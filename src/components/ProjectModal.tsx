"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { Project } from "@/data/projects";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-none">
        <div className="flex flex-col h-[90vh] md:h-auto max-h-[90vh] overflow-y-auto">
          {/* Header Image Section */}
          <div className="relative w-full bg-muted/30 overflow-hidden flex items-center justify-center border-b border-border/50">
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
                  className="w-full h-auto max-h-[70vh] object-contain"
                  priority
                  unoptimized
                  onError={() => setImgError(true)}
                />
              ) : (
                <div 
                  className="w-full aspect-[16/9] flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${project.accentColor}20, ${project.accentColor}05)` }}
                >
                  <div className="text-muted-foreground font-medium">Image not available</div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
              <div className="flex-1">
                <div 
                  className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                  style={{ backgroundColor: `${project.accentColor}20`, color: project.accentColor }}
                >
                  {project.summary}
                </div>
                <DialogHeader>
                  <DialogTitle className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {project.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-bold transition-all hover:bg-muted"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl text-white px-5 py-2.5 text-sm font-bold shadow-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: project.accentColor,
                    boxShadow: `0 10px 20px -5px ${project.accentColor}50`,
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({...props}) => <h1 className="text-3xl font-bold mb-6 mt-12 border-b border-border pb-2" {...props} />,
                  h2: ({...props}) => <h2 className="text-2xl font-bold mb-4 mt-10" {...props} />,
                  h3: ({...props}) => <h3 className="text-xl font-bold mb-3 mt-8" {...props} />,
                  p: ({...props}) => <p className="text-lg leading-relaxed text-muted-foreground mb-6" {...props} />,
                  ul: ({...props}) => <ul className="list-disc list-outside mb-6 space-y-3 pl-6" {...props} />,
                  ol: ({...props}) => <ol className="list-decimal list-outside mb-6 space-y-3 pl-6" {...props} />,
                  li: ({...props}) => <li className="text-lg text-muted-foreground" {...props} />,
                  strong: ({...props}) => <strong className="font-bold text-foreground" {...props} />,
                  code: ({inline, ...props}: {inline?: boolean} & React.HTMLAttributes<HTMLElement>) => 
                    inline ? (
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary" {...props} />
                    ) : (
                      <pre className="overflow-x-auto rounded-xl bg-secondary p-4 my-6">
                        <code className="font-mono text-sm" {...props} />
                      </pre>
                    ),
                  blockquote: ({...props}) => (
                    <blockquote className="border-l-4 border-primary bg-primary/5 px-6 py-4 italic rounded-r-lg my-8" {...props} />
                  ),
                  hr: () => <hr className="my-12 border-border" />,
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
