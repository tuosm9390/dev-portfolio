"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20 section-dark">
      {/* Main Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-[980px] text-center"
      >
        {/* Hero Title: Apple Display Style */}
        <motion.h1
          variants={fadeInUp}
          className="mb-4 text-[48px] font-semibold leading-[1.07] tracking-[-0.015em] text-white sm:text-[80px] lg:text-[120px]"
        >
          {profile.tagline.split(", ")[0]}
        </motion.h1>
        
        <motion.h2
          variants={fadeInUp}
          className="mb-8 text-[21px] font-normal leading-[1.19] tracking-[0.011em] text-white/90 sm:text-[28px] lg:text-[34px]"
        >
          {profile.tagline.split(", ").slice(1).join(", ")}
        </motion.h2>

        {/* Hero Description: Clean & Readable */}
        <motion.p
          variants={fadeInUp}
          className="mx-auto mb-10 max-w-[600px] text-[17px] leading-[1.47] tracking-[-0.022em] text-white/60 sm:text-[19px]"
        >
          {profile.description.join(" ")}
        </motion.p>

        {/* Call to Actions: Apple Pill Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <button
            onClick={() => {
              document
                .querySelector("#projects")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-apple-primary group flex items-center gap-2 rounded-full px-8 py-3 text-[17px] font-normal"
          >
            프로젝트 보기
          </button>
          <button
            onClick={() => {
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex items-center gap-1 text-[17px] font-normal text-apple-bright-blue hover:underline"
          >
            문의하기
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative Glow - Kept subtle for cinematic feel */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-apple-blue/10 blur-[120px]" />
      </div>
    </section>
  );
}
