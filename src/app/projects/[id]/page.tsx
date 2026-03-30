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
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-3xl">
          {/* 뒤로가기 */}
          <Link
            href="/#projects"
            className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            포트폴리오로 돌아가기
          </Link>

          {/* 헤더 */}
          <div className="mb-10">
            <div
              className="mb-4 inline-block h-1 w-12 rounded-full"
              style={{ backgroundColor: project.accentColor }}
            />
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground">{project.summary}</p>
          </div>

          {/* 기술 스택 */}
          <div className="mb-10 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* 링크 */}
          <div className="mb-12 flex flex-wrap gap-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" />
              라이브 데모
            </a>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition-all hover:border-primary/30"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            )}
          </div>

          {/* 본문 (Markdown) */}
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.description}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </>
  );
}
