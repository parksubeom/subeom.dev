"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
import { LIVE_STATS } from "@/shared/config/stats";

const fmt = (n: number) => n.toLocaleString("en-US");

// 시그니처 정체성 — "어떤 사람이 무엇을 만드나"
const LENSES = [
  {
    title: "AI 도구로 페인 포인트를 풉니다.",
    body: `Claude Code Skills Panel — Open VSX ${fmt(
      LIVE_STATS.openVsxDownloads,
    )} 다운로드 · 평점 5.0. claude-distill — npm weekly ${fmt(
      LIVE_STATS.npmWeeklyDownloads,
    )}. 본인이 답답해하던 문제로 시작해서 LLM 비용을 4단 게이트로 약 90% 절감하는 모델까지 직접 설계합니다.`,
  },
  {
    title: "구조와 의미를 먼저 봅니다.",
    body:
      "MAU 480만 서비스(CJ CGV 등)의 접근성 진단·개선을 컨설턴트로 수행했어요. SEO 와 접근성이 결국 같은 구조를 본다는 걸 프론트엔드 합류 전부터 알고 있었고, vercel.app 권한 0 에서 이름 검색 1위로 증명한 적 있습니다.",
  },
  {
    title: '"대충 비슷한 답" 이 안 통하는 곳에서 일합니다.',
    body:
      "에듀테크 콘텐츠 뷰어/리포트 도메인에서 SSOT 정착 · FSD 레이어 위반 자체 발견·교정 · 6개월 누적 latent bug 동시 해소. 숫자 하나·좌표 한 칸 차이가 사용자 경험을 바꾸는 정밀 도메인입니다.",
  },
];

// 자기 주장 — 사고 방식
const BELIEFS = [
  "기능보다 메트릭의 정의가 먼저예요.",
  "허허벌판과 미로 — 같은 도구도 환경에 따라 정반대로 씁니다.",
  "SEO 와 접근성은 결국 같은 구조를 봅니다.",
  "비용 모델 없는 LLM 협업은 지속 불가능합니다.",
];

// 경력 데이터 (최신순)
const experiences = [
  {
    id: 0,
    company: "(주)코드넛",
    role: "Frontend Developer · 에듀테크 콘텐츠 뷰어/리포트 도메인",
    period: "2026.03 - 현재",
    description:
      "정밀성이 요구되는 에듀테크 콘텐츠 뷰어/리포트 도메인에서 Vue 3 + FSD 아키텍처 기반 신규 기능 5건 · V2 리디자인 5건 출시. SSOT 정착·FSD 정합·latent bug 해소를 동시에 수행.",
    achievements: [
      "학생 풀이 재생 인프라 양방향 최적화 — forward 는 teardown 생략 + delta 적용, backward 는 history undo 역적용으로 슬라이더 seek 시 DOM 전체 재구성 비용 제거",
      "리포트 도메인 단일 진실 출처(SSOT) 정착 — 정답률·아이콘 맵·시간 포맷·결과 빌더를 entities/report/lib 로 통합, FSD 레이어 순환 위험 자체 발견·교정",
      "6개월 누적 latent bug 동시 해소 — 뷰어 진입 응답 shape 불일치, 채점 결과 직렬화 누락, 요약·상세 정답률 어긋남",
      "Figma 디자인 시스템 정합화 다수 — 리포트 목록·진행률 3-state 프로그래스바·빈 상태 variant·정답 확인 버튼 통일",
    ],
  },
  {
    id: 1,
    company: "(주)에스앤씨랩",
    role: "웹 접근성 컨설팅 및 개선 개발",
    period: "2024.07 - 2026.03",
    description:
      "MAU 480만 대규모 서비스(CJ CGV 등)의 접근성 진단·개선 프로젝트 수행. 컨설턴트 시점에서 구조와 의미를 먼저 보는 사고를 익혔어요.",
    achievements: [
      "개발자 친화적 가이드라인 배포로 소통 비용 절감",
      "재작업률 30% 감소 및 1차 검수 All Pass 달성",
      "스크린 리더 사용성을 고려한 마크업 개선으로 법적 리스크 해소",
    ],
  },
  {
    id: 2,
    company: "널리소프트 (SSEM)",
    role: "Frontend Developer",
    period: "2024.03 - 2024.07",
    description: "SSEM 홈페이지 전면 리뉴얼 및 사내 운영 백오피스 개발.",
    achievements: [
      "레거시 스타일 청산 및 반응형 웹 구축으로 UX 개선",
      "배포 프로세스 자동화로 3일 소요 작업을 즉시(0분)로 단축",
      "자체 프레임워크 리팩토링 및 라이브러리화",
    ],
  },
  {
    id: 3,
    company: "모아프렌즈",
    role: "ICT 인턴",
    period: "2022.07 - 2023.01",
    description: "데이터 관제 대시보드 개발 및 레거시 마이그레이션.",
    achievements: [
      "데이터 집계 시간 일 1시간 → 실시간(0분) 단축",
      "PHP 레거시 시스템을 React/JWT 기반으로 마이그레이션",
    ],
  },
];

