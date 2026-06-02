// geul 글 데이터 구조와 저장 입력 타입을 정의한다

export type GeulTimestamp = {
  toDate: () => Date;
};

export type GeulPostStatus = "draft" | "published";

export type GeulPost = {
  slug: string;
  title: string;
  topic: string;
  body: string;
  status: GeulPostStatus;
  excerpt: string;
  authorUid: string;
  createdAt: Date | GeulTimestamp | string | null;
  updatedAt: Date | GeulTimestamp | string | null;
  publishedAt: Date | GeulTimestamp | string | null;
};

export type GeulPostInput = {
  slug: string;
  title: string;
  topic: string;
  body: string;
  status: GeulPostStatus;
  excerpt: string;
};
