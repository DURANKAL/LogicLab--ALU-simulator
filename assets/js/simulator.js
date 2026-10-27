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
      <g class="circuit-row">
        <text class="circuit-io-label" x="9" y="${y - 5}">A${step.position} · ${aBit}</text>
        <text class="circuit-io-label" x="9" y="${y + 13}">B${step.position} · ${bBit}</text>
        <path class="circuit-wire" data-state="${aBit}" d="M64 ${y - 8}H164V${y - 2}H238" />
        <path class="circuit-wire" data-state="${bBit}" d="M64 ${y + 10}H164V${y + 2}H238" />
        <g class="circuit-component" tabindex="0" role="button" data-component="${kind}" aria-label="${step.position === 3 ? "Most significant" : step.position === 0 ? "Least significant" : "Bit"} ${step.position}, ${operation} · ${step.result}, ${kind === "adder" ? "full adder" : "logic gate"}">
          <rect x="238" y="${y - 19}" width="104" height="37" />
          <text x="290" y="${y + 5}">${operation} · ${step.result}</text>
        </g>
        <path class="circuit-wire" data-state="${step.result}" d="M342 ${y}H458" />
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

export function mountSimulator(root) {
  let currentResult = null;
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
        return;
      }
      currentResult = update.result;
      renderResult(root, update.result);
    },
  });
  root.querySelector("#reset-simulator").addEventListener("click", () => controls.reset());
  return controls;
}
