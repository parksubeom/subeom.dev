import { Github, Mail } from "lucide-react"
import { PROFILE } from "@/shared/config/profile"
import { SITE_NAME } from "@/shared/config/site"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href={PROFILE.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-2"
              aria-label="GitHub 프로필로 이동"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub 프로필로 이동</span>
            </a>
            <a
              href={PROFILE.links.email}
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-2"
              aria-label="이메일 보내기"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">이메일 보내기</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
