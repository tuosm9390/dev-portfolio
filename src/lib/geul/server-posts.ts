// geul 서버 API에서 Firestore 글 문서를 읽고 저장한다
import { FieldValue } from "firebase-admin/firestore";
import { getGeulAdminFirestore } from "./admin";
import type { GeulPost, GeulPostInput } from "./types";

const collectionName = "geul_posts";
const serverAuthorId = "geul-password-owner";

function serializeDate(value: unknown) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
}

function normalizePost(slug: string, data: Record<string, unknown>): GeulPost {
  return {
    slug,
    title: String(data.title ?? ""),
    topic: String(data.topic ?? ""),
    body: String(data.body ?? ""),
    status: data.status === "published" ? "published" : "draft",
    excerpt: String(data.excerpt ?? ""),
    authorUid: String(data.authorUid ?? ""),
    createdAt: serializeDate(data.createdAt),
    updatedAt: serializeDate(data.updatedAt),
    publishedAt: serializeDate(data.publishedAt),
  };
}

export async function getPublishedGeulPostFromServer(slug: string) {
  const snapshot = await getGeulAdminFirestore().collection(collectionName).doc(slug).get();

  if (!snapshot.exists) {
    return null;
  }

  const post = normalizePost(snapshot.id, snapshot.data() ?? {});
  return post.status === "published" ? post : null;
}

export async function getPublishedGeulPostsFromServer() {
  const snapshot = await getGeulAdminFirestore()
    .collection(collectionName)
    .where("status", "==", "published")
    .get();

  return snapshot.docs
    .map((item) => normalizePost(item.id, item.data()))
    .sort((a, b) => String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")));
}

export async function getAuthorGeulPostsFromServer() {
  const snapshot = await getGeulAdminFirestore().collection(collectionName).get();

  return snapshot.docs
    .map((item) => normalizePost(item.id, item.data()))
    .sort((a, b) => String(b.updatedAt ?? "").localeCompare(String(a.updatedAt ?? "")));
}

export async function saveGeulPostFromServer(input: GeulPostInput) {
  const collection = getGeulAdminFirestore().collection(collectionName);
  const ref = input.postId ? collection.doc(input.postId) : collection.doc();
  const snapshot = await ref.get();
  const existing = snapshot.exists ? normalizePost(snapshot.id, snapshot.data() ?? {}) : null;
  const now = FieldValue.serverTimestamp();
  const publishedAt =
    input.status === "published" ? existing?.publishedAt ?? now : existing?.publishedAt ?? null;

  await ref.set(
    {
      title: input.title,
      topic: input.topic,
      body: input.body,
      status: input.status,
      excerpt: input.excerpt,
      authorUid: serverAuthorId,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      publishedAt,
    },
    { merge: true },
  );

  return ref.id;
}

export async function deleteGeulPostFromServer(slug: string) {
  await getGeulAdminFirestore().collection(collectionName).doc(slug).delete();
}
