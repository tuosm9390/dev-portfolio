// geul 공개 글 상세 조회와 관리자 삭제 요청을 처리한다
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { geulSessionCookieName, verifyGeulSessionToken } from "@/lib/geul/session";
import { deleteGeulPostFromServer, getPublishedGeulPostFromServer } from "@/lib/geul/server-posts";

type GeulPostRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function hasGeulSession() {
  const cookieStore = await cookies();
  return verifyGeulSessionToken(cookieStore.get(geulSessionCookieName)?.value);
}

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

export async function DELETE(_request: Request, { params }: GeulPostRouteProps) {
  if (!(await hasGeulSession())) {
    return NextResponse.json({ message: "작성 권한이 없습니다." }, { status: 401 });
  }

  const { slug } = await params;

  try {
    await deleteGeulPostFromServer(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
