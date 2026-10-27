import { getTruthTable, OPERATIONS } from "./logic/alu.js";
import { mountSimulationControls } from "./controls.js";

const componentDescriptions = {
  logic: {
    title: "Logic gate",
    inputs: "A bit, B bit",
    outputs: "One result bit",
    purpose: "Applies the selected Boolean operation to this matching pair of input bits.",
  },
  adder: {
    title: "Full adder",
    inputs: "A bit, B bit, carry-in",
    outputs: "Sum bit, carry-out",
    purpose: "Adds one column and passes its carry to the next column.",
  },
  selector: {
    title: "Operation selector",
    inputs: "Selected operation",
    outputs: "Active logic path",
    purpose: "Routes the chosen operation's calculated bits to the output.",
  },
};

function circuitMarkup(result) {
  const nextOperation = OPERATIONS[(OPERATIONS.indexOf(result.operation) + 1) % OPERATIONS.length];
  const rows = result.bitSteps.map((step, index) => {
    const y = 66 + index * 48;
    const aBit = result.binaryA[index];
    const bBit = result.binaryB[index];
    const operation = result.operation === "ADD" ? "FA" : result.operation;
    const kind = result.operation === "ADD" ? "adder" : "logic";
    const carryLabel = result.operation === "ADD"
      ? `<text class="circuit-bit-label" x="390" y="${y + 17}">C${step.carryOut}</text>`
      : "";
    return `
      <g class="circuit-row" data-bit-position="${step.position}">
        <text class="circuit-io-label" x="9" y="${y - 5}">A${step.position} · ${aBit}</text>
        <text class="circuit-io-label" x="9" y="${y + 13}">B${step.position} · ${bBit}</text>
        <path class="circuit-wire circuit-wire-input" pathLength="1" data-state="${aBit}" d="M64 ${y - 8}H164V${y - 2}H238" />
        <path class="circuit-wire circuit-wire-input" pathLength="1" data-state="${bBit}" d="M64 ${y + 10}H164V${y + 2}H238" />
        <g class="circuit-component" tabindex="0" role="button" data-component="${kind}" aria-label="${step.position === 3 ? "Most significant" : step.position === 0 ? "Least significant" : "Bit"} ${step.position}, ${operation} · ${step.result}, ${kind === "adder" ? "full adder" : "logic gate"}">
          <rect x="238" y="${y - 19}" width="104" height="37" />
          <text x="290" y="${y + 5}">${operation} · ${step.result}</text>
        </g>
        <path class="circuit-wire circuit-wire-output" pathLength="1" data-state="${step.result}" d="M342 ${y}H458" />
        <text class="circuit-bit-label" x="478" y="${y + 5}">${step.result}</text>
        ${carryLabel}
      </g>`;
  }).join("");

  return `
    <svg viewBox="0 0 530 286" role="group" aria-labelledby="circuit-title" aria-describedby="circuit-description">
      <title id="circuit-title">${result.operation} circuit for ${result.binaryA} and ${result.binaryB}</title>
      <desc id="circuit-description">Each input bit pair passes through the selected ${result.operation} circuit and produces ${result.binary}. The signal labels show the actual evaluated bit values.</desc>
      <rect class="circuit-chip" x="223" y="28" width="137" height="204" />
      <text class="circuit-io-label" x="10" y="32">A / B</text>
      <text class="circuit-io-label" x="451" y="32">OUTPUT</text>
      ${rows}
      <g class="circuit-component circuit-operation-selector" tabindex="0" role="button" data-component="selector" aria-label="${result.operation} → ${nextOperation}; change operation">
        <rect x="210" y="252" width="110" height="25" />
        <text x="265" y="269">${result.operation} → ${nextOperation}</text>
      </g>
    </svg>`;
}

function renderInspection(panel, kind, result) {
  const description = componentDescriptions[kind];
  if (!description) return;
  panel.innerHTML = `
    <span class="mono-label">${kind === "selector" ? "CONTROL / ROUTING" : `BIT PATH / ${result.operation}`}</span>
    <h3>${description.title}</h3>
    <dl><div><dt>Inputs</dt><dd>${description.inputs}</dd></div>
    <div><dt>Outputs</dt><dd>${description.outputs}</dd></div></dl>
    <p>${description.purpose}</p>`;
}

