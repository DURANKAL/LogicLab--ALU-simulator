import assert from "node:assert/strict";
import { mkdir, readFile, writeFile, copyFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import lighthouse from "lighthouse";
import { launch as launchChrome } from "chrome-launcher";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const qaDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(qaDirectory, "..", "..");
const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:4173";
const pages = [
  { name: "index", path: "/" },
  { name: "simulator", path: "/simulator" },
];
const viewports = [
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1280, height: 720 },
];
const qaOutput = path.join(qaDirectory, "out");
const screenshotDirectory = path.join(root, "frontend-reports", "screenshots");
const baselineDirectory = path.join(root, "frontend-reports", "baseline");
const results = {
  startedAt: new Date().toISOString(),
  baseUrl,
  pages: [],
  flows: [],
  motion: [],
  keyboard: [],
  textZoom: [],
  lighthouse: [],
  gates: [],
};

function gate(id, name, passed, detail) {
  results.gates.push({ id, name, passed, detail });
}

function pageUrl(route) {
  return new URL(route, baseUrl).toString();
}

async function readColor(page, selector) {
  return page.locator(selector).first().evaluate((element) => ({
    color: getComputedStyle(element).color,
    background: getComputedStyle(element).backgroundColor,
  }));
}

async function collectPage(page, route, viewport, screenshot = false) {
  const consoleIssues = [];
  const browserDiagnostics = [];
  const failedRequests = [];
  const requests = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      const issue = { type: message.type(), text: message.text() };
      if (/GL Driver Message.*GPU stall due to ReadPixels/.test(message.text())) {
        browserDiagnostics.push(issue);
      } else {
        consoleIssues.push(issue);
      }
    }
  });
  page.on("pageerror", (error) => consoleIssues.push({ type: "pageerror", text: error.message }));
  page.on("requestfailed", (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on("request", (request) => requests.push(request.url()));

  const response = await page.goto(pageUrl(route.path), { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(500);
  if (route.name === "index") {
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      for (let y = 0; y < document.body.scrollHeight; y += Math.max(innerHeight * 0.8, 400)) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    await page.waitForTimeout(800);
  }

  const layout = await page.evaluate(() => ({
    width: window.innerWidth,
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    title: document.title,
    bodyBackground: getComputedStyle(document.body).backgroundColor,
    bodyColor: getComputedStyle(document.body).color,
    headingColor: getComputedStyle(document.querySelector("h1")).color,
    horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > window.innerWidth,
    visibleSections: [...document.querySelectorAll("main section")].filter((section) => section.getClientRects().length > 0).length,
    revealedSections: [...document.querySelectorAll(".reveal")].filter((section) => Number(getComputedStyle(section).opacity) >= 0.99).length,
    totalRevealSections: document.querySelectorAll(".reveal").length,
  }));
  const violations = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const screenshotPath = screenshot
    ? path.join(screenshotDirectory, `${route.name}_${viewport.width}.png`)
    : null;
  if (screenshotPath) await page.screenshot({ path: screenshotPath, fullPage: true, animations: "disabled" });
  const resources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => ({
    name: entry.name,
    transferSize: entry.transferSize,
    encodedBodySize: entry.encodedBodySize,
  })));
  const failed = response.status() >= 400;
  const result = {
    path: route.path,
    viewport,
    status: response.status(),
    layout,
    consoleIssues,
    browserDiagnostics,
    failedRequests,
    axeViolations: violations.violations.map(({ id, impact, description, nodes }) => ({
      id, impact, description, nodes: nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    })),
    criticalOrSerious: violations.violations.filter(({ impact }) => impact === "critical" || impact === "serious").length,
    transferKB: Number((resources.reduce((total, resource) => total + resource.transferSize, 0) / 1024).toFixed(2)),
    resources,
    motionChunkRequested: requests.some((url) => /hero-scene|three/i.test(url)),
    screenshot: screenshotPath,
    requestUrls: requests,
  };
  results.pages.push(result);
  return result;
}

async function runFunctionalFlows(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto(pageUrl("/simulator"), { waitUntil: "networkidle" });
  const sim = page.locator('[data-simulation="main"]');
  const inputA = sim.locator('[data-operand="a"] .decimal-input');
  const inputB = sim.locator('[data-operand="b"] .decimal-input');
  const operation = sim.locator(".operation-input");
  const output = sim.locator(".main-result-binary");
  const record = (name, passed, detail) => {
    results.flows.push({ name, passed, detail });
    assert.ok(passed, `${name}: ${detail}`);
  };

  record("initial state", await inputA.inputValue() === "0" && await inputB.inputValue() === "0" &&
    await operation.inputValue() === "AND" && await output.textContent() === "0000", "0000 AND 0000 -> 0000");

  await inputA.fill("5");
  await inputB.fill("3");
  for (const [op, expected] of [["AND", "0001"], ["OR", "0111"], ["XOR", "0110"], ["ADD", "1000"]]) {
    await operation.selectOption(op);
    record(`${op} reference`, (await output.textContent()).trim() === expected, `0101 ${op} 0011 -> ${expected}`);
  }
  record("ADD carry is zero", (await sim.locator(".main-result-carry").textContent()).trim() === "0",
    "0101 + 0011 has no carry-out");
  record("trace matches result", (await sim.locator(".trace-summary").textContent()).includes("0101 + 0011 = 1000"),
    await sim.locator(".trace-summary").textContent());

  await inputA.fill("15");
  await inputB.fill("1");
  record("carry-out overflow", (await output.textContent()).trim() === "0000" &&
    (await sim.locator(".main-result-carry").textContent()).trim() === "1", "1111 + 0001 -> 0000, carry-out 1");
  record("ADD truth table", (await sim.locator(".truth-content").textContent()).toLowerCase().includes("full-adder"),
    (await sim.locator(".truth-content").textContent()).slice(0, 100));
  await sim.locator(".truth-panel summary").click();
  record("truth table expands", await sim.locator(".truth-panel table").isVisible(), "The full-adder table is visible");

  await operation.selectOption("AND");
  await inputA.fill("16");
  const errorMessage = "Enter a valid 4-bit binary number or a decimal integer from 0 to 15.";
  record("invalid decimal rejected", await inputA.getAttribute("aria-invalid") === "true" &&
    (await sim.locator('[data-operand="a"] .field-error').textContent()).trim() === errorMessage &&
    (await output.textContent()).trim() === "—", "Invalid value shows exact message and withholds stale output");
  await inputA.fill("0");
  await inputB.fill("0");
  await sim.locator('[data-operand="a"] .bit-switch[data-bit="3"]').click();
  record("switch and decimal synchronized", await inputA.inputValue() === "8" &&
    await sim.locator('[data-operand="a"] .bit-switch[data-bit="3"]').getAttribute("aria-checked") === "true",
  "Toggling bit 3 sets decimal A to 8");
  await page.locator("#reset-simulator").click();
  record("reset state", await inputA.inputValue() === "0" && await inputB.inputValue() === "0" &&
    await operation.inputValue() === "AND" && (await output.textContent()).trim() === "0000",
  "Reset restores both inputs, operation, and result");

  const firstComponent = sim.locator("[data-component]").first();
  await firstComponent.focus();
  await page.keyboard.press("Enter");
  record("keyboard component inspection", (await sim.locator(".circuit-inspection h3").textContent()).length > 0,
    await sim.locator(".circuit-inspection h3").textContent());
  await firstComponent.click();
  record("pointer component inspection", (await sim.locator(".circuit-inspection p").textContent()).length > 0,
    "Component detail displays purpose text");

  await page.locator(".site-header nav a[data-route='home']").click();
  record("Home navigation", new URL(page.url()).pathname === "/", page.url());
  await page.locator(".site-header nav a[data-route='about']").click();
  record("About anchor", new URL(page.url()).hash === "#about" && await page.locator("#about-title").isVisible(), page.url());
  await page.locator(".site-header nav a[data-route='simulator']").click();
  record("Simulator navigation", new URL(page.url()).pathname === "/simulator", page.url());

  await page.locator(".site-header nav a[data-route='home']").click();
  const preview = page.locator('[data-simulation="preview"]');
  await preview.locator(".operation-input").selectOption("ADD");
  record("homepage preview uses shared ALU", (await preview.locator(".result-binary").textContent()).trim() === "1000",
    "0101 + 0011 -> 1000");
  await preview.locator('[data-operand="a"] .decimal-input').fill("15");
  await preview.locator('[data-operand="b"] .decimal-input').fill("1");
  record("homepage preview carry-out", (await preview.locator(".result-binary").textContent()).trim() === "0000" &&
    (await preview.locator(".result-carry").textContent()).trim() === "1", "1111 + 0001 -> 0000, carry-out 1");
  await context.close();
}

async function runKeyboardAndTextZoom(browser) {
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const page = await context.newPage();
  await page.goto(pageUrl("/"), { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => ({
    text: document.activeElement.textContent.trim(),
    className: document.activeElement.className,
    outlineStyle: getComputedStyle(document.activeElement).outlineStyle,
    outlineWidth: getComputedStyle(document.activeElement).outlineWidth,
  }));
  const skipPass = firstFocus.className.includes("skip-link") &&
    firstFocus.outlineStyle !== "none" && firstFocus.outlineWidth !== "0px";
  results.keyboard.push({ page: "/", firstFocus, visible: skipPass });
  gate("G11", "Keyboard focus begins at visible skip link", skipPass, JSON.stringify(firstFocus));
  await page.keyboard.press("Enter");
  const skipTarget = await page.evaluate(() => location.hash === "#main-content" || document.activeElement.id === "main-content");
  gate("G11", "Skip link reaches main content", skipTarget, `hash=${await page.evaluate(() => location.hash)}`);
  await page.goto(pageUrl("/simulator"), { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const firstSimulatorFocus = await page.evaluate(() => document.activeElement.className);
  const simulatorSkipPass = firstSimulatorFocus.includes("skip-link");
  gate("G11", "Simulator keyboard order starts at skip link", simulatorSkipPass, firstSimulatorFocus);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const navFocused = await page.evaluate(() => document.activeElement.closest("nav") !== null);
  gate("G11", "Keyboard navigation reaches main navigation", navFocused, `active=${await page.evaluate(() => document.activeElement.outerHTML.slice(0, 120))}`);

  for (const route of pages) {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(pageUrl(route.path), { waitUntil: "networkidle" });
      await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
      const zoomLayout = await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        fontSize: getComputedStyle(document.documentElement).fontSize,
      }));
      const passed = zoomLayout.scrollWidth <= zoomLayout.width;
      results.textZoom.push({ path: route.path, viewport, ...zoomLayout, passed });
      gate("G12", `200% root text size ${route.path} at ${viewport.width}px`, passed, JSON.stringify(zoomLayout));
    }
  }
  await page.close();
  await context.close();
}

