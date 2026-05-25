"use client";
// 개인 커리어 스토리를 읽기 좋은 단일 흐름으로 렌더링하는 섹션 컴포넌트

import RevealSection from "./RevealSection";
import { profile } from "@/data/profile";

export default function StorySection() {
  return (
    <RevealSection className="bg-[#ffffff] min-h-screen flex flex-col justify-center py-0 px-5 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-[14px] font-semibold tracking-[-0.224px] text-[var(--text-muted)]">
            About
          </p>
          <h2 className="mt-3 text-[40px] font-semibold leading-[1.10] tracking-normal text-[var(--text-primary)]">
            다시 실무 감각을 쌓는 방식.
          </h2>
        </div>
        <div className="max-w-3xl space-y-5 text-[17px] leading-[1.47] tracking-[-0.374px] text-[var(--text-secondary)] font-normal">
          {profile.personalStory.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
