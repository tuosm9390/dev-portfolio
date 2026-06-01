"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import PhotoStack from "@/components/home/PhotoStack";
import ProjectList from "@/components/home/ProjectList";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

export default function Home() {
  // We will display the featured projects on the landing page
  const featuredProjects = projects.filter((p) =>
    [
      "Synapso.dev",
      "persona-style",
      "threads-autoposter",
      "minions-bid",
      "ai-doc-agent",
      "youtube-notebooklm-platform",
    ].includes(p.id)
  );

  return (
    <>
      <Header />

      <main className="relative w-full bg-white text-black font-mono selection:bg-black selection:text-white">
        {/* Hero Section */}
        <section className="relative min-h-screen w-full flex flex-col justify-center px-6 md:px-20 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center w-full relative gap-12 md:gap-0">
            {/* Bio Left */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-[300px] text-[11px] md:text-[12px] leading-[1.6] tracking-tight whitespace-pre-wrap z-10 text-center md:text-left order-2 md:order-1"
            >
              <span>
                AI 툴을 활용하여 속도감 있게 완성형 제품을 구현하는 프론트엔드 및 프로덕트 엔지니어 김상찬입니다. 필요한 것을 직접 설계하고, 끝까지 배포해 나갑니다.
              </span>
            </motion.div>

            {/* Photo Centerpiece Stack */}
            <div className="relative md:absolute left-0 md:left-1/2 top-0 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-0 order-1 md:order-none py-20 md:py-0">
              <PhotoStack />
            </div>

            {/* Badges Right */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center md:text-right text-[11px] md:text-[12px] leading-[1.6] tracking-tight lowercase z-10 order-3 opacity-60"
            >
              <p>product engineer</p>
              <p>frontend specialist</p>
              <p>ai automation builder</p>
            </motion.div>
          </div>
        </section>

        {/* What I Do Best Section */}
        <section className="w-full px-6 md:px-20 pb-40">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h2 className="text-[11px] tracking-[0.2em] uppercase mb-24 opacity-40">
              What I do best?
            </h2>

            <div className="flex flex-col gap-12">
              {/* Strength 1 */}
              <div className="group grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-16 border-b border-black/5 pb-8 last:border-0 items-baseline">
                <h3 className="text-[12px] font-medium uppercase tracking-wider">
                  Development
                </h3>
                <div className="flex flex-row md:flex-col gap-4 md:gap-1 text-[10px] md:text-[11px] uppercase tracking-widest opacity-40 text-left md:text-center">
                  <span>React</span>
                  <span>Next.js</span>
                  <span>TypeScript</span>
                </div>
                <p className="text-[11px] md:text-[12px] text-left md:text-right leading-[1.6] opacity-70">
                  인증, 결제, 상태 관리를 갖춘 고성능 웹 & SaaS <br className="hidden md:block" /> 어플리케이션을 확장 가능한 아키텍처로 구현합니다.
                </p>
              </div>

              {/* Strength 2 */}
              <div className="group grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-16 border-b border-black/5 pb-8 last:border-0 items-baseline">
                <h3 className="text-[12px] font-medium uppercase tracking-wider">
                  Automation & AI
                </h3>
                <div className="flex flex-row md:flex-col gap-4 md:gap-1 text-[10px] md:text-[11px] uppercase tracking-widest opacity-40 text-left md:text-center">
                  <span>Gemini</span>
                  <span>Node.js</span>
                  <span>Pipelines</span>
                </div>
                <p className="text-[11px] md:text-[12px] text-left md:text-right leading-[1.6] opacity-70">
                  Gemini Structured Output 및 외부 API를 결합하여 <br className="hidden md:block" /> 자동화된 데이터 수집 및 상태 추적 파이프라인을 구축합니다.
                </p>
              </div>

              {/* Strength 3 */}
              <div className="group grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-16 border-b border-black/5 pb-8 last:border-0 items-baseline">
                <h3 className="text-[12px] font-medium uppercase tracking-wider">
                  Integrations
                </h3>
                <div className="flex flex-row md:flex-col gap-4 md:gap-1 text-[10px] md:text-[11px] uppercase tracking-widest opacity-40 text-left md:text-center">
                  <span>Supabase</span>
                  <span>Stripe/PortOne</span>
                  <span>DB design</span>
                </div>
                <p className="text-[11px] md:text-[12px] text-left md:text-right leading-[1.6] opacity-70">
                  단순 프론트엔드 화면을 넘어 데이터베이스 설계, RLS 보안, <br className="hidden md:block" /> 결제 모듈 연동까지 연계된 최종 제품 흐름을 완성합니다.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Selected Work Section */}
        <section className="w-full px-6 md:px-20 pb-40">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h2 className="text-[11px] tracking-[0.2em] uppercase mb-16 opacity-40">
              Selected work
            </h2>

            <ProjectList projects={featuredProjects} />

            <div className="mt-8 flex justify-end">
              <Link
                href="/projects"
                className="text-[11px] uppercase tracking-wider opacity-60 hover:opacity-100 border-b border-black pb-0.5 transition-opacity"
              >
                All Projects →
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section className="w-full px-6 md:px-20 pb-40">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h2 className="text-[11px] tracking-[0.2em] uppercase mb-16 opacity-40">
              Experience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-stretch">
              <p className="text-[12px] leading-[1.8] opacity-80">
                {profile.description[0]}
              </p>
              <div className="flex flex-col items-center justify-center gap-6 py-6 h-full border-t border-b md:border-t-0 md:border-b-0 border-black/5 opacity-40">
                <span className="text-[10px] font-bold tracking-widest">[FRONTEND ENGINEER]</span>
                <span className="text-[10px] font-bold tracking-widest">[AI AUTOMATION SPECIALIST]</span>
                <span className="text-[10px] font-bold tracking-widest">[SAAS PROTOTYPER]</span>
              </div>
              <p className="text-[12px] text-left md:text-right leading-[1.8] opacity-80">
                {profile.description[1]}
              </p>
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>
    </>
  );
}
