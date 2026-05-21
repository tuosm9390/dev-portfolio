// 포트폴리오 상단 고정 내비게이션을 렌더링하는 컴포넌트

const navItems = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(0,0,0,0.08)] bg-white/80 backdrop-blur-xl">
      <nav
        aria-label="주요 내비게이션"
        className="mx-auto flex h-12 max-w-[1120px] items-center justify-between px-5 text-[12px] text-[rgba(0,0,0,0.8)] sm:px-8"
      >
        <a
          className="font-semibold tracking-[-0.12px] text-[#1d1d1f] transition-colors hover:text-[#0066cc]"
          href="#top"
        >
          chan.works
        </a>
        <div className="flex items-center gap-5">
          {navItems.map((item) => (
            <a
              className="transition-colors hover:text-[#0066cc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
