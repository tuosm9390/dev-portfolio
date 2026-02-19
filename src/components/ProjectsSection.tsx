"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Code2, BarChart3, FileText, MonitorSmartphone } from "lucide-react";
import Image from "next/image";
import { projects } from "@/data/projects";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const projectIcons: Record<string, React.ElementType> = {
  "persona-style": Code2,
  "investment-platform": BarChart3,
  "auto-blog": FileText,
  "remote-desktop": MonitorSmartphone,
};

const projectGradients: Record<string, string> = {
  "persona-style": "from-violet-600/20 via-purple-600/10 to-fuchsia-600/20",
  "investment-platform": "from-blue-600/20 via-cyan-600/10 to-teal-600/20",
  "auto-blog": "from-emerald-600/20 via-green-600/10 to-lime-600/20",
  "remote-desktop": "from-orange-600/20 via-amber-600/10 to-yellow-600/20",
};

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-padding px-6">
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
            Projects
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="mb-6 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
          >
            최근 작업물
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary"
          >
            기획부터 배포까지, 직접 만든 서비스들입니다.
            각 프로젝트를 클릭하여 라이브 데모를 확인해보세요.
          </motion.p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 md:grid-cols-2"
        >
          {projects.map((project) => {
            const Icon = projectIcons[project.id] || Code2;
            const gradient = projectGradients[project.id] || "from-accent/20 to-accent/5";

            return (
              <ProjectCard
                key={project.id}
                project={project}
                Icon={Icon}
                gradient={gradient}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  Icon,
  gradient,
}: {
  project: (typeof projects)[0];
  Icon: React.ElementType;
  gradient: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      variants={fadeInUp}
      className="group relative overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-all duration-500 hover:border-border-hover hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
    >
      {/* Image / Placeholder */}
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-tertiary">
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
          /* Gradient placeholder */
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-bg-secondary/80 backdrop-blur-sm">
                  <Icon className="h-8 w-8 text-text-secondary" />
                </div>
                <span className="text-sm font-medium text-text-muted">
                  {project.summary}
                </span>
              </div>
            </div>
            {/* Decorative grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        )}
        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent opacity-60" />

        {/* Hover overlay with links */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-bg-primary/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white transition-transform hover:scale-110"
            aria-label={`${project.title} 라이브 보기`}
          >
            <ExternalLink className="h-5 w-5" />
          </a>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-secondary text-text-primary transition-transform hover:scale-110"
              aria-label={`${project.title} GitHub`}
            >
              <Github className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="mb-1 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
              {project.title}
            </h3>
            <p className="text-sm text-text-muted">{project.summary}</p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-text-secondary">
          {project.description}
        </p>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-bg-primary px-2.5 py-1 text-xs font-medium text-text-muted transition-colors group-hover:border-accent/30 group-hover:text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