function renderTrace(container, result) {
  const label = result.operation === "ADD" ? "FULL ADDER" : result.operation;
  const steps = result.bitSteps.map((step) => {
    const detail = result.operation === "ADD"
      ? `${step.a} + ${step.b} + ${step.carryIn} = ${step.result}, carry ${step.carryOut}`
      : `${step.a} ${result.operation} ${step.b} = ${step.result}`;
    return `<div class="trace-step"><span>BIT ${step.position}</span><strong>${detail}</strong></div>`;
  }).join("");
  const expression = result.operation === "ADD"
    ? `${result.binaryA} + ${result.binaryB} = ${result.binary} · carry-out ${result.carryOut} (${result.a} + ${result.b} = ${result.a + result.b}).`
    : `${result.binaryA} ${result.operation} ${result.binaryB} = ${result.binary}. Each pair of matching bits is evaluated by ${label}.`;
  container.innerHTML = `${steps}<p class="trace-summary">${expression}</p>`;
}

function renderTruthTable(container, operation) {
  const table = getTruthTable(operation);
  const headings = table.headers.map((heading) => `<th scope="col">${heading}</th>`).join("");
  const rows = table.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");
  container.innerHTML = `<h3>${table.title}</h3><p>${table.description}</p><table><thead><tr>${headings}</tr></thead><tbody>${rows}</tbody></table>`;
}

function renderInvalid(root) {
  root.querySelector(".result-state").textContent = "INPUT REQUIRED";
  root.querySelector(".main-result-binary").textContent = "—";
  root.querySelector(".main-result-decimal").textContent = "—";
  root.querySelector(".main-carry").hidden = true;
  root.querySelector(".simulation-message").textContent =
    "Correct the invalid input to calculate a result. The circuit is not evaluating stale values.";
  root.querySelector(".circuit-operation").textContent = "PAUSED";
  root.querySelector(".simulator-circuit").innerHTML =
    `<p class="field-error" role="alert">Enter a valid 4-bit binary number or a decimal integer from 0 to 15.</p>`;
  root.querySelector(".trace-index").textContent = "WAITING FOR INPUT";
  root.querySelector(".trace-content").textContent = "No operation is evaluated until both inputs are valid.";
  root.querySelector(".truth-content").textContent = "Truth table available when both inputs are valid.";
}

function renderResult(root, result) {
  root.querySelector(".result-state").textContent = "COMPUTED";
  root.querySelector(".main-result-binary").textContent = result.binary;
  root.querySelector(".main-result-decimal").textContent = String(result.decimal);
  root.querySelector(".main-carry").hidden = result.operation !== "ADD";
  root.querySelector(".main-result-carry").textContent = String(result.carryOut);
  root.querySelector(".circuit-operation").textContent = `${result.operation} / 04`;
  root.querySelector(".simulation-message").textContent =
    result.operation === "ADD"
      ? `Addition complete. Carry-out is ${result.carryOut}; it is separate from the four-bit result.`
      : `${result.operation} evaluated for all four bits.`;
  root.querySelector(".trace-index").textContent = "01 — 04";
  root.querySelector(".simulator-circuit").innerHTML = circuitMarkup(result);
  renderTrace(root.querySelector(".trace-content"), result);
  renderTruthTable(root.querySelector(".truth-content"), result.operation);

}

const WALKTHROUGH_STEP_COUNT = 7;
const WALKTHROUGH_STEP_DURATION = 2500;
const WALKTHROUGH_DURATION = WALKTHROUGH_STEP_COUNT * WALKTHROUGH_STEP_DURATION;

