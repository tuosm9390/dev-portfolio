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
              한 번 보고 지나가는 인상보다, 실제로 써도 괜찮은 결과를 만드는 쪽을 더 중요하게 생각합니다.
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
              어떤 사람인지 궁금할 때 제일 먼저 열어보는 페이지가 됐으면 합니다.
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
