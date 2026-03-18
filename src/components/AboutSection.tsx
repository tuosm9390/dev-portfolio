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
    <section id="about" className="section-padding px-6 bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            <span>About</span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            왜 저와 함께해야 할까요?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground"
          >
            {profile.description}
          </motion.p>
        </motion.div>

        {/* Strength cards: Toss TDS Style */}
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
                whileHover={{ y: -5 }}
                className="group relative rounded-[24px] border border-border bg-card p-8 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary/20"
              >
                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground">
                    {strength.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
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
