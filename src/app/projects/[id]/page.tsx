import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
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
  const project = projects.find((p) => p.id === id);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `${profile.siteUrl}/projects/${project.id}`,
    },
    openGraph: {
      title: `${project.title} | DevCraft Studio`,
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
      title: `${project.title} | DevCraft Studio`,
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
  const project = projects.find((p) => p.id === id);

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
      <div className="min-h-screen bg-white section-light px-6 py-20">
        <div className="mx-auto max-w-[800px]">
          {/* 뒤로가기 */}
          <Link
            href="/#projects"
            className="mb-16 inline-flex items-center gap-2 text-[17px] font-normal text-apple-link-blue hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            포트폴리오로 돌아가기
          </Link>

          {/* 헤더 */}
          <div className="mb-16">
            <p className="mb-4 text-[14px] font-semibold uppercase tracking-wider text-black/40">
              {project.summary}
            </p>
            <h1 className="mb-8 text-[48px] font-semibold leading-[1.07] tracking-tight text-[#1d1d1f] sm:text-[64px]">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-3 mb-12">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg bg-black/5 px-3 py-1 text-[12px] font-medium text-black/60"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-apple-primary flex items-center gap-2"
                >
                  <ExternalLink size={18} />
                  라이브 데모
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-[#f5f5f7] border border-black/5 px-6 py-3 text-[17px] font-normal text-[#1d1d1f] transition-all hover:bg-black/5"
                >
                  <Github size={18} />
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* 본문 (Markdown) */}
          <article className="prose prose-neutral max-w-none prose-headings:text-[#1d1d1f] prose-p:text-black/80 prose-p:text-[19px] prose-p:leading-[1.47] border-t border-black/5 pt-16">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h1
                    className="text-[40px] font-semibold mb-8 mt-16"
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h2
                    className="text-[32px] font-semibold mb-6 mt-12"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="text-[24px] font-semibold mb-4 mt-8"
                    {...props}
                  />
                ),
                p: ({ ...props }) => (
                  <p
                    className="text-[19px] leading-[1.47] tracking-[-0.022em] mb-8"
                    {...props}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul
                    className="list-disc list-outside mb-8 space-y-4 pl-6"
                    {...props}
                  />
                ),
                ol: ({ ...props }) => (
                  <ol
                    className="list-decimal list-outside mb-8 space-y-4 pl-6"
                    {...props}
                  />
                ),
                li: ({ ...props }) => (
                  <li className="text-[19px] text-black/80" {...props} />
                ),
                strong: ({ ...props }) => (
                  <strong className="font-semibold text-[#1d1d1f]" {...props} />
                ),
                pre: ({ ...props }) => (
                  <pre
                    className="overflow-x-auto rounded-xl bg-black/5 p-8 my-10 text-[15px] text-black"
                    {...props}
                  />
                ),
                code: ({
                  className,
                  children,
                  ...props
                }: React.HTMLAttributes<HTMLElement>) => {
                  const isBlock =
                    className?.includes("language-") ||
                    String(children).includes("\n");
                  return (
                    <code
                      className={`${isBlock ? "font-mono" : "rounded bg-black/5 px-1.5 py-0.5 font-mono text-apple-blue"} ${className || ""}`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-4 border-apple-blue bg-apple-blue/5 px-8 py-6 italic rounded-r-lg my-12"
                    {...props}
                  />
                ),
                hr: () => <hr className="my-20 border-black/5" />,
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
