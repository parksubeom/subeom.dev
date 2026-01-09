"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

// 경력 데이터
const experiences = [
  {
    id: 1,
    company: "(주)에스앤씨랩",
    role: "웹 접근성 컨설팅 및 개선 개발",
    period: "2024.07 - ", // 정확한 기간은 이력서 참조하여 수정 필요
    description: "MAU 480만 대규모 서비스(CJ CGV 등)의 접근성 진단 및 개선 프로젝트 수행",
    achievements: [
      "개발자 친화적 가이드라인 배포로 소통 비용 절감",
      "재작업률 30% 감소 및 1차 검수 All Pass 달성",
      "스크린 리더 사용성을 고려한 마크업 개선으로 법적 리스크 해소"
    ]
  },
  {
    id: 2,
    company: "널리소프트 (SSEM)",
    role: "Frontend Developer",
    period: "2024.03 - 2024.07",
    description: "SSEM 홈페이지 전면 리뉴얼 및 사내 운영 백오피스 개발",
    achievements: [
      "레거시 스타일 청산 및 반응형 웹 구축으로 UX 개선",
      "배포 프로세스 자동화로 3일 소요 작업을 즉시(0분)로 단축",
      "자체 프레임워크 리팩토링 및 라이브러리화"
    ]
  },
  {
    id: 3,
    company: "모아프렌즈",
    role: "ICT 인턴",
    period: "2022.07 - 2023.01",
    description: "데이터 관제 대시보드 개발 및 레거시 마이그레이션",
    achievements: [
      "데이터 집계 시간 일 1시간 → 실시간(0분) 단축",
      "PHP 레거시 시스템을 React/JWT 기반으로 마이그레이션"
    ]
  }
];

const education = [
  {
    school: "항해 플러스",
    degree: "프론트엔드 제7기 심화 과정",
    period: "2025.10 - 2026.01",
    note: "Best Practice 5회 선정, 팀장 수료"
  },
  {
    school: "코드스테이츠",
    degree: "프론트엔드 엔지니어링 부트캠프",
    period: "2022.12 - 2023.06",
    note: "기수 1위 수료"
  },
  {
    school: "전남대학교",
    degree: "멀티미디어 전공",
    period: "2015.03 - 2024.08",
    note: "졸업"
  }
];

export function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-muted-foreground">
              Frontend Developer, <span className="text-foreground font-semibold">박수범</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Seoul, Korea • Available for work
            </p>
          </div>
        </motion.div>

        {/* Intro Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pl-6 border-l-4 border-primary/30 italic text-lg text-muted-foreground leading-relaxed py-2 bg-muted/20 rounded-r-lg"
        >
          "단순한 기능 구현을 넘어 '왜(Why)'를 끊임없이 질문하며, 서비스 자체에 대한 오너십을 가지고 제품을 만듭니다. 
          웹 접근성 컨설팅 경험을 바탕으로 포용적인 인터페이스와 견고한 코드를 지향합니다."
        </motion.blockquote>
      </section>

      {/* Experience Timeline */}
      <section className="space-y-8">
        <motion.h3 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-2xl font-bold flex items-center gap-2"
        >
          <Briefcase className="w-6 h-6 text-primary" />
          Experience
        </motion.h3>

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
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
              
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                <h4 className="text-xl font-bold">{exp.company}</h4>
                <span className="text-sm font-mono text-muted-foreground">{exp.period}</span>
              </div>
              <div className="text-base font-medium text-primary mb-3">{exp.role}</div>
              <p className="text-muted-foreground mb-4">{exp.description}</p>
              
              <ul className="space-y-2">
                {exp.achievements.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
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
        <motion.h3 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-2xl font-bold flex items-center gap-2"
        >
          <GraduationCap className="w-6 h-6 text-primary" />
          Education
        </motion.h3>

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">{edu.school}</CardTitle>
                  <CardDescription>{edu.period}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground mt-2">{edu.note}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}