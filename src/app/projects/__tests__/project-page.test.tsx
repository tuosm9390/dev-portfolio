import { describe, it, expect, vi } from "vitest";
import { notFound } from "next/navigation";
import { generateStaticParams, generateMetadata } from "../[id]/page";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("react-markdown", () => ({
  default: ({ children }: { children: string }) => <div>{children}</div>,
}));

vi.mock("remark-gfm", () => ({
  default: vi.fn(),
}));

describe("generateStaticParams", () => {
  it("모든 프로젝트 ID를 반환한다", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(projects.length);
    projects.forEach((project) => {
      expect(params).toContainEqual({ id: project.id });
    });
  });
});

describe("generateMetadata", () => {
  it("유효한 프로젝트 ID로 메타데이터를 반환한다", async () => {
    const project = projects[0];
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: project.id }),
    });
    expect(metadata.title).toBe(project.title);
    expect(metadata.description).toBe(project.summary);
  });

  it("유효하지 않은 ID에서 빈 메타데이터를 반환한다", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "nonexistent-id" }),
    });
    expect(metadata).toEqual({});
  });

  it("OG 이미지 URL에 실제 도메인이 포함된다", async () => {
    const project = projects[0];
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: project.id }),
    });
    const ogImages = metadata.openGraph?.images as { url: string }[];
    expect(ogImages?.[0]?.url).toContain(profile.siteUrl);
    expect(ogImages?.[0]?.url).not.toContain("your-portfolio-domain.com");
  });
});

describe("notFound 동작", () => {
  it("존재하지 않는 ID 접근 시 notFound를 호출한다", async () => {
    const { default: ProjectPage } = await import("../[id]/page");
    await ProjectPage({ params: Promise.resolve({ id: "invalid-id" }) });
    expect(notFound).toHaveBeenCalled();
  });
});
