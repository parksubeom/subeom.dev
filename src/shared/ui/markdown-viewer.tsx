"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { isValidElement } from "react";
import { CompressionChart } from "@/shared/ui/compression-chart";

// ```<lang> 코드펜스 → 커스텀 컴포넌트 매핑 (그 외 코드블록은 기본 렌더 유지)
const FENCE_COMPONENTS: Record<string, () => React.ReactNode> = {
  "language-compression-chart": () => <CompressionChart />,
};

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
    return (
      <article className="prose prose-neutral dark:prose-invert max-w-none break-keep">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "wrap",
                properties: {
                  className: ["anchor-link"],
                },
              },
            ],
          ]}
          components={{
            // 헤딩에 scroll-mt 추가
            h1: ({ id, ...props }) => (
              <h1 id={id} className="scroll-mt-20" {...props} />
            ),
            h2: ({ id, ...props }) => (
              <h2 id={id} className="scroll-mt-20" {...props} />
            ),
            h3: ({ id, ...props }) => (
              <h3 id={id} className="scroll-mt-20" {...props} />
            ),
            h4: ({ id, ...props }) => (
              <h4 id={id} className="scroll-mt-20" {...props} />
            ),
            a: ({ ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline" />
            ),
            img: ({ ...props }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img {...props} className="rounded-lg border border-border shadow-sm" alt={props.alt || ""} />
            ),
            // 특정 언어의 코드펜스를 커스텀 컴포넌트로 치환 (그 외는 기본 <pre>)
            pre: ({ children, node: _node, ...props }) => {
              const child = Array.isArray(children) ? children[0] : children;
              const cls = isValidElement(child)
                ? (child.props as { className?: string }).className ?? ""
                : "";
              const key = Object.keys(FENCE_COMPONENTS).find((k) =>
                cls.includes(k),
              );
              if (key) return <>{FENCE_COMPONENTS[key]()}</>;
              return <pre {...props}>{children}</pre>;
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    );
  }