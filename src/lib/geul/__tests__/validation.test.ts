// geul 글 입력 검증과 내부 문서 ID 보존을 테스트한다
import { describe, expect, it } from "vitest";
import { createExcerpt, geulPostSchema } from "../validation";

describe("createExcerpt", () => {
  it("마크다운 문법을 제거해 짧은 요약을 만든다", () => {
    expect(createExcerpt("## 왜 이 글을 쓰는가\n\n**포트폴리오**는 결과를 보여준다.")).toContain(
      "왜 이 글을 쓰는가 포트폴리오는 결과를 보여준다.",
    );
  });
});

describe("geulPostSchema", () => {
  it("slug 없이 유효한 공개 글 입력을 통과시킨다", () => {
    const result = geulPostSchema.safeParse({
      title: "AI 시대에 프론트엔드로 성장한다는 것",
      topic: "성장의 기록",
      body: "비전공자로 시작한 나는 다시 성장하는 과정을 기록한다.",
      status: "published",
      excerpt: "비전공자로 시작한 성장 기록",
    });

    expect(result.success).toBe(true);
  });

  it("기존 글 수정을 위한 내부 postId는 slug 규칙으로 검증하지 않는다", () => {
    const result = geulPostSchema.safeParse({
      postId: "Firestore_Auto.ID_123",
      title: "AI 시대에 프론트엔드로 성장한다는 것",
      topic: "성장의 기록",
      body: "비전공자로 시작한 나는 다시 성장하는 과정을 기록한다.",
      status: "draft",
      excerpt: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.postId).toBe("Firestore_Auto.ID_123");
    }
  });
});