function walkthroughCopy(index, result) {
  if (index === 0) {
    return {
      title: "Inputs enter the circuit",
      description: `Input A (${result.binaryA}) and Input B (${result.binaryB}) enter as four separate signals.`,
    };
  }
  if (index === 1) {
    const operationDescription = {
      AND: "only passes a 1 when both matching input bits are 1.",
      OR: "passes a 1 when either matching input bit is 1.",
      XOR: "passes a 1 when the matching input bits are different.",
      ADD: "uses a full adder at each bit, carrying overflow into the next column.",
    }[result.operation];
    return {
      title: `${result.operation} is selected`,
      description: `The operation selector opens the ${result.operation} path. ${result.operation} ${operationDescription}`,
    };
  }
  if (index < WALKTHROUGH_STEP_COUNT - 1) {
    const position = WALKTHROUGH_STEP_COUNT - 2 - index;
    const bit = result.bitSteps.find((item) => item.position === position);
    if (result.operation === "ADD") {
      return {
        title: `The full adder evaluates bit ${position}`,
        description: `${bit.a} + ${bit.b} + carry ${bit.carryIn} = ${bit.result}. Carry ${bit.carryOut} moves into the next column.`,
      };
    }
    return {
      title: `The ${result.operation} gate evaluates bit ${position}`,
      description: `${bit.a} ${result.operation} ${bit.b} = ${bit.result}. This bit is evaluated independently from the other three.`,
    };
  }
  const carry = result.operation === "ADD" ? ` Carry-out is ${result.carryOut}.` : "";
  return {
    title: "The result reaches the output",
    description: `${result.binaryA} ${result.operation} ${result.binaryB} produces ${result.binary} (decimal ${result.decimal}).${carry}`,
  };
}

