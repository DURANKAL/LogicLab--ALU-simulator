import { mountSimulationControls } from "./controls.js";

let latestPreviewResult = null;

function updateHeroDiagram(result) {
  latestPreviewResult = result.binary ? result : null;
  const values = {
    "input-a": result.binaryA,
    "input-b": result.binaryB,
    output: result.binary,
  };
  for (const [name, value] of Object.entries(values)) {
    const label = document.querySelector(`[data-home-value="${name}"]`);
    if (label) label.textContent = value;
  }
  const canvas = document.querySelector("#hero-canvas");
  if (canvas) canvas.hidden = !latestPreviewResult;
  window.dispatchEvent(new CustomEvent("logiclab:preview", { detail: result }));
}

function renderPreview(root, update) {
  const binary = root.querySelector(".result-binary");
  const decimal = root.querySelector(".result-decimal");
  const carry = root.querySelector(".result-carry");
  const output = root.querySelector(".preview-output");
  if (!update.valid) {
    binary.textContent = "—";
    decimal.textContent = "—";
    carry.textContent = "—";
    output.setAttribute("aria-label", "No result. Correct the invalid input.");
    updateHeroDiagram({ binaryA: "----", binaryB: "----", binary: "----" });
    return;
  }
  const result = update.result;
  binary.textContent = result.binary;
  decimal.textContent = String(result.decimal);
  carry.textContent = String(result.carryOut);
  output.setAttribute("aria-label", `Result ${result.binary}, decimal ${result.decimal}, carry-out ${result.carryOut}`);
  updateHeroDiagram(result);
}

const componentCopy = {
  "logic-gates": {
    index: "COMPONENT / 01",
    title: "Logic gates",
    inputs: "A bit, B bit",
    outputs: "One logic bit",
    purpose: "AND, OR, and XOR compare matching input bits and return a Boolean result.",
  },
  "full-adder": {
    index: "COMPONENT / 02",
    title: "Full adder",
    inputs: "A, B, carry-in",
    outputs: "Sum, carry-out",
    purpose: "Adds two bits and the incoming carry, then passes a new carry to the next column.",
  },
  selection: {
    index: "COMPONENT / 03",
    title: "Operation-selection circuitry",
    inputs: "Operation, candidate results",
    outputs: "Selected four-bit result",
    purpose: "Routes the output of the chosen operation while keeping its signal path visible.",
  },
};

function renderComponentDetail(detail, key) {
  const item = componentCopy[key];
  if (!item) return;
  detail.innerHTML = `
    <p class="mono-label">${item.index}</p><h3>${item.title}</h3>
    <dl><div><dt>Inputs</dt><dd>${item.inputs}</dd></div><div><dt>Outputs</dt><dd>${item.outputs}</dd></div></dl>
    <p>${item.purpose}</p>`;
}

export function mountHome() {
  const preview = document.querySelector('[data-simulation="preview"]');
  mountSimulationControls(preview, {
    initial: { a: 5, b: 3, operation: "XOR" },
    onUpdate: (update) => renderPreview(preview, update),
  });

  const detail = document.querySelector("#component-detail");
  const explorer = document.querySelector(".explorer-diagram");
  explorer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-explain]");
    if (!button) return;
    explorer.querySelector(".explorer-node-active")?.classList.remove("explorer-node-active");
    button.classList.add("explorer-node-active");
    renderComponentDetail(detail, button.dataset.explain);
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    try {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      }, { threshold: 0.08 });
      document.documentElement.classList.add("js-motion");
      for (const section of reveals) observer.observe(section);
    } catch (error) {
      document.documentElement.classList.remove("js-motion");
      console.error("LogicLab section reveals could not initialize; all content remains visible.", error);
    }
  } else {
    for (const section of reveals) section.classList.add("is-visible");
  }

  const canvas = document.querySelector("#hero-canvas");
  const staticMode = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection?.saveData === true;
  if (canvas && window.innerWidth >= 768 && !staticMode && !saveData) {
    import("./motion/hero-scene.js")
      .then(({ mountHeroScene }) => mountHeroScene(canvas))
      .then((scene) => {
        if (latestPreviewResult) scene.update(latestPreviewResult);
        window.addEventListener("logiclab:preview", (event) => scene.update(event.detail));
      })
      .catch((error) => {
        console.error("LogicLab 3D scene could not start; the accessible circuit illustration remains available.", error);
        const runtimeError = document.querySelector("#runtime-error");
        runtimeError.hidden = false;
      });
  }
}
