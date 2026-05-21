"use client";
// 프로젝트 목록과 책 펼침 상세 전환을 관리하는 인터랙티브 섹션 컴포넌트

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import ProjectBook from "./ProjectBook";
import ProjectCard from "./ProjectCard";
import RevealSection from "./RevealSection";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const selectedProject = useMemo(
    () =>
      projects.find((project) => project.id === selectedProjectId) ??
      projects[0] ??
      null,
    [selectedProjectId],
  );
  const isOpen = selectedProjectId !== null && selectedProject !== null;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedProjectId(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <RevealSection id="projects" innerClassName="space-y-10">
      <div className="max-w-3xl">
        <p className="text-[14px] font-semibold tracking-[-0.224px] text-[var(--text-muted)]">
          Projects
        </p>
        <h2 className="mt-3 text-[40px] font-semibold leading-[1.1] tracking-[-0.28px] text-[var(--text-primary)]">
          실제 제품 흐름으로 연결한 작업들.
        </h2>
        <p className="mt-4 text-[17px] leading-[1.6] tracking-[-0.374px] text-[var(--text-secondary)]">
          각 프로젝트의 배경, 제품 흐름, 기술 결정, 증거 신호를 한 화면에서
          이어 보여줍니다.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            exit={{ opacity: 0, y: -12 }}
            initial={{ opacity: 0, y: 16 }}
            key="project-grid"
            transition={{ duration: 0.28 }}
          >
            {projects.map((project) => (
              <ProjectCard
                isSelected={selectedProjectId === project.id}
                key={project.id}
                onSelect={setSelectedProjectId}
                project={project}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]"
            exit={{ opacity: 0, y: 12 }}
            initial={{ opacity: 0, y: 18 }}
            key="project-book"
            transition={{ duration: 0.32 }}
          >
            <aside aria-label="프로젝트 목록" className="lg:pt-2">
              <div className="flex gap-2 overflow-x-auto pb-3 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
                {projects.map((project) => {
                  const active = selectedProjectId === project.id;

                  return (
                    <button
                      aria-current={active ? "true" : undefined}
                      className="min-w-[180px] rounded-lg bg-[var(--surface)] px-4 py-3 text-left text-[14px] leading-[1.25] tracking-[-0.224px] text-[var(--text-primary)] transition-colors hover:bg-[#ededf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] lg:min-w-0 lg:border-l-4"
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      style={{
                        borderLeftColor: active
                          ? project.accentColor
                          : "transparent",
                      }}
                      type="button"
                    >
                      <span className="block font-semibold">
                        {project.title}
                      </span>
                      <span className="mt-1 block truncate text-[12px] text-[var(--text-muted)]">
                        {project.techStack.slice(0, 2).join(" / ")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <AnimatePresence mode="wait">
              {selectedProject ? (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  initial={{ opacity: 0, x: -12 }}
                  key={selectedProject.id}
                  transition={{ duration: 0.22 }}
                >
                  <ProjectBook
                    onClose={() => setSelectedProjectId(null)}
                    project={selectedProject}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </RevealSection>
  );
}
