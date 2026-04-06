"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import Image from "next/image";
import { Project } from "@/data/projects";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) {
  const [imgError, setImgError] = React.useState(false);

  // Reset error state when project changes
  React.useEffect(() => {
    setImgError(false);
  }, [project?.id]);
  
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[1024px] p-0 overflow-hidden bg-[#f5f5f7] border-none apple-shadow rounded-2xl">
        <div className="flex flex-col h-[90vh] md:h-auto max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <DialogClose className="absolute right-6 top-6 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/40 transition-all hover:bg-black/10 hover:text-black/60">
            <X size={20} />
          </DialogClose>

          {/* Header Image Section */}
          <div className="relative w-full bg-white overflow-hidden flex items-center justify-center">
            <motion.div 
              layoutId={`project-image-${project.id}`} 
              className="relative w-full h-full flex items-center justify-center"
            >
              {!imgError ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[60vh] object-contain"
                  priority
                  unoptimized
                  onError={() => setImgError(true)}
                />
              ) : (
                <div 
                  className="w-full aspect-[16/9] flex items-center justify-center bg-[#f5f5f7]"
                >
                  <div className="text-black/20 font-medium">Image not available</div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-10 md:p-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-black/5 pb-16">
              <div className="flex-1">
                <p className="mb-4 text-[14px] font-semibold uppercase tracking-wider text-apple-blue">
                  {project.summary}
                </p>
                <DialogHeader>
                  <DialogTitle className="text-[40px] md:text-[56px] font-semibold leading-[1.1] tracking-tight text-[#1d1d1f]">
                    {project.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="flex flex-wrap gap-3 mt-8">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-black/5 px-3 py-1 text-[12px] font-medium text-black/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 shrink-0">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-apple-primary group flex items-center gap-2"
                >
                  <ExternalLink size={18} />
                  방문하기
                </a>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-white border border-black/10 px-5 py-2 text-[17px] font-normal text-[#1d1d1f] transition-all hover:bg-[#f5f5f7]"
                  >
                    <Github size={18} />
                    GitHub
                  </a>
                )}
              </div>
            </div>

            <div className="prose prose-neutral max-w-none prose-headings:text-[#1d1d1f] prose-p:text-black/80 prose-p:text-[17px] prose-p:leading-[1.47]">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({...props}) => <h1 className="text-[34px] font-semibold mb-8 mt-16" {...props} />,
                  h2: ({...props}) => <h2 className="text-[28px] font-semibold mb-6 mt-12" {...props} />,
                  h3: ({...props}) => <h3 className="text-[21px] font-semibold mb-4 mt-8" {...props} />,
                  p: ({...props}) => <p className="text-[17px] leading-[1.47] tracking-[-0.022em] mb-6" {...props} />,
                  ul: ({...props}) => <ul className="list-disc list-outside mb-6 space-y-3 pl-6" {...props} />,
                  ol: ({...props}) => <ol className="list-decimal list-outside mb-6 space-y-3 pl-6" {...props} />,
                  li: ({...props}) => <li className="text-[17px] text-black/80" {...props} />,
                  strong: ({...props}) => <strong className="font-semibold text-[#1d1d1f]" {...props} />,
                  pre: ({...props}) => (
                    <pre className="overflow-x-auto rounded-xl bg-black/5 p-6 my-8" {...props} />
                  ),
                  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
                    const isBlock = className?.includes('language-') || String(children).includes('\n');
                    return (
                      <code 
                        className={`${isBlock ? "font-mono text-sm" : "rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm text-apple-blue"} ${className || ""}`} 
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({...props}) => (
                    <blockquote className="border-l-4 border-apple-blue bg-apple-blue/5 px-8 py-6 italic rounded-r-lg my-10" {...props} />
                  ),
                  hr: () => <hr className="my-16 border-black/5" />,
                }}
              >
                {project.description}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
