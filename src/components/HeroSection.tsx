"use client";

import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { profile } from "@/data/profile";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20 bg-background">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Main Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-8xl text-center"
      >
        {/* Toss-style Badge */}
        <motion.div variants={fadeInUp} className="mb-10 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold tracking-wide text-primary">
            <Sparkles className="h-4 w-4" />
            Available for New Projects
          </span>
        </motion.div>

        {/* Hero Title: Extreme Typography */}
        <motion.h1
          variants={fadeInUp}
          className="mb-10 text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-8xl lg:text-9xl"
        >
          {profile.tagline.split(", ").map((part, i) => (
            <span key={i} className="block">
              {i === 0 ? (
                <span className="text-primary">{part}</span>
              ) : (
                <span className="text-foreground">{part}</span>
              )}
            </span>
          ))}
        </motion.h1>

        {/* Hero Description: Clean & Readable */}
        <motion.p
          variants={fadeInUp}
          className="mx-auto mb-16 max-w-5xl text-xl leading-relaxed text-muted-foreground sm:text-2xl"
        >
          {profile.description.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.p>

        {/* Call to Actions: Toss-like Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => {
              document
                .querySelector("#projects")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex items-center gap-2 rounded-[18px] bg-primary px-10 py-5 text-lg font-bold text-white transition-all hover:bg-primary/90 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(0,100,255,0.3)]"
          >
            프로젝트 보기
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => {
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex items-center gap-2 rounded-[18px] bg-secondary px-10 py-5 text-lg font-bold text-foreground transition-all hover:bg-muted hover:scale-[1.02]"
          >
            문의하기
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
            Scroll
          </span>
          <ChevronDown className="h-5 w-5 opacity-50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
