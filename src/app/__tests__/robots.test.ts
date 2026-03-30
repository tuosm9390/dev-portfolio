import { describe, it, expect } from "vitest";
import robots from "../robots";
import { profile } from "@/data/profile";

describe("robots", () => {
  it("실제 도메인으로 sitemap URL을 반환한다", () => {
    const result = robots();
    expect(result.sitemap).toBe(`${profile.siteUrl}/sitemap.xml`);
  });

  it("플레이스홀더 도메인을 포함하지 않는다", () => {
    const result = robots();
    expect(JSON.stringify(result)).not.toContain("your-portfolio-domain.com");
  });

  it("모든 경로에 크롤링을 허용한다", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.allow).toBe("/");
  });
});
