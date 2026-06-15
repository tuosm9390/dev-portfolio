"use client";
// geul 글 작성 폼과 마크다운 미리보기를 제공한다

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { getAuthorGeulPosts, saveGeulPost } from "@/lib/geul/posts";
import type { GeulPost, GeulPostInput, GeulPostStatus } from "@/lib/geul/types";
import { createExcerpt, geulPostSchema } from "@/lib/geul/validation";
import { formatGeulDate } from "@/lib/geul/dates";

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="font-mono text-xl font-semibold tracking-tight mt-6 mb-3 leading-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="font-mono text-lg font-semibold tracking-tight mt-5 mb-2 leading-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="font-mono text-base font-semibold mt-4 mb-2 leading-tight">{children}</h3>,
  p: ({ children }) => <p className="font-mono text-sm leading-8 mb-4">{children}</p>,
  ul: ({ children }) => <ul className="font-mono text-sm leading-8 list-disc pl-5 mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="font-mono text-sm leading-8 list-decimal pl-5 mb-4">{children}</ol>,
  li: ({ children }) => <li className="font-mono text-sm leading-7">{children}</li>,
  blockquote: ({ children }) => <blockquote className="border-l-2 border-black/20 pl-4 my-4 opacity-60 italic">{children}</blockquote>,
  code: ({ className, children }) =>
    className?.startsWith("language-")
      ? <code className={className}>{children}</code>
      : <code className="font-mono text-xs bg-black/5 px-1.5 py-0.5 rounded">{children}</code>,
  pre: ({ children }) => <pre className="font-mono text-xs bg-black/5 p-4 rounded overflow-x-auto mb-4 leading-6">{children}</pre>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="line-through opacity-50">{children}</del>,
  hr: () => <hr className="border-t border-black/10 my-8" />,
  a: ({ href, children }) => <a href={href} className="underline opacity-70 hover:opacity-40">{children}</a>,
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      <Image
        src={src}
        alt={alt ?? ""}
        width={1200}
        height={675}
        unoptimized
        className="my-4 h-auto max-w-full rounded"
      />
    ) : null,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-xs border-collapse font-mono">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b-2 border-black/20">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-black/10">{children}</tr>,
  th: ({ children }) => <th className="font-semibold text-left py-2 px-3">{children}</th>,
  td: ({ children }) => <td className="py-2 px-3">{children}</td>,
  input: ({ type, checked }) =>
    type === "checkbox" ? <input type="checkbox" checked={checked} readOnly className="mr-1.5 accent-black" /> : null,
};

const emptyPost: GeulPostInput = {
  title: "",
  topic: "",
  body: "",
  status: "draft",
  excerpt: "",
};

