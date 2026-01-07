import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

const navigation = [
  { name: "홈", href: "/" },
  { name: "소개", href: "/about" },
  { name: "포트폴리오", href: "/portfolio" },
  { name: "블로그", href: "/blog" },
  { name: "연락", href: "/contact" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">포트폴리오</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side: Theme toggle and Social icons */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

