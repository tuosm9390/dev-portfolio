// geul 글 입력값과 내부 문서 ID를 검증한다
import { z } from "zod";

export const geulPostSchema = z.object({
  postId: z
    .string()
    .trim()
    .min(1, "게시글 ID가 비어 있습니다.")
    .max(1500, "게시글 ID가 너무 깁니다.")
    .refine((value) => !value.includes("/"), "게시글 ID 형식이 올바르지 않습니다.")
    .optional(),
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

export function createExcerpt(body: string) {
  return body
    .replace(/[#_*`>[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}
