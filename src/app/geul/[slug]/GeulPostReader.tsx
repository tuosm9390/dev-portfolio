"use client";
// geul 공개 글을 Firestore에서 조회해 읽기 전용으로 보여준다

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublishedGeulPost } from "@/lib/geul/posts";
import type { GeulPost } from "@/lib/geul/types";
import { formatGeulDate } from "@/lib/geul/dates";

type GeulPostReaderProps = {
  slug: string;
};

export default function GeulPostReader({ slug }: GeulPostReaderProps) {
  const [post, setPost] = useState<GeulPost | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    let isMounted = true;

    getPublishedGeulPost(slug)
      .then((nextPost) => {
        if (!isMounted) {
          return;
        }

        setPost(nextPost);
        setStatus(nextPost ? "ready" : "missing");
      })
      .catch(() => {
        if (isMounted) {
          setStatus("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 font-mono text-xs uppercase tracking-[0.2em] text-black/40">
        loading geul
      </main>
    );
  }

  if (status === "missing" || status === "error" || !post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center font-mono text-black">
        <p className="text-[10px] uppercase tracking-[0.24em] opacity-40">geul</p>
        <h1 className="mt-5 text-2xl font-semibold">글을 찾을 수 없습니다.</h1>
        <p className="mt-4 max-w-sm text-xs leading-6 opacity-60">
          공개되지 않았거나 삭제된 글입니다.
        </p>
        <Link href="/" className="mt-8 border border-black px-4 py-3 text-[10px] uppercase tracking-widest">
          home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-black lg:px-10 lg:py-12">
      <article className="mx-auto max-w-3xl font-mono">
        <nav className="mb-16 flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
          <Link href="/" className="font-semibold hover:opacity-50">
            chan.works
          </Link>
          <span className="opacity-40">geul</span>
        </nav>

        <header className="border-b border-black/10 pb-10">
          <p className="text-[10px] uppercase tracking-[0.24em] opacity-40">{post.topic}</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] opacity-50">
            <span>{formatGeulDate(post.createdAt)} 생성</span>
            <span>{formatGeulDate(post.updatedAt)} 수정</span>
          </div>
          <h1 className="mt-10 text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? <p className="mt-6 max-w-2xl text-sm leading-7 opacity-60">{post.excerpt}</p> : null}
        </header>

        <div className="prose prose-neutral mt-12 max-w-none prose-headings:font-mono prose-headings:tracking-tight prose-p:font-mono prose-p:text-[15px] prose-p:leading-8 prose-li:font-mono prose-li:text-[15px] prose-li:leading-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
