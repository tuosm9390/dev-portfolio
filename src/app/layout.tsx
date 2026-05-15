import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "chan.works",
  description: "Portfolio baseline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
