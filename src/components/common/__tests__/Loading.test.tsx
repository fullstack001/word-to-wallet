import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "../Loading";

describe("Loading Component", () => {
  it("should render with default props", () => {
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render with custom message", () => {
    render(<Loading message="Please wait..." />);
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });

  it("should render spinner variant by default", () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should render dots variant", () => {
    const { container } = render(<Loading variant="dots" />);
    const dots = container.querySelectorAll(".bg-purple-600.rounded-full");
    expect(dots.length).toBeGreaterThan(0);
  });

  it("should apply size classes correctly", () => {
    const { container, rerender } = render(<Loading size="sm" />);
    let spinner = container.querySelector(".w-4.h-4");
    expect(spinner).toBeInTheDocument();

    rerender(<Loading size="lg" />);
    spinner = container.querySelector(".w-12.h-12");
    expect(spinner).toBeInTheDocument();
  });

  it("should apply fullScreen class when fullScreen is true", () => {
    const { container } = render(<Loading fullScreen />);
    // The fullScreen prop adds min-h-screen and flex classes, not fixed inset-0
    const fullScreenElement = container.querySelector(".min-h-screen");
    expect(fullScreenElement).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<Loading className="custom-class" />);
    const element = container.firstChild;
    expect(element).toHaveClass("custom-class");
  });
});
