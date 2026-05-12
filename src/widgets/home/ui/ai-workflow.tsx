"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    step: "01",
    tool: "CLAUDE.md · knowledge.md · gotchas.md",
    title: "Context Engineering",
    subTitle: "AI 가 빈 손으로 시작하지 않게",
    desc: "프로젝트마다 결정 이유(판례)·함정 기록·도메인 규약을 분리한 markdown 으로 미리 설계합니다. 한 파일에 다 때려박지 않고 layer 를 나눠야 다음 세션에서 관련 컨텍스트만 정확히 복구돼요.",
  },
  {
    step: "02",
    tool: "Claude Code Skills Panel",
    title: "Skill-based Execution",
    subTitle: "반복 작업을 한 클릭으로",
    desc: "자주 쓰는 작업 패턴(코드리뷰·테스트 작성·디자인 토큰 매칭 등)을 슬래시 커맨드/Skills 로 등록해서 매 세션 같은 설명을 반복하지 않습니다. 30개를 넘는 커맨드를 카드 그리드로 시각화하는 게 본업이 된 이유.",
  },
  {
    step: "03",
    tool: "Phase Split",
    title: "Phased Prompting",
    subTitle: "기획 → 인터페이스 → 구현",
    desc: "한 번에 다 시키지 않고 phase 별로 쪼개 지시합니다. 앞 단계 산출물이 다음 프롬프트의 완벽한 컨텍스트가 되도록 설계해 구현 오류를 사전 차단해요.",
  },
  {
    step: "04",
    tool: "claude-distill · Stop hook",
    title: "Auto Handoff",
    subTitle: "세션 휘발성 무력화",
    desc: "세션 종료 시 4단 게이트(휴리스틱 → Haiku → dedup → 재귀 가드)로 결정·페일·환경 quirk 를 자동 추출해 markdown 에 누적. 다음 세션은 어제 노하우를 시스템 프롬프트로 들고 시작합니다. LLM 비용 약 90% 절감.",
  },
];

const PRINCIPLES = [
  {
    title: "컨텍스트가 곧 자산",
    desc: "AI 협업의 진짜 비용은 어제 한 결정을 오늘 다시 설명하는 것. 매 세션 휘발되는 노하우를 자동 누적해 다음 세션의 출발점으로 만듭니다.",
  },
  {
    title: "자유도보다 제약",
    desc: "막연한 자유는 환각의 입구. 엣지 케이스를 사전에 막고 입력을 뾰족하게 다듬어 정해진 레일 위에서 정교하게 움직이게 합니다.",
  },
  {
    title: "비용 모델 없는 협업은 지속 불가",
    desc: "세션마다 LLM 부르면 금세 한 달 $60. 4단 게이트로 본 추출 호출률을 약 10% 수준까지 낮춰 세션 평균 비용을 0 에 가깝게.",
  },
  {
    title: "100% 위임하되 100% 신뢰는 X",
    desc: "AI 산출물도 추론 과정·변경 사항을 먼저 문서화시킵니다. 그 문서가 곧 검수 필터이자, 회귀가 들어와도 즉시 잡히는 안전망.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export function AiWorkflow() {
  return (
    <section className="space-y-14 max-w-5xl mx-auto py-8 px-4 md:px-0">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wider uppercase">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AI-Native Workflow
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          AI 와 경쟁하지 않고,{" "}
          <span className="text-primary">지휘</span>합니다.
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl break-keep">
          <span className="text-foreground/90 font-medium">Claude Max</span>{" "}
          를 메인으로,{" "}
          <span className="text-foreground/90 font-medium">claude-distill</span>{" "}
          로 세션 간 컨텍스트를 관리하고,{" "}
          <span className="text-foreground/90 font-medium">Skills</span> 로
          반복 작업을 한 클릭으로 줄입니다. 자유도가 아니라{" "}
          <span className="text-foreground font-semibold">&apos;제약&apos;</span>
          을 설계하는 파이프라인이에요.
        </p>
      </div>

      {/* Steps — 좌측 라인 타임라인 */}
      <div className="relative border-l border-border ml-3 md:ml-6 space-y-10">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.step}
            {...reveal}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative pl-8 md:pl-12"
          >
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-xs font-mono text-primary tracking-wider">
                {s.step}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {s.subTitle}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-bold tracking-tight mb-2">
              {s.title}
            </h3>

            <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-muted text-xs font-mono text-foreground/70 mb-3">
              {s.tool}
            </div>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed break-keep">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Core Principles */}
      <div className="border-t border-border/60 pt-12 space-y-6">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight">
          Core Principles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={i}
              {...reveal}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-xl border border-border/60 bg-card/30 p-5 md:p-6 flex flex-col gap-2"
            >
              <h4 className="text-base md:text-lg font-bold leading-snug break-keep">
                {p.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed break-keep">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
