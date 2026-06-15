// 포트폴리오 AI 정책과 provider 경계 동작을 검증한다
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ENGLISH_PORTFOLIO_REFUSAL,
  KOREAN_PORTFOLIO_REFUSAL,
  buildAssistantPrompt,
  handlePortfolioAssistantMessage,
  shouldRefuseQuestion,
} from "../portfolio-assistant";

const geminiMocks = vi.hoisted(() => ({
  generateContent: vi.fn(),
  GoogleGenAI: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: geminiMocks.GoogleGenAI,
}));

afterEach(() => {
  vi.unstubAllEnvs();
  geminiMocks.GoogleGenAI.mockReset();
  geminiMocks.generateContent.mockReset();
});

describe("portfolio assistant policy", () => {
  it("refuses-weather-before-provider", () => {
    const result = shouldRefuseQuestion("오늘 서울 날씨 알려줘");

    expect(result.refused).toBe(true);
    expect(result.answer).toBe(KOREAN_PORTFOLIO_REFUSAL);
  });

  it("refuses-general-coding-before-provider", async () => {
    const provider = vi.fn();
    const result = await handlePortfolioAssistantMessage("Write me a React hook", provider);

    expect(result.refused).toBe(true);
    expect(result.answer).toBe(ENGLISH_PORTFOLIO_REFUSAL);
    expect(provider).not.toHaveBeenCalled();
  });

  it("allows-known-project-question", () => {
    expect(shouldRefuseQuestion("Synapso.dev는 뭐야?").refused).toBe(false);
  });

  it("uses-fixed-korean-refusal", () => {
    expect(shouldRefuseQuestion("대통령이 누구야?").answer).toBe(KOREAN_PORTFOLIO_REFUSAL);
  });

  it("uses-fixed-english-refusal", () => {
    expect(shouldRefuseQuestion("What is the weather today?").answer).toBe(ENGLISH_PORTFOLIO_REFUSAL);
  });

  it("missing-api-key-provider-unavailable", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    vi.stubEnv("GOOGLE_API_KEY", "");

    const result = await handlePortfolioAssistantMessage("Synapso.dev는 뭐야?");

    expect(result.status).toBe("provider_unavailable");
    expect(result.refused).toBe(false);
  });

  it("uses-google-api-key-env-when-gemini-key-is-absent", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    vi.stubEnv("GOOGLE_API_KEY", "google-api-key-from-env-local");
    geminiMocks.generateContent.mockResolvedValue({ text: "Synapso.dev는 Project Memory SaaS입니다." });
    geminiMocks.GoogleGenAI.mockImplementation(function () {
      return {
      models: {
        generateContent: geminiMocks.generateContent,
      },
      };
    });

    const result = await handlePortfolioAssistantMessage("Synapso.dev는 뭐야?");

    expect(geminiMocks.GoogleGenAI).toHaveBeenCalledWith({ apiKey: "google-api-key-from-env-local" });
    expect(result.status).toBe("ok");
    expect(result.answer).toContain("Project Memory");
  });

  it("prefers-google-api-key-env-over-existing-gemini-key", async () => {
    vi.stubEnv("GEMINI_API_KEY", "ambient-gemini-key");
    vi.stubEnv("GOOGLE_API_KEY", "google-api-key-from-env-local");
    geminiMocks.generateContent.mockResolvedValue({ text: "Synapso.dev는 Project Memory SaaS입니다." });
    geminiMocks.GoogleGenAI.mockImplementation(function () {
      return {
        models: {
          generateContent: geminiMocks.generateContent,
        },
      };
    });

    await handlePortfolioAssistantMessage("Synapso.dev는 뭐야?");

    expect(geminiMocks.GoogleGenAI).toHaveBeenCalledWith({ apiKey: "google-api-key-from-env-local" });
  });

  it("builds-prompt-with-context-and-refusal-policy", () => {
    const prompt = buildAssistantPrompt("Synapso.dev는 뭐야?");

    expect(prompt).toContain("Synapso.dev");
    expect(prompt).toContain(KOREAN_PORTFOLIO_REFUSAL);
    expect(prompt).toContain("포트폴리오");
  });
});
