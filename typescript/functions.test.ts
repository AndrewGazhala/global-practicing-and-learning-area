import { add, divide, multiply, subtract } from "./functions";

describe("add", () => {
  test("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("adds negative numbers", () => {
    expect(add(-2, -3)).toBe(-5);
  });

  test("adds zero", () => {
    expect(add(7, 0)).toBe(7);
  });
});

describe("subtract", () => {
  test("subtracts two positive numbers", () => {
    expect(subtract(5, 3)).toBe(2);
  });

  test("subtracts to a negative result", () => {
    expect(subtract(3, 5)).toBe(-2);
  });

  test("subtracts zero", () => {
    expect(subtract(7, 0)).toBe(7);
  });
});

describe("multiply", () => {
  test("multiplies two positive numbers", () => {
    expect(multiply(4, 3)).toBe(12);
  });

  test("multiplies by zero", () => {
    expect(multiply(9, 0)).toBe(0);
  });

  test("multiplies negative numbers", () => {
    expect(multiply(-2, 3)).toBe(-6);
  });
});

describe("divide", () => {
  test("divides two positive numbers", () => {
    expect(divide(10, 2)).toBe(5);
  });

  test("divides to a fractional result", () => {
    expect(divide(5, 2)).toBe(2.5);
  });

  test("divides negative numbers", () => {
    expect(divide(-9, 3)).toBe(-3);
  });
});
