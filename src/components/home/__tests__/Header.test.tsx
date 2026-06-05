// 포트폴리오 헤더의 ask me 트리거와 모바일 메뉴 동작을 검증한다
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Header from "../Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Header assistant trigger", () => {
  it("renders-centered-ask-me-trigger", () => {
    render(<Header />);

    const trigger = screen.getByRole("button", { name: "ask me!" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("data-assistant-trigger", "desktop");
  });

  it("mobile-ask-me-closes-menu-and-opens-island", async () => {
    const { container } = render(<Header />);

    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(container.querySelector("[data-mobile-menu='open']")).toBeInTheDocument();

    const mobileTrigger = container.querySelector("[data-assistant-trigger='mobile']");
    expect(mobileTrigger).toBeInTheDocument();
    fireEvent.click(mobileTrigger as HTMLElement);

    await waitFor(() => {
      expect(container.querySelector("[data-mobile-menu='open']")).not.toBeInTheDocument();
    });
    expect(await screen.findByRole("dialog", { name: "Portfolio assistant" })).toBeInTheDocument();
  });
});
