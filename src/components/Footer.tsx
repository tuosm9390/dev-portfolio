import { Github, Linkedin, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { profile } from "@/data/profile";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 pb-10 pt-4 md:px-6 md:pb-14">
      <div className="section-shell">
        <div className="panel flex flex-col gap-8 rounded-[1.8rem] px-6 py-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[34rem]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/42">
              {profile.businessName}
            </p>
            <p className="mt-3 text-lg leading-8 text-white/70">
              일회성 인상보다 오래 남는 결과를 만드는 쪽을 선호합니다. 포트폴리오는
              그 태도를 가장 압축해서 보여주는 인터페이스여야 한다고 생각합니다.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex items-center gap-3">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/64 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/64 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>

            <p className="max-w-[18rem] text-sm leading-6 text-white/42 md:text-right">
              깊게 파고드는 작업자를 찾는 사람에게 가장 먼저 열리는 입구.
            </p>

            <Link
              href="#page-top"
              className="inline-flex items-center gap-2 text-sm text-white/54 hover:text-white"
            >
              다시 위로
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <p className="text-xs uppercase tracking-[0.16em] text-white/28">
              © {currentYear} {profile.businessName}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
