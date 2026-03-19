"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Code2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { projects } from "@/data/projects";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

/**
 * Toss-style Project Section
 * Focused on: Extreme readability, Soft shadows, and Premium Blue accents.
 */
export default function ProjectsSection() {
  return (
    <section id="projects" className="section-padding px-6 bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-left md:text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
          >
            <Sparkles className="h-4 w-4" />
            <span>Portfolio</span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            선별된 <span className="text-primary">프로젝트</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            복잡한 문제를 단순하고 우아한 솔루션으로 풀어낸 작업들입니다.
            <br />
            저의 개인적인 호기심으로 만든 작업도 있고, 요청을 받아 진행한
            작업들도 있습니다.
            <br />
            편하게 구경하시고 궁금한 점이 있다면 언제든지 연락주세요.
          </motion.p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-2"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[24px] border border-border bg-card transition-all duration-300"
      style={
        {
          ["--accent-color" as string]: project.accentColor,
        } as React.CSSProperties
      }
    >
      {/* Dynamic Hover Border & Shadow */}
      <div
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `0 20px 40px -15px ${project.accentColor}25`,
          border: `1px solid ${project.accentColor}40`,
        }}
      />

      {/* Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {!imgError ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${project.accentColor}20, ${project.accentColor}05)`,
            }}
          >
            <Code2
              className="h-12 w-12"
              style={{ color: project.accentColor }}
            />
          </div>
        )}

        {/* Tech Stack Floating Badges */}
        <div className="absolute left-6 top-6 flex flex-wrap gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-lg bg-black/60 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-grow flex-col p-8">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3
              className="text-2xl font-bold tracking-tight text-foreground transition-colors"
              style={
                {
                  ["--hover-color" as string]: project.accentColor,
                } as React.CSSProperties
              }
            >
              <span className="group-hover:text-[var(--hover-color)] transition-colors duration-300">
                {project.title}
              </span>
            </h3>
            <p
              className="mt-1 text-sm font-medium opacity-80"
              style={{ color: project.accentColor }}
            >
              {project.summary}
            </p>
          </div>
          <div className="flex gap-2">
            {/* {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <Github className="h-5 w-5" />
              </a>
            )} */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-110"
              style={{
                backgroundColor: project.accentColor,
                boxShadow: `0 10px 20px -5px ${project.accentColor}50`,
              }}
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>

        <p className="mb-8 text-base leading-relaxed text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
          <div className="flex flex-wrap gap-3">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs font-semibold text-muted-foreground/70"
              >
                {tech}
              </span>
            ))}
          </div>
          <button
            className="flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-2"
            style={{ color: project.accentColor }}
          >
            자세히 보기
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
