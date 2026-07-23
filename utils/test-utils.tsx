import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

// Mock providers that might be needed
const MockProviders = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) =>
  render(ui, {
    wrapper: MockProviders,
    ...options
  });

// Special render function for layout components that contain HTML elements
const renderLayout = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  // For layout components, don't use wrapper to avoid HTML nesting issues
  return render(ui, options);
};

// Re-export everything from testing library
export * from "@testing-library/react";
export { customRender as render, renderLayout };

// Helper functions for common test patterns
export const createMockFunction = (returnValue?: unknown) => {
  const mockFn = jest.fn();
  if (returnValue !== undefined) {
    mockFn.mockReturnValue(returnValue);
  }
  return mockFn;
};

export const waitForElementToBeRemoved = async (element: Element) => {
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
};
