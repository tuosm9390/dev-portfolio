// Firestore의 geul_posts 컬렉션을 읽고 저장하는 함수들을 제공한다
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { getGeulFirestore } from "./firebase";
import type { GeulPost, GeulPostInput } from "./types";

const collectionName = "geul_posts";

function requireDb() {
  const db = getGeulFirestore();

  if (!db) {
    throw new Error("Firebase 환경변수가 설정되지 않았습니다.");
  }

  return db;
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
    createdAt: (data.createdAt as GeulPost["createdAt"]) ?? null,
    updatedAt: (data.updatedAt as GeulPost["updatedAt"]) ?? null,
    publishedAt: (data.publishedAt as GeulPost["publishedAt"]) ?? null,
  };
}

export async function getPublishedGeulPost(slug: string) {
  const db = requireDb();
  const snapshot = await getDoc(doc(db, collectionName, slug));

  if (!snapshot.exists()) {
    return null;
  }

  const post = normalizePost(snapshot.id, snapshot.data());
  return post.status === "published" ? post : null;
}

export async function getAuthorGeulPosts(user: User) {
  const db = requireDb();
  const snapshot = await getDocs(
    query(
      collection(db, collectionName),
      where("authorUid", "==", user.uid),
      limit(20),
    ),
  );

  return snapshot.docs.map((item) => normalizePost(item.id, item.data()));
}

export async function saveGeulPost(input: GeulPostInput, user: User) {
  const db = requireDb();
  const ref = doc(db, collectionName, input.slug);
  const snapshot = await getDoc(ref);
  const now = serverTimestamp();
  const existing = snapshot.exists() ? normalizePost(snapshot.id, snapshot.data()) : null;
  const publishedAt =
    input.status === "published" ? existing?.publishedAt ?? now : existing?.publishedAt ?? null;

  await setDoc(
    ref,
    {
      ...input,
      authorUid: user.uid,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      publishedAt,
    },
    { merge: true },
  );

  return input.slug;
}
