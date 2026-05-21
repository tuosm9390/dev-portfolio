// 포트폴리오 하단 저작권 정보를 렌더링하는 푸터 컴포넌트

import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--divider)] bg-white px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-2 text-[12px] leading-[1.33] tracking-[-0.12px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {profile.businessName}</p>
        <a className="hover:text-[#0066cc]" href={`mailto:${profile.contact.email}`}>
          {profile.contact.email}
        </a>
      </div>
    </footer>
  );
}
