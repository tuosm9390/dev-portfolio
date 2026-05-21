// 개인 커리어 스토리를 읽기 좋은 단일 흐름으로 렌더링하는 섹션 컴포넌트

import RevealSection from "./RevealSection";
import { profile } from "@/data/profile";

export default function StorySection() {
  return (
    <RevealSection>
      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-[14px] font-semibold tracking-[-0.224px] text-[var(--text-muted)]">
            Story
          </p>
          <h2 className="mt-3 text-[40px] font-semibold leading-[1.1] tracking-[-0.28px] text-[var(--text-primary)]">
            다시 실무 감각을 쌓는 방식.
          </h2>
        </div>
        <div className="max-w-3xl space-y-5 text-[17px] leading-[1.7] tracking-[-0.374px] text-[var(--text-secondary)]">
          {profile.personalStory.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
