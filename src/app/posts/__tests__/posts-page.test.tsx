// 공개 글 목록 페이지의 동적 렌더링과 목록 출력을 검증한다
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PostsPage, { dynamic } from "../page";
import { getPublishedGeulPostsFromServer } from "@/lib/geul/server-posts";

vi.mock("@/components/home/Header", () => ({
  default: () => <header>Header</header>,
}));

vi.mock("@/components/home/Footer", () => ({
  default: () => <footer>Footer</footer>,
}));

vi.mock("@/lib/geul/server-posts", () => ({
  getPublishedGeulPostsFromServer: vi.fn(),
}));

describe("PostsPage", () => {
  it("새로 공개한 글이 정적 캐시에 막히지 않도록 동적 렌더링을 강제한다", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("서버가 반환한 공개 글만 목록에 표시한다", async () => {
    vi.mocked(getPublishedGeulPostsFromServer).mockResolvedValue([
      {
        slug: "fresh-post",
        title: "바로 보여야 하는 글",
        topic: "기록",
        body: "본문",
        status: "published",
        excerpt: "공개 직후 확인하는 글입니다.",
        authorUid: "geul-password-owner",
        createdAt: "2026-06-15T00:00:00.000Z",
        updatedAt: "2026-06-15T00:00:00.000Z",
        publishedAt: "2026-06-15T00:00:00.000Z",
      },
    ]);

    render(await PostsPage());

    expect(screen.getByRole("link", { name: /바로 보여야 하는 글/ })).toHaveAttribute(
      "href",
      "/geul/fresh-post",
    );
    expect(screen.getByText("공개 직후 확인하는 글입니다.")).toBeInTheDocument();
  });

  it("초안은 공개 posts 목록에 표시하지 않는다", async () => {
    vi.mocked(getPublishedGeulPostsFromServer).mockResolvedValue([]);

    render(await PostsPage());

    expect(screen.queryByText("초안도 보여야 하는 글")).not.toBeInTheDocument();
  });
});
