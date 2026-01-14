import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  // 1️⃣ [필수] 배포 도메인 설정 (이게 있어야 동적 이미지 URL이 완성됩니다)
  metadataBase: new URL('https://subeomdev.vercel.app'),

  title: {
    template: "%s | Subeom.dev",
    default: "Subeom.dev | Frontend Developer",
  },
  description: "비즈니스 임팩트를 고민하는 프론트엔드 개발자 박수범의 포트폴리오입니다.",
  icons: {
    icon: "/icon", // app/icon.tsx가 있다면 자동으로 연결됩니다.
  },
  openGraph: {
    title: "Subeom.dev Portfolio",
    description: "비즈니스 임팩트를 고민하는 프론트엔드 개발자 박수범의 포트폴리오입니다.",
    url: "https://subeomdev.vercel.app",
    siteName: "Subeom.dev",
    locale: "ko_KR",
    type: "website",
    // 2️⃣ [중요] images 속성을 제거했습니다!
    // src/app/opengraph-image.tsx 파일이 존재하면 Next.js가 자동으로 감지해서
    // <meta property="og:image" content="..." /> 태그를 삽입합니다.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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