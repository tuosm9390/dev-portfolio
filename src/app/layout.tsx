import type { Metadata } from "next";
import { Hahmlet } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { profile } from "@/data/profile";

const hahmlet = Hahmlet({
  subsets: ["latin"],
  variable: "--font-hahmlet",
  display: "swap",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: "DevCraft Studio | 몰입형 풀스택 웹 개발 포트폴리오",
    template: "%s | DevCraft Studio",
  },
  description:
    "깊게 파고드는 방식으로 제품을 완성하는 풀스택 웹 개발자 포트폴리오. Next.js, TypeScript, React로 구조와 결과를 함께 만듭니다.",
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
    title: "DevCraft Studio | 몰입형 풀스택 웹 개발 포트폴리오",
    description:
      "깊게 파고드는 방식으로 제품을 완성하는 풀스택 웹 개발자 포트폴리오.",
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
    title: "DevCraft Studio | 몰입형 풀스택 웹 개발 포트폴리오",
    description:
      "깊게 파고드는 방식으로 제품을 완성하는 풀스택 웹 개발자 포트폴리오.",
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
    <html lang="ko" className={hahmlet.variable}>
      <body className="site-shell antialiased">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
