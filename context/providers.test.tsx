import { render, screen } from "@/utils/test-utils";
import { Providers } from "./providers";

describe("Providers", () => {
  it("wraps children with ThemeProvider", () => {
    render(
      <Providers>
        <span data-testid="child">Child</span>
      </Providers>
    );

    // With the global next-themes mock, ThemeProvider just passes through children
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders without children", () => {
    render(<Providers>{null}</Providers>);

    // Should render without crashing
    expect(document.body).toBeDefined();
  });
});
