// geul 공개 글 상세 조회 요청을 처리한다
import { NextResponse } from "next/server";
import { getPublishedGeulPostFromServer } from "@/lib/geul/server-posts";

type GeulPostRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: GeulPostRouteProps) {
  const { slug } = await params;

  try {
    const post = await getPublishedGeulPostFromServer(slug);

    if (!post) {
      return NextResponse.json({ post: null });
    }

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ post: null });
  }
}
