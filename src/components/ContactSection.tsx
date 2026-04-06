"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { profile } from "@/data/profile";
import {
  fadeInUp,
  staggerContainer,
} from "@/lib/animations";
import emailjs from "@emailjs/browser";

const contactLinks = [
  {
    icon: Mail,
    label: "이메일",
    value: profile.contact.email,
    href: `mailto:${profile.contact.email}`,
  },
  {
    icon: Phone,
    label: "전화",
    value: profile.contact.phone,
    href: `tel:${profile.contact.phone.replace(/-/g, "")}`,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "GitHub 프로필",
    href: profile.contact.github,
    external: true,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "LinkedIn 프로필",
    href: profile.contact.linkedin,
    external: true,
  },
];

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <section id="contact" className="section-padding px-6 section-light">
      <div className="mx-auto max-w-[1024px]">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-6 text-[40px] font-semibold leading-[1.1] tracking-tight sm:text-[56px]"
          >
            프로젝트를 시작해볼까요?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-[600px] text-[17px] leading-[1.47] tracking-[-0.022em] text-black/60 sm:text-[21px]"
          >
            아이디어가 있으시다면 편하게 연락주세요.
            최대한 빠르게 답변드리겠습니다.
          </motion.p>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2 items-start">
          {/* Contact info */}
          <motion.div
            variants={fadeInUp}
            className="space-y-10"
          >
            <h3 className="text-[28px] font-semibold tracking-[0.007em] text-[#1d1d1f]">
              연락처 정보
            </h3>
            <div className="grid gap-6">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black/80 transition-all group-hover:bg-apple-blue group-hover:text-white">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-black/40 mb-0.5">
                      {link.label}
                    </p>
                    <p className="text-[17px] font-normal text-[#1d1d1f] group-hover:text-apple-blue transition-colors">
                      {link.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl bg-white apple-shadow p-8 sm:p-10"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="user_name"
                    className="text-[14px] font-semibold text-black/60"
                  >
                    성함
                  </label>
                  <input
                    id="user_name"
                    name="user_name"
                    type="text"
                    required
                    className="w-full rounded-xl border border-black/10 bg-[#fafafc] px-4 py-3 text-[17px] text-[#1d1d1f] outline-none transition-all focus:border-apple-blue"
                    placeholder="홍길동"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="user_email"
                    className="text-[14px] font-semibold text-black/60"
                  >
                    이메일
                  </label>
                  <input
                    id="user_email"
                    name="user_email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-black/10 bg-[#fafafc] px-4 py-3 text-[17px] text-[#1d1d1f] outline-none transition-all focus:border-apple-blue"
                    placeholder="hello@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-[14px] font-semibold text-black/60"
                  >
                    상세 내용
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full resize-none rounded-xl border border-black/10 bg-[#fafafc] px-4 py-3 text-[17px] text-[#1d1d1f] outline-none transition-all focus:border-apple-blue"
                    placeholder="진행하고자 하는 프로젝트에 대해 들려주세요."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="btn-apple-primary group flex w-full items-center justify-center gap-2 disabled:opacity-70 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    전송 중...
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    메시지가 전송되었습니다
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    보내기
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
