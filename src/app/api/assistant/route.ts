// 포트폴리오 전용 assistant 채팅 요청을 처리한다
import { NextResponse } from "next/server";
import { z } from "zod";
import { handlePortfolioAssistantMessage } from "@/lib/portfolio-assistant";

const assistantRequestSchema = z.object({
  message: z.string(),
});

function jsonResponse(body: unknown, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = assistantRequestSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse({ message: "질문을 입력해야 합니다." }, 400);
  }

  const message = parsed.data.message.trim();

  if (!message) {
    return jsonResponse({ message: "질문을 입력해야 합니다." }, 400);
  }

  if (message.length > 1_000) {
    return jsonResponse({ message: "질문은 1,000자 이하로 입력해야 합니다." }, 400);
  }

  const result = await handlePortfolioAssistantMessage(message);

  if (result.status === "provider_unavailable") {
    return jsonResponse({ message: "AI 응답을 생성할 수 없습니다. 잠시 후 다시 시도해 주세요." }, 503);
  }

  return jsonResponse({
    answer: result.answer,
    refused: result.refused,
    sources: result.sources,
  });
}
