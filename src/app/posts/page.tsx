// 공개된 geul 글 목록을 보여주는 포스트 아카이브 페이지
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { getPublishedGeulPostsFromServer } from "@/lib/geul/server-posts";
import { formatGeulDate } from "@/lib/geul/dates";

export const metadata: Metadata = {
  title: "Posts | chan.works",
  description: "김상찬의 개발과 성장에 관한 글",
};

export default async function PostsPage() {
  let posts: Awaited<ReturnType<typeof getPublishedGeulPostsFromServer>> = [];

  try {
    posts = await getPublishedGeulPostsFromServer();
  } catch {
    posts = [];
  }

  return (
    <>
      <Header />

      <main className="relative w-full min-h-screen bg-white text-black font-mono pt-40 px-6 md:px-20 selection:bg-black selection:text-white">
        <section className="max-w-[1200px] mx-auto pb-40">
          <h1 className="text-[11px] tracking-[0.2em] uppercase mb-16 opacity-40">
            Posts
          </h1>

          <div className="mb-20 md:mb-32 flex flex-col md:flex-row justify-between items-baseline gap-4">
            <h2 className="text-2xl md:text-[28px] font-medium tracking-tight">
              Writing & Essays
            </h2>
            <p className="text-[10px] tracking-[0.2em] uppercase opacity-40">
              geul / 개발과 성장의 기록
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-[11px] tracking-[0.15em] uppercase opacity-30">
              아직 공개된 글이 없습니다.
            </p>
          ) : (
            <ul className="divide-y divide-black/10">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/geul/${post.slug}`}
                    className="group flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12 py-8 hover:opacity-60 transition-opacity"
                  >
                    <span className="shrink-0 text-[9px] uppercase tracking-[0.2em] opacity-40 md:w-28">
                      {post.topic}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base md:text-lg font-medium tracking-tight leading-snug">
                        {post.title}
                      </p>
                      {post.excerpt ? (
                        <p className="mt-2 text-[11px] leading-6 opacity-50 line-clamp-2">
                          {post.excerpt}
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-[10px] tabular-nums opacity-40 md:text-right">
                      {formatGeulDate(post.publishedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Footer />
      </main>
    </>
  );
}
