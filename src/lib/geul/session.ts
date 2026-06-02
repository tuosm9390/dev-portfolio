// geul 관리자 세션 쿠키를 생성하고 검증한다
import { createHmac, timingSafeEqual } from "crypto";

export const geulSessionCookieName = "geul_session";

const sessionDurationMs = 1000 * 60 * 60 * 12;

function getSessionSecret() {
  const secret = process.env.GEUL_SESSION_SECRET;

  if (!secret) {
    throw new Error("GEUL_SESSION_SECRET 환경변수가 설정되지 않았습니다.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");

  return left.length === right.length && timingSafeEqual(left, right);
}

export function createGeulSessionToken() {
  const expiresAt = String(Date.now() + sessionDurationMs);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifyGeulSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [expiresAt, signature] = token.split(".");

  if (!expiresAt || !signature || Number(expiresAt) <= Date.now()) {
    return false;
  }

  try {
    return safeEqual(sign(expiresAt), signature);
  } catch {
    return false;
  }
}

export function getGeulSessionMaxAge() {
  return Math.floor(sessionDurationMs / 1000);
}
