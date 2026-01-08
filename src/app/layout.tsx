import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// 폴더 구조에 따라 경로 확인 (현재 components 폴더 사용 중)
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | 박수범",
    default: "박수범 | Frontend Developer",
  },
  description: "비즈니스 임팩트를 고민하는 프론트엔드 개발자 박수범의 포트폴리오입니다.",
  icons: {
    icon: "/favicon.ico",
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
            <Header />
            
            {/* ✨ 레이아웃 변경: max-w-3xl로 밀도감 있는 중앙 정렬 */}
            <main className="flex-1 w-full max-w-3xl mx-auto px-6 md:px-0 py-12 selection:bg-primary/20">
              {children}
            </main>
            
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}