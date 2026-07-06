"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Pin } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { PROFILE } from "@/shared/config/profile";
import { LIVE_STATS } from "@/shared/config/stats";
import { NOW_BUILDING } from "@/shared/config/now-building";

const fmt = (n: number) => n.toLocaleString("en-US");

const STATS: { label: string; value: string; caption: string }[] = [
  {
    label: "Open VSX",
    value: fmt(LIVE_STATS.openVsxDownloads),
    caption: "Claude Code Skills Panel · downloads",
  },
  {
    label: "npm weekly",
    value: fmt(LIVE_STATS.npmWeeklyDownloads),
    caption: "claude-distill · bumpist-code · 지난 7일",
  },
];

function BackgroundEffect() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse delay-1000" />

      <div
        className="absolute inset-0 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28">
      <BackgroundEffect />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-14">
          {/* Headline + sub + author */}
          <motion.div
            {...reveal}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2]">
              <span className="block">
                집에선 <span className="text-primary">출력</span>을,
              </span>
              <span className="block">
                회사에선 <span className="text-primary">정확도</span>를
                연마합니다.
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground/90 font-medium">
              혼자선 빠르게, 함께선 신중하게.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground/70 tracking-wide">
              ─ 프론트엔드 개발자 박수범
            </p>
          </motion.div>

          {/* Body — 2 단락 */}
          <motion.div
            {...reveal}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 text-left md:text-center max-w-2xl"
          >
            <p className="text-base md:text-lg text-foreground/85 leading-[1.8] break-keep">
              사이드프로젝트로 만든{" "}
              <span className="text-foreground font-medium">AI 도구</span>가
              실사용자에게 닿고, 그 경험을 다시 팀 워크플로우에 가져옵니다.
            </p>
            <p className="text-base md:text-lg text-foreground/85 leading-[1.8] break-keep">
              웹접근성 컨설턴트로 시작해서,{" "}
              <span className="text-foreground font-medium">
                구조와 의미를 먼저 보는 사고
              </span>
              가 기본기예요.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...reveal}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full space-y-2"
          >
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-xl mx-auto">
              {STATS.map((s) => (
                <li
                  key={s.label}
                  className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm px-5 py-4 text-left"
                >
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    {s.label}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold tracking-tight mt-0.5">
                    {s.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground/80 mt-1 leading-snug">
                    {s.caption}
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-muted-foreground/60 text-center pt-1">
              Live · 매일 09:00 KST 자동 갱신 · last sync{" "}
              {new Date(LIVE_STATS.lastUpdated).toLocaleDateString("ko-KR")}
            </p>
          </motion.div>

          {/* Now Building */}
          {NOW_BUILDING.items.length > 0 && (
            <motion.div
              {...reveal}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-xl"
            >
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] dark:bg-amber-500/[0.06] px-5 py-4 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Pin
                    className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400"
                    aria-hidden="true"
                  />
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-300">
                    Now Building
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {NOW_BUILDING.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm md:text-[15px] text-foreground/85 leading-relaxed break-keep flex flex-col sm:flex-row sm:items-baseline sm:gap-3"
                    >
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium shrink-0 min-w-[60px]">
                        {item.label}
                      </span>
                      <span>{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            {...reveal}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center"
          >
            <Button
              size="lg"
              className="gap-2 h-11 px-8 text-base rounded-full"
              asChild
            >
              <Link href="/portfolio">
                View Projects <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="gap-2 h-11 px-6 text-base rounded-full text-muted-foreground hover:text-foreground"
              asChild
            >
              <a
                href={PROFILE.links.threads}
                target="_blank"
                rel="noopener noreferrer"
              >
                @water_bum_2 on Threads
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
