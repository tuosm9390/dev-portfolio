import Link from "next/link";
import { ArrowRight, ExternalLink, Orbit, Star } from "lucide-react";
import Image from "next/image";
import { projects } from "@/data/projects";

const KNOWN_PROJECT_IMAGES = new Set([
  "/images/project-cafe-book.png",
  "/images/project-minions-bid.png",
  "/images/project-synapso.dev.png",
]);

const projectLayouts = [
  "lg:col-span-7",
  "lg:col-span-5 lg:translate-y-14",
  "lg:col-span-5 lg:-translate-y-6",
  "lg:col-span-7 lg:translate-y-10",
  "lg:col-span-6 lg:-translate-y-4",
  "lg:col-span-6 lg:translate-y-12",
];

/**
 * Skeleton component for ProjectsSection
 */
export function ProjectsSectionSkeleton() {
  return (
    <section className="px-4 py-20 md:px-6">
      <div className="section-shell">
        <div className="mb-16 animate-pulse">
          <div className="mb-5 h-4 w-32 rounded-full bg-white/10" />
          <div className="mb-4 h-16 w-full max-w-xl rounded-[1.5rem] bg-white/10" />
          <div className="h-24 w-full max-w-2xl rounded-[1.5rem] bg-white/8" />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="panel h-[24rem] rounded-[2rem] bg-white/5 animate-pulse lg:col-span-6"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="px-4 py-20 md:px-6"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1400px" }}
    >
      <div className="section-shell">
        <div className="mb-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="eyebrow">주요 작업</span>
            <h2 className="section-title mt-6 max-w-none text-white sm:max-w-[14ch] lg:max-w-[12ch]">
              말보다 결과물이
              더 빠른 프로젝트들.
            </h2>
            <div className="mt-6 hidden items-center gap-3 lg:flex">
              <span className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-white/44">
                archive / {projects.length.toString().padStart(2, "0")}
              </span>
              <span className="text-sm text-white/40">
                이것저것 다 넣기보다, 다시 봐도 괜찮은 것만 남겼습니다.
              </span>
            </div>
          </div>

          <div className="space-y-5 lg:pt-3">
            <p className="body-copy">
              여기 적힌 소개 문구는 읽기 쉽게 AI 도움을 받아 조금 다듬었습니다. 다만
              프로젝트 자체는 제가 직접 만들고 부딪히면서 정리한 것들이라, 결과물하고
              설명이 너무 따로 놀지 않게만 맞춰두려고 했습니다.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-white/62">
              <span className="surface-chip">
                <Orbit className="h-4 w-4" />
                AI · SaaS · 실시간 시스템
              </span>
              <span className="surface-chip">
                <Star className="h-4 w-4" />
                제품 구조 + 구현 디테일 동시 공개
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-y-10">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              index={index}
              project={project}
              className={projectLayouts[index % projectLayouts.length]}
              emphasis={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  index,
  project,
  className,
  emphasis,
}: {
  index: number;
  project: (typeof projects)[0];
  className: string;
  emphasis: boolean;
}) {
  const hasProjectImage = KNOWN_PROJECT_IMAGES.has(project.imageUrl);

  return (
    <article className={`group ${className}`}>
      <div
        className={`panel relative h-full rounded-[2rem] p-5 transition-transform duration-300 ease-out group-hover:-translate-y-1.5 md:p-6 ${emphasis ? "lg:min-h-[38rem]" : "lg:min-h-[34rem]"}`}
        style={{
          boxShadow: `0 14px 34px ${project.accentColor}12, 0 10px 20px rgba(3, 6, 18, 0.18)`,
        }}
      >
        <div className="relative flex h-full flex-col">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-[28rem]">
              <p className="text-xs uppercase tracking-[0.2em] text-white/38">
                {String(index + 1).padStart(2, "0")} / {project.techStack.slice(0, 2).join(" / ")}
              </p>
              <h3 className="mt-3 text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white md:text-[2.4rem]">
                {project.title}
              </h3>
              <p className="mt-4 max-w-[42ch] text-sm leading-7 text-white/66 md:text-[0.98rem]">
                {project.summary}
              </p>
            </div>

            <span className="surface-chip border-white/10 bg-black/18 text-white/72">
              {project.techStack[0]}
            </span>
          </div>

          <Link
            href={`/projects/${project.id}`}
            prefetch={false}
            className={`relative mt-8 overflow-hidden rounded-[1.7rem] border border-white/8 bg-black/18 text-left ${emphasis ? "min-h-[17rem] md:min-h-[19rem]" : "min-h-[15rem] md:min-h-[16.5rem]"}`}
          >
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/8 to-transparent" />
            {hasProjectImage ? (
              <div className="absolute left-5 top-5 z-10 rounded-full border border-white/10 bg-black/24 px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em] text-white/56">
                open case
              </div>
            ) : null}
            {hasProjectImage ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 767px) 92vw, (max-width: 1279px) 86vw, 42vw"
                quality={index < 2 ? 60 : 56}
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
            ) : (
              <div
                className="flex h-full flex-col justify-between p-5"
                style={{
                  background: `radial-gradient(circle at top left, ${project.accentColor}30, transparent 35%), linear-gradient(180deg, rgba(9,12,24,0.86), rgba(5,7,16,0.96))`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="surface-chip border-white/10 bg-white/5 text-white/58">
                    no preview asset
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-white/34">
                    {project.id}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/34">
                    fallback preview
                  </p>
                  <h4 className="mt-3 max-w-[10ch] text-[1.6rem] font-semibold leading-[1] tracking-[-0.05em] text-white">
                    {project.title}
                  </h4>
                  <p className="mt-3 line-clamp-3 max-w-[32ch] text-sm leading-6 text-white/56">
                    {project.summary}
                  </p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b17] via-transparent to-transparent" />
          </Link>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs text-white/58"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
            <Link
              href={`/projects/${project.id}`}
              prefetch={false}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/86"
            >
              자세히 보기
              <ArrowRight className="h-4 w-4" />
            </Link>

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/58 hover:text-white"
              >
                방문하기
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
