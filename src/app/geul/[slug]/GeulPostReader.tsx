"use client";
// geul 공개 글을 Firestore에서 조회해 읽기 전용으로 보여준다

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { getPublishedGeulPost } from "@/lib/geul/posts";
import type { GeulPost } from "@/lib/geul/types";
import { formatGeulDate } from "@/lib/geul/dates";

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="font-mono text-2xl font-semibold tracking-tight mt-10 mb-4 leading-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="font-mono text-xl font-semibold tracking-tight mt-8 mb-3 leading-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="font-mono text-lg font-semibold mt-6 mb-2 leading-tight">{children}</h3>,
  p: ({ children }) => <p className="font-mono text-[15px] leading-8 mb-5">{children}</p>,
  ul: ({ children }) => <ul className="font-mono text-[15px] leading-8 list-disc pl-6 mb-5">{children}</ul>,
  ol: ({ children }) => <ol className="font-mono text-[15px] leading-8 list-decimal pl-6 mb-5">{children}</ol>,
  li: ({ children }) => <li className="font-mono text-[15px] leading-8">{children}</li>,
  blockquote: ({ children }) => <blockquote className="border-l-2 border-black/20 pl-5 my-6 opacity-60 italic">{children}</blockquote>,
  code: ({ className, children }) => {
    if (className?.startsWith("language-")) {
      return <code className={className}>{children}</code>;
    }
    return <code className="font-mono text-sm bg-black/5 px-1.5 py-0.5 rounded">{children}</code>;
  },
  pre: ({ children }) => <pre className="font-mono text-sm bg-black/5 p-5 rounded overflow-x-auto my-6 leading-7">{children}</pre>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="line-through opacity-50">{children}</del>,
  hr: () => <hr className="border-t border-black/10 my-10" />,
  a: ({ href, children }) => <a href={href} className="underline opacity-70 hover:opacity-40">{children}</a>,
  img: ({ src, alt }) => <img src={src} alt={alt ?? ""} className="max-w-full rounded my-6" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-[14px] border-collapse font-mono">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b-2 border-black/20">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-black/10">{children}</tr>,
  th: ({ children }) => <th className="font-semibold text-left py-2 px-4">{children}</th>,
  td: ({ children }) => <td className="py-2 px-4">{children}</td>,
  input: ({ type, checked }) =>
    type === "checkbox" ? <input type="checkbox" checked={checked} readOnly className="mr-1.5 accent-black" /> : null,
};

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

        <div className="mt-12 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>{post.body}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
