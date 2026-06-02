// geul 글 입력 검증과 slug 생성 규칙을 테스트한다
import { describe, expect, it } from "vitest";
import { createExcerpt, createSlug, geulPostSchema } from "../validation";

describe("createSlug", () => {
  it("영문 제목을 공개 URL slug로 변환한다", () => {
    expect(createSlug("AI Frontend Growth!!")).toBe("ai-frontend-growth");
  });

  it("한글만 있는 제목은 빈 slug를 반환한다", () => {
    expect(createSlug("성장의 기록")).toBe("");
  });
});

describe("createExcerpt", () => {
  it("마크다운 문법을 제거해 짧은 요약을 만든다", () => {
    expect(createExcerpt("## 왜 이 글을 쓰는가\n\n**포트폴리오**는 결과를 보여준다.")).toContain(
      "왜 이 글을 쓰는가 포트폴리오는 결과를 보여준다.",
    );
  });
});

describe("geulPostSchema", () => {
  it("유효한 공개 글 입력을 통과시킨다", () => {
    const result = geulPostSchema.safeParse({
      slug: "ai-frontend-growth",
      title: "AI 시대에 프론트엔드로 성장한다는 것",
      topic: "성장의 기록",
      body: "비전공자로 시작한 나는 다시 성장하는 과정을 기록한다.",
      status: "published",
      excerpt: "비전공자로 시작한 성장 기록",
    });

    expect(result.success).toBe(true);
  });

  it("대문자 slug를 거부한다", () => {
    const result = geulPostSchema.safeParse({
      slug: "AI-Growth",
      title: "AI 시대에 프론트엔드로 성장한다는 것",
      topic: "성장의 기록",
      body: "비전공자로 시작한 나는 다시 성장하는 과정을 기록한다.",
      status: "draft",
      excerpt: "",
    });

    expect(result.success).toBe(false);
  });
});
