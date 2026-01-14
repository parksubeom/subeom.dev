import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import localFont from "next/font/local";
import "./globals.css";

// ✨ FSD 구조에 맞게 경로 수정
import { Header } from "@/components/header";
import { Footer } from "@/components/footer"; 
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  // 1️⃣ [필수] OG 이미지 생성을 위한 기준 도메인 설정
  metadataBase: new URL('https://subeomdev.vercel.app'),

  title: {
    template: "%s | Subeom.dev",
    default: "Subeom.dev | Frontend Developer",
  },
  description: "비즈니스 임팩트를 고민하는 프론트엔드 개발자 박수범의 포트폴리오입니다.",
  icons: {
    icon: "/icon", // 동적 파비콘 연결
  },
  openGraph: {
    title: "Subeom.dev Portfolio",
    description: "비즈니스 임팩트를 고민하는 프론트엔드 개발자 박수범의 포트폴리오입니다.",
    // 2️⃣ [수정] 실제 배포 주소로 변경
    url: "https://subeomdev.vercel.app",
    siteName: "Subeom.dev",
    locale: "ko_KR",
    type: "website",
    // images: [] -> 제거함 (src/app/opengraph-image.tsx 자동 감지)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col relative">
            {/* 상단 헤더 */}
            <Header />
            
            {/* 메인 컨텐츠 영역 */}
            <main className="flex-1 w-full max-w-3xl mx-auto px-6 md:px-0 py-12 selection:bg-primary/20">
              {children}
            </main>
            
            {/* 하단 푸터 */}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
      
      {/* 3️⃣ Google Analytics 연결 (환경변수 설정 필수) */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}