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
  Sparkles,
  Loader2,
} from "lucide-react";
import { profile } from "@/data/profile";
import {
  fadeInUp,
  staggerContainer,
  slideInLeft,
  slideInRight,
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
    <section id="contact" className="section-padding px-6 bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
          >
            <Sparkles className="h-4 w-4" />
            <span>Contact</span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            프로젝트를 시작해볼까요?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            아이디어가 있으시다면 편하게 연락주세요. 최대한 빠르게
            답변드리겠습니다.
          </motion.p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-5 items-start">
          {/* Contact info: Clean Cards */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-8">
              연락처 정보
            </h3>
            <div className="grid gap-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-0.5">
                      {link.label}
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      {link.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact form: EmailJS integrated */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-3 rounded-[32px] border border-border bg-card p-8 sm:p-12"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="user_name"
                    className="text-sm font-bold text-foreground"
                  >
                    성함
                  </label>
                  <input
                    id="user_name"
                    name="user_name"
                    type="text"
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-4 text-base text-foreground placeholder-muted-foreground/40 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="홍길동"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="user_email"
                    className="text-sm font-bold text-foreground"
                  >
                    이메일
                  </label>
                  <input
                    id="user_email"
                    name="user_email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-4 text-base text-foreground placeholder-muted-foreground/40 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="hello@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-bold text-foreground"
                >
                  상세 내용
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-4 text-base text-foreground placeholder-muted-foreground/40 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="진행하고자 하는 프로젝트에 대해 들려주세요."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-5 text-lg font-bold text-white transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-xl shadow-primary/20 disabled:opacity-70 sm:w-auto"
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
                    <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    프로젝트 문의하기
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
