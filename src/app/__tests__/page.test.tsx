import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  it("renders the interactive portfolio sections", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", { level: 1, name: "chan.works" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "실제 제품 흐름으로 연결한 작업들.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "프로젝트 보기" })).toHaveAttribute(
      "href",
      "#projects",
    );
  });

  it("opens a project detail in the same screen", async () => {
    render(<Page />);

    fireEvent.click(
      screen.getByRole("button", { name: "프로젝트 선택: Synapso.dev" }),
    );

    expect(await screen.findByText("만든 이유")).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "프로젝트 목록" }),
    ).toBeInTheDocument();
  });

  it("closes the selected project with Escape", async () => {
    render(<Page />);

    fireEvent.click(
      screen.getByRole("button", { name: "프로젝트 선택: Synapso.dev" }),
    );
    await screen.findByText("만든 이유");

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "프로젝트 선택: Synapso.dev" }),
      ).toBeInTheDocument();
    });
  });
});
