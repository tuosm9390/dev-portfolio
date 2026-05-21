// 프로필 강점 목록을 Apple식 카드 그리드로 렌더링하는 섹션 컴포넌트

import { Code2, Rocket, Shield, Sparkles } from "lucide-react";
import RevealSection from "./RevealSection";
import { profile } from "@/data/profile";

const icons = {
  Code2,
  Rocket,
  Shield,
  Sparkles,
};

export default function StrengthsSection() {
  return (
    <RevealSection className="bg-[var(--surface)]" id="about">
      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-[14px] font-semibold tracking-[-0.224px] text-[var(--text-muted)]">
            Strengths
          </p>
          <h2 className="mt-3 text-[40px] font-semibold leading-[1.1] tracking-[-0.28px] text-[var(--text-primary)]">
            화면 너머의 제품 흐름까지 봅니다.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {profile.strengths.map((strength) => {
            const Icon = icons[strength.icon as keyof typeof icons] ?? Sparkles;

            return (
              <article
                className="rounded-lg bg-white p-6"
                key={strength.title}
              >
                <Icon aria-hidden="true" color="#0071e3" size={24} />
                <h3 className="mt-5 text-[21px] font-semibold leading-[1.19] tracking-[0.231px] text-[var(--text-primary)]">
                  {strength.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] tracking-[-0.224px] text-[var(--text-secondary)]">
                  {strength.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
}
