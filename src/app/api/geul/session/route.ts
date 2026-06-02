// geul 관리자 비밀번호 세션을 발급하고 해제한다
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getGeulSessionMaxAge, geulSessionCookieName, createGeulSessionToken, verifyGeulSessionToken } from "@/lib/geul/session";
import { verifyGeulPassword } from "@/lib/geul/password";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(geulSessionCookieName)?.value;

  return NextResponse.json({
    authenticated: verifyGeulSessionToken(token),
    configured: Boolean(process.env.GEUL_PASSWORD_HASH && process.env.GEUL_SESSION_SECRET),
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!body?.password) {
    return NextResponse.json({ message: "비밀번호를 입력해야 합니다." }, { status: 400 });
  }

  let isValid = false;

  try {
    isValid = verifyGeulPassword(body.password);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "비밀번호 설정을 확인해야 합니다." },
      { status: 500 },
    );
  }

  if (!isValid) {
    return NextResponse.json({ message: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(geulSessionCookieName, createGeulSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getGeulSessionMaxAge(),
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(geulSessionCookieName, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
