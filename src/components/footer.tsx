import { Github, Mail } from "lucide-react"
// import { Linkedin } from "lucide-react" // TODO: 추후 LinkedIn 추가 예정

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} subeom.dev. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/parksubeom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-2"
              aria-label="GitHub 프로필로 이동"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub 프로필로 이동</span>
            </a>
            {/* TODO: 추후 LinkedIn 추가 예정
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            */}
            <a
              href="mailto:contact@example.com"
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

