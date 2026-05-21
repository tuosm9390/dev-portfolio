// 포트폴리오의 핵심 수치 증거를 표시하는 섹션 컴포넌트

import RevealSection from "./RevealSection";
import { profile } from "@/data/profile";

export default function ProofCounters() {
  return (
    <RevealSection className="bg-[var(--surface)]">
      <div className="grid gap-px overflow-hidden rounded-lg bg-[var(--divider)] sm:grid-cols-2 lg:grid-cols-4">
        {profile.proofCounters.map((item) => (
          <div className="bg-[var(--surface)] p-7 sm:p-8" key={item.label}>
            <p className="text-[40px] font-semibold leading-[1.1] tracking-[-0.28px] text-[var(--text-primary)]">
              {item.value}
            </p>
            <p className="mt-3 text-[14px] leading-[1.45] tracking-[-0.224px] text-[var(--text-secondary)]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </RevealSection>
  );
}
