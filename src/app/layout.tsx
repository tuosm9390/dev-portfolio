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
    default: "chan.works | 풀스택 웹 개발 포트폴리오",
    template: "%s | chan.works",
  },
  description:
    "화면부터 구조, 배포 이후까지 같이 보는 풀스택 웹 개발자 포트폴리오.",
  keywords: [
    "웹 개발",
    "풀스택 개발자",
    "Next.js",
    "TypeScript",
    "React",
    "포트폴리오",
    "프리랜서 개발자",
    "외주 개발",
    "chan.works",
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
    title: "chan.works | 풀스택 웹 개발 포트폴리오",
    description:
      "화면부터 구조, 배포 이후까지 같이 보는 풀스택 웹 개발자 포트폴리오.",
    type: "website",
    locale: "ko_KR",
    url: profile.siteUrl,
    siteName: "chan.works",
    images: [
      {
        url: `${profile.siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "chan.works | 풀스택 웹 개발 포트폴리오",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "chan.works | 풀스택 웹 개발 포트폴리오",
    description:
      "화면부터 구조, 배포 이후까지 같이 보는 풀스택 웹 개발자 포트폴리오.",
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
