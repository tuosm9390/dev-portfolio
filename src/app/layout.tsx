import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://your-portfolio-domain.com"),
  title: {
    default: "DevCraft Studio | 프리미엄 풀스택 웹 개발 포트폴리오",
    template: "%s | DevCraft Studio"
  },
  description:
    "Toss 스타일의 정제된 디자인과 고도화된 기술로 비즈니스 가치를 창출하는 프리미엄 풀스택 개발 포트폴리오입니다.",
  keywords: ["웹 개발", "풀스택", "Next.js", "React", "Toss 스타일", " shadcn/ui", "포트폴리오"],
  creator: "DevCraft Studio",
  openGraph: {
    title: "DevCraft Studio | 프리미엄 풀스택 웹 개발 포트폴리오",
    description: "Toss 스타일의 정제된 디자인과 고도화된 기술로 완성하는 비즈니스 솔루션.",
    type: "website",
    locale: "ko_KR",
    siteName: "DevCraft Studio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable}`}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
