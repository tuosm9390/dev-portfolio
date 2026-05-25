// 포트폴리오 상단 고정 내비게이션을 렌더링하는 컴포넌트

const navItems = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-none bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px] backdrop-saturate-[180%]">
      <nav
        aria-label="주요 내비게이션"
        className="mx-auto flex h-12 max-w-[1120px] items-center justify-between px-5 text-[12px] font-normal tracking-[-0.12px] text-[rgba(255,255,255,0.8)] sm:px-8"
      >
        <a
          className="font-semibold text-white transition-colors duration-200 hover:text-white"
          href="#top"
        >
          chan.works
        </a>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <a
              className="transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
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
