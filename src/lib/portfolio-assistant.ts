// 포트폴리오 전용 AI 응답 정책과 Gemini 호출 경계를 관리한다
import { GoogleGenAI } from "@google/genai";
import { buildAssistantContext } from "@/lib/portfolio-context";

export const KOREAN_PORTFOLIO_REFUSAL =
  "포트폴리오에서 확인할 수 없는 내용입니다. 김상찬의 프로젝트, 기술 스택, 협업 범위, 연락 방법에 대해서만 답변할 수 있습니다.";

export const ENGLISH_PORTFOLIO_REFUSAL =
  "I cannot confirm that from the portfolio. I can only answer questions about Kim Sangchan's projects, tech stack, collaboration scope, and contact options.";

export type AssistantResult = {
  answer: string;
  refused: boolean;
  sources: string[];
  status: "ok" | "provider_unavailable";
};

export type AssistantProvider = (prompt: string) => Promise<string | null>;

const allowedTerms = [
  "김상찬",
  "sangchan",
  "kim sangchan",
  "chanworks",
  "chan.works",
  "portfolio",
  "포트폴리오",
  "project",
  "프로젝트",
  "synapso",
  "ai doc agent",
  "youtube",
  "notebooklm",
  "minions",
  "persona",
  "threads",
  "기술",
  "스택",
  "협업",
  "연락",
  "contact",
  "github",
  "linkedin",
  "frontend",
  "프론트엔드",
  "개발자",
  "경력",
  "available",
  "availability",
];

const refusedTerms = [
  "날씨",
  "weather",
  "대통령",
  "president",
  "react hook",
  "훅",
  "집 주소",
  "address",
  "정치",
  "politics",
];

function isEnglishQuestion(message: string) {
  const latinLetters = message.match(/[a-zA-Z]/g)?.length ?? 0;
  const koreanLetters = message.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g)?.length ?? 0;
  return latinLetters > koreanLetters;
}

function localizedRefusal(message: string) {
  return isEnglishQuestion(message) ? ENGLISH_PORTFOLIO_REFUSAL : KOREAN_PORTFOLIO_REFUSAL;
}

export function shouldRefuseQuestion(message: string) {
  const normalized = message.toLowerCase();
  const hasRefusedTerm = refusedTerms.some((term) => normalized.includes(term));
  const hasAllowedTerm = allowedTerms.some((term) => normalized.includes(term));
  const refused = hasRefusedTerm || !hasAllowedTerm;

  return {
    refused,
    answer: refused ? localizedRefusal(message) : "",
  };
}

export function buildAssistantPrompt(message: string) {
  return [
    "너는 김상찬의 포트폴리오 전용 assistant다.",
    "아래 컨텍스트에 명시된 내용만 답변한다.",
    "컨텍스트에서 확인할 수 없는 내용은 반드시 고정 거절 문구로 답변한다.",
    `한국어 거절 문구: ${KOREAN_PORTFOLIO_REFUSAL}`,
    `영어 거절 문구: ${ENGLISH_PORTFOLIO_REFUSAL}`,
    "전화번호는 절대 답변하지 않는다.",
    "",
    buildAssistantContext(),
    "",
    `사용자 질문: ${message}`,
  ].join("\n");
}

async function callGemini(prompt: string) {
  const apiKey =
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });

  return response.text?.trim() || null;
}

function sourcesFor(message: string) {
  const normalized = message.toLowerCase();
  const sources = ["profile", "llms.txt"];

  if (normalized.includes("synapso")) sources.push("projects:Synapso.dev");
  if (normalized.includes("ai doc agent")) sources.push("projects:ai-doc-agent");
  if (normalized.includes("연락") || normalized.includes("contact")) sources.push("profile.contact");

  return sources;
}

function isUngroundedAnswer(answer: string) {
  return answer.includes("010-9121-8397") || answer.includes("집 주소");
}

export async function handlePortfolioAssistantMessage(
  message: string,
  provider: AssistantProvider = callGemini,
): Promise<AssistantResult> {
  const gate = shouldRefuseQuestion(message);
  if (gate.refused) {
    return {
      answer: gate.answer,
      refused: true,
      sources: [],
      status: "ok",
    };
  }

  const prompt = buildAssistantPrompt(message);
  const generated = await provider(prompt).catch(() => null);

  if (!generated) {
    return {
      answer: "AI 응답을 생성할 수 없습니다. 잠시 후 다시 시도해 주세요.",
      refused: false,
      sources: [],
      status: "provider_unavailable",
    };
  }

  if (isUngroundedAnswer(generated)) {
    return {
      answer: localizedRefusal(message),
      refused: true,
      sources: [],
      status: "ok",
    };
  }

  return {
    answer: generated,
    refused: false,
    sources: sourcesFor(message),
    status: "ok",
  };
}
