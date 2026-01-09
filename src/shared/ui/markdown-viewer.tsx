"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none break-keep">
      {/* prose: 타이포그래피 스타일 적용
        dark:prose-invert: 다크모드일 때 글자색 반전 (흰색으로)
        max-w-none: 기본 최대 너비 제한 해제 (꽉 차게)
      */}
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // 링크 클릭 시 새 탭으로 열리게 커스텀
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline" />
          ),
          // 이미지 스타일링
          img: ({ node, ...props }) => (
            <img {...props} className="rounded-lg border border-border shadow-sm" alt={props.alt || ""} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}