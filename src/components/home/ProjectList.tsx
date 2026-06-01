"use client";

import Link from "next/link";
import Image from "next/image";
import { Project, getProjectMetadata } from "@/data/projects";

interface ProjectListProps {
  projects: Project[];
  limit?: number;
}

export default function ProjectList({ projects, limit }: ProjectListProps) {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <div className="w-full border-t border-black/5 font-mono">
      {displayProjects.map((project) => {
        const meta = getProjectMetadata(project);

        return (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block w-full"
          >
            <div className="group flex items-center justify-between py-6 md:py-10 border-b border-black/5 hover:bg-black/[0.01] transition-colors cursor-pointer">
              {/* Year */}
              <div className="w-[15%] md:w-[10%] text-[11px] tabular-nums opacity-30 tracking-wider">
                {meta.year}
              </div>

              {/* Title */}
              <div className="w-[45%] md:w-[50%] text-[13px] md:text-[15px] tracking-tight font-medium group-hover:translate-x-1 transition-transform duration-500 ease-out">
                {project.title}
              </div>

              {/* Description Snippet (Desktop only) */}
              <div className="hidden md:block w-[25%] text-[9px] uppercase tracking-[0.15em] opacity-30 leading-relaxed line-clamp-2">
                {project.summary}
              </div>

              {/* Image Preview */}
              <div className="w-[30%] md:w-[15%] flex justify-end">
                <div className="relative w-20 md:w-32 aspect-[4/3] overflow-hidden rounded-sm bg-gray-50 border border-black/5 transform origin-center group-hover:scale-105 transition-transform duration-700 ease-out">
                  <Image
                    alt={project.title}
                    src={project.imageUrl}
                    fill
                    sizes="(max-width: 768px) 80px, 128px"
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                  />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
