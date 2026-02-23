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
  metadataBase: new URL("https://your-portfolio-domain.com"),
  title: {
    default: "DevCraft Studio | 프리미엄 풀스택 웹 개발 포트폴리오",
    template: "%s | DevCraft Studio"
  },
  description:
    "프리미엄 프론트엔드 디자인과 고도화된 백엔드 아키텍처를 결합한 풀스택 웹 개발 서비스입니다. 퀄리티 높은 기술로 비즈니스 가치를 창출합니다.",
  keywords: ["최상위 웹 개발", "풀스택", "Next.js", "React", "프론트엔드 포트폴리오", "엔터프라이즈 아키텍처", "프리랜서"],
  creator: "DevCraft Studio",
  openGraph: {
    title: "DevCraft Studio | 프리미엄 풀스택 웹 개발 포트폴리오",
    description:
      "프리미엄 프론트엔드 디자인과 고도화된 백엔드 아키텍처를 결합한 풀스택 웹 개발 서비스입니다. 퀄리티 높은 기술로 비즈니스 가치를 창출합니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "DevCraft Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevCraft Studio | 프리미엄 풀스택 웹 개발 포트폴리오",
    description: "프리미엄 프론트엔드 디자인과 고도화된 백엔드 코드로 완성하는 비즈니스 솔루션.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
