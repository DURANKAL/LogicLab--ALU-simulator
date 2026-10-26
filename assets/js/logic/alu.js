export const OPERATIONS = Object.freeze(["AND", "OR", "XOR", "ADD"]);
export const INVALID_INPUT_MESSAGE =
  "Enter a valid 4-bit binary number or a decimal integer from 0 to 15.";

export function createResetState() {
  return { a: 0, b: 0, operation: "AND" };
}

export class InputValidationError extends Error {
  constructor() {
    super(INVALID_INPUT_MESSAGE);
    this.name = "InputValidationError";
  }
}

export function parseBinary(value) {
  const normalized = String(value).trim();
  if (!/^[01]{4}$/.test(normalized)) throw new InputValidationError();
  return Number.parseInt(normalized, 2);
}

export function parseDecimal(value) {
  const normalized = String(value).trim();
  if (!/^\d+$/.test(normalized)) throw new InputValidationError();
  const number = Number(normalized);
  if (!Number.isSafeInteger(number) || number > 15) throw new InputValidationError();
  return number;
}

export function format4(value) {
  if (!Number.isInteger(value) || value < 0 || value > 15) {
    throw new InputValidationError();
  }
  return value.toString(2).padStart(4, "0");
}

export function calculate(a, b, operation) {
  if (!Number.isInteger(a) || a < 0 || a > 15 || !Number.isInteger(b) || b < 0 || b > 15) {
    throw new InputValidationError();
  }
  if (!OPERATIONS.includes(operation)) throw new RangeError(`Unsupported operation: ${operation}`);

  const binaryA = format4(a);
  const binaryB = format4(b);
  let value;
  let carryOut = 0;
  const bitSteps = [];

  if (operation === "ADD") {
    let carry = 0;
    for (let index = 3; index >= 0; index -= 1) {
      const left = Number(binaryA[index]);
      const right = Number(binaryB[index]);
      const carryIn = carry;
      const total = left + right + carryIn;
      const result = total % 2;
      carry = total > 1 ? 1 : 0;
      bitSteps.unshift({ position: 3 - index, a: left, b: right, carryIn, result, carryOut: carry });
    }
    value = (a + b) & 15;
    carryOut = carry;
  } else {
    const bitwise = {
      AND: (left, right) => left & right,
      OR: (left, right) => left | right,
      XOR: (left, right) => left ^ right,
    }[operation];
    value = bitwise(a, b);
    for (let index = 0; index < 4; index += 1) {
      const left = Number(binaryA[index]);
      const right = Number(binaryB[index]);
      bitSteps.push({
        position: 3 - index,
        a: left,
        b: right,
        result: Number(format4(value)[index]),
      });
    }
  }

  return {
    operation,
    a,
    b,
    binaryA,
    binaryB,
    value,
    binary: format4(value),
    decimal: value,
    carryOut,
    bitSteps,
  };
}

export function getTruthTable(operation) {
  if (!OPERATIONS.includes(operation)) throw new RangeError(`Unsupported operation: ${operation}`);
  if (operation === "ADD") {
    return {
      title: "Full-adder truth table",
      description: "Each bit adds A, B, and the carry-in from the bit to its right.",
      headers: ["A", "B", "Carry-in", "Sum", "Carry-out"],
      rows: Array.from({ length: 8 }, (_, value) => {
        const a = (value >> 2) & 1;
        const b = (value >> 1) & 1;
        const carryIn = value & 1;
        const total = a + b + carryIn;
        return [a, b, carryIn, total % 2, total > 1 ? 1 : 0];
      }),
    };
  }

  const apply = {
    AND: (a, b) => a & b,
    OR: (a, b) => a | b,
    XOR: (a, b) => a ^ b,
  }[operation];
  return {
    title: `${operation} truth table`,
    description: `The ${operation} operation is evaluated independently for each matching bit.`,
    headers: ["A", "B", operation],
    rows: [0, 1].flatMap((a) => [0, 1].map((b) => [a, b, apply(a, b)])),
  };
}
