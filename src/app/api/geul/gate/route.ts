// geul 편집기 비공개 입장 키를 확인하고 게이트 쿠키를 발급한다
import { NextResponse } from "next/server";
import {
  createGeulGateToken,
  geulGateCookieName,
  getGeulGateMaxAge,
  verifyGeulAccessKey,
} from "@/lib/geul/session";

export function GET(request: Request) {
  const url = new URL(request.url);

  if (!verifyGeulAccessKey(url.searchParams.get("key"))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const response = NextResponse.redirect(new URL("/geul", request.url));
  response.cookies.set(geulGateCookieName, createGeulGateToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/geul",
    maxAge: getGeulGateMaxAge(),
  });

  return response;
}
