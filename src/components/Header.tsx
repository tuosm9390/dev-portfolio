import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";

const navLinks = [
  { label: "프로젝트", href: "#projects" },
  { label: "작업 방식", href: "#about" },
  { label: "연락", href: "#contact" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div className="section-shell">
        <div className="md:hidden">
          <input id="mobile-nav-toggle" type="checkbox" className="peer sr-only" />
          <div className="floating-nav flex items-center justify-between rounded-[1.35rem] px-4 py-3 md:px-5">
            <Link href="#page-top" scroll className="group flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                <span className="h-4 w-4 rounded-[0.45rem] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(122,146,255,0.95)_40%,rgba(60,79,170,0.95))]" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-[0.14em] text-white/86 uppercase">
                  {profile.businessName}
                </p>
                <p className="truncate text-xs text-white/48">
                  혼자서도 끝까지 만드는 개발자
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap text-sm text-white/62 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <span className="surface-chip border-white/10 bg-white/4 text-white/62">
                채용 · 레퍼런스 · 외주
              </span>
              <Link href="#contact" className="secondary-button whitespace-nowrap px-4 py-2 text-sm leading-none">
                대화 열기
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <label
              htmlFor="mobile-nav-toggle"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            >
              <Menu className="h-5 w-5 peer-checked:hidden" />
              <X className="hidden h-5 w-5 peer-checked:block" />
            </label>
          </div>

          <div className="panel mt-3 hidden overflow-hidden rounded-[1.6rem] p-4 peer-checked:block">
            <div className="mb-4 rounded-[1.2rem] border border-white/8 bg-white/4 p-4">
              <p className="text-sm font-semibold text-white/82">{profile.name}</p>
              <p className="mt-1 text-sm text-white/56">
                작업물 보고 이야기 이어갈 수 있게 만든 페이지입니다.
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-[1rem] border border-white/6 bg-white/3 px-4 py-3 text-left text-base text-white/82"
                >
                  {link.label}
                </Link>
                ))}
              </nav>
          </div>
        </div>

        <div className="floating-nav hidden items-center justify-between rounded-[1.35rem] px-4 py-3 md:px-5 md:flex">
          <Link href="#page-top" scroll className="group flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
              <span className="h-4 w-4 rounded-[0.45rem] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(122,146,255,0.95)_40%,rgba(60,79,170,0.95))]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[0.14em] text-white/86 uppercase">
                {profile.businessName}
              </p>
              <p className="truncate text-xs text-white/48">
                혼자서도 끝까지 만드는 개발자
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm text-white/62 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <span className="surface-chip border-white/10 bg-white/4 text-white/62">
              채용 · 레퍼런스 · 외주
            </span>
            <Link href="#contact" className="secondary-button whitespace-nowrap px-4 py-2 text-sm leading-none">
              대화 열기
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