export default function GeulEditor() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [form, setForm] = useState<GeulPostInput>(emptyPost);
  const [posts, setPosts] = useState<GeulPost[]>([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const previewExcerpt = form.excerpt || createExcerpt(form.body);

  useEffect(() => {
    fetch("/api/geul/session")
      .then((response) => response.json())
      .then((state: { authenticated?: boolean; configured?: boolean }) => {
        setIsAuthenticated(Boolean(state.authenticated));
        setIsConfigured(state.configured !== false);
      })
      .catch(() => {
        setIsConfigured(false);
      })
      .finally(() => {
        setIsCheckingSession(false);
      });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setPosts([]);
      return;
    }

    getAuthorGeulPosts()
      .then(setPosts)
      .catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : "글 목록을 불러오지 못했습니다.");
      });
  }, [isAuthenticated]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAuthError("");

    try {
      const response = await fetch("/api/geul/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(error?.message ?? "로그인에 실패했습니다.");
      }

      setIsAuthenticated(true);
      setPassword("");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    }
  }

  async function handleLogout() {
    await fetch("/api/geul/session", { method: "DELETE" });
    setIsAuthenticated(false);
    setPosts([]);
  }

  function updateField(name: keyof GeulPostInput, value: string) {
    setForm((current) => ({
      ...current,
      [name]: name === "status" ? (value as GeulPostStatus) : value,
    }));
  }

  function loadPost(post: GeulPost) {
    setForm({
      postId: post.slug,
      title: post.title,
      topic: post.topic,
      body: post.body,
      status: post.status,
      excerpt: post.excerpt,
    });
    setMessage(`${post.title} 글을 불러왔습니다.`);
  }

  async function handleSave(status: GeulPostStatus) {
    if (!isAuthenticated) {
      setMessage("작성 권한이 없습니다.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const input = {
      ...form,
      status,
      excerpt: form.excerpt || createExcerpt(form.body),
    };
    const parsed = geulPostSchema.safeParse(input);

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "입력값을 확인해야 합니다.");
      setIsSaving(false);
      return;
    }

    try {
      const slug = await saveGeulPost(parsed.data);
      setMessage(status === "published" ? `공개했습니다. /geul/${slug}` : "초안으로 저장했습니다.");
      const nextPosts = await getAuthorGeulPosts();
      setPosts(nextPosts);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black font-mono">
      <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(360px,0.95fr)_minmax(420px,1.05fr)]">
        <div className="border-b border-black/10 px-5 py-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] opacity-40">hidden editor</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">geul</h1>
              <p className="mt-3 max-w-sm text-xs leading-6 opacity-60">
                채용 담당자와 협업자가 읽을 수 있는 개인 서사 글을 작성합니다.
              </p>
            </div>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="border border-black px-3 py-2 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white"
              >
                logout
              </button>
            ) : null}
          </div>

          {!isCheckingSession && !isConfigured ? (
            <div className="mb-8 border border-black/10 p-4 text-xs leading-6">
              <p className="font-semibold">관리자 비밀번호 설정이 필요합니다.</p>
              <p className="mt-2 opacity-60">
                `GEUL_PASSWORD_HASH`와 `GEUL_SESSION_SECRET`을 설정해야 작성 화면을 사용할 수
                있습니다. Firestore 저장에는 Firebase Admin 환경변수도 필요합니다.
              </p>
            </div>
          ) : null}

          {!isCheckingSession && !isAuthenticated ? (
            <form onSubmit={handleLogin} className="mb-8 space-y-3 border border-black/10 p-4">
              <label className="block text-[10px] uppercase tracking-widest opacity-50" htmlFor="password">
                admin password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-black/10 px-3 py-2 text-xs outline-none focus:border-black"
              />
              <button
                type="submit"
                className="w-full bg-black px-4 py-2 text-[10px] uppercase tracking-widest text-white disabled:opacity-40"
              >
                login
              </button>
              {authError ? <p className="text-xs text-red-600">{authError}</p> : null}
            </form>
          ) : null}

          <div className={!isAuthenticated ? "pointer-events-none opacity-40" : ""}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-[11px] uppercase tracking-[0.2em] opacity-50">write</h2>
              <button
                type="button"
                onClick={() => setForm(emptyPost)}
                className="text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100"
              >
                new
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest opacity-50">title</span>
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="mt-2 w-full border border-black/10 px-3 py-3 text-sm outline-none focus:border-black"
                  placeholder="AI 시대에 프론트엔드로 성장한다는 것"
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-widest opacity-50">topic</span>
                <input
                  value={form.topic}
                  onChange={(event) => updateField("topic", event.target.value)}
                  className="mt-2 w-full border border-black/10 px-3 py-3 text-sm outline-none focus:border-black"
                  placeholder="성장의 기록"
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-widest opacity-50">excerpt</span>
                <textarea
                  value={form.excerpt}
                  onChange={(event) => updateField("excerpt", event.target.value)}
                  rows={2}
                  className="mt-2 w-full resize-none border border-black/10 px-3 py-3 text-sm leading-6 outline-none focus:border-black"
                  placeholder="비워두면 본문에서 자동 생성합니다."
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-widest opacity-50">body</span>
                <textarea
                  value={form.body}
                  onChange={(event) => updateField("body", event.target.value)}
                  rows={16}
                  className="mt-2 w-full resize-y border border-black/10 px-3 py-3 text-sm leading-7 outline-none focus:border-black"
                  placeholder={"비전공자로 시작한 나는...\n\n## 왜 이 글을 쓰는가\n\n포트폴리오는 결과를 보여주지만..."}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isSaving || !isAuthenticated}
                  onClick={() => handleSave("draft")}
                  className="border border-black px-4 py-3 text-[10px] uppercase tracking-widest disabled:opacity-40"
                >
                  save draft
                </button>
                <button
                  type="button"
                  disabled={isSaving || !isAuthenticated}
                  onClick={() => handleSave("published")}
                  className="bg-black px-4 py-3 text-[10px] uppercase tracking-widest text-white disabled:opacity-40"
                >
                  publish
                </button>
              </div>

              {message ? <p className="text-xs leading-6 opacity-70">{message}</p> : null}

              <div className="mt-10 border-t border-black/10 pt-6">
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] opacity-40">markdown guide</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                  {[
                    ["# 제목", "H1 헤딩"],
                    ["## 제목", "H2 헤딩"],
                    ["### 제목", "H3 헤딩"],
                    ["**텍스트**", "굵은 텍스트"],
                    ["*텍스트*", "기울인 텍스트"],
                    ["- 항목", "순서 없는 목록"],
                    ["1. 항목", "순서 있는 목록"],
                    ["`코드`", "인라인 코드"],
                    ["```코드```", "코드 블록"],
                    ["> 텍스트", "인용 블록"],
                    ["---", "구분선"],
                    ["[텍스트](URL)", "링크"],
                    ["Enter 1번", "줄바꿈"],
                    ["Enter 2번", "단락 구분"],
                    ["~~텍스트~~", "취소선"],
                    ["![이름](URL)", "이미지"],
                    ["| A | B |\\n|---|---|\\n| 1 | 2 |", "테이블"],
                    ["- [ ] 항목", "체크리스트 (미완료)"],
                    ["- [x] 항목", "체크리스트 (완료)"],
                  ].map(([syntax, desc]) => (
                    <div key={syntax} className="contents">
                      <dt className="font-mono text-[10px] leading-5 opacity-60 whitespace-nowrap bg-black/5 px-1.5 py-0.5 rounded self-start">{syntax}</dt>
                      <dd className="text-[10px] leading-5 opacity-40 self-center">{desc}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {posts.length > 0 ? (
              <div className="mt-10">
                <h2 className="mb-3 text-[11px] uppercase tracking-[0.2em] opacity-50">recent posts</h2>
                <div className="space-y-2">
                  {posts.map((post) => (
                    <button
                      key={post.slug}
                      type="button"
                      onClick={() => loadPost(post)}
                      className="block w-full border border-black/10 px-3 py-3 text-left hover:border-black"
                    >
                      <span className="block text-xs font-semibold">{post.title}</span>
                      <span className="mt-1 block text-[10px] uppercase tracking-widest opacity-50">
                        {post.status} · {formatGeulDate(post.updatedAt)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <article className="min-h-screen px-5 py-8 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 border-b border-black/10 pb-6">
              <p className="text-[10px] uppercase tracking-[0.24em] opacity-40">
                {form.topic || "topic"}
              </p>
              <p className="mt-3 text-[11px] opacity-50">생성 미리보기 · 수정 미리보기</p>
              <h2 className="mt-8 text-3xl font-semibold leading-tight tracking-tight">
                {form.title || "제목을 입력하면 여기에 표시됩니다."}
              </h2>
              {previewExcerpt ? <p className="mt-5 text-sm leading-7 opacity-60">{previewExcerpt}</p> : null}
            </div>
            <div className="max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
                {form.body || "본문을 입력하면 Markdown 미리보기가 여기에 표시됩니다."}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
