// 연락처와 협업 가능 범위를 렌더링하는 하단 CTA 섹션 컴포넌트

import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import RevealSection from "./RevealSection";
import { profile } from "@/data/profile";

export default function ContactSection() {
  return (
    <RevealSection className="bg-[var(--surface)]" id="contact">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-[14px] font-semibold tracking-[-0.224px] text-[var(--text-muted)]">
            Contact
          </p>
          <h2 className="mt-3 text-[40px] font-semibold leading-[1.1] tracking-[-0.28px] text-[var(--text-primary)]">
            AI 기능이 들어간 제품 흐름을 함께 만들 수 있습니다.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0071e3] px-5 text-[17px] text-white transition-colors hover:bg-[#0077ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
              href={`mailto:${profile.contact.email}`}
            >
              <Mail size={17} />
              메일 보내기
              <ArrowRight
                className="transition-transform group-hover:translate-x-0.5"
                size={17}
              />
            </a>
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0066cc] px-5 text-[17px] text-[#0066cc] transition-colors hover:bg-white"
              href={profile.social.github}
              rel="noreferrer"
              target="_blank"
            >
              <Github size={17} />
              GitHub
            </a>
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0066cc] px-5 text-[17px] text-[#0066cc] transition-colors hover:bg-white"
              href={profile.social.linkedin}
              rel="noreferrer"
              target="_blank"
            >
              <Linkedin size={17} />
              LinkedIn
            </a>
          </div>
        </div>
        <div className="grid gap-2">
          {profile.collaborationScope.map((scope) => (
            <div
              className="rounded-lg bg-white px-5 py-4 text-[15px] leading-[1.45] tracking-[-0.224px] text-[var(--text-secondary)]"
              key={scope}
            >
              {scope}
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
