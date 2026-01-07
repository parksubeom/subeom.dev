"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const codeString = String(children).replace(/\n$/, "")
  const language = className?.replace(/language-/, "") || "text"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-t-lg border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="코드 복사"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span>복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>복사</span>
            </>
          )}
        </button>
      </div>
      <pre
        className={cn(
          "overflow-x-auto rounded-b-lg bg-muted p-4 text-sm leading-relaxed",
          className
        )}
        {...props}
      >
        <code className="text-foreground">{children}</code>
      </pre>
    </div>
  )
}

