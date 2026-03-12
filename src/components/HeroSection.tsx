"use client";

import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background Animated Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -left-20 top-20 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -right-40 bottom-20 h-[500px] w-[500px] rounded-full bg-gradient-end/10 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]"
        />
      </div>

      {/* Subtle Noise/Texture Layer */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }} />

      {/* Main Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        {/* Badge */}
        <motion.div variants={fadeInUp} className="mb-10">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs font-semibold tracking-wider text-text-secondary backdrop-blur-md">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            Available for Freelance
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          variants={fadeInUp}
          className="mb-8 font-[family-name:var(--font-display)] text-5xl font-black leading-[1.1] tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl"
        >
          {profile.tagline.split(", ").map((part, i) => (
            <span key={i} className="block">
              {i === 0 ? (
                <span className="gradient-text italic px-2">{part}</span>
              ) : (
                <span className="text-white drop-shadow-2xl">{part}</span>
              )}
            </span>
          ))}
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          variants={fadeInUp}
          className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl lg:text-2xl"
        >
          {profile.description}
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <button
            onClick={() => {
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-accent px-10 py-5 text-base font-bold text-white transition-all hover:bg-accent-hover hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
          >
            Explore My Work
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => {
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-10 py-5 text-base font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20"
          >
            Get in Touch
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-text-muted"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
