import { Mail, Phone, Github, Linkedin, Orbit } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { profile } from "@/data/profile";

const contactLinks = [
  {
    icon: Mail,
    label: "이메일",
    value: profile.contact.email,
    href: `mailto:${profile.contact.email}`,
  },
  {
    icon: Phone,
    label: "전화",
    value: profile.contact.phone,
    href: `tel:${profile.contact.phone.replace(/-/g, "")}`,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/tuosm9390",
    href: profile.contact.github,
    external: true,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "프로필 보기",
    href: profile.contact.linkedin,
    external: true,
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="px-4 py-20 md:px-6">
      <div className="section-shell">
        <div className="panel-strong overflow-hidden rounded-[2.2rem] p-6 md:p-8 lg:p-10">
          <div className="absolute right-[-6rem] top-[-5rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(128,149,255,0.3),transparent_70%)] blur-2xl" />
          <div className="absolute bottom-[-7rem] left-[-5rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(89,214,255,0.18),transparent_70%)] blur-2xl" />

          <div className="relative grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="max-w-[32rem]">
              <span className="eyebrow">연락하기</span>
              <h2 className="section-title mt-6 max-w-[10ch] text-white">
                뭔가 같이 해보고 싶다면
                편하게 연락 주세요.
              </h2>
              <p className="body-copy mt-7">
                아직 머릿속에만 있는 아이디어여도 괜찮고, 이미 해야 할 일이 정리돼
                있어도 괜찮습니다. 일단 이야기부터 해보면 그다음은 같이 맞춰볼 수 있습니다.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="surface-chip border-white/10 bg-white/[0.05] text-white/64">
                  첫 상담
                </span>
                <span className="surface-chip border-white/10 bg-white/[0.05] text-white/64">
                  비동기 피드백
                </span>
                <span className="surface-chip border-white/10 bg-white/[0.05] text-white/64">
                  외주 문의
                </span>
              </div>

              <div className="mt-10">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Orbit className="h-4 w-4" />
                  너무 갖춰서 보내지 않아도 됩니다.
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {contactLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-white/76 hover:border-white/14 hover:bg-white/[0.05] hover:text-white"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-white/10 bg-white/6 text-white">
                        <link.icon className="h-4 w-4" />
                      </span>
                      <span className="mt-1 min-w-0">
                        <span className="block text-xs uppercase tracking-[0.18em] text-white/34">
                          {link.label}
                        </span>
                        <span className="mt-1 block truncate text-sm text-white/78">
                          {link.value}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
