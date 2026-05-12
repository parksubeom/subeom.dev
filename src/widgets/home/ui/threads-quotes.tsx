import { ArrowUpRight, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PROFILE } from "@/shared/config/profile";
import { getThreadsInsights } from "@/entities/threads-insight/api/get-threads-insights";

function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

export function ThreadsQuotes() {
  const insights = getThreadsInsights();
  if (insights.length === 0) return null;

  return (
    <section className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
            From the Threads
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            요즘 생각하고 있는 것들
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            스레드에 풀어둔 글 중에서, 지금의 나를 가장 잘 드러내는 것들만
            골라 옮겨둡니다.
          </p>
        </div>
        <a
          href={PROFILE.links.threads}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md self-start md:self-auto"
        >
          @water_bum_2 <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <ul className="space-y-6">
        {insights.map((item, idx) => (
          <li
            key={idx}
            className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 md:p-8 hover:border-border transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-foreground/80 text-[11px] font-medium tracking-wide">
                #{item.topic}
              </span>
              <span className="text-xs text-muted-foreground tracking-wider">
                {formatDate(item.date)}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-snug mb-3">
              {item.title}
            </h3>

            <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5 break-keep">
              {item.lead}
            </p>

            <div
              className="prose prose-sm md:prose-base dark:prose-invert max-w-none
                         text-muted-foreground leading-relaxed break-keep
                         prose-p:my-3 prose-blockquote:my-3
                         prose-blockquote:border-l-2 prose-blockquote:border-primary/40
                         prose-blockquote:pl-4 prose-blockquote:italic
                         prose-blockquote:text-foreground/70
                         prose-strong:text-foreground/90
                         prose-ol:my-3 prose-ul:my-3 prose-li:my-1"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.body}
              </ReactMarkdown>
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                @water_bum_2 · Threads
              </span>
              <a
                href={item.threadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              >
                Read on Threads
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
