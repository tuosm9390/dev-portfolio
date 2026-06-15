// geul 작성 화면의 기본 렌더링과 미리보기를 테스트한다
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GeulEditor from "../GeulEditor";
import { getAuthorGeulPosts, saveGeulPost } from "@/lib/geul/posts";

vi.mock("@/lib/geul/posts", () => ({
  getAuthorGeulPosts: vi.fn(),
  saveGeulPost: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAuthorGeulPosts).mockResolvedValue([]);
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ authenticated: false, configured: false }),
    }),
  );
});

describe("GeulEditor", () => {
  it("비밀번호 설정이 없을 때 설정 안내와 작성 레이아웃을 렌더링한다", async () => {
    render(<GeulEditor />);

    expect(screen.getByRole("heading", { level: 1, name: "geul" })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("관리자 비밀번호 설정이 필요합니다.")).toBeInTheDocument();
    });
    expect(screen.getByText("hidden editor")).toBeInTheDocument();
    expect(screen.getByText("write")).toBeInTheDocument();
  });

  it("작성한 제목과 본문을 우측 미리보기에 반영한다", () => {
    render(<GeulEditor />);

    fireEvent.change(screen.getByPlaceholderText("AI 시대에 프론트엔드로 성장한다는 것"), {
      target: { value: "AI 시대에 프론트엔드로 성장한다는 것" },
    });
    fireEvent.change(screen.getByPlaceholderText(/비전공자로 시작한 나는/), {
      target: { value: "## 왜 이 글을 쓰는가\n\n포트폴리오는 결과를 보여준다." },
    });

    expect(
      screen.getByRole("heading", { level: 2, name: "AI 시대에 프론트엔드로 성장한다는 것" }),
    ).toBeInTheDocument();
    expect(screen.getByText("왜 이 글을 쓰는가")).toBeInTheDocument();
    expect(screen.getByText("포트폴리오는 결과를 보여준다.")).toBeInTheDocument();
  });

  it("새 글 작성 화면에서 slug 입력을 노출하지 않고 저장 요청에도 slug를 보내지 않는다", async () => {
    vi.mocked(saveGeulPost).mockResolvedValue("generated-post-id");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ authenticated: true, configured: true }),
      }),
    );

    render(<GeulEditor />);

    await waitFor(() => {
      expect(screen.queryByText("slug")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("AI 시대에 프론트엔드로 성장한다는 것"), {
      target: { value: "랜덤 ID로 저장되는 글" },
    });
    fireEvent.change(screen.getByPlaceholderText("성장의 기록"), {
      target: { value: "기록" },
    });
    fireEvent.change(screen.getByPlaceholderText(/비전공자로 시작한 나는/), {
      target: { value: "본문은 랜덤 ID 저장을 검증할 만큼 충분히 길다." },
    });
    fireEvent.click(screen.getByRole("button", { name: "publish" }));

    await waitFor(() => {
      expect(saveGeulPost).toHaveBeenCalledWith(
        expect.not.objectContaining({ slug: expect.anything() }),
      );
    });
    expect(saveGeulPost).toHaveBeenCalledWith(
      expect.not.objectContaining({ postId: expect.anything() }),
    );
    expect(await screen.findByText("공개했습니다. /geul/generated-post-id")).toBeInTheDocument();
  });

  it("인증된 작성자 화면에서 서버가 반환한 모든 글을 recent posts에 표시한다", async () => {
    vi.mocked(getAuthorGeulPosts).mockResolvedValue([
      {
        slug: "first-post",
        title: "첫 번째 글",
        topic: "기록",
        body: "첫 번째 본문",
        status: "published",
        excerpt: "",
        authorUid: "legacy-user-a",
        createdAt: "2026-06-01T00:00:00.000Z",
        updatedAt: "2026-06-01T00:00:00.000Z",
        publishedAt: "2026-06-01T00:00:00.000Z",
      },
      {
        slug: "second-post",
        title: "두 번째 글",
        topic: "기록",
        body: "두 번째 본문",
        status: "draft",
        excerpt: "",
        authorUid: "legacy-user-b",
        createdAt: "2026-06-02T00:00:00.000Z",
        updatedAt: "2026-06-02T00:00:00.000Z",
        publishedAt: null,
      },
      {
        slug: "third-post",
        title: "세 번째 글",
        topic: "기록",
        body: "세 번째 본문",
        status: "published",
        excerpt: "",
        authorUid: "geul-password-owner",
        createdAt: "2026-06-03T00:00:00.000Z",
        updatedAt: "2026-06-03T00:00:00.000Z",
        publishedAt: "2026-06-03T00:00:00.000Z",
      },
    ]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ authenticated: true, configured: true }),
      }),
    );

    render(<GeulEditor />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /첫 번째 글/ })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /두 번째 글/ })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /세 번째 글/ })).toBeInTheDocument();
    });
  });

  it("기존 글 수정 요청은 slug가 아니라 내부 postId로 저장한다", async () => {
    vi.mocked(saveGeulPost).mockResolvedValue("Firestore_Auto.ID_123");
    vi.mocked(getAuthorGeulPosts).mockResolvedValue([
      {
        slug: "Firestore_Auto.ID_123",
        title: "기존 글",
        topic: "기록",
        body: "기존 글 본문입니다.",
        status: "draft",
        excerpt: "",
        authorUid: "geul-password-owner",
        createdAt: "2026-06-01T00:00:00.000Z",
        updatedAt: "2026-06-01T00:00:00.000Z",
        publishedAt: null,
      },
    ]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ authenticated: true, configured: true }),
      }),
    );

    render(<GeulEditor />);

    fireEvent.click(await screen.findByRole("button", { name: /기존 글/ }));
    fireEvent.click(screen.getByRole("button", { name: "publish" }));

    await waitFor(() => {
      expect(saveGeulPost).toHaveBeenCalledWith(
        expect.objectContaining({ postId: "Firestore_Auto.ID_123" }),
      );
    });
    expect(saveGeulPost).toHaveBeenCalledWith(
      expect.not.objectContaining({ slug: expect.anything() }),
    );
  });
});
