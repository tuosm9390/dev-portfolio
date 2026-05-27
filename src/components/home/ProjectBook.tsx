"use client";
// 선택된 프로젝트를 실제 책이 펼쳐지는 듯한 상세 패널로 렌더링하는 컴포넌트

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { BookOpen, ExternalLink, Github, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { isProjectInProgress } from "./projectStatus";
import type { Project } from "@/data/projects";

type ProjectBookProps = {
  project: Project;
  onClose: () => void;
};

function LimitedList({
  items,
  title,
}: {
  items?: string[];
  title: string;
}) {
  if (!items?.length) return null;

  return (
    <div>
      <h4 className="text-[14px] font-semibold tracking-[-0.224px] text-[var(--text-primary)]">
        {title}
      </h4>
      <ul className="mt-3 space-y-2 text-[14px] leading-[1.5] tracking-[-0.224px] text-[var(--text-secondary)]">
        {items.slice(0, 4).map((item) => (
          <li className="flex gap-2" key={item}>
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#0071e3]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectBook({ project, onClose }: ProjectBookProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const inProgress = isProjectInProgress(project.id);
  const coverVariants = {
    closed: { opacity: 1, rotateY: 0 },
    open: shouldReduceMotion
      ? {
          opacity: 0,
          transition: { duration: 0.22 },
        }
      : {
          opacity: 1,
          rotateY: -155,
          transition: {
            duration: 1.6,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        },
  };
  const pageVariants = {
    closed: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.55,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <Dialog.Root
      onOpenChange={setIsDescriptionOpen}
      open={isDescriptionOpen}
    >
      <div className="book-shell">
      <motion.article
        animate="open"
        className="book-inner min-h-[680px] rounded-lg bg-[#f7f7f9] shadow-[rgba(0,0,0,0.12)_3px_5px_30px_0px]"
        initial="closed"
        key={project.id}
      >
        <motion.div
          className="book-cover absolute inset-0 z-20 hidden overflow-hidden rounded-lg bg-[var(--surface)] md:block"
          variants={coverVariants}
        >
          <div className="relative h-full">
            <Image
              alt={`${project.title} 표지`}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1200px) 70vw, 760px"
              src={project.imageUrl}
            />
            <div className="absolute inset-0 bg-white/72" />
            <div className="absolute inset-y-0 left-0 w-4 bg-[rgba(0,0,0,0.12)]" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[13px] font-semibold text-[var(--text-muted)]">
                  Project Book
                </p>
                {inProgress ? (
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[-0.08px] text-[#0066cc]">
                    개발 진행중
                  </span>
                ) : null}
              </div>
              <h3 className="mt-2 text-[40px] font-semibold leading-[1.1] tracking-[-0.28px] text-[var(--text-primary)]">
                {project.title}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="book-page grid min-h-[680px] gap-px overflow-hidden rounded-lg bg-[var(--divider)] md:grid-cols-2"
          variants={pageVariants}
        >
          <div className="bg-white p-6 sm:p-8 lg:p-10">
            <button
              aria-label="프로젝트 상세 닫기"
              className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-primary)] transition-colors hover:bg-[#ededf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] md:hidden"
              onClick={onClose}
              type="button"
            >
              <X size={18} />
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[13px] font-semibold tracking-[-0.12px] text-[var(--text-muted)]">
                {project.techStack.slice(0, 3).join(" / ")}
              </p>
              {inProgress ? (
                <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-semibold tracking-[-0.08px] text-[#0066cc]">
                  개발 진행중
                </span>
              ) : null}
            </div>
            <h3 className="mt-4 text-[38px] font-semibold leading-[1.08] tracking-[-0.28px] text-[var(--text-primary)]">
              {project.title}
            </h3>
            <p className="mt-5 text-[17px] leading-[1.55] tracking-[-0.374px] text-[var(--text-secondary)]">
              {project.summary}
            </p>
            {project.origin ? (
              <div className="mt-8">
                <h4 className="text-[14px] font-semibold tracking-[-0.224px] text-[var(--text-primary)]">
                  만든 이유
                </h4>
                <p className="mt-3 text-[15px] leading-[1.65] tracking-[-0.224px] text-[var(--text-secondary)]">
                  {project.origin}
                </p>
              </div>
            ) : null}
            <div className="mt-8">
              <LimitedList items={project.productFlow} title="제품 흐름" />
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 lg:p-10">
            <div className="hidden justify-end md:flex">
              <button
                aria-label="프로젝트 상세 닫기"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-primary)] transition-colors hover:bg-[#ededf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
                onClick={onClose}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative mt-0 aspect-[16/10] overflow-hidden rounded-lg bg-[var(--surface)] md:mt-8">
              <Image
                alt={`${project.title} 대표 화면`}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 430px"
                src={project.imageUrl}
              />
            </div>
            <div className="mt-8 grid gap-7">
              <LimitedList items={project.keyDecisions} title="기술 결정" />
              <LimitedList items={project.proofSignals} title="구현 내용" />
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.techStack.slice(0, 6).map((tech) => (
                <span
                  className="rounded-full bg-[var(--surface)] px-3 py-1.5 text-[12px] font-semibold tracking-[-0.12px] text-[var(--text-secondary)]"
                  key={tech}
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Dialog.Trigger asChild>
                <button
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--text-primary)] px-4 text-[14px] text-white transition-colors hover:bg-[#2d2d30] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
                  type="button"
                >
                  구현내용
                  <BookOpen size={15} />
                </button>
              </Dialog.Trigger>
              {project.liveUrl ? (
                <a
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0071e3] px-4 text-[14px] text-white transition-colors hover:bg-[#0077ed]"
                  href={project.liveUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Live
                  <ExternalLink size={15} />
                </a>
              ) : null}
              {project.githubUrl ? (
                <a
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#0066cc] px-4 text-[14px] text-[#0066cc] transition-colors hover:bg-[var(--surface)]"
                  href={project.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                  <Github size={15} />
                </a>
              ) : null}
            </div>
          </div>
        </motion.div>
      </motion.article>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/52" />
        <Dialog.Content
          aria-describedby={`project-description-${project.id}`}
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[86vh] w-[min(92vw,880px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-white shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] focus-visible:outline-none"
          data-project-description-modal=""
          onTouchMove={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          <div className="relative aspect-[16/9] min-h-[190px] shrink-0 bg-[var(--surface)]">
            <Image
              alt={`${project.title} 대표 이미지`}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 92vw, 880px"
              src={project.imageUrl}
            />
            <Dialog.Close asChild>
              <button
                aria-label="구현내용 닫기"
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/88 text-[var(--text-primary)] shadow-[rgba(0,0,0,0.14)_0_2px_12px] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
                type="button"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8 sm:py-7"
            data-project-description-scroll=""
            onTouchMove={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            <Dialog.Title className="text-[26px] font-semibold leading-[1.15] tracking-[-0.224px] text-[var(--text-primary)]">
              {project.title}
            </Dialog.Title>
            <div
              className="mt-5 max-w-none text-[15px] leading-[1.7] tracking-[-0.224px] text-[var(--text-secondary)] [&_a]:text-[#0066cc] [&_code]:rounded [&_code]:bg-[var(--surface)] [&_code]:px-1 [&_h1]:mb-4 [&_h1]:text-[24px] [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-[20px] [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-[17px] [&_h3]:font-semibold [&_li]:my-1.5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[var(--surface)] [&_pre]:p-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
              id={`project-description-${project.id}`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.description}
              </ReactMarkdown>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