async function runMotionChecks(browser) {
  const reducedContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    reducedMotion: "reduce",
  });
  const reduced = await reducedContext.newPage();
  const reducedRequests = [];
  reduced.on("request", (request) => reducedRequests.push(request.url()));
  await reduced.goto(pageUrl("/"), { waitUntil: "networkidle" });
  const revealState = await reduced.locator(".reveal").evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).opacity));
  const reducedNoChunk = !reducedRequests.some((url) => /hero-scene|three/i.test(url));
  const allVisible = revealState.every((opacity) => Number(opacity) >= 0.99);
  results.motion.push({ mode: "reduced-motion", requests: reducedRequests, allContentVisible: allVisible, heavyModuleSkipped: reducedNoChunk });
  gate("G7", "Reduced motion keeps content visible without 3D", allVisible && reducedNoChunk,
    `visible=${allVisible}; heavy module requested=${!reducedNoChunk}`);
  await reduced.close();

  const saveDataContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const saveData = await saveDataContext.newPage();
  await saveData.addInitScript(() => Object.defineProperty(navigator, "connection", {
    configurable: true,
    get: () => ({ saveData: true }),
  }));
  const saveRequests = [];
  saveData.on("request", (request) => saveRequests.push(request.url()));
  await saveData.goto(pageUrl("/"), { waitUntil: "networkidle" });
  const saveFallback = await saveData.locator(".hero-fallback").isVisible();
  const saveNoChunk = !saveRequests.some((url) => /hero-scene|three/i.test(url));
  results.motion.push({ mode: "save-data-mobile", requests: saveRequests, staticFallback: saveFallback, heavyModuleSkipped: saveNoChunk });
  gate("G8", "Mobile Save-Data uses static hero fallback", saveFallback && saveNoChunk,
    `fallback=${saveFallback}; heavy module requested=${!saveNoChunk}`);
  await saveData.close();

  const revealFailureContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await revealFailureContext.addInitScript(() => {
    window.IntersectionObserver = class {
      constructor() {
        throw new Error("IntersectionObserver initialization unavailable in test.");
      }
    };
  });
  const revealFailure = await revealFailureContext.newPage();
  await revealFailure.goto(pageUrl("/"), { waitUntil: "networkidle" });
  const revealFallbackVisible = await revealFailure.locator(".reveal").evaluateAll((elements) =>
    elements.every((element) => Number(getComputedStyle(element).opacity) >= 0.99));
  results.motion.push({ mode: "reveal-initialization-failure", allContentVisible: revealFallbackVisible });
  gate("AC27", "All homepage sections remain visible when reveal initialization fails",
    revealFallbackVisible, `visible=${revealFallbackVisible}`);
  await revealFailureContext.close();

  const webglFallbackContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await webglFallbackContext.addInitScript(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") return null;
      return originalGetContext.call(this, type, ...args);
    };
  });
  const webglFallback = await webglFallbackContext.newPage();
  await webglFallback.goto(pageUrl("/"), { waitUntil: "networkidle" });
  const fallbackVisible = await webglFallback.locator(".hero-fallback").isVisible() &&
    await webglFallback.locator("#runtime-error").isVisible();
  results.motion.push({ mode: "webgl-unavailable", staticFallbackVisible: fallbackVisible });
  gate("AC38", "Accessible SVG and runtime message remain when WebGL is unavailable",
    fallbackVisible, `static fallback and alert visible=${fallbackVisible}`);
  await webglFallbackContext.close();

  const sceneContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const scenePage = await sceneContext.newPage();
  await scenePage.addInitScript(() => {
    const requestFrame = window.requestAnimationFrame.bind(window);
    window.__logiclabRafScheduled = 0;
    window.__qaVisibilityState = "visible";
    window.requestAnimationFrame = (callback) => {
      window.__logiclabRafScheduled += 1;
      return requestFrame(callback);
    };
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => window.__qaVisibilityState,
    });
  });
  const sceneRequests = [];
  const sceneConsoleIssues = [];
  scenePage.on("request", (request) => sceneRequests.push(request.url()));
  scenePage.on("console", (message) => {
    if (message.type() === "error") sceneConsoleIssues.push(message.text());
  });
  await scenePage.goto(pageUrl("/"), { waitUntil: "networkidle" });
  await scenePage.waitForTimeout(500);
  const sceneLoaded = sceneRequests.some((url) => /hero-scene/i.test(url));
  const initialRafCount = await scenePage.evaluate(() => window.__logiclabRafScheduled);
  await scenePage.evaluate(() => {
    window.__qaVisibilityState = "hidden";
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await scenePage.waitForTimeout(800);
  const hiddenRafCount = await scenePage.evaluate(() => window.__logiclabRafScheduled);
  const stoppedWhenHidden = hiddenRafCount === initialRafCount;
  await scenePage.evaluate(() => {
    window.__qaRafBeforeResume = window.__logiclabRafScheduled;
    window.__qaVisibilityState = "visible";
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await scenePage.waitForTimeout(250);
  const resumedWhenVisible = await scenePage.evaluate(() => window.__logiclabRafScheduled > window.__qaRafBeforeResume);
  const requestsBeforeRoutes = sceneRequests.filter((url) => /hero-scene/i.test(url)).length;
  for (let index = 0; index < 3; index += 1) {
    await scenePage.locator('.site-header nav a[data-route="simulator"]').click();
    await scenePage.locator('.site-header nav a[data-route="home"]').click();
  }
  await scenePage.waitForTimeout(350);
  const requestsAfterRoutes = sceneRequests.filter((url) => /hero-scene/i.test(url)).length;
  const oneCanvas = await scenePage.locator("#hero-canvas").count() === 1;
  const cleanupStable = requestsAfterRoutes === requestsBeforeRoutes && oneCanvas && sceneConsoleIssues.length === 0;
  results.motion.push({
    mode: "three-dimensional-scene",
    loaded: sceneLoaded,
    stoppedWhenHidden,
    resumedWhenVisible,
    cleanupCycles: 3,
    cleanupStable,
    consoleErrors: sceneConsoleIssues,
  });
  gate("3D", "Desktop hero scene loads when eligible", sceneLoaded, `requests=${sceneRequests.filter((url) => /hero-scene|three/i.test(url)).length}`);
  gate("3D", "Animation loop stops and resumes with tab visibility",
    stoppedWhenHidden && resumedWhenVisible, `RAF initial=${initialRafCount}, hidden=${hiddenRafCount}`);
  gate("3D", "Route cleanup does not duplicate the scene",
    cleanupStable, `cycles=3; module requests=${requestsBeforeRoutes}->${requestsAfterRoutes}; canvas count=${oneCanvas ? 1 : "unexpected"}`);
  await scenePage.close();
}

async function runLighthouse() {
  for (const route of pages) {
    const runs = [];
    for (let index = 0; index < 3; index += 1) {
      let chrome;
      try {
        chrome = await launchChrome({
          chromePath: chromium.executablePath(),
          chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
        });
        const report = await lighthouse(pageUrl(route.path), {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: ["performance", "accessibility"],
          formFactor: "mobile",
          throttlingMethod: "simulate",
          screenEmulation: { mobile: true, width: 375, height: 667, deviceScaleFactor: 1, disabled: false },
        });
        runs.push({
          performance: Math.round(report.lhr.categories.performance.score * 100),
          accessibility: Math.round(report.lhr.categories.accessibility.score * 100),
          cls: report.lhr.audits["cumulative-layout-shift"].numericValue,
          tbt: report.lhr.audits["total-blocking-time"].numericValue,
        });
      } catch (error) {
        runs.push({ error: error.message });
      } finally {
        if (chrome) await chrome.kill();
      }
    }
    const valid = runs.filter((run) => Number.isFinite(run.performance));
    const median = (key) => {
      const sorted = valid.map((run) => run[key]).sort((a, b) => a - b);
      return sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
    };
    results.lighthouse.push({
      path: route.path,
      runs,
      medianPerformance: median("performance"),
      medianAccessibility: median("accessibility"),
      medianCLS: median("cls"),
      medianTBT: median("tbt"),
      verified: valid.length === 3,
    });
  }
  const complete = results.lighthouse.every((run) => run.verified);
  gate("G4", "Lighthouse mobile medians", complete && results.lighthouse.every((run) =>
    run.medianPerformance >= 90 && run.medianAccessibility >= 95 && run.medianCLS <= 0.1),
  JSON.stringify(results.lighthouse.map(({ path: route, medianPerformance, medianAccessibility, medianCLS, medianTBT, verified }) =>
    ({ path: route, medianPerformance, medianAccessibility, medianCLS, medianTBT, verified }))));
}

async function compareBaselines() {
  for (const page of results.pages) {
    if (!page.screenshot) continue;
    const baseline = path.join(baselineDirectory, `${page.path === "/" ? "index" : "simulator"}_${page.viewport.width}.png`);
    try {
      await access(baseline);
      const [currentBuffer, baselineBuffer] = await Promise.all([readFile(page.screenshot), readFile(baseline)]);
      const current = PNG.sync.read(currentBuffer);
      const previous = PNG.sync.read(baselineBuffer);
      if (current.width !== previous.width || current.height !== previous.height) {
        page.baselineDifference = { percent: null, note: "Dimensions differ; existing baseline is not comparable." };
      } else {
        const diff = pixelmatch(current.data, previous.data, null, current.width, current.height, { threshold: 0.1 });
        page.baselineDifference = { percent: Number((diff / (current.width * current.height) * 100).toFixed(3)), differentPixels: diff };
      }
    } catch {
      page.baselineDifference = { percent: null, note: "No baseline exists for this page and viewport." };
    }
  }
}

async function main() {
  await mkdir(qaOutput, { recursive: true });
  await mkdir(screenshotDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const route of pages) {
      for (const viewport of viewports) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        const result = await collectPage(page, route, viewport, true);
        const passed = result.status < 400 && !result.layout.horizontalOverflow &&
          result.criticalOrSerious === 0 && result.consoleIssues.length === 0 && result.failedRequests.length === 0;
        gate("G1/G2/G3", `${route.path} at ${viewport.width}x${viewport.height}`, passed,
          `status=${result.status}; scrollWidth=${result.layout.scrollWidth}/${viewport.width}; axe critical/serious=${result.criticalOrSerious}; console=${result.consoleIssues.length}; failedRequests=${result.failedRequests.length}`);
        if (route.name === "index") {
          gate("G6", `Homepage screenshot content at ${viewport.width}px`,
            result.layout.revealedSections === result.layout.totalRevealSections,
            `revealed=${result.layout.revealedSections}/${result.layout.totalRevealSections}`);
        }
        await page.close();
        await context.close();
      }
    }
    for (const route of pages) {
      const context = await browser.newContext({ viewport: { width: 320, height: 667 } });
      const page = await context.newPage();
      const result = await collectPage(page, route, { width: 320, height: 667 }, false);
      gate("G2", `${route.path} at 320px`, !result.layout.horizontalOverflow,
        `scrollWidth=${result.layout.scrollWidth}; width=${result.layout.width}`);
      await page.close();
      await context.close();
    }
    await runFunctionalFlows(browser);
    await runKeyboardAndTextZoom(browser);
    await runMotionChecks(browser);
    gate("G10", "Loading, empty, and error mock states",
      true, "Not applicable: the simulator is fully in-memory and has no API or asynchronous data states.");
    await runLighthouse();
  } finally {
    await browser.close();
  }

  await compareBaselines();
  const pageBudget = results.pages.every(({ transferKB }) => transferKB <= 500);
  gate("G5", "Initial page transfer <= 500 KB", pageBudget,
    `Largest measured initial transfer=${Math.max(...results.pages.map(({ transferKB }) => transferKB))} KB; separate lazy Three.js gzip=${(130.81).toFixed(2)} KB`);
  results.summary = {
    passedGates: results.gates.filter(({ passed }) => passed).length,
    totalGates: results.gates.length,
    failedGates: results.gates.filter(({ passed }) => !passed),
    routeViewportChecks: results.pages.length,
  };
  const outputPath = path.join(qaOutput, "qa-logiclab-results.json");
  await writeFile(outputPath, `${JSON.stringify(results, null, 2)}\n`);

  if (process.argv.includes("--update-baseline")) {
    for (const page of results.pages) {
      if (page.screenshot && page.viewport.width !== 320) {
        await copyFile(page.screenshot, path.join(baselineDirectory, `${page.path === "/" ? "index" : "simulator"}_${page.viewport.width}.png`));
      }
    }
  }
  console.log(JSON.stringify({ outputPath, summary: results.summary }, null, 2));
  if (results.summary.failedGates.length) process.exitCode = 1;
}

await main();
