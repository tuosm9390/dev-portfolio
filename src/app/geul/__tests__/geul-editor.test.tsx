// geul 작성 화면의 기본 렌더링과 미리보기를 테스트한다
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GeulEditor from "../GeulEditor";

vi.mock("@/lib/geul/posts", () => ({
  getAuthorGeulPosts: vi.fn(),
  saveGeulPost: vi.fn(),
}));

beforeEach(() => {
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
});
