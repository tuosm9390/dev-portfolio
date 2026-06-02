// geul 공개 글 상세 라우트를 렌더링한다
import type { Metadata } from "next";
import GeulPostReader from "./GeulPostReader";

type GeulPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: GeulPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug} | geul | chan.works`,
    description: "김상찬의 포트폴리오 스토리 글",
  };
}

export default async function GeulPostPage({ params }: GeulPostPageProps) {
  const { slug } = await params;

  return <GeulPostReader slug={slug} />;
}
