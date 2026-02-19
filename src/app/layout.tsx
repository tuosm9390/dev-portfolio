import type { Metadata } from "next";
import { Outfit, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DevCraft Studio | 풀스택 웹 개발 전문",
  description:
    "아이디어를 현실로, 코드로 가치를 만듭니다. 기획부터 디자인, 개발, 배포까지 원스톱 웹 개발 서비스를 제공합니다.",
  keywords: ["웹 개발", "풀스택", "Next.js", "React", "프리랜서", "개발 외주"],
  openGraph: {
    title: "DevCraft Studio | 풀스택 웹 개발 전문",
    description:
      "아이디어를 현실로, 코드로 가치를 만듭니다. 기획부터 디자인, 개발, 배포까지 원스톱 웹 개발 서비스.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} ${notoSansKR.variable}`}>
      <body>{children}</body>
    </html>
  );
}
