// 홈 첫 화면의 브랜드와 핵심 가치 제안을 렌더링하는 섹션 컴포넌트

import { ArrowRight } from "lucide-react";
import RevealSection from "./RevealSection";
import { profile } from "@/data/profile";

export default function HeroSection() {
  return (
    <RevealSection
      className="min-h-screen pt-32 sm:pt-36"
      id="top"
      innerClassName="flex min-h-[calc(100vh-14rem)] flex-col justify-center"
    >
      <div className="max-w-4xl">
        <p className="mb-5 text-[14px] font-semibold tracking-[-0.224px] text-[var(--text-muted)]">
          {profile.name}
        </p>
        <h1 className="max-w-3xl text-[48px] font-semibold leading-[1.07] tracking-[-0.28px] text-[var(--text-primary)] sm:text-[56px]">
          {profile.businessName}
        </h1>
        <p className="mt-5 max-w-3xl text-[24px] font-normal leading-[1.22] tracking-[-0.28px] text-[var(--text-primary)] sm:text-[32px]">
          {profile.title}
        </p>
        <p className="mt-6 max-w-2xl text-[17px] leading-[1.6] tracking-[-0.374px] text-[var(--text-secondary)]">
          {profile.tagline}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0071e3] px-5 text-[17px] text-white transition-colors hover:bg-[#0077ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
            href="#projects"
          >
            프로젝트 보기
            <ArrowRight size={17} />
          </a>
          <a
            className="inline-flex min-h-11 items-center rounded-full border border-[#0066cc] px-5 text-[17px] text-[#0066cc] transition-colors hover:bg-[#f5f5f7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
            href="#contact"
          >
            연락하기
          </a>
        </div>
      </div>
    </RevealSection>
  );
}
