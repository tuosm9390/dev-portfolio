import { buildPortfolioSummaryText } from "@/lib/portfolio-context";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildPortfolioSummaryText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
