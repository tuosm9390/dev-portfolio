"use client";

import { motion } from "framer-motion";
import { Code2, Rocket, Shield, Sparkles } from "lucide-react";
import { profile } from "@/data/profile";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Rocket,
  Shield,
  Sparkles,
};

export default function AboutSection() {
  return (
    <section id="about" className="section-padding px-6">
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
            About
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="mb-6 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
          >
            왜 저와 함께해야 할까요?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary"
          >
            {profile.description}
          </motion.p>
        </motion.div>

        {/* Strength cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {profile.strengths.map((strength) => {
            const Icon = iconMap[strength.icon] || Code2;
            return (
              <motion.div
                key={strength.title}
                variants={fadeInUp}
                className="group relative rounded-2xl border border-border bg-bg-secondary p-6 transition-all duration-300 hover:border-border-hover hover:bg-bg-tertiary"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-accent/0 transition-all duration-500 group-hover:bg-accent/[0.02]" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent/20 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-[family-name:var(--font-display)] text-lg font-semibold">
                    {strength.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {strength.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
