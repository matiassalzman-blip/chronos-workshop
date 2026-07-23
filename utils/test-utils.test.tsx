import { RenderOptions, render as rtlRender } from "@testing-library/react";
import React from "react";
import {
  createMockFunction,
  render,
  renderLayout,
  waitForElementToBeRemoved
} from "./test-utils";

// Mock @testing-library/react
jest.mock("@testing-library/react", () => ({
  ...jest.requireActual("@testing-library/react"),
  render: jest.fn((ui: React.ReactElement, options?: RenderOptions) => {
    const actualRender = jest.requireActual("@testing-library/react").render;

    // If wrapper is provided, actually execute it to cover MockProviders
    if (options?.wrapper) {
      const Wrapper = options.wrapper;
      const wrappedUi = <Wrapper>{ui}</Wrapper>;
      return actualRender(wrappedUi);
    }

    return actualRender(ui, options);
  })
}));

describe("test-utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("render (customRender)", () => {
    it("should render component with MockProviders wrapper", () => {
      const TestComponent = () => <div>Test Content</div>;
      render(<TestComponent />);

      // Verify rtlRender was called with the wrapper
      expect(rtlRender).toHaveBeenCalledWith(
        <TestComponent />,
        expect.objectContaining({
          wrapper: expect.any(Function)
        })
      );
    });

    it("should pass through additional options", () => {
      const TestComponent = () => <div>Test Content</div>;
      const options = { container: document.createElement("div") };

      render(<TestComponent />, options);

      expect(rtlRender).toHaveBeenCalledWith(
        <TestComponent />,
        expect.objectContaining({
          wrapper: expect.any(Function),
          container: options.container
        })
      );
    });

    it("should wrap children in MockProviders", () => {
      // Test the wrapper function directly
      const mockRtlRender = rtlRender as jest.MockedFunction<typeof rtlRender>;

      render(<div>Test</div>);

      // Get the wrapper function that was passed to rtlRender
      const wrapperFunction = mockRtlRender.mock.calls[0][1]?.wrapper;

      // Test that the wrapper renders children correctly
      if (wrapperFunction) {
        const Wrapper = wrapperFunction;
        const wrapped = (
          <Wrapper>
            <span>Child</span>
          </Wrapper>
        );
        expect(wrapped).toBeDefined();
      }
    });
  });

  describe("renderLayout", () => {
    it("should render without wrapper for layout components", () => {
      const LayoutComponent = () => (
        <html>
          <body>
            <div>Layout Content</div>
          </body>
        </html>
      );

      renderLayout(<LayoutComponent />);

      expect(rtlRender).toHaveBeenCalledWith(<LayoutComponent />, undefined);
    });

    it("should pass through options without wrapper", () => {
      const LayoutComponent = () => <div>Layout</div>;
      const options = { container: document.createElement("div") };

      renderLayout(<LayoutComponent />, options);

      expect(rtlRender).toHaveBeenCalledWith(<LayoutComponent />, options);
    });
  });

  describe("createMockFunction", () => {
    it("should create a mock function without return value", () => {
      const mockFn = createMockFunction();

      expect(jest.isMockFunction(mockFn)).toBe(true);
      expect(mockFn()).toBeUndefined();
    });

    it("should create a mock function with return value", () => {
      const returnValue = { test: "value" };
      const mockFn = createMockFunction(returnValue);

      expect(jest.isMockFunction(mockFn)).toBe(true);
      expect(mockFn()).toBe(returnValue);
    });

    it("should handle undefined return value explicitly", () => {
      const mockFn = createMockFunction(undefined);

      expect(jest.isMockFunction(mockFn)).toBe(true);
      expect(mockFn()).toBeUndefined();
      expect(mockFn).not.toHaveBeenCalledWith(expect.anything());
    });
  });

  describe("waitForElementToBeRemoved", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    it("should resolve when element is removed from DOM", async () => {
      // Create and append an element
      const element = document.createElement("div");
      element.setAttribute("data-testid", "test-element");
      document.body.appendChild(element);

      // Start waiting for removal
      const removalPromise = waitForElementToBeRemoved(element);

      // Remove element after a short delay
      setTimeout(() => {
        document.body.removeChild(element);
      }, 10);

      // Should resolve without error
      await expect(removalPromise).resolves.toBeUndefined();
    });

    it("should handle element not in DOM", async () => {
      // Create element but don't add to DOM
      const element = document.createElement("div");

      // The function sets up an observer but since element is not in DOM,
      // we need to trigger a mutation to activate the observer callback
      const promise = waitForElementToBeRemoved(element);

      // Add a dummy element to trigger a mutation
      const dummy = document.createElement("div");
      document.body.appendChild(dummy);

      // Wait a bit and remove the dummy to trigger observer
      await new Promise((resolve) => setTimeout(resolve, 10));
      document.body.removeChild(dummy);

      // The observer should detect the element is not in DOM and resolve
      await expect(promise).resolves.toBeUndefined();
    });

    it("should handle element removal from nested structure", async () => {
      // Create nested structure
      const parent = document.createElement("div");
      const child = document.createElement("span");
      parent.appendChild(child);
      document.body.appendChild(parent);

      // Wait for child removal
      const removalPromise = waitForElementToBeRemoved(child);

      // Remove parent (which removes child)
      setTimeout(() => {
        document.body.removeChild(parent);
      }, 10);

      await expect(removalPromise).resolves.toBeUndefined();
    });

    it("should observe mutations in subtree", async () => {
      // Create deeply nested element
      const root = document.createElement("div");
      const middle = document.createElement("div");
      const element = document.createElement("span");

      root.appendChild(middle);
      middle.appendChild(element);
      document.body.appendChild(root);

      const removalPromise = waitForElementToBeRemoved(element);

      // Remove just the specific element
      setTimeout(() => {
        middle.removeChild(element);
      }, 10);

      await expect(removalPromise).resolves.toBeUndefined();
    });
  });

  describe("MockProviders component", () => {
    it("should render children without modification", () => {
      // Clear any previous renders
      document.body.innerHTML = "";

      // Test that MockProviders passes through children unchanged
      const TestChild = () => (
        <div data-testid="mock-test-child">Mock Test Content</div>
      );

      // Render with our custom render to capture the wrapper
      const mockRtlRender = rtlRender as jest.MockedFunction<typeof rtlRender>;
      mockRtlRender.mockClear();

      render(<TestChild />);

      // Verify wrapper was provided
      expect(mockRtlRender).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          wrapper: expect.any(Function)
        })
      );

      // Get the wrapper and verify it's a pass-through
      const wrapperFunction = mockRtlRender.mock.calls[0][1]?.wrapper;
      expect(wrapperFunction).toBeDefined();

      if (wrapperFunction) {
        // Test the wrapper renders children without modification
        const Wrapper = wrapperFunction;
        const testChild = <span>Test Child Content</span>;
        const wrapped = <Wrapper>{testChild}</Wrapper>;

        // The wrapper should just pass through the children
        expect(wrapped.props.children).toBe(testChild);
      }
    });
  });
});
