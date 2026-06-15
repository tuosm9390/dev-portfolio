// geul 클라이언트가 서버 API를 통해 글을 읽고 저장하게 한다
import type { GeulPost, GeulPostInput } from "./types";

export async function getPublishedGeulPost(slug: string) {
  const response = await fetch(`/api/geul/posts/${encodeURIComponent(slug)}`);

  if (!response.ok) {
    throw new Error("공개 글을 불러오지 못했습니다.");
  }

  const result = (await response.json()) as { post: GeulPost | null };
  return result.post;
}

export async function getAuthorGeulPosts() {
  const response = await fetch("/api/geul/posts");

  if (!response.ok) {
    throw new Error("글 목록을 불러오지 못했습니다.");
  }

  return (await response.json()) as GeulPost[];
}

export async function saveGeulPost(input: GeulPostInput) {
  const response = await fetch("/api/geul/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? "저장에 실패했습니다.");
  }

  return ((await response.json()) as { slug: string }).slug;
}

export async function deleteGeulPost(slug: string) {
  const response = await fetch(`/api/geul/posts/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? "삭제에 실패했습니다.");
  }
}
