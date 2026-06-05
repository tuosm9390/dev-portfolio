// geul 서버 글 목록 조회가 모든 문서를 반환하는지 검증한다
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAuthorGeulPostsFromServer, getPublishedGeulPostsFromServer } from "../server-posts";

const getMock = vi.fn();
const limitMock = vi.fn(() => ({ get: getMock }));
const whereMock = vi.fn(() => ({ limit: limitMock, get: getMock }));
const collectionMock = vi.fn(() => ({ where: whereMock, get: getMock }));

vi.mock("../admin", () => ({
  getGeulAdminFirestore: () => ({
    collection: collectionMock,
  }),
}));

function doc(slug: string, data: Record<string, unknown>) {
  return {
    id: slug,
    data: () => data,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getPublishedGeulPostsFromServer", () => {
  it("공개 글 조회에 임의 limit을 걸지 않고 모든 글을 최신순으로 반환한다", async () => {
    getMock.mockResolvedValueOnce({
      docs: [
        doc("old-post", {
          title: "오래된 글",
          topic: "기록",
          body: "old",
          status: "published",
          publishedAt: "2026-06-01T00:00:00.000Z",
        }),
        doc("middle-post", {
          title: "중간 글",
          topic: "기록",
          body: "middle",
          status: "published",
          publishedAt: "2026-06-03T00:00:00.000Z",
        }),
        doc("new-post", {
          title: "최신 글",
          topic: "기록",
          body: "new",
          status: "published",
          publishedAt: "2026-06-05T00:00:00.000Z",
        }),
      ],
    });

    const posts = await getPublishedGeulPostsFromServer();

    expect(limitMock).not.toHaveBeenCalled();
    expect(posts.map((post) => post.slug)).toEqual(["new-post", "middle-post", "old-post"]);
  });
});

describe("getAuthorGeulPostsFromServer", () => {
  it("작성자 글 조회에 임의 limit이나 legacy author 필터를 걸지 않고 모든 글을 최신 수정순으로 반환한다", async () => {
    getMock.mockResolvedValueOnce({
      docs: [
        doc("draft-one", {
          title: "초안 1",
          topic: "draft",
          body: "draft",
          status: "draft",
          authorUid: "legacy-user-a",
          updatedAt: "2026-06-01T00:00:00.000Z",
        }),
        doc("published-one", {
          title: "공개 1",
          topic: "published",
          body: "published",
          status: "published",
          authorUid: "geul-password-owner",
          updatedAt: "2026-06-04T00:00:00.000Z",
        }),
        doc("draft-two", {
          title: "초안 2",
          topic: "draft",
          body: "draft",
          status: "draft",
          authorUid: "legacy-user-b",
          updatedAt: "2026-06-03T00:00:00.000Z",
        }),
      ],
    });

    const posts = await getAuthorGeulPostsFromServer();

    expect(limitMock).not.toHaveBeenCalled();
    expect(whereMock).not.toHaveBeenCalledWith("authorUid", "==", "geul-password-owner");
    expect(posts.map((post) => post.slug)).toEqual(["published-one", "draft-two", "draft-one"]);
  });
});
