"use client"

import { useEffect, useState } from "react"
import { cn } from "@/shared/lib/utils"

interface TocItem {
  id: string
  text: string
  level: number
}

interface PostTocProps {
  content: string
  className?: string
}

export function PostToc({ content, className }: PostTocProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  // 헤딩 추출
  useEffect(() => {
    if (typeof window === "undefined") return

    const headings = Array.from(
      document.querySelectorAll("h2, h3")
    ) as HTMLHeadingElement[]

    const items: TocItem[] = headings.map((heading) => ({
      id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
      text: heading.textContent || "",
      level: parseInt(heading.tagName.charAt(1)),
    }))

    setTocItems(items)
  }, [content])

  // Intersection Observer로 현재 섹션 감지
  useEffect(() => {
    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0% -80% 0%",
      }
    )

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => {
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) observer.unobserve(element)
      })
    }
  }, [tocItems])

  if (tocItems.length === 0) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // 헤더 높이 고려
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <nav className={cn("sticky top-20", className)}>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground mb-4">목차</h3>
        <ul className="space-y-1">
          {tocItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToHeading(item.id)}
                className={cn(
                  "text-left text-sm transition-colors hover:text-foreground w-full",
                  item.level === 3 && "pl-4",
                  activeId === item.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

