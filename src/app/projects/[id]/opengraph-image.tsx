import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  const title = project?.title ?? "프로젝트";
  const summary = project?.summary ?? "";
  const techStack = project?.techStack.slice(0, 4) ?? [];
  const accentColor = project?.accentColor ?? "#0064ff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 배경 글로우 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "20%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            backgroundColor: `${accentColor}0D`,
            filter: "blur(80px)",
          }}
        />

        {/* 상단: DevCraft Studio 레이블 */}
        <div
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "32px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {profile.businessName}
        </div>

        {/* 프로젝트 제목 */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          {title}
        </div>

        {/* 요약 */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "48px",
            maxWidth: "800px",
          }}
        >
          {summary}
        </div>

        {/* 기술 스택 */}
        <div style={{ display: "flex", gap: "12px" }}>
          {techStack.map((tech) => (
            <div
              key={tech}
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                padding: "8px 16px",
                color: "rgba(255,255,255,0.7)",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* 강조 바 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "4px",
            backgroundColor: accentColor,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
