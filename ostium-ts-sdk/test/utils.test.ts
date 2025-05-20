import { describe, it, expect } from "bun:test";
import { formatWithPrecision, calculateFeePerHours, fromErrorCodeToMessage, toBaseUnits, convertToScaledInteger, isValidDecimal, isNumeric } from "../src/utils";

describe("formatWithPrecision", () => {
  it("formats numbers with precision and strips zeros", () => {
    expect(formatWithPrecision(12.3456, 2)).toBe(12.35);
    expect(formatWithPrecision(12.3, 2)).toBe(12.3);
    expect(formatWithPrecision("12.300", 5)).toBe(12.3);
  });
});

describe("calculateFeePerHours", () => {
  it("calculates funding fee per hours", () => {
    expect(calculateFeePerHours(1, 1)).toBeCloseTo((10 / 3) * 60 * 60 * 100);
  });
});

describe("fromErrorCodeToMessage", () => {
  it("maps known error codes", () => {
    const [msg, suggestion] = fromErrorCodeToMessage("0x35fe85c5");
    expect(msg).toBe("WrongLeverage(uint32)");
    expect(suggestion).toBeNull();
  });

  it("handles insufficient funds", () => {
    const [msg, suggestion] = fromErrorCodeToMessage({ message: "insufficient funds for gas * price + value" });
    expect(msg).toBe("insufficient funds for gas * price + value");
    expect(suggestion).toBe("Please top up your account with more ETH");
  });
});

describe("toBaseUnits", () => {
  it("converts decimals to base units", () => {
    expect(toBaseUnits(1.23, 6)).toBe(1230000n);
  });
});

describe("convertToScaledInteger", () => {
  it("scales values correctly", () => {
    expect(convertToScaledInteger(1.23456)).toBe(1234560000000000000n);
  });
});

describe("isValidDecimal", () => {
  it("validates positive decimals", () => {
    expect(isValidDecimal("1.23")).toBe(true);
    expect(isValidDecimal("-1", true)).toBe(false);
  });
});

describe("isNumeric", () => {
  it("checks numeric values", () => {
    expect(isNumeric("123")).toBe(true);
    expect(isNumeric("abc")).toBe(false);
  });
});
