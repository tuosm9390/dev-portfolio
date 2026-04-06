import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { profile } from "@/data/profile";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: "DevCraft Studio | 프리미엄 풀스택 웹 개발 포트폴리오",
    template: "%s | DevCraft Studio",
  },
  description:
    "5년 이상의 경험을 가진 풀스택 웹 개발자. Next.js, TypeScript, React로 비즈니스 가치를 창출하는 프리미엄 개발 포트폴리오.",
  keywords: [
    "웹 개발",
    "풀스택 개발자",
    "Next.js",
    "TypeScript",
    "React",
    "포트폴리오",
    "프리랜서 개발자",
    "외주 개발",
    "DevCraft Studio",
    "Supabase",
    "Tailwind CSS",
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.businessName,
  publisher: profile.businessName,
  alternates: {
    canonical: profile.siteUrl,
    languages: { "ko-KR": profile.siteUrl },
  },
  openGraph: {
    title: "DevCraft Studio | 프리미엄 풀스택 웹 개발 포트폴리오",
    description:
      "5년 이상의 경험을 가진 풀스택 웹 개발자. Next.js, TypeScript로 비즈니스 솔루션을 완성합니다.",
    type: "website",
    locale: "ko_KR",
    url: profile.siteUrl,
    siteName: "DevCraft Studio",
    images: [
      {
        url: `${profile.siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "DevCraft Studio | 풀스택 웹 개발 포트폴리오",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevCraft Studio | 프리미엄 풀스택 웹 개발 포트폴리오",
    description:
      "5년 이상의 경험을 가진 풀스택 웹 개발자. Next.js, TypeScript로 비즈니스 솔루션을 완성합니다.",
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
    <html lang="ko" className={`${inter.variable}`}>
      <head>
        {/* Pretendard is excellent for Korean SF Pro-like feel */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="antialiased">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
