// Firestore 날짜 값을 공개 화면용 문자열로 변환한다
import type { Timestamp } from "firebase/firestore";

type FirestoreDate = Date | Timestamp | null | undefined;

function toDate(value: FirestoreDate) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if ("toDate" in value && typeof value.toDate === "function") {
    return value.toDate();
  }

  return null;
}

export function formatGeulDate(value: FirestoreDate) {
  const date = toDate(value);

  if (!date) {
    return "날짜 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
