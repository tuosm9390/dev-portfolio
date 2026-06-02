// geul 관리자 비밀번호를 서버에서 scrypt 해시로 검증한다
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const scheme = "scrypt";
const keyLength = 64;

export function createGeulPasswordHash(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, keyLength).toString("hex");
  return `${scheme}:${salt}:${hash}`;
}

export function verifyGeulPassword(password: string) {
  const stored = process.env.GEUL_PASSWORD_HASH;

  if (!stored) {
    throw new Error("GEUL_PASSWORD_HASH 환경변수가 설정되지 않았습니다.");
  }

  const [storedScheme, salt, expectedHash] = stored.split(":");

  if (storedScheme !== scheme || !salt || !expectedHash) {
    throw new Error("GEUL_PASSWORD_HASH 형식이 올바르지 않습니다.");
  }

  const actual = Buffer.from(scryptSync(password, salt, keyLength).toString("hex"), "hex");
  const expected = Buffer.from(expectedHash, "hex");

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
