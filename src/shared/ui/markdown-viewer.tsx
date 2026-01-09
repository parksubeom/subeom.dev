"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
    return (
      <article className="prose prose-neutral dark:prose-invert max-w-none break-keep">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // 1. node 제거: ({ node, ...props }) -> ({ ...props })
            a: ({ ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline" />
            ),
            // 2. node 제거 및 eslint 경고 무시 주석 추가
            img: ({ ...props }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img {...props} className="rounded-lg border border-border shadow-sm" alt={props.alt || ""} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    );
  }