"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { isValidElement, type ReactNode } from "react";
import { CompressionChart, type ChartSpec } from "@/shared/ui/compression-chart";

// 코드펜스 <code> 자식에서 원문 텍스트(펜스 본문) 추출
function fenceText(child: unknown): string {
  if (!isValidElement(child)) return "";
  const kids = (child.props as { children?: unknown }).children;
  if (typeof kids === "string") return kids;
  if (Array.isArray(kids)) return kids.filter((k) => typeof k === "string").join("");
  return kids == null ? "" : String(kids);
}

// ```<lang> 코드펜스 → 커스텀 컴포넌트 렌더러 (본문 JSON 을 파싱해 주입).
// 파싱 실패/미지원 언어는 null 을 반환해 기본 <pre> 로 폴백.
const FENCE_RENDERERS: Record<string, (body: string) => ReactNode> = {
  "language-compression-chart": (body) => {
    try {
      const parsed = JSON.parse(body);
      const charts: ChartSpec[] = Array.isArray(parsed) ? parsed : parsed?.charts;
      if (!Array.isArray(charts)) return null;
      return <CompressionChart charts={charts} />;
    } catch {
      return null;
    }
  },
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
              const key = Object.keys(FENCE_RENDERERS).find((k) =>
                cls.includes(k),
              );
              if (key) {
                const rendered = FENCE_RENDERERS[key](fenceText(child));
                if (rendered != null) return <>{rendered}</>;
              }
              return <pre {...props}>{children}</pre>;
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    );
  }