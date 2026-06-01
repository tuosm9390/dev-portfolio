// About 페이지 - 증거 수치 바, 개인 스토리, 핵심 성과를 포함한 소개 페이지
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { profile } from "@/data/profile";
import LifeGraph from "@/components/home/LifeGraph";

export default function AboutPage() {
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
          <h1 className="text-[11px] tracking-[0.2em] uppercase mb-12 opacity-40">
            About Me
          </h1>

          {/* Proof Numbers Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-b border-black/5 py-10 mb-16">
            {profile.proofCounters.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-[24px] md:text-[32px] font-medium tracking-tight">{item.value}</p>
                <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1.5 leading-[1.5]">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-12">
              <h2 className="text-2xl md:text-[36px] leading-[1.15] font-medium tracking-tight">
                Bridging the gap between frontend interface and AI automation.
              </h2>
              <div className="space-y-6 text-[13px] md:text-[14px] leading-[1.7] opacity-80">
                <p>
                  인프라와 백엔드를 고려하는 프론트엔드 개발자로서 웹 표준 및 성능 최적화를 깊게 고민하고 제품을 설계합니다. Next.js 및 TypeScript 생태계에서 사용자가 체감하는 매끄러운 동작과 데이터베이스, 결제, 파이프라인의 연동을 최우선으로 둡니다.
                </p>
                <p>
                  AI 기술을 단순한 코드 보조에서 넘어 독립적인 워크플로우를 자동화하는 핵심 아키텍처로 설계·구현해본 경험이 있습니다. 매일 실무 지향적 제품을 구축하고 배포하며 더 빠르고 견고한 최적의 해결책을 학습하고 있습니다.
                </p>
                <p>
                  정규직 경력 이후에는 React·Next.js 기반 제품 개발 역량을 확장하기 위해 AI·자동화 웹 서비스를 직접 설계하고 배포했습니다. 단순 토이 프로젝트가 아니라, 인증·결제·데이터 저장·AI 분석·자동 발행·PDF 리포트 등 실제 제품에 필요한 흐름을 끝까지 연결하는 데 집중했습니다.
                </p>
                <p>
                  - AI·자동화 기반 웹 서비스 10개 이상 설계·배포
                </p>
                <p>
                  - Synapso.dev, Persona Style AI, Threads Auto-Poster, Minions Bid 등 운영 가능한 제품형 프로젝트 구축
                </p>
                <p>
                  - Gemini API, Supabase RLS, Firebase, pgvector, PortOne/Stripe, Meta Threads API, Vercel Cron, Claude API, NotebookLM 기반 학습 자동화 워크플로우 등 실서비스 구성 요소 직접 통합
                </p>
              </div>

              {/* Personal Story */}
              <div className="pt-10 border-t border-black/5 space-y-4">
                <h3 className="text-[11px] uppercase tracking-widest font-bold opacity-50">Story</h3>
                <div className="space-y-4 text-[12px] leading-[1.7] opacity-70">
                  {profile.personalStory.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Approach & Craft Details */}
              <div className="pt-12 border-t border-black/5 space-y-8">
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-3">The Approach</h3>
                  <p className="text-[12px] leading-[1.6] opacity-75">
                    기술은 문제를 해결할 때 가장 가치 있다고 믿습니다. 단순히 기술 스택의 유행을 따르기보다는 해결하려는 마찰 지점을 명확히 정의하고, 이를 실증하기 위해 가장 빠르고 안전한 연결 구조를 설계합니다.
                  </p>
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-3">The Craft</h3>
                  <p className="text-[12px] leading-[1.6] opacity-75">
                    Supabase의 RLS 설계부터 Next.js App Router의 SSR 성능 튜닝, 결제 멱등성 및 PDF 오프라인 리포트 발행까지, 비즈니스가 부드럽게 돌아갈 수 있도록 디테일에 집중합니다.
                  </p>
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-3">The Mission</h3>
                  <p className="text-[12px] leading-[1.6] opacity-75">
                    개발 공정을 효율화하고 AI 툴링을 실제 상용 프로덕트에 녹여내어 개발 일정과 비효율을 줄이고 신뢰할 수 있는 가치를 만들어내는 것입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Meta details & Polaroid */}
            <div className="md:col-span-4 md:col-start-9 space-y-12">
              {/* Polaroid Single Card */}
              <div className="flex justify-center md:justify-start">
                <div className="bg-white p-3 pb-8 shadow-xl border border-black/5 rounded-sm transform rotate-[-2deg] max-w-[220px]">
                  <div className="relative aspect-square w-full overflow-hidden bg-gray-100 rounded-sm">
                    <Image
                      alt="Me :)"
                      src="/images/avatar.png?v=3"
                      width={200}
                      height={200}
                      unoptimized
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700 pointer-events-none"
                    />
                  </div>
                  <p className="mt-3 text-center text-[10px] italic opacity-60">Me, 2026</p>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="space-y-6 pt-6 border-t border-black/5 text-[11px]">
                <div>
                  <p className="uppercase tracking-widest opacity-40 mb-1">Current Role</p>
                  <p className="font-medium text-black">Product Engineer & Prototyper</p>
                </div>
                <div>
                  <p className="uppercase tracking-widest opacity-40 mb-1">Location</p>
                  <p className="font-medium text-black">Seoul, South Korea</p>
                </div>
                <div>
                  <p className="uppercase tracking-widest opacity-40 mb-1">Focus</p>
                  <p className="font-medium text-black">React / Next.js, Supabase, AI Pipelines, Workflows</p>
                </div>
              </div>

              {/* Key Results */}
              <div className="pt-6 border-t border-black/5 space-y-3 text-[11px]">
                <p className="uppercase tracking-widest opacity-40">Key Results</p>
                <div className="space-y-2 opacity-70 leading-[1.6]">
                  <p>→ 일정 지연 프로젝트 2개월 내 정상화 (50% 단축)</p>
                  <p>→ 구조 재설계 후 오류 발생률 80% 감소</p>
                  <p>→ AI·자동화 서비스 10개 이상 직접 배포</p>
                  <p>→ SaaS 정기구독 결제 시스템 운영 중</p>
                </div>
              </div>

              {/* Life Graph */}
              <LifeGraph />
            </div>
          </div>
        </motion.section>

        <Footer />
      </main>
    </>
  );
}
