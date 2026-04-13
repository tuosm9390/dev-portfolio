import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink, Github, Orbit } from "lucide-react";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((entry) => entry.id === id);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `${profile.siteUrl}/projects/${project.id}`,
    },
    openGraph: {
      title: `${project.title} | chan.works`,
      description: project.summary,
      url: `${profile.siteUrl}/projects/${project.id}`,
      images: [
        {
          url: `${profile.siteUrl}/projects/${project.id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | chan.works`,
      description: project.summary,
      images: [`${profile.siteUrl}/projects/${project.id}/opengraph-image`],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((entry) => entry.id === id);

  if (!project) return notFound();

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.summary,
    url: project.liveUrl,
    author: {
      "@type": "Person",
      name: profile.name,
      url: profile.siteUrl,
    },
    applicationCategory: "WebApplication",
    programmingLanguage: project.techStack,
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />

      <div className="relative overflow-hidden px-4 pb-20 pt-28 md:px-6 md:pt-32">
        <div className="section-shell-narrow">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              href="/#projects"
              className="secondary-button px-4 py-2 text-sm text-white/82"
            >
              <ArrowLeft className="h-4 w-4" />
              포트폴리오로 돌아가기
            </Link>

            <span className="surface-chip">
              <Orbit className="h-4 w-4" />
              project dossier
            </span>
          </div>

          <div
            className="panel-strong rounded-[2.3rem] p-7 md:p-9"
            style={{
              boxShadow: `0 32px 110px ${project.accentColor}22, 0 20px 48px rgba(4, 7, 15, 0.58)`,
            }}
          >
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.2em] text-white/34">
                {project.techStack.slice(0, 3).join(" / ")}
              </p>
              <h1
                className="mt-5 max-w-[12ch] text-[clamp(2.9rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.055em] text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {project.title}
              </h1>
              <p className="mt-6 max-w-[56ch] text-[1.02rem] leading-8 text-white/70 md:text-[1.08rem]">
                {project.summary}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-white/58"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-button"
                  >
                    <ExternalLink className="h-4 w-4" />
                    라이브 데모
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="secondary-button"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <article className="project-prose panel mt-8 rounded-[2.1rem] px-6 py-8 md:px-10 md:py-10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h1
                    className="mb-8 mt-12 text-[2.4rem] md:text-[3rem]"
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h2
                    className="mb-6 mt-12 text-[2rem] md:text-[2.45rem]"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="mb-4 mt-8 text-[1.45rem] md:text-[1.7rem]"
                    {...props}
                  />
                ),
                p: ({ ...props }) => <p className="mb-7" {...props} />,
                ul: ({ ...props }) => (
                  <ul className="mb-7 list-disc space-y-3 pl-6" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="mb-7 list-decimal space-y-3 pl-6" {...props} />
                ),
                li: ({ ...props }) => <li {...props} />,
                hr: () => <hr className="my-10 border-white/8" />,
              }}
            >
              {project.description}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </>
  );
}
