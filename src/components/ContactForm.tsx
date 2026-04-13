"use client";

import { useRef, useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "your_service_id",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "your_template_id",
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "your_public_key",
      );

      setSubmitted(true);
      formRef.current.reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("FAILED...", error);
      alert("메시지 전송에 실패했습니다. 나중에 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-[1.9rem] border border-white/10 bg-white/[0.045] p-6 md:p-8"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-white/34">
          open a thread
        </p>
        <p className="mt-3 text-lg text-white/78">
          간단한 소개와 원하는 작업 내용을 남겨주세요.
        </p>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm text-white/54">성함</span>
          <input
            id="user_name"
            name="user_name"
            type="text"
            required
            className="input-shell"
            placeholder="어떻게 불러드리면 될까요?"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/54">이메일</span>
          <input
            id="user_email"
            name="user_email"
            type="email"
            required
            className="input-shell"
            placeholder="reply@company.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/54">상세 내용</span>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="input-shell min-h-40 resize-none"
            placeholder="검토 중인 포지션, 만들고 싶은 제품, 참고하고 싶은 방향 등을 자유롭게 적어주세요."
          />
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-white/44">
          답변은 가능한 빠르게 드립니다. 아직 정리되지 않은 아이디어도 괜찮습니다.
        </p>

        <button
          type="submit"
          disabled={isSubmitting || submitted}
          className="primary-button min-w-[10rem] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              전송 중
            </>
          ) : submitted ? (
            <>
              <CheckCircle className="h-4 w-4" />
              전송 완료
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              메시지 보내기
            </>
          )}
        </button>
      </div>
    </form>
  );
}
