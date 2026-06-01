import { render, screen } from "@testing-library/react";
import Page from "../page";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({
    alt,
    className,
  }: {
    alt: string;
    className?: string;
  }) => (
    <span aria-label={alt} className={className} role="img">
      {alt}
    </span>
  ),
}));

// Mock usePathname
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

beforeAll(() => {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];

    disconnect() {}
    observe() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    unobserve() {}
  }

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

describe("Home Page", () => {
  it("renders the monospace developer portfolio layout", () => {
    render(<Page />);

    // Brand logo Link
    expect(screen.getByRole("link", { name: "chan.works" })).toBeInTheDocument();

    // Section Headings
    expect(
      screen.getByRole("heading", { level: 2, name: "What I do best?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Selected work" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Experience" }),
    ).toBeInTheDocument();

    // Verification of list and footer links
    expect(screen.getByRole("link", { name: "All Projects →" })).toHaveAttribute(
      "href",
      "/projects",
    );
  });
});
