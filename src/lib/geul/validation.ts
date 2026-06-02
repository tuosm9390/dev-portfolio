// geul 글 입력값을 검증하고 공개 URL slug를 정리한다
import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const geulPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "slug는 2자 이상이어야 합니다.")
    .max(80, "slug는 80자 이하여야 합니다.")
    .regex(slugPattern, "slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다."),
  title: z
    .string()
    .trim()
    .min(2, "제목은 2자 이상이어야 합니다.")
    .max(120, "제목은 120자 이하여야 합니다."),
  topic: z
    .string()
    .trim()
    .min(1, "주제를 입력해야 합니다.")
    .max(40, "주제는 40자 이하여야 합니다."),
  body: z
    .string()
    .trim()
    .min(10, "본문은 10자 이상이어야 합니다."),
  status: z.enum(["draft", "published"]),
  excerpt: z
    .string()
    .trim()
    .max(180, "요약은 180자 이하여야 합니다."),
});

export type GeulPostFormValues = z.infer<typeof geulPostSchema>;

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/[가-힣]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createExcerpt(body: string) {
  return body
    .replace(/[#_*`>[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}
