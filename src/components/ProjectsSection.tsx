"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Code2,
  BarChart3,
  FileText,
  MonitorSmartphone,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { projects } from "@/data/projects";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const projectIcons: Record<string, React.ElementType> = {
  "persona-style": Code2,
  "investment-platform": BarChart3,
  "synapso.dev": FileText,
  "remote-desktop": MonitorSmartphone,
};

const projectGradients: Record<string, string> = {
  "persona-style": "from-violet-600/30 via-purple-600/15 to-fuchsia-600/30",
  "investment-platform": "from-blue-600/30 via-cyan-600/15 to-teal-600/30",
  "synapso.dev": "from-emerald-600/30 via-green-600/15 to-lime-600/30",
  "remote-desktop": "from-orange-600/30 via-amber-600/15 to-yellow-600/30",
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
          className="mb-20 text-center"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-block">
            <span className="rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
              Portfolio
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mb-6 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            선별된 <span className="gradient-text">프로젝트</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary"
          >
            복잡한 문제를 단순하고 우아한 솔루션으로 풀어낸 작업들입니다.
            각 카드의 디테일과 라이브 데모를 확인해보세요.
          </motion.p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-10 md:grid-cols-2"
        >
          {projects.map((project, index) => {
            const Icon = projectIcons[project.id] || Code2;
            const gradient =
              projectGradients[project.id] || "from-accent/30 to-accent/10";

            return (
              <ProjectCard
                key={project.id}
                project={project}
                Icon={Icon}
                gradient={gradient}
                index={index}
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
  index,
}: {
  project: (typeof projects)[0];
  Icon: React.ElementType;
  gradient: string;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", x + "px");
    cardRef.current.style.setProperty("--mouse-y", y + "px");
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      variants={fadeInUp}
      className="group spotlight-card relative flex flex-col overflow-hidden rounded-[2rem] border border-border bg-bg-secondary/40 transition-all duration-500 hover:border-accent/40 hover:bg-bg-secondary/60"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {!imgError ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={"absolute inset-0 bg-gradient-to-br " + gradient}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <Icon className="h-10 w-10 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Decorative Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-80" />
        
        {/* Floating Tags (Optional) */}
        <div className="absolute left-6 top-6 flex gap-2">
          {project.techStack.slice(0, 2).map((tech) => (
            <span key={tech} className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-md border border-white/10">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-grow flex-col p-8 sm:p-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white group-hover:text-accent transition-colors duration-300 sm:text-3xl">
            {project.title}
          </h3>
          <div className="flex gap-3">
             <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-primary/50 text-text-secondary hover:bg-accent hover:text-white transition-all duration-300"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-hover hover:scale-110 transition-all duration-300"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>

        <p className="mb-8 text-base leading-relaxed text-text-secondary line-clamp-3">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium text-text-muted"
              >
                #{tech}
              </span>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-accent group/btn hover:text-accent-hover transition-colors">
            Detail 
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
