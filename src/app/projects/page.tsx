"use client";

import { motion } from "framer-motion";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ProjectList from "@/components/home/ProjectList";
import { projects } from "@/data/projects";

export default function ProjectsArchivePage() {
  return (
    <>
      <Header />

      <main className="relative w-full min-h-screen bg-white text-black font-mono pt-40 px-6 md:px-20 selection:bg-black selection:text-white">
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[1200px] mx-auto pb-40"
        >
          {/* Section Breadcrumb */}
          <h1 className="text-[11px] tracking-[0.2em] uppercase mb-16 opacity-40">
            Projects
          </h1>

          {/* Section Heading Row */}
          <div className="mb-20 md:mb-32 flex flex-col md:flex-row justify-between items-baseline gap-4">
            <h2 className="text-2xl md:text-[28px] font-medium tracking-tight">
              All Projects
            </h2>
            <p className="text-[10px] tracking-[0.2em] uppercase opacity-40">
              Archive / 2024—Present
            </p>
          </div>

          {/* Hover-reveal Projects List */}
          <ProjectList projects={projects} />
        </motion.section>

        <Footer />
      </main>
    </>
  );
}