const education = [
  {
    school: "항해 플러스",
    degree: "프론트엔드 제7기 심화 과정",
    period: "2025.10 - 2026.01",
    note: "Best Practice 5회 선정, 팀장 수료",
  },
  {
    school: "코드스테이츠",
    degree: "프론트엔드 엔지니어링 부트캠프",
    period: "2022.12 - 2023.06",
    note: "기수 1위 수료",
  },
  {
    school: "전남대학교",
    degree: "멀티미디어 전공",
    period: "2015.03 - 2024.08",
    note: "졸업",
  },
];

export function AboutPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
          <div className="space-y-2">
            <p className="text-xl font-medium text-muted-foreground">
              Frontend Developer,{" "}
              <span className="text-foreground font-semibold">박수범</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Seoul · Available for work · 매주 스레드에 인사이트 발행
            </p>
          </div>
        </motion.div>

        {/* Intro Hook — 시그니처 한 단락 */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pl-6 border-l-4 border-primary/40 text-base md:text-lg text-foreground/90 leading-[1.85] py-2 break-keep"
        >
          제가 답답해하던 문제가 곧 다음 도구의 개발 동기가 됩니다.
          <br className="hidden sm:inline" /> 슬래시 커맨드 30개를 외우다
          Claude Code Skills Panel 을, Claude 가 어제 배운 걸 까먹어서
          claude-distill 을 만들었어요.
          <br className="hidden sm:inline" /> 제가 만든 npm 패키지가 모르는
          사람들에게 닿는 사이클을 좋아합니다.
        </motion.blockquote>
      </section>

      {/* What I Build For — 3 lenses */}
      <section className="space-y-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold tracking-tight"
        >
          What I Build For
        </motion.h2>

        <div className="grid gap-4 md:grid-cols-3">
          {LENSES.map((lens, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border/60 bg-card/30 p-5 md:p-6 flex flex-col gap-3"
            >
              <div className="text-xs font-mono text-primary tracking-wider">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-base md:text-lg font-bold leading-snug break-keep">
                {lens.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed break-keep">
                {lens.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Beliefs — 짧은 자기 주장 */}
      <section className="space-y-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold tracking-tight"
        >
          자주 하는 생각
        </motion.h2>

        <ul className="grid gap-3 md:grid-cols-2">
          {BELIEFS.map((b, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border/50 bg-card/30 px-4 py-3 text-sm md:text-base text-foreground/85 leading-relaxed break-keep flex items-start gap-3"
            >
              <span
                className="text-primary mt-0.5 shrink-0 font-bold"
                aria-hidden="true"
              >
                —
              </span>
              <span>{b}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Experience Timeline */}
      <section className="space-y-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-2xl font-bold tracking-tight flex items-center gap-2"
        >
          <Briefcase className="w-6 h-6 text-primary" aria-hidden="true" />
          Experience
        </motion.h2>

        <div className="relative border-l border-border/50 ml-3 md:ml-6 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                <h3 className="text-xl font-bold">{exp.company}</h3>
                <span className="text-sm font-mono text-muted-foreground">
                  {exp.period}
                </span>
              </div>
              <div className="text-base font-medium text-primary mb-3">
                {exp.role}
              </div>
              <p className="text-muted-foreground mb-4 break-keep">
                {exp.description}
              </p>

              <ul className="space-y-2">
                {exp.achievements.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                    <span className="break-keep">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-2xl font-bold tracking-tight flex items-center gap-2"
        >
          <GraduationCap className="w-6 h-6 text-primary" aria-hidden="true" />
          Education
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/30 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">{edu.school}</CardTitle>
                  <CardDescription>{edu.period}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {edu.note}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
