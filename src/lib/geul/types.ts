// geul 글 데이터 구조와 저장 입력 타입을 정의한다
import type { Timestamp } from "firebase/firestore";

export type GeulPostStatus = "draft" | "published";

export type GeulPost = {
  slug: string;
  title: string;
  topic: string;
  body: string;
  status: GeulPostStatus;
  excerpt: string;
  authorUid: string;
  createdAt: Date | Timestamp | null;
  updatedAt: Date | Timestamp | null;
  publishedAt: Date | Timestamp | null;
};

export type GeulPostInput = {
  slug: string;
  title: string;
  topic: string;
  body: string;
  status: GeulPostStatus;
  excerpt: string;
};
