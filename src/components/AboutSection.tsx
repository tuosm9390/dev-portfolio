import { Code2, Rocket, Shield, Sparkles } from "lucide-react";
import { profile } from "@/data/profile";

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Rocket,
  Shield,
  Sparkles,
};

const operatingSequence = [
  "문제를 끝까지 정의합니다",
  "구조를 먼저 단단하게 세웁니다",
  "빠르게 만들되, 얕게 끝내지 않습니다",
  "배포 이후의 운영 감각까지 포함합니다",
];

export default function AboutSection() {
  return (
    <section id="about" className="px-4 py-20 md:px-6">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">operating profile</span>
            <h2 className="section-title mt-6 max-w-[10ch] text-white">
              몰입해서 일하는 방식 자체를 공개합니다.
            </h2>
            <p className="body-copy mt-7">
              정신이 조금 산만해 보여도, 하나의 문제에 걸리면 예상보다 오래 파고드는
              편입니다. 그래서 작업 스타일 역시 넓게 훑기보다 깊게 잠수하는 쪽에
              가깝습니다. 이 페이지는 그 성향이 결과물과 어떻게 연결되는지 보여주는
              공간입니다.
            </p>

            <div className="mt-10">
              <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                how work usually unfolds
              </p>
              <div className="mt-5 space-y-0 border-y border-white/8">
                {operatingSequence.map((step, index) => (
                  <div
                    key={step}
                    className="grid grid-cols-[2.2rem_minmax(0,1fr)] items-start gap-3 border-b border-white/8 py-4 last:border-b-0"
                  >
                    <span className="mt-0.5 text-xs font-semibold text-white/30">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-6 text-white/70">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {profile.strengths.map((strength, index) => {
              const Icon = iconMap[strength.icon] || Code2;
              const layoutClass =
                index === 0
                  ? "md:col-span-2"
                  : index === 1
                    ? "md:translate-y-10"
                      : index === 2
                        ? "md:-translate-y-6"
                        : "";

              return (
                <article
                  key={strength.title}
                  className={`rounded-[1.9rem] border border-white/10 bg-white/[0.035] p-6 md:p-7 ${layoutClass}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10 bg-white/6 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[0.72rem] uppercase tracking-[0.18em] text-white/34">
                      {index === 0 ? "full stack" : index === 1 ? "speed" : index === 2 ? "stability" : "taste"}
                    </span>
                  </div>
                  <h3 className="mt-6 text-[1.45rem] font-semibold tracking-[-0.04em] text-white">
                    {strength.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/66 md:text-[0.98rem]">
                    {strength.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
