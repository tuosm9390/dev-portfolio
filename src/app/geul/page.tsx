// geul 작성자 전용 편집 라우트를 렌더링한다
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GeulEditor from "./GeulEditor";
import { geulGateCookieName, verifyGeulGateToken } from "@/lib/geul/session";

export const metadata: Metadata = {
  title: "geul editor | chan.works",
  description: "김상찬의 포트폴리오 스토리 글 작성 화면",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function GeulPage() {
  const cookieStore = await cookies();

  if (!verifyGeulGateToken(cookieStore.get(geulGateCookieName)?.value)) {
    notFound();
  }

  return <GeulEditor />;
}
