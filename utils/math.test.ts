import { isOdd } from "./math";

describe("isOdd", () => {
  it("returns true for odd numbers", () => {
    expect(isOdd(1)).toBe(true);
    expect(isOdd(-3)).toBe(true);
    expect(isOdd(999)).toBe(true);
  });

  it("returns false for even numbers", () => {
    expect(isOdd(0)).toBe(false);
    expect(isOdd(2)).toBe(false);
    expect(isOdd(-4)).toBe(false);
  });
});
