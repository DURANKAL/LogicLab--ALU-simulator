import test from "node:test";
import assert from "node:assert/strict";
import {
  calculate,
  createResetState,
  format4,
  getTruthTable,
  InputValidationError,
  parseBinary,
  parseDecimal,
} from "./alu.js";

test("logic operations match the reference values", () => {
  assert.equal(calculate(5, 3, "AND").binary, "0001");
  assert.equal(calculate(5, 3, "OR").binary, "0111");
  assert.equal(calculate(5, 3, "XOR").binary, "0110");
  assert.equal(calculate(5, 3, "ADD").binary, "1000");
  assert.equal(calculate(5, 3, "ADD").carryOut, 0);
});

test("all operations produce correct results for every unsigned input pair", () => {
  for (let a = 0; a < 16; a += 1) {
    for (let b = 0; b < 16; b += 1) {
      assert.equal(calculate(a, b, "AND").value, a & b);
      assert.equal(calculate(a, b, "OR").value, a | b);
      assert.equal(calculate(a, b, "XOR").value, a ^ b);
      assert.equal(calculate(a, b, "ADD").value, (a + b) & 15);
      assert.equal(calculate(a, b, "ADD").carryOut, Number(a + b > 15));
    }
  }
});

test("addition wraps to four bits and returns carry-out separately", () => {
  const result = calculate(15, 1, "ADD");
  assert.equal(result.binary, "0000");
  assert.equal(result.decimal, 0);
  assert.equal(result.carryOut, 1);
  assert.equal(calculate(15, 15, "ADD").carryOut, 1);
});

test("binary and decimal parsing are strict and synchronized", () => {
  assert.equal(parseBinary(" 1010 "), 10);
  assert.equal(parseDecimal("10"), parseBinary("1010"));
  assert.equal(parseDecimal("0"), 0);
  for (const value of ["", "101", "00000", "10a1", "2 10"]) {
    assert.throws(() => parseBinary(value), InputValidationError);
  }
  for (const value of ["", "-1", "1.5", "16", "1e1"]) {
    assert.throws(() => parseDecimal(value), InputValidationError);
  }
  assert.equal(parseDecimal("01"), 1);
});

test("four-bit formatting validates the unsigned range", () => {
  assert.equal(format4(0), "0000");
  assert.equal(format4(15), "1111");
  assert.throws(() => format4(16), InputValidationError);
  assert.throws(() => format4(-1), InputValidationError);
});

test("execution steps match each computed output", () => {
  const result = calculate(5, 3, "XOR");
  assert.equal(result.bitSteps.map((step) => step.result).join(""), result.binary);
  const addition = calculate(15, 1, "ADD");
  assert.deepEqual(addition.bitSteps.map((step) => step.result), [0, 0, 0, 0]);
  assert.equal(addition.bitSteps[0].carryOut, 1);
});

test("operation truth tables cover bit logic and full-adder carry", () => {
  assert.deepEqual(getTruthTable("XOR").rows, [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]]);
  const fullAdder = getTruthTable("ADD");
  assert.equal(fullAdder.rows.length, 8);
  assert.deepEqual(fullAdder.rows[7], [1, 1, 1, 1, 1]);
});

test("reset state produces the specified initial output", () => {
  const reset = createResetState();
  assert.deepEqual(reset, { a: 0, b: 0, operation: "AND" });
  assert.equal(calculate(reset.a, reset.b, reset.operation).binary, "0000");
});
