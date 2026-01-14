import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// ✨ FSD 구조에 맞게 경로 수정 (Header는 widgets로 이동했으므로 변경)
import { Header } from "@/components/header";
// Footer와 ThemeProvider는 기존 경로 유지
import { Footer } from "@/components/footer"; 
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // 폰트 로딩 중 텍스트 표시 유지
  preload: true, // 폰트 우선 로딩
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s | Subeom.dev", // ✨ 브랜딩: 사이트 이름 변경
    default: "Subeom.dev | Frontend Developer",
  },
  // ✅ 기존 설명 문구 유지
  description: "비즈니스 임팩트를 고민하는 프론트엔드 개발자 박수범의 포트폴리오입니다.",
  icons: {
    icon: "/icon", // ✨ 동적 파비콘 연결 (app/icon.tsx)
  },
  openGraph: {
    title: "Subeom.dev Portfolio",
    description: "비즈니스 임팩트를 고민하는 프론트엔드 개발자 박수범의 포트폴리오입니다.",
    url: "https://subeom.dev",
    siteName: "Subeom.dev",
    locale: "ko_KR",
    type: "website",
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
            {/* 상단 헤더 (widgets 경로) */}
            <Header />
            
            {/* 메인 컨텐츠 영역 (중앙 정렬 & 최대 너비 제한) */}
            <main className="flex-1 w-full max-w-3xl mx-auto px-6 md:px-0 py-12 selection:bg-primary/20">
              {children}
            </main>
            
            {/* 하단 푸터 */}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}