import type { Metadata } from "next";
import { Noto_Sans_KR, Song_Myung } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { profile } from "@/data/profile";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-body-kr",
  display: "swap",
  weight: ["400", "500", "700"],
});

const songMyung = Song_Myung({
  variable: "--font-display-kr",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: "김상찬 | 프론트엔드 개발자 포트폴리오 — chan.works",
    template: "%s | chan.works",
  },
  description:
    "React · TypeScript · Next.js 기반 프론트엔드 개발자 김상찬의 포트폴리오. AI 도구를 활용해 혼자 기획부터 배포까지 6개 프로덕션 서비스를 운영하고 있습니다.",
  keywords: [
    "프론트엔드 개발자",
    "김상찬",
    "chan.works",
    "React 개발자",
    "Next.js 개발자",
    "TypeScript",
    "Tanstack Query",
    "포트폴리오",
    "웹 개발자",
    "AI 개발",
    "Supabase",
    "Firebase",
    "Vercel",
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  publisher: profile.businessName,
  alternates: {
    canonical: profile.siteUrl,
    languages: { "ko-KR": profile.siteUrl },
  },
  openGraph: {
    title: "김상찬 | 프론트엔드 개발자 포트폴리오 — chan.works",
    description:
      "React · TypeScript · Next.js 기반 프론트엔드 개발자 김상찬의 포트폴리오. AI 도구를 활용해 혼자 기획부터 배포까지 6개 프로덕션 서비스를 운영하고 있습니다.",
    type: "website",
    locale: "ko_KR",
    url: profile.siteUrl,
    siteName: "chan.works",
    images: [
      {
        url: `${profile.siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "김상찬 프론트엔드 개발자 포트폴리오 — chan.works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "김상찬 | 프론트엔드 개발자 포트폴리오 — chan.works",
    description:
      "React · TypeScript · Next.js 기반 프론트엔드 개발자. AI 도구 활용해 6개 프로덕션 서비스 독립 운영 중.",
    images: [`${profile.siteUrl}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${songMyung.variable}`}>
      <body className="site-shell antialiased">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
