"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { Github, Menu } from "lucide-react";

// ✨ FSD 구조에 맞게 경로 수정 (@/components -> @/shared)
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/shared/ui/logo"; // ✨ 아까 만든 로고 컴포넌트 적용

const navigation = [
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-3xl mx-auto flex h-14 items-center justify-between px-6 md:px-0">
        
        {/* 1. Left: Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            {/* ✨ 텍스트 대신 Logo 컴포넌트 사용 */}
            <Logo />
          </Link>

          {/* Desktop Navigation (md 이상에서만 보임) */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    className="absolute -bottom-[19px] left-0 w-full h-[2px] bg-primary"
                    layoutId="navbar-underline"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* 2. Right: Actions & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* GitHub Link */}
          <Link
            href="https://github.com/parksubeom" 
            target="_blank"
            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground hidden sm:block"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </Link>
          
          <ThemeToggle />

          {/* ✨ Mobile Menu Trigger (md 미만에서만 보임) */}
          <div className="md:hidden ml-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader className="text-left border-b pb-4 mb-4">
                  <SheetTitle>
                    {/* 모바일 메뉴 내부에도 로고 적용 */}
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-3">
                  {navigation.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "px-2 py-3 rounded-md text-base font-medium transition-colors hover:bg-accent",
                          pathname === item.href 
                            ? "text-foreground bg-accent/50 font-bold" 
                            : "text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                  
                  {/* 모바일 메뉴 내 GitHub 링크 */}
                  <div className="pt-4 mt-2 border-t">
                    <Link
                      href="https://github.com/parksubeom"
                      target="_blank"
                      className="flex items-center gap-2 px-2 py-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span className="font-medium">GitHub</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}