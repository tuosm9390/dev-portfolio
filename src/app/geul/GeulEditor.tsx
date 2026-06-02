"use client";
// geul 글 작성 폼과 마크다운 미리보기를 제공한다

import { FormEvent, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { getAllowedGeulAuthorEmail, getGeulAuth, getGeulFirestore } from "@/lib/geul/firebase";
import { getAuthorGeulPosts, saveGeulPost } from "@/lib/geul/posts";
import type { GeulPost, GeulPostInput, GeulPostStatus } from "@/lib/geul/types";
import { createExcerpt, createSlug, geulPostSchema } from "@/lib/geul/validation";
import { formatGeulDate } from "@/lib/geul/dates";

const emptyPost: GeulPostInput = {
  slug: "",
  title: "",
  topic: "",
  body: "",
  status: "draft",
  excerpt: "",
};

export default function GeulEditor() {
  const auth = useMemo(() => getGeulAuth(), []);
  const db = useMemo(() => getGeulFirestore(), []);
  const allowedEmail = getAllowedGeulAuthorEmail();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState(allowedEmail);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [form, setForm] = useState<GeulPostInput>(emptyPost);
  const [posts, setPosts] = useState<GeulPost[]>([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isFirebaseReady = Boolean(auth && db);
  const isAllowedAuthor = Boolean(user?.email && user.email === allowedEmail);
  const previewExcerpt = form.excerpt || createExcerpt(form.body);

  useEffect(() => {
    if (!auth) {
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
  }, [auth]);

  useEffect(() => {
    if (!user || !isAllowedAuthor) {
      setPosts([]);
      return;
    }

    getAuthorGeulPosts(user)
      .then(setPosts)
      .catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : "글 목록을 불러오지 못했습니다.");
      });
  }, [isAllowedAuthor, user]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth) {
      setAuthError("Firebase 환경변수가 설정되지 않았습니다.");
      return;
    }

    setAuthError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setPassword("");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    }
  }

  async function handleLogout() {
    if (auth) {
      await signOut(auth);
    }
  }

  function updateField(name: keyof GeulPostInput, value: string) {
    setForm((current) => ({
      ...current,
      [name]: name === "status" ? (value as GeulPostStatus) : value,
    }));
  }

  function loadPost(post: GeulPost) {
    setForm({
      slug: post.slug,
      title: post.title,
      topic: post.topic,
      body: post.body,
      status: post.status,
      excerpt: post.excerpt,
    });
    setMessage(`${post.title} 글을 불러왔습니다.`);
  }

  function applyTitleSlug() {
    const nextSlug = createSlug(form.title);
    if (nextSlug) {
      updateField("slug", nextSlug);
    }
  }

  async function handleSave(status: GeulPostStatus) {
    if (!user || !isAllowedAuthor) {
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
      const slug = await saveGeulPost(parsed.data, user);
      setMessage(status === "published" ? `공개했습니다. /geul/${slug}` : "초안으로 저장했습니다.");
      const nextPosts = await getAuthorGeulPosts(user);
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
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="border border-black px-3 py-2 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white"
              >
                logout
              </button>
            ) : null}
          </div>

          {!isFirebaseReady ? (
            <div className="mb-8 border border-black/10 p-4 text-xs leading-6">
              <p className="font-semibold">Firebase 설정이 필요합니다.</p>
              <p className="mt-2 opacity-60">
                `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`,
                `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`를 설정해야 저장할 수
                있습니다.
              </p>
            </div>
          ) : null}

          {isFirebaseReady && !user ? (
            <form onSubmit={handleLogin} className="mb-8 space-y-3 border border-black/10 p-4">
              <label className="block text-[10px] uppercase tracking-widest opacity-50" htmlFor="email">
                author email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-black/10 px-3 py-2 text-xs outline-none focus:border-black"
              />
              <label className="block text-[10px] uppercase tracking-widest opacity-50" htmlFor="password">
                password
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

          {user && !isAllowedAuthor ? (
            <div className="mb-8 border border-red-200 p-4 text-xs leading-6 text-red-700">
              허용된 작성자 이메일이 아닙니다. 현재 로그인: {user.email}
            </div>
          ) : null}

          <div className={!isAllowedAuthor ? "pointer-events-none opacity-40" : ""}>
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
                <span className="text-[10px] uppercase tracking-widest opacity-50">slug</span>
                <div className="mt-2 flex gap-2">
                  <input
                    value={form.slug}
                    onChange={(event) => updateField("slug", event.target.value)}
                    className="w-full border border-black/10 px-3 py-3 text-sm outline-none focus:border-black"
                    placeholder="ai-frontend-growth"
                  />
                  <button
                    type="button"
                    onClick={applyTitleSlug}
                    className="border border-black px-3 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white"
                  >
                    make
                  </button>
                </div>
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
                  disabled={isSaving || !isAllowedAuthor}
                  onClick={() => handleSave("draft")}
                  className="border border-black px-4 py-3 text-[10px] uppercase tracking-widest disabled:opacity-40"
                >
                  save draft
                </button>
                <button
                  type="button"
                  disabled={isSaving || !isAllowedAuthor}
                  onClick={() => handleSave("published")}
                  className="bg-black px-4 py-3 text-[10px] uppercase tracking-widest text-white disabled:opacity-40"
                >
                  publish
                </button>
              </div>

              {message ? <p className="text-xs leading-6 opacity-70">{message}</p> : null}
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
            <div className="prose prose-neutral max-w-none prose-headings:font-mono prose-p:font-mono prose-p:text-sm prose-p:leading-8 prose-li:font-mono prose-li:text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {form.body || "본문을 입력하면 Markdown 미리보기가 여기에 표시됩니다."}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
