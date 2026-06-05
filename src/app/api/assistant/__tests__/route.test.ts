// 포트폴리오 assistant API 계약을 검증한다
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../route";

vi.mock("@/lib/portfolio-assistant", () => ({
  handlePortfolioAssistantMessage: vi.fn(async (message: string) => {
    if (message.includes("날씨")) {
      return {
        answer:
          "포트폴리오에서 확인할 수 없는 내용입니다. 김상찬의 프로젝트, 기술 스택, 협업 범위, 연락 방법에 대해서만 답변할 수 있습니다.",
        refused: true,
        sources: [],
        status: "ok",
      };
    }

    if (message.includes("Synapso.dev")) {
      return {
        answer: "Synapso.dev는 Project Memory SaaS입니다.",
        refused: false,
        sources: ["projects:Synapso.dev"],
        status: "ok",
      };
    }

    return {
      answer: "AI provider를 사용할 수 없습니다.",
      refused: false,
      sources: [],
      status: "provider_unavailable",
    };
  }),
}));

function request(body: unknown) {
  return new Request("http://localhost/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/assistant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("answers-supported-project-question-with-mocked-provider", async () => {
    const response = await POST(request({ message: "Synapso.dev는 어떤 프로젝트야?" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.refused).toBe(false);
    expect(body.answer).toContain("Project Memory");
    expect(body.sources).toContain("projects:Synapso.dev");
  });

  it("refuses-weather-without-provider", async () => {
    const response = await POST(request({ message: "오늘 서울 날씨 알려줘" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.refused).toBe(true);
    expect(body.answer).toContain("포트폴리오에서 확인할 수 없는 내용입니다");
  });

  it("rejects-empty-message", async () => {
    const response = await POST(request({ message: "   " }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ message: "질문을 입력해야 합니다." });
  });

  it("rejects-oversized-message", async () => {
    const response = await POST(request({ message: "a".repeat(1001) }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ message: "질문은 1,000자 이하로 입력해야 합니다." });
  });

  it("returns-503-when-provider-missing-for-allowed-question", async () => {
    const response = await POST(request({ message: "김상찬 포트폴리오에 대해 알려줘" }));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.message).toBe("AI 응답을 생성할 수 없습니다. 잠시 후 다시 시도해 주세요.");
  });
});
