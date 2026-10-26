import { mountHome } from "./home.js";
import { mountSimulator } from "./simulator.js";
import "../css/styles.css";

const homePage = document.querySelector("#home-page");
const simulatorPage = document.querySelector("#simulator-page");
const navigation = document.querySelector(".site-header nav");
let homeMounted = false;
let simulatorMounted = false;

function setNavigation(route, hash) {
  for (const link of navigation.querySelectorAll("a[data-route]")) {
    link.removeAttribute("aria-current");
    if (link.dataset.route === route) {
      link.setAttribute("aria-current", route === "about" ? "location" : "page");
    }
  }
  if (route === "about") {
    navigation.querySelector('[data-route="about"]')?.setAttribute("aria-current", "location");
  } else if (hash === "#about" && route === "home") {
    navigation.querySelector('[data-route="about"]')?.setAttribute("aria-current", "location");
  }
}

function renderRoute({ focus = false } = {}) {
  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
  if (normalizedPath !== "/" && normalizedPath !== "/simulator") {
    history.replaceState({}, "", "/");
  } else if (window.location.pathname !== normalizedPath) {
    history.replaceState({}, "", `${normalizedPath}${window.location.hash}`);
  }
  const isSimulator = normalizedPath === "/simulator";
  const hash = window.location.hash;
  homePage.hidden = isSimulator;
  simulatorPage.hidden = !isSimulator;
  const route = isSimulator ? "simulator" : hash === "#about" ? "about" : "home";
  document.title = isSimulator
    ? "4-bit ALU Simulator — LogicLab"
    : route === "about"
      ? "About LogicLab — Logic, made visible"
      : "LogicLab — Logic, made visible";
  setNavigation(route, hash);

  if (isSimulator && !simulatorMounted) {
    mountSimulator(simulatorPage);
    simulatorMounted = true;
  }
  if (!isSimulator && !homeMounted) {
    mountHome();
    homeMounted = true;
  }

  if (focus) {
    const heading = isSimulator
      ? simulatorPage.querySelector("h1")
      : route === "about"
        ? document.querySelector("#about-title")
        : homePage.querySelector("h1");
    requestAnimationFrame(() => {
      if (route === "about") {
        heading.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
      heading.focus({ preventScroll: route !== "about" });
    });
  } else if (hash === "#about") {
    requestAnimationFrame(() => document.querySelector("#about-title")?.scrollIntoView());
  }
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const destination = new URL(link.href);
  if (destination.origin !== window.location.origin) return;
  event.preventDefault();
  history.pushState({}, "", `${destination.pathname}${destination.hash}`);
  renderRoute({ focus: true });
});

window.addEventListener("popstate", () => renderRoute({ focus: true }));
window.addEventListener("error", () => {
  document.querySelector("#runtime-error").hidden = false;
});
window.addEventListener("unhandledrejection", (event) => {
  console.error("LogicLab encountered an unexpected error.", event.reason);
  document.querySelector("#runtime-error").hidden = false;
});

try {
  renderRoute();
} catch (error) {
  console.error("LogicLab could not initialize the requested screen.", error);
  document.querySelector("#runtime-error").hidden = false;
}
