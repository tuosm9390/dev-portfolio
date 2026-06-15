// geul 관리자 세션 쿠키를 생성하고 검증한다
import { createHmac, timingSafeEqual } from "crypto";

export const geulSessionCookieName = "geul_session";
export const geulGateCookieName = "geul_gate";

const sessionDurationMs = 1000 * 60 * 60 * 12;
const gateDurationMs = 1000 * 60 * 60 * 24 * 30;
const gatePayload = "geul-editor";

function getSessionSecret() {
  const secret = process.env.GEUL_SESSION_SECRET;

  if (!secret) {
    throw new Error("GEUL_SESSION_SECRET 환경변수가 설정되지 않았습니다.");
  }

  return secret;
}

function getAccessKey() {
  const secret = process.env.GEUL_ACCESS_KEY;

  if (!secret) {
    throw new Error("GEUL_ACCESS_KEY 환경변수가 설정되지 않았습니다.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  if (!/^[a-f0-9]+$/i.test(a) || !/^[a-f0-9]+$/i.test(b)) {
    return false;
  }

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

export function createGeulGateToken() {
  return `${gatePayload}.${createHmac("sha256", getAccessKey()).update(gatePayload).digest("hex")}`;
}

export function verifyGeulGateToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (payload !== gatePayload || !signature) {
    return false;
  }

  try {
    return safeEqual(createHmac("sha256", getAccessKey()).update(gatePayload).digest("hex"), signature);
  } catch {
    return false;
  }
}

export function verifyGeulAccessKey(key: string | null) {
  if (!key) {
    return false;
  }

  try {
    const secret = getAccessKey();
    const inputHash = createHmac("sha256", secret).update(key).digest("hex");
    const expectedHash = createHmac("sha256", secret).update(secret).digest("hex");

    return safeEqual(inputHash, expectedHash);
  } catch {
    return false;
  }
}

export function getGeulGateMaxAge() {
  return Math.floor(gateDurationMs / 1000);
}
