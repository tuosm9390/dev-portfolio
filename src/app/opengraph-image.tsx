import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const runtime = "edge";
export const alt = "chan.works | AI 제품형 프론트엔드 포트폴리오";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
            left: "50%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 100, 255, 0.06)",
            transform: "translate(-50%, -50%)",
            filter: "blur(80px)",
          }}
        />

        {/* Available 뱃지 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(0, 100, 255, 0.12)",
            border: "1px solid rgba(0, 100, 255, 0.3)",
            borderRadius: "100px",
            padding: "8px 20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#0064ff",
            }}
          />
          <span style={{ color: "#0064ff", fontSize: "16px", fontWeight: 600 }}>
            Available for New Projects
          </span>
        </div>

        {/* 브랜드 이름 */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          {profile.businessName}
        </div>

        {/* 직함 */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            marginBottom: "48px",
          }}
        >
          {profile.title}
        </div>

        {/* 기술 스택 태그 */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {["Next.js", "TypeScript", "React", "Tailwind CSS"].map((tech) => (
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

        {/* 우측 하단 URL */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "80px",
            color: "rgba(255,255,255,0.25)",
            fontSize: "18px",
          }}
        >
          {profile.siteUrl.replace("https://", "")}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
