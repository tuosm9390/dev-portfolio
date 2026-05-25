"use client";
// 연락처와 협업 가능 범위를 렌더링하는 하단 CTA 섹션 컴포넌트

import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import RevealSection from "./RevealSection";
import { profile } from "@/data/profile";

export default function ContactSection() {
  return (
    <RevealSection className="bg-[#000000] py-0 w-full" id="contact">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-[14px] font-semibold tracking-[-0.224px] text-[rgba(255,255,255,0.48)]">
            Contact
          </p>
          <h2 className="mt-3 text-[40px] font-semibold leading-[1.10] tracking-normal text-white">
            AI 툴을 활용하여 신속하고 완성도 높은 제품을 함께 개발할 수 있습니다.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="group inline-flex min-h-11 items-center gap-1.5 rounded-[980px] bg-[#0071e3] px-6 text-[17px] text-white transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-[#0077ed] active:scale-[0.97] active:bg-[#0062c3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
              href={`mailto:${profile.contact.email}`}
            >
              <Mail size={17} />
              메일 보내기
              <ArrowRight
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                size={17}
              />
            </a>
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-[980px] border border-[#2997ff] px-6 text-[17px] text-[#2997ff] bg-transparent transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-[rgba(41,151,255,0.08)] active:scale-[0.97] active:bg-[rgba(41,151,255,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
              href={profile.social.github}
              rel="noreferrer"
              target="_blank"
            >
              <Github size={17} />
              GitHub
            </a>
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-[980px] border border-[#2997ff] px-6 text-[17px] text-[#2997ff] bg-transparent transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-[rgba(41,151,255,0.08)] active:scale-[0.97] active:bg-[rgba(41,151,255,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
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
              className="rounded-lg bg-[#272729] px-5 py-4 text-[15px] leading-[1.45] tracking-[-0.224px] text-[rgba(255,255,255,0.8)]"
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
