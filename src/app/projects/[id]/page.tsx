import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { projects, getProjectMetadata } from "@/data/projects";
import { profile } from "@/data/profile";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

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

  const absoluteImageUrl = project.imageUrl.startsWith("http")
    ? project.imageUrl
    : `${profile.siteUrl}${project.imageUrl}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `${profile.siteUrl}/projects/${project.id}`,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `${profile.siteUrl}/projects/${project.id}`,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [absoluteImageUrl],
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

  const meta = getProjectMetadata(project);

  return (
    <>
      <Header />

      <main className="relative w-full min-h-screen bg-[#fdfdfd] text-[#111111] font-mono antialiased selection:bg-black selection:text-white pt-40">
        {/* Project Header */}
        <section className="px-6 md:px-20 pb-16 border-b border-black/[0.05]">
          <div className="max-w-[1200px] mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-4 mb-12">
              <Link
                href="/projects"
                className="group flex items-center text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity font-medium"
              >
                <ArrowLeft size={12} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Projects
              </Link>
              <span className="w-1 h-1 bg-black/20 rounded-full"></span>
              <span className="text-[10px] uppercase tracking-widest opacity-40 font-medium">Detail</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-[28px] md:text-[40px] font-medium tracking-[-0.03em] leading-[1.1] mb-6">
              {project.title}
            </h1>
            <p className="text-[15px] opacity-50 tracking-[-0.01em] max-w-2xl mb-16 leading-relaxed">
              {project.summary}
            </p>

            {/* Metadata Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-black/[0.05] pt-8">
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] opacity-40 mb-2 font-mono">Year</p>
                <p className="text-[13px] font-medium opacity-80">{meta.year}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] opacity-40 mb-2 font-mono">Status</p>
                <p className="text-[13px] font-medium opacity-80 capitalize">{meta.status}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] opacity-40 mb-2 font-mono">Focus</p>
                <p className="text-[13px] font-medium opacity-80 truncate">{meta.focus}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] opacity-40 mb-2 font-mono">Links</p>
                <div className="flex flex-col gap-1">
                  {project.liveUrl && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-medium opacity-80 flex items-center hover:opacity-100 transition-opacity group"
                      href={project.liveUrl}
                    >
                      Visit Website
                      <ExternalLink size={12} className="ml-1.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-medium opacity-80 flex items-center hover:opacity-100 transition-opacity group"
                      href={project.githubUrl}
                    >
                      Source Code
                      <Github size={12} className="ml-1.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {!project.liveUrl && !project.githubUrl && (
                    <p className="text-[13px] font-medium opacity-40">Internal Project</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Large Media Preview Section */}
        <section className="px-6 md:px-20 py-24 bg-[#fafafa]">
          <div className="relative aspect-[16/10] w-full max-w-[1400px] mx-auto overflow-hidden bg-gray-100 border border-black/[0.05] rounded-xl shadow-2xl shadow-black/[0.03]">
            <Image
              alt={project.title}
              src={project.imageUrl}
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 ease-[0.16,1,0.3,1]"
              priority
            />
          </div>
        </section>

        {/* Challenge vs Execution Split Details Section */}
        <section className="px-6 md:px-20 py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 max-w-[1400px] mx-auto">
            {/* Left side: Challenge & Key Decisions */}
            <div className="md:col-span-4 space-y-12">
              <div>
                <h2 className="text-[10px] tracking-[0.2em] uppercase mb-6 opacity-40 font-mono font-medium">
                  Challenge &amp; Vision
                </h2>
                <p className="text-[14px] leading-[1.6] tracking-[-0.01em] opacity-80 font-medium whitespace-pre-wrap">
                  {project.origin || project.summary}
                </p>
              </div>

              {project.keyDecisions && project.keyDecisions.length > 0 && (
                <div className="pt-8 border-t border-black/5">
                  <h3 className="text-[10px] tracking-[0.2em] uppercase mb-4 opacity-40 font-mono font-medium">
                    Key Decisions
                  </h3>
                  <ul className="space-y-3 text-[12px] leading-[1.6] opacity-70 list-disc pl-4">
                    {project.keyDecisions.map((dec, i) => (
                      <li key={i}>{dec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.proofSignals && project.proofSignals.length > 0 && (
                <div className="pt-8 border-t border-black/5">
                  <h3 className="text-[10px] tracking-[0.2em] uppercase mb-4 opacity-40 font-mono font-medium">
                    Proof Signals
                  </h3>
                  <ul className="space-y-3 text-[12px] leading-[1.6] opacity-70 list-disc pl-4">
                    {project.proofSignals.map((proof, i) => (
                      <li key={i}>{proof}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right side: Markdown execution detail */}
            <div className="md:col-span-7 md:col-start-6">
              <h2 className="text-[10px] tracking-[0.2em] uppercase mb-6 opacity-40 font-mono font-medium">
                Execution
              </h2>
              <div className="text-[13px] leading-[1.8] opacity-80 tracking-[-0.01em] font-mono">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-[18px] font-bold text-[#111111] mt-12 mb-6 border-b border-black/[0.08] pb-2 uppercase tracking-wide">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-[14px] font-bold text-[#111111] mt-10 mb-4 border-b border-black/[0.05] pb-1 uppercase tracking-wider">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-[12px] font-bold text-[#111111] mt-8 mb-3 tracking-wide">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-[13px] text-[#222222] leading-[1.8] mb-4 whitespace-pre-wrap font-mono">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc marker:text-black/30 pl-5 mb-6 space-y-2 font-mono text-[13px] text-[#222222] leading-[1.7]">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal marker:text-black/30 pl-5 mb-6 space-y-2 font-mono text-[13px] text-[#222222] leading-[1.7]">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="pl-1 text-[13px] text-[#222222] leading-[1.7]">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-black/20 pl-4 py-1 my-6 italic text-black/60 bg-black/[0.02] rounded-r-md text-[13px] leading-relaxed">
                        {children}
                      </blockquote>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-[#fafafa] border border-black/[0.06] rounded-lg p-4 my-6 overflow-x-auto text-[12px] leading-[1.6] text-[#333333] font-mono shadow-sm">
                        {children}
                      </pre>
                    ),
                    code: ({ className, children, ...props }) => {
                      const isInline = !className && typeof children === 'string' && !children.includes('\n');
                      if (isInline) {
                        return (
                          <code className="bg-black/[0.04] text-[#111111] px-1.5 py-0.5 rounded text-[12px] font-mono border border-black/[0.03]">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className="text-[12px] text-[#333333] font-mono block">
                          {children}
                        </code>
                      );
                    },
                    hr: () => <hr className="my-8 border-t border-black/[0.06]" />,
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black underline underline-offset-4 decoration-black/20 hover:decoration-black hover:opacity-80 transition-all font-medium inline-flex items-center gap-0.5"
                      >
                        {children}
                        <ExternalLink size={10} className="opacity-40 inline-block" />
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="w-full overflow-x-auto my-6 border border-black/[0.06] rounded-lg">
                        <table className="w-full text-left border-collapse text-[12px]">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-[#fafafa] border-b border-black/[0.06] font-semibold text-[#111111]">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-black/[0.04] text-[#333333]">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-black/[0.01] transition-colors">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-3 font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3 font-mono">
                        {children}
                      </td>
                    )
                  }}
                >
                  {project.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </section>

        {/* Technologies Used Section */}
        <section className="px-6 md:px-20 py-24 border-t border-black/[0.05] bg-[#fafafa]">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-[10px] tracking-[0.2em] uppercase mb-12 opacity-40 font-mono font-medium">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-5 py-2.5 bg-white border border-black/[0.08] rounded-full text-[11px] uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity font-medium cursor-default shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
