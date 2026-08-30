"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    step: "01",
    tool: "CLAUDE.md · knowledge.md · gotchas.md",
    title: "Context Engineering",
    subTitle: "AI 가 빈 손으로 시작하지 않게",
    desc: "프로젝트마다 결정 이유(판례)·함정 기록·도메인 규약을 분리한 markdown 으로 미리 설계합니다. 한 파일에 다 때려박지 않고 layer 를 나눠야, 다음 세션에서 관련 컨텍스트만 정확히 복구돼요.",
  },
  {
    step: "02",
    tool: "Phase Split · Skills",
    title: "Phased Prompting",
    subTitle: "기획 → 인터페이스 → 구현",
    desc: "한 번에 다 시키지 않고 phase 별로 쪼개 지시합니다. 앞 단계 산출물이 다음 프롬프트의 완벽한 컨텍스트가 되도록 설계해 구현 오류를 사전에 차단하고, 반복되는 패턴은 Skills 로 등록해 매번 같은 설명을 하지 않아요.",
  },
  {
    step: "03",
    tool: "런타임 계측 · toDataURL",
    title: "Measure, Don't Infer",
    subTitle: "증상을 묻지 말고 숫자로 답하게",
    desc: "AI 에게 '왜 느리냐'고 되묻는 대신, 의심 구간에 계측을 직접 심어 숫자로 답하게 합니다. 슬라이드 전환 지연을 파던 날엔 그럴듯한 가설 4개를 계측 한 번으로 전부 죽였고, WebGL 이 비면 버퍼를 이미지로 떠서 '안 그려진 것'과 '안 보이는 것'을 갈랐어요. 추론은 빠르지만 틀리고, 측정은 결론을 냅니다.",
  },
  {
    step: "04",
    tool: "Vitest · Mutation A/B",
    title: "Adversarial Verification",
    subTitle: "AI 가 쓴 테스트를 되묻는다",
    desc: "테스트가 초록불이라고 안심하지 않습니다. 일부러 버그를 심어(변이) 그 테스트가 진짜 잡는지 확인해요. 정적 스펙을 통과해버리는 변이를 직접 만들어 '한 층만 있었으면 그대로 새어 나갔을 회귀'를 눈으로 본 뒤로는, 수정 하나에 정적·런타임 2층 스펙을 같은 PR 에 함께 답니다.",
  },
  {
    step: "05",
    tool: "claude-distill · Stop hook",
    title: "Auto Handoff",
    subTitle: "세션 휘발성 무력화",
    desc: "세션 종료 시 4단 게이트(휴리스틱 → Haiku → dedup → 재귀 가드)로 결정·페일·환경 quirk 를 자동 추출해 markdown 에 누적합니다. 다음 세션은 어제 노하우를 시스템 프롬프트로 들고 시작해요. LLM 비용 약 90% 절감.",
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
          를 메인으로 쓰지만, 핵심은 도구가 아니라{" "}
          <span className="text-foreground/90 font-medium">
            AI 의 결과가 스스로 증명하게 만드는 방식
          </span>
          이에요. 컨텍스트를 layer 로 설계해 세션 간에 잇고(claude-distill),
          반복은 Skills 로 줄이고, 지시는 phase 로 쪼갭니다. 그리고 나온 결과는
          계측과 변이 테스트로 되묻습니다. 자유도가 아니라{" "}
          <span className="text-foreground font-semibold">&apos;제약&apos;</span>
          을, 신뢰가 아니라{" "}
          <span className="text-foreground font-semibold">&apos;검증&apos;</span>
          을 설계하는 파이프라인입니다.
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
