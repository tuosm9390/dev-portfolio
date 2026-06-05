// Dynamic Island assistant UI 상호작용을 검증한다
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PortfolioAssistantIsland from "../PortfolioAssistantIsland";

describe("PortfolioAssistantIsland", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          answer: "AI Doc Agent는 문서 생성 자동화 프로젝트입니다.",
          refused: false,
          sources: ["projects:ai-doc-agent"],
        }),
      })),
    );
  });

  it("opens-from-ask-me-and-focuses-input", async () => {
    render(<PortfolioAssistantIsland triggerLabel="ask me!" />);

    fireEvent.click(screen.getByRole("button", { name: "ask me!" }));

    const input = await screen.findByPlaceholderText("포트폴리오에 대해 물어보세요");
    expect(input).toHaveFocus();
  });

  it("submits-supported-question", async () => {
    render(<PortfolioAssistantIsland triggerLabel="ask me!" />);

    fireEvent.click(screen.getByRole("button", { name: "ask me!" }));
    fireEvent.change(await screen.findByPlaceholderText("포트폴리오에 대해 물어보세요"), {
      target: { value: "AI Doc Agent는 뭐야?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByText("AI Doc Agent는 문서 생성 자동화 프로젝트입니다.")).toBeInTheDocument();
    });
  });

  it("renders-refusal-response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          answer:
            "포트폴리오에서 확인할 수 없는 내용입니다. 김상찬의 프로젝트, 기술 스택, 협업 범위, 연락 방법에 대해서만 답변할 수 있습니다.",
          refused: true,
          sources: [],
        }),
      })),
    );
    render(<PortfolioAssistantIsland triggerLabel="ask me!" />);

    fireEvent.click(screen.getByRole("button", { name: "ask me!" }));
    fireEvent.change(await screen.findByPlaceholderText("포트폴리오에 대해 물어보세요"), {
      target: { value: "오늘 날씨 알려줘" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByText(/포트폴리오에서 확인할 수 없는 내용입니다/)).toBeInTheDocument();
    });
  });

  it("does-not-submit-empty-message", async () => {
    const fetchMock = vi.mocked(fetch);
    render(<PortfolioAssistantIsland triggerLabel="ask me!" />);

    fireEvent.click(screen.getByRole("button", { name: "ask me!" }));
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("escape-closes-island", async () => {
    render(<PortfolioAssistantIsland triggerLabel="ask me!" />);

    fireEvent.click(screen.getByRole("button", { name: "ask me!" }));
    expect(await screen.findByRole("dialog", { name: "Portfolio assistant" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Portfolio assistant" })).not.toBeInTheDocument();
    });
  });

  it("renders-no-bottom-right-launcher", () => {
    const { container } = render(<PortfolioAssistantIsland triggerLabel="ask me!" />);

    expect(container.querySelector("[data-bottom-right-launcher]")).not.toBeInTheDocument();
  });
});