function mountWalkthrough(root) {
  const range = root.querySelector("[data-walkthrough-range]");
  const positionOutput = root.querySelector("[data-walkthrough-position]");
  const indexLabel = root.querySelector("[data-walkthrough-index]");
  const title = root.querySelector("[data-walkthrough-title]");
  const description = root.querySelector("[data-walkthrough-description]");
  const stateLabel = root.querySelector("[data-walkthrough-state]");
  const previousButton = root.querySelector("[data-walkthrough-previous]");
  const playButton = root.querySelector("[data-walkthrough-play]");
  const nextButton = root.querySelector("[data-walkthrough-next]");
  const replayButton = root.querySelector("[data-walkthrough-replay]");

  let result = null;
  let step = 0;
  let elapsed = 0;
  let active = false;
  let playing = false;
  let frameId = 0;
  let lastFrameTime = 0;
  let lastProgressUpdate = 0;
  let copyAnimation = null;
  let lastCopy = "";

  function updateCircuit() {
    const svg = root.querySelector(".simulator-circuit svg");
    if (!svg) return;
    svg.dataset.walkthroughActive = String(result !== null);
    const currentBitPosition = step >= 2 && step < WALKTHROUGH_STEP_COUNT - 1
      ? WALKTHROUGH_STEP_COUNT - 2 - step
      : null;
    for (const row of svg.querySelectorAll(".circuit-row")) {
      row.removeAttribute("data-guide-state");
      const position = Number(row.dataset.bitPosition);
      if (!active) row.dataset.guideState = "waiting";
      else if (step === 0) row.dataset.guideState = "inputs";
      else if (step === 1) row.dataset.guideState = "operation";
      else if (step === WALKTHROUGH_STEP_COUNT - 1 || position > currentBitPosition) {
        row.dataset.guideState = "revealed";
      } else if (position === currentBitPosition) {
        row.dataset.guideState = "active";
      } else {
        row.dataset.guideState = "upcoming";
      }
    }
    svg.querySelector(".circuit-operation-selector")
      ?.classList.toggle("is-guide-active", active && step === 1);
  }

  function updateProgress() {
    const seconds = (elapsed / 1000).toFixed(1);
    range.value = seconds;
    positionOutput.textContent = `${seconds} / ${(WALKTHROUGH_DURATION / 1000).toFixed(1)} s`;
  }

  function render() {
    const copy = result
      ? walkthroughCopy(step, result)
      : {
          title: "Valid inputs are needed",
          description: "Correct both inputs to run the guided circuit walkthrough.",
        };
    const copyKey = `${copy.title}|${copy.description}`;
    const currentStep = String(step + 1).padStart(2, "0");
    indexLabel.textContent = `STEP ${currentStep} / ${String(WALKTHROUGH_STEP_COUNT).padStart(2, "0")}`;
    title.textContent = copy.title;
    description.textContent = copy.description;
    if (active && copyKey !== lastCopy && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      copyAnimation?.cancel();
      copyAnimation = root.querySelector(".walkthrough-step").animate(
        [
          { opacity: 0.65, transform: "translateY(0.35rem)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    }
    lastCopy = copyKey;
    range.setAttribute("aria-valuetext", `Step ${step + 1} of ${WALKTHROUGH_STEP_COUNT}: ${copy.title}`);
    updateProgress();
    stateLabel.textContent = !result ? "WAITING FOR INPUT" : playing ? "PLAYING" : active ? "PAUSED" : "READY";
    playButton.textContent = playing ? "Pause walkthrough" : "Play walkthrough";
    playButton.setAttribute("aria-pressed", String(playing));
    previousButton.disabled = !result || step === 0;
    playButton.disabled = !result;
    nextButton.disabled = !result || step === WALKTHROUGH_STEP_COUNT - 1;
    replayButton.disabled = !result;
    range.disabled = !result;
    updateCircuit();
  }

  function pause() {
    if (!playing) return;
    playing = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastFrameTime = 0;
    render();
  }

  function setStep(nextStep) {
    pause();
    step = Math.max(0, Math.min(WALKTHROUGH_STEP_COUNT - 1, nextStep));
    elapsed = step * WALKTHROUGH_STEP_DURATION;
    active = true;
    render();
  }

  function frame(now) {
    if (!playing) return;
    if (lastFrameTime) elapsed += now - lastFrameTime;
    lastFrameTime = now;
    if (elapsed >= WALKTHROUGH_DURATION) {
      elapsed = WALKTHROUGH_DURATION;
      step = WALKTHROUGH_STEP_COUNT - 1;
      playing = false;
      frameId = 0;
      lastFrameTime = 0;
      render();
      return;
    }
    const nextStep = Math.min(
      WALKTHROUGH_STEP_COUNT - 1,
      Math.floor(elapsed / WALKTHROUGH_STEP_DURATION),
    );
    if (nextStep !== step) {
      step = nextStep;
      render();
    } else if (now - lastProgressUpdate >= 100) {
      updateProgress();
      lastProgressUpdate = now;
    }
    frameId = requestAnimationFrame(frame);
  }

  function play() {
    if (!result || playing) return;
    if (elapsed >= WALKTHROUGH_DURATION) {
      step = 0;
      elapsed = 0;
    }
    active = true;
    playing = true;
    lastFrameTime = 0;
    lastProgressUpdate = 0;
    render();
    frameId = requestAnimationFrame(frame);
  }

  playButton.addEventListener("click", () => {
    if (playing) pause();
    else play();
  });
  previousButton.addEventListener("click", () => setStep(step - 1));
  nextButton.addEventListener("click", () => setStep(step + 1));
  replayButton.addEventListener("click", () => {
    setStep(0);
    play();
  });
  range.addEventListener("input", () => {
    pause();
    elapsed = Number(range.value) * 1000;
    step = Math.min(
      WALKTHROUGH_STEP_COUNT - 1,
      Math.floor(elapsed / WALKTHROUGH_STEP_DURATION),
    );
    active = true;
    render();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });

  render();
  return {
    render(nextResult) {
      result = nextResult;
      render();
    },
    renderInvalid() {
      pause();
      result = null;
      active = false;
      render();
    },
    reset() {
      pause();
      step = 0;
      elapsed = 0;
      active = false;
      render();
    },
    pause,
  };
}

export function mountSimulator(root) {
  let currentResult = null;
  const walkthrough = mountWalkthrough(root);
  const circuit = root.querySelector(".simulator-circuit");
  const inspect = (component) => {
    const kind = component?.dataset.component;
    if (!kind || !currentResult) return;
    if (kind === "selector") {
      const operationInput = root.querySelector(".operation-input");
      const currentIndex = OPERATIONS.indexOf(operationInput.value);
      operationInput.value = OPERATIONS[(currentIndex + 1) % OPERATIONS.length];
      operationInput.dispatchEvent(new Event("change", { bubbles: true }));
      root.querySelector(".circuit-operation-selector")?.focus();
    }
    renderInspection(root.querySelector(".circuit-inspection"), kind, currentResult);
  };
  circuit.addEventListener("click", (event) => inspect(event.target.closest("[data-component]")));
  circuit.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const component = event.target.closest("[data-component]");
    if (!component) return;
    event.preventDefault();
    inspect(component);
  });

  const controls = mountSimulationControls(root, {
    onUpdate(update) {
      if (!update.valid) {
        currentResult = null;
        renderInvalid(root);
        walkthrough.renderInvalid();
        return;
      }
      currentResult = update.result;
      renderResult(root, update.result);
      walkthrough.render(update.result);
    },
  });
  root.querySelector("#reset-simulator").addEventListener("click", () => {
    controls.reset();
    walkthrough.reset();
  });
  return { ...controls, pauseWalkthrough: walkthrough.pause };
}
