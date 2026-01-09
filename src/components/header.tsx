"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // shadcn utils
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { Github } from "lucide-react"; // npm install lucide-react 필요

const navigation = [
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    // ✨ Glassmorphism 효과 적용
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      {/* 레이아웃 너비와 일치시키는 max-w-3xl */}
      <div className="w-full max-w-3xl mx-auto flex h-14 items-center justify-between px-6 md:px-0">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
              subeom.dev
            </span>
          </Link>

          {/* Desktop Navigation */}
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
                {/* Active Link Underline Animation */}
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

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/parksubeom" 
            target="_blank"
            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}