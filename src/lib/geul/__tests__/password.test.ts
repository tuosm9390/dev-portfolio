// geul 관리자 비밀번호 해시 생성과 검증을 테스트한다
import { afterEach, describe, expect, it, vi } from "vitest";
import { createGeulPasswordHash, verifyGeulPassword } from "../password";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("verifyGeulPassword", () => {
  it("scrypt 해시와 일치하는 비밀번호만 통과시킨다", () => {
    vi.stubEnv("GEUL_PASSWORD_HASH", createGeulPasswordHash("secret-password", "abcd1234"));

    expect(verifyGeulPassword("secret-password")).toBe(true);
    expect(verifyGeulPassword("wrong-password")).toBe(false);
  });

  it("해시 환경변수가 없으면 설정 오류를 던진다", () => {
    expect(() => verifyGeulPassword("secret-password")).toThrow("GEUL_PASSWORD_HASH");
  });
});
