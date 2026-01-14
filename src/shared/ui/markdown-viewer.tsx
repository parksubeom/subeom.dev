"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

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
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    );
  }