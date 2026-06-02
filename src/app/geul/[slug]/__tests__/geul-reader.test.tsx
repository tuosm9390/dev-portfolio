// geul 공개 글 조회 화면의 성공과 누락 상태를 테스트한다
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GeulPostReader from "../GeulPostReader";
import { getPublishedGeulPost } from "@/lib/geul/posts";

vi.mock("@/lib/geul/posts", () => ({
  getPublishedGeulPost: vi.fn(),
}));

describe("GeulPostReader", () => {
  it("공개 글의 주제, 날짜, 제목, 본문을 표시한다", async () => {
    vi.mocked(getPublishedGeulPost).mockResolvedValue({
      slug: "ai-frontend-growth",
      title: "AI 시대에 프론트엔드로 성장한다는 것",
      topic: "성장의 기록",
      body: "비전공자로 시작한 나는 다시 성장하는 과정을 기록한다.",
      status: "published",
      excerpt: "비전공자로 시작한 성장 기록",
      authorUid: "owner",
      createdAt: new Date("2026-06-01T00:00:00.000Z"),
      updatedAt: new Date("2026-06-02T00:00:00.000Z"),
      publishedAt: new Date("2026-06-02T00:00:00.000Z"),
    });

    render(<GeulPostReader slug="ai-frontend-growth" />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: "AI 시대에 프론트엔드로 성장한다는 것" }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("성장의 기록")).toBeInTheDocument();
    expect(screen.getAllByText(/2026/)).toHaveLength(2);
    expect(screen.getByText("비전공자로 시작한 나는 다시 성장하는 과정을 기록한다.")).toBeInTheDocument();
  });

  it("공개 글이 없으면 찾을 수 없음 화면을 표시한다", async () => {
    vi.mocked(getPublishedGeulPost).mockResolvedValue(null);

    render(<GeulPostReader slug="missing" />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1, name: "글을 찾을 수 없습니다." })).toBeInTheDocument();
    });
  });
});
