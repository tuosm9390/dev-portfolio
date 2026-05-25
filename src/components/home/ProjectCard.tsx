"use client";
// 프로젝트 목록에서 선택 가능한 카드 형태의 프로젝트 요약을 렌더링하는 컴포넌트

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { isProjectInProgress } from "./projectStatus";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export default function ProjectCard({
  project,
  isSelected,
  onSelect,
}: ProjectCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const inProgress = isProjectInProgress(project.id);

  return (
    <motion.button
      aria-label={`프로젝트 선택: ${project.title}`}
      aria-pressed={isSelected}
      className="group flex min-h-[430px] flex-col overflow-hidden rounded-lg bg-[var(--surface)] text-left [box-shadow:var(--card-shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
      onClick={() => onSelect(project.id)}
      type="button"
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e5e5ea]">
        {isImageLoading && (
          <div className="absolute inset-0 animate-pulse bg-[#e5e5ea]" />
        )}
        <motion.div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          whileHover={{ scale: 1.025 }}
        >
          <Image
            alt={`${project.title} 화면`}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
            src={project.imageUrl}
            onLoad={() => setIsImageLoading(false)}
          />
        </motion.div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-semibold tracking-[-0.12px] text-[var(--text-muted)]">
            {project.techStack.slice(0, 3).join(" / ")}
          </p>
          {inProgress ? (
            <span className="rounded-full bg-[#0071e3]/10 px-2.5 py-1 text-[11px] font-semibold tracking-[-0.08px] text-[#0071e3]">
              개발 진행중
            </span>
          ) : null}
        </div>
        <h3 className="mt-3 text-[21px] font-bold leading-[1.19] tracking-[0.231px] text-[var(--text-primary)]">
          {project.title}
        </h3>
        <p className="mt-3 line-clamp-4 text-[15px] leading-[1.47] tracking-[-0.224px] text-[var(--text-secondary)]">
          {project.summary}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-6 text-[14px] text-[#0066cc] font-medium transition-all group-hover:underline">
          펼쳐보기
          <ArrowRight
            className="transition-transform duration-200 group-hover:translate-x-0.5"
            size={15}
          />
        </span>
      </div>
    </motion.button>
  );
}
