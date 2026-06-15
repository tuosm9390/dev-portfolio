// geul 관리자 세션과 편집기 게이트 토큰을 테스트한다
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createGeulGateToken,
  createGeulSessionToken,
  verifyGeulAccessKey,
  verifyGeulGateToken,
  verifyGeulSessionToken,
} from "../session";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("geul session token", () => {
  it("세션 비밀값으로 서명한 토큰만 통과시킨다", () => {
    vi.stubEnv("GEUL_SESSION_SECRET", "session-secret");

    const token = createGeulSessionToken();

    expect(verifyGeulSessionToken(token)).toBe(true);
    expect(verifyGeulSessionToken(`${token}tampered`)).toBe(false);
  });
});

describe("geul gate token", () => {
  it("비공개 입장 키가 맞을 때만 게이트 토큰을 발급하고 검증한다", () => {
    vi.stubEnv("GEUL_ACCESS_KEY", "private-entry-key");

    const token = createGeulGateToken();

    expect(verifyGeulAccessKey("private-entry-key")).toBe(true);
    expect(verifyGeulAccessKey("wrong-key")).toBe(false);
    expect(verifyGeulGateToken(token)).toBe(true);
    expect(verifyGeulGateToken(`${token}tampered`)).toBe(false);
  });
});
