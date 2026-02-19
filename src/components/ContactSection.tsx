"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Github, Linkedin, Send, CheckCircle } from "lucide-react";
import { profile } from "@/data/profile";
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/animations";

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
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 formspree, emailjs 등 서비스 연동
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <section id="contact" className="section-padding px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent"
          >
            Contact
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="mb-6 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
          >
            프로젝트를 시작해볼까요?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary"
          >
            아이디어가 있으시다면 편하게 연락주세요.
            24시간 내에 답변드리겠습니다.
          </motion.p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact info */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-2"
          >
            <h3 className="mb-6 font-[family-name:var(--font-display)] text-xl font-semibold">
              연락처
            </h3>
            <div className="space-y-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-bg-secondary p-4 transition-all duration-300 hover:border-border-hover hover:bg-bg-tertiary"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-all group-hover:bg-accent/20">
                    <link.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-muted">{link.label}</p>
                    <p className="text-sm font-medium text-text-primary">{link.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-text-secondary">
                    이름
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-secondary">
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30"
                    placeholder="hello@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-text-secondary">
                  프로젝트 설명
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-border bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30"
                  placeholder="프로젝트에 대해 간략히 설명해주세요. 예산, 일정, 기대 기능 등을 포함하면 더 빠른 답변이 가능합니다."
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:opacity-70 sm:w-auto"
              >
                {submitted ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    전송 완료!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    메시지 보내기
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
