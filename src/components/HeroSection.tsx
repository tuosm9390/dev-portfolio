import Link from "next/link";
import { ArrowRight, Layers3, Sparkles, Telescope } from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

const floatingProjects = projects.slice(0, 3);

export default function HeroSection() {
  const primaryProject = floatingProjects[0];
  const secondaryProjects = floatingProjects.slice(1);

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-28 md:px-6 md:pb-14 md:pt-34">
      <div className="section-shell">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-12">
          <div className="relative z-10">
            <span className="eyebrow">
              immersive portfolio system
            </span>

            <h1 className="mt-6 max-w-[10ch] text-[clamp(2.7rem,10vw,6.2rem)] font-semibold leading-[0.95] tracking-[-0.065em] text-white sm:max-w-[12ch] lg:max-w-[11ch]">
              흩어진 생각도 끝까지 파고들면 결과가 됩니다.
            </h1>

            <p className="body-copy mt-8">
              {profile.businessName}는 템플릿 같은 소개 페이지보다, 작업자의 사고방식과
              결과물이 동시에 드러나는 화면을 지향합니다. 채용 검토, 레퍼런스 확인,
              외주 탐색 어느 맥락에서 들어오더라도 한 가지는 분명하게 남아야 합니다.
              <span className="text-white"> 이 사람은 깊게 일한다.</span>
            </p>

            <div className="mt-8 flex flex-wrap items-start gap-3 sm:gap-4">
              <Link href="#projects" scroll className="primary-button">
                프로젝트 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#contact" scroll className="secondary-button">
                작업 문의
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 max-w-[38rem] rounded-[1.7rem] border border-white/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-5">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/36">
                    field note
                  </p>
                  <p className="mt-3 max-w-[30ch] text-base leading-7 text-white/72">
                    빠르게 끝내는 사람보다, 끝까지 물고 늘어지는 사람으로 기억되는 편이
                    더 맞다고 생각합니다.
                  </p>
                </div>
                <div className="hidden min-w-[9rem] rounded-[1.2rem] border border-white/8 bg-black/16 px-4 py-3 sm:block">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-white/34">
                    visitor lens
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    hiring
                    <br />
                    references
                    <br />
                    freelance
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/[0.035] px-4 py-4 sm:hidden">
              <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                current frame
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">
                      {primaryProject.title}
                    </h2>
                    <span className="surface-chip border-white/10 bg-white/4 text-white/62">
                      {primaryProject.techStack[0]}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/58">
                    {primaryProject.summary}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {secondaryProjects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-[1.05rem] border border-white/8 bg-white/[0.03] px-3 py-3"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-white/34">
                        {project.techStack[0]}
                      </p>
                      <p className="mt-2 text-sm font-medium tracking-[-0.02em] text-white/74">
                        {project.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-[1.25fr_0.8fr_0.95fr]">
              <div className="panel rounded-[1.7rem] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                  reading context
                </p>
                <p className="mt-3 max-w-[24ch] text-base leading-7 text-white/74">
                  채용 검토, 외주 탐색, 레퍼런스 확인에 모두 견디는 구조를 먼저 잡습니다.
                </p>
              </div>
              <div className="panel rounded-[1.7rem] px-4 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                  visual axis
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  dark
                  <br />
                  depth
                  <br />
                  personal grain
                </p>
              </div>
              <div className="panel rounded-[1.7rem] px-4 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                  output logic
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  생각의 밀도를
                  <br />
                  결과물과 설명 구조에
                  <br />
                  같이 남깁니다.
                </p>
              </div>
            </div>
          </div>

          <div
            className="relative mx-auto hidden w-full max-w-[620px] sm:block sm:h-[390px] lg:h-[470px]"
            style={{ perspective: "1400px" }}
          >
            <div className="depth-grid absolute inset-[7%_8%] rounded-[2.2rem] opacity-55" />
            <div className="absolute left-[3%] top-[12%] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(146,166,255,0.22),transparent_72%)] blur-lg" />
            <div className="absolute right-[2%] top-[3%] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(255,116,196,0.14),transparent_72%)] blur-lg" />

            <div
              className="panel-strong absolute inset-x-[10%] top-[8%] rounded-[2rem] p-6"
              style={{
                transform: "rotateX(10deg) rotateY(-15deg) rotateZ(-4deg)",
                boxShadow: `0 28px 82px ${primaryProject.accentColor}20, 0 14px 30px rgba(5, 7, 16, 0.4)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background: `radial-gradient(circle at top left, ${primaryProject.accentColor}26, transparent 38%)`,
                }}
              />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                      signal focus
                    </p>
                    <h2 className="mt-3 max-w-[10ch] text-[1.9rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
                      {primaryProject.title}
                    </h2>
                  </div>
                  <span className="surface-chip border-white/12 bg-black/18 text-white/72">
                    {primaryProject.techStack[0]}
                  </span>
                </div>

                <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <p className="line-clamp-3 text-sm leading-6 text-white/68">
                    {primaryProject.summary}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="panel absolute right-[4%] top-[18%] w-[28%] rounded-[1.5rem] p-4"
              style={{
                transform: "translate3d(0,0,32px) rotateX(8deg) rotateY(18deg) rotateZ(4deg)",
              }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">artifact</p>
              <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
                {secondaryProjects[0]?.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/56">
                {secondaryProjects[0]?.techStack[0]}
              </p>
            </div>

            <div
              className="panel absolute bottom-[13%] left-[7%] w-[24%] rounded-[1.5rem] p-4"
              style={{
                transform: "translate3d(0,0,26px) rotateX(8deg) rotateY(-16deg) rotateZ(-5deg)",
              }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">proof</p>
              <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
                {secondaryProjects[1]?.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/56">
                {secondaryProjects[1]?.techStack[0]}
              </p>
            </div>

            <div className="panel absolute bottom-[2%] right-[8%] flex w-[52%] flex-col gap-4 rounded-[1.6rem] p-5">
              <div className="flex items-center gap-3 text-white/72">
                <Telescope className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.18em]">
                  working mode
                </span>
              </div>
              <div className="grid gap-3 text-sm text-white/76">
                <div className="flex items-center gap-3">
                  <Layers3 className="h-4 w-4 text-white/40" />
                  구조를 먼저 세운 뒤 감각을 얹습니다.
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-white/40" />
                  장식보다 깊이와 긴장을 더 중요하게 봅니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
