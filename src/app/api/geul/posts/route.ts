// geul 관리자 글 목록 조회와 저장 요청을 처리한다
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { geulPostSchema } from "@/lib/geul/validation";
import { geulSessionCookieName, verifyGeulSessionToken } from "@/lib/geul/session";
import { getAuthorGeulPostsFromServer, saveGeulPostFromServer } from "@/lib/geul/server-posts";

async function hasGeulSession() {
  const cookieStore = await cookies();
  return verifyGeulSessionToken(cookieStore.get(geulSessionCookieName)?.value);
}

export async function GET() {
  if (!(await hasGeulSession())) {
    return NextResponse.json({ message: "작성 권한이 없습니다." }, { status: 401 });
  }

  try {
    return NextResponse.json(await getAuthorGeulPostsFromServer());
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "글 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await hasGeulSession())) {
    return NextResponse.json({ message: "작성 권한이 없습니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = geulPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "입력값을 확인해야 합니다." },
      { status: 400 },
    );
  }

  try {
    const slug = await saveGeulPostFromServer(parsed.data);
    return NextResponse.json({ slug });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "저장에 실패했습니다." },
      { status: 500 },
    );
  }
}
