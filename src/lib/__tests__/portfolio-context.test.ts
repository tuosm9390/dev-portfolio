// 포트폴리오 AI 컨텍스트 생성 규칙을 검증한다
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { GET } from "@/app/llms.txt/route";
import {
  buildAssistantContext,
  buildPortfolioSummaryText,
} from "../portfolio-context";

describe("portfolio context", () => {
  it("includes-core-portfolio-facts", () => {
    const context = buildAssistantContext();

    expect(context).toContain("김상찬");
    expect(context).toContain("chan.works");
    expect(context).toContain("Synapso.dev");
    expect(context).toContain("AI Doc Agent");
    expect(context).toContain(profile.contact.email);
    expect(context).toContain("포트폴리오에서 확인할 수 없는 내용");
  });

  it("excludes-phone-number-from-assistant-context", () => {
    expect(buildAssistantContext()).not.toContain(profile.contact.phone);
  });

  it("caps-context-length", () => {
    expect(buildAssistantContext().length).toBeLessThanOrEqual(18_200);
  });

  it("llms-route-uses-shared-summary", async () => {
    const response = GET();
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(body).toBe(buildPortfolioSummaryText());
  });
});
