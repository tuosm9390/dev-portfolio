import { describe, it, expect } from "vitest";
import sitemap from "../sitemap";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

describe("sitemap", () => {
  it("홈 + 7개 프로젝트 총 8개 항목을 반환한다", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(projects.length + 1);
  });

  it("첫 번째 항목은 priority 1의 홈 URL이다", () => {
    const entries = sitemap();
    expect(entries[0].url).toBe(profile.siteUrl);
    expect(entries[0].priority).toBe(1);
  });

  it("각 프로젝트 항목이 올바른 URL을 가진다", () => {
    const entries = sitemap();
    const projectEntries = entries.slice(1);
    projects.forEach((project, index) => {
      expect(projectEntries[index].url).toBe(
        `${profile.siteUrl}/projects/${project.id}`
      );
    });
  });

  it("플레이스홀더 도메인을 포함하지 않는다", () => {
    const entries = sitemap();
    entries.forEach((entry) => {
      expect(entry.url).not.toContain("your-portfolio-domain.com");
    });
  });
});
