"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Code2,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { projects } from "@/data/projects";
import { fadeInUp, staggerContainer } from "@/lib/animations";

/**
 * Skeleton component for ProjectsSection
 */
export function ProjectsSectionSkeleton() {
  return (
    <section className="section-padding px-6 section-light">
      <div className="mx-auto max-w-[1024px]">
        <div className="mb-16 text-center animate-pulse">
          <div className="mb-6 h-12 w-3/4 md:w-1/2 rounded-lg bg-black/5 mx-auto" />
          <div className="mx-auto h-20 w-full md:w-2/3 rounded-lg bg-black/5" />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="aspect-square w-full rounded-xl bg-black/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Apple-style Project Section
 */
export default function ProjectsSection() {
  return (
    <section id="projects" className="section-padding px-6 section-light">
      <div className="mx-auto max-w-[1024px]">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-6 text-[40px] font-semibold leading-[1.1] tracking-tight sm:text-[56px]"
          >
            선별된 프로젝트
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-[600px] text-[17px] leading-[1.47] tracking-[-0.022em] text-black/60 sm:text-[21px]"
          >
            복잡한 문제를 단순하고 우아한 솔루션으로 풀어낸 작업들입니다.
            각 프로젝트는 성능, 디자인, 사용자 경험의 완벽한 조화를 목표로 합니다.
          </motion.p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-12 md:grid-cols-2"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof projects)[0];
}) {
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  const handleOpenDetail = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      className="group relative flex flex-col overflow-hidden bg-white apple-shadow rounded-xl transition-all duration-300 cursor-pointer h-full"
      onClick={handleOpenDetail}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5f5f7]">
        {!imgError ? (
          <motion.div layoutId={`project-image-${project.id}`} className="relative w-full h-full">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
              onError={() => setImgError(true)}
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <Code2 className="h-12 w-12 text-black/20" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col p-8 text-center">
        <h3 className="text-[24px] font-semibold leading-[1.14] tracking-[0.011em] text-[#1d1d1f] mb-2">
          {project.title}
        </h3>
        <p className="text-[17px] leading-[1.47] tracking-[-0.022em] text-black/60 mb-6 line-clamp-2">
          {project.summary}
        </p>

        <div className="mt-auto flex items-center justify-center gap-6">
          <button
            className="text-[17px] font-normal text-apple-link-blue hover:underline flex items-center gap-1"
          >
            자세히 보기 <ArrowRight size={16} />
          </button>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[17px] font-normal text-apple-link-blue hover:underline flex items-center gap-1"
          >
            방문하기 <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
