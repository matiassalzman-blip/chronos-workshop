import { classNames } from "./classNames";

describe("classNames", () => {
  it("joins multiple class names", () => {
    expect(classNames("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(classNames("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string for all falsy", () => {
    expect(classNames(false, null, undefined)).toBe("");
  });

  it("handles single string", () => {
    expect(classNames("a")).toBe("a");
  });

  it("handles no arguments", () => {
    expect(classNames()).toBe("");
  });
});
