import type { Metadata, Viewport } from "next";
import { Inter, Noto_Serif_KR } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const pretendard = localFont({
  src: [
    {
      path: "./fonts/PretendardVariable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1A1A1A",
};

export const metadata: Metadata = {
  title: {
    default: "STAYLOG | 감성 숙소 예약",
    template: "%s | STAYLOG",
  },
  description: "국내 감성 숙소를 큐레이션하여 예약할 수 있는 플랫폼. 한옥, 펜션, 부티크 호텔, 게스트하우스까지.",
  keywords: ["숙소 예약", "감성 숙소", "한옥 스테이", "펜션", "부티크 호텔", "국내 여행"],
  authors: [{ name: "STAYLOG" }],
  openGraph: {
    title: "STAYLOG | 감성 숙소 예약",
    description: "국내 감성 숙소를 큐레이션하여 예약할 수 있는 플랫폼",
    type: "website",
    siteName: "STAYLOG",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body
        className={`${pretendard.variable} ${inter.variable} ${notoSerifKR.variable} font-sans antialiased text-text-primary bg-bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
