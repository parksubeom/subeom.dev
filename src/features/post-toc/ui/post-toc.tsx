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

    // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 헤딩을 찾도록 함
    const timeoutId = setTimeout(() => {
      const headings = Array.from(
        document.querySelectorAll("article h2")
      ) as HTMLHeadingElement[]

      const items: TocItem[] = headings.map((heading) => {
        // rehype-slug가 생성한 id를 사용하거나, 없으면 텍스트 기반으로 생성
        let id = heading.id;
        if (!id) {
          const text = heading.textContent || "";
          id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
          heading.id = id;
        }

        return {
          id,
          text: heading.textContent?.replace(/#\s*$/, "").trim() || "",
          level: 2,
        };
      })

      setTocItems(items)
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [content])

  // Intersection Observer로 현재 섹션 감지
  useEffect(() => {
    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 가장 위에 있는 헤딩을 활성화
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // 가장 위에 있는 요소를 찾기 위해 정렬
          const sortedEntries = visibleEntries.sort((a, b) => {
            const aTop = a.boundingClientRect.top;
            const bTop = b.boundingClientRect.top;
            return aTop - bTop;
          });
          setActiveId(sortedEntries[0].target.id);
        }
      },
      {
        rootMargin: "-10% 0% -70% 0%",
        threshold: 0,
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
      const offset = 100 // 헤더 높이 + 여유 공간
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
      
      // URL 해시 업데이트 (선택사항)
      window.history.pushState(null, "", `#${id}`)
    }
  }

  return (
    <nav
      aria-label="게시글 목차"
      className={cn("sticky top-24", className)}
    >
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground mb-4">목차</h3>
        <ul className="space-y-1">
          {tocItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToHeading(item.id)}
                className={cn(
                  "text-left text-sm transition-colors hover:text-foreground w-full py-1 px-2 rounded-md -mx-2",
                  activeId === item.id
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
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

