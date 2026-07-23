import { memoize } from "./memoize";

describe("memoize", () => {
  it("returns same result for same arguments", () => {
    const fn = jest.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("caches results for different argument sets", () => {
    const fn = jest.fn((a: number, b: number) => a * b);
    const memoized = memoize(fn);
    expect(memoized(2, 3)).toBe(6);
    expect(memoized(2, 3)).toBe(6);
    expect(memoized(3, 2)).toBe(6);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("handles no arguments", () => {
    const fn = jest.fn(() => 42);
    const memoized = memoize(fn);
    expect(memoized()).toBe(42);
    expect(memoized()).toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("caches objects by value not reference", () => {
    const fn = jest.fn((obj: { x: number }) => obj.x);
    const memoized = memoize(fn);

    // First call with { x: 1 }
    expect(memoized({ x: 1 })).toBe(1);

    // Second call with different reference but same value - should use cache
    expect(memoized({ x: 1 })).toBe(1);

    // Function should only be called once since values are the same
    expect(fn).toHaveBeenCalledTimes(1);

    // Call with different value
    expect(memoized({ x: 2 })).toBe(2);

    // Now function should have been called twice
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
