import {
  calculate,
  createResetState,
  format4,
  InputValidationError,
  OPERATIONS,
  parseDecimal,
} from "./logic/alu.js";

const ERROR_MESSAGE =
  "Enter a valid 4-bit binary number or a decimal integer from 0 to 15.";

export function mountSimulationControls(root, { onUpdate, initial = { a: 0, b: 0, operation: "AND" } }) {
  const state = { ...initial };
  const invalid = { a: false, b: false };
  const fields = {};

  for (const key of ["a", "b"]) {
    const fieldset = root.querySelector(`[data-operand="${key}"]`);
    const switchGroup = fieldset.querySelector(".bit-switches");
    const decimalInput = fieldset.querySelector(".decimal-input");
    const error = fieldset.querySelector(".field-error");
    fields[key] = { fieldset, switchGroup, decimalInput, error };
    decimalInput.value = String(state[key]);

    for (let bit = 3; bit >= 0; bit -= 1) {
      const button = document.createElement("button");
      button.className = "bit-switch";
      button.type = "button";
      button.setAttribute("role", "switch");
      button.dataset.bit = String(bit);
      button.setAttribute("aria-label", `Input ${key.toUpperCase()} bit ${bit}`);
      button.innerHTML = `<span aria-hidden="true">0</span><span aria-hidden="true">${bit}</span>`;
      switchGroup.append(button);
    }

    switchGroup.addEventListener("click", (event) => {
      const button = event.target.closest(".bit-switch");
      if (!button || !switchGroup.contains(button)) return;
      const bit = Number(button.dataset.bit);
      state[key] ^= 1 << bit;
      invalid[key] = false;
      decimalInput.value = String(state[key]);
      renderField(key);
      emitUpdate();
    });

    decimalInput.addEventListener("input", () => {
      try {
        state[key] = parseDecimal(decimalInput.value);
        invalid[key] = false;
      } catch (errorValue) {
        if (!(errorValue instanceof InputValidationError)) throw errorValue;
        invalid[key] = true;
      }
      renderField(key);
      emitUpdate();
    });
  }

  const operationInput = root.querySelector(".operation-input");
  operationInput.value = state.operation;
  operationInput.addEventListener("change", () => {
    if (!OPERATIONS.includes(operationInput.value)) {
      throw new RangeError(`Unsupported operation: ${operationInput.value}`);
    }
    state.operation = operationInput.value;
    emitUpdate();
  });

  function renderField(key) {
    const field = fields[key];
    const invalidValue = invalid[key];
    field.decimalInput.setAttribute("aria-invalid", String(invalidValue));
    field.error.textContent = invalidValue ? ERROR_MESSAGE : "";
    for (const button of field.switchGroup.querySelectorAll(".bit-switch")) {
      const bit = Number(button.dataset.bit);
      const enabled = !invalidValue && Boolean(state[key] & (1 << bit));
      button.setAttribute("aria-checked", String(enabled));
      button.querySelector("span").textContent = enabled ? "1" : "0";
    }
  }

  function emitUpdate() {
    if (invalid.a || invalid.b) {
      onUpdate({ valid: false, state: { ...state }, invalid: { ...invalid } });
      return;
    }
    onUpdate({
      valid: true,
      state: { ...state },
      result: calculate(state.a, state.b, state.operation),
    });
  }

  function reset(next = createResetState()) {
    Object.assign(state, next);
    invalid.a = false;
    invalid.b = false;
    operationInput.value = state.operation;
    for (const key of ["a", "b"]) {
      fields[key].decimalInput.value = String(state[key]);
      renderField(key);
    }
    emitUpdate();
  }

  function renderFieldInitial() {
    renderField("a");
    renderField("b");
    emitUpdate();
  }

  renderFieldInitial();
  return { reset };
}

export function renderBitRow(value) {
  return format4(value);
}
