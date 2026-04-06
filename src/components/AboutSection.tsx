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
    <section id="about" className="section-padding px-6 section-dark">
      <div className="mx-auto max-w-[1024px]">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-8 text-[40px] font-semibold leading-[1.1] tracking-tight sm:text-[56px]"
          >
            왜 저와 함께해야 할까요?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-[700px] text-[17px] leading-[1.47] tracking-[-0.022em] text-white/60 sm:text-[21px]"
          >
            {profile.description.join(" ")}
          </motion.p>
        </motion.div>

        {/* Strength cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {profile.strengths.map((strength) => {
            const Icon = iconMap[strength.icon] || Code2;
            return (
              <motion.div
                key={strength.title}
                variants={fadeInUp}
                className="group relative rounded-xl bg-white/5 p-8 transition-all duration-300"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-[21px] font-semibold tracking-[0.011em] text-white">
                  {strength.title}
                </h3>
                <p className="text-[14px] leading-[1.43] tracking-[-0.016em] text-white/60">
                  {strength.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
