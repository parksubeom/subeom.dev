"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { FileDown, Briefcase, GraduationCap } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const experiences = [
  {
    company: "(주)에스앤씨랩",
    role: "웹 접근성 컨설팅 및 개선 개발",
    description: "CJ CGV(MAU 480만), 신협, 한국예탁결제원 등 대규모 서비스의 접근성 진단 및 개선.",
    achievements: [
      "'개발자 친화적 가이드라인' 배포로 소통 비용 절감",
      "재작업률 30% 감소 달성"
    ]
  },
  {
    company: "널리소프트(SSEM)",
    role: "프론트엔드 개발",
    description: "SSEM 홈페이지 전면 리뉴얼 및 사내 운영 백오피스 개발.",
    achievements: [
      "레거시 청산 및 반응형 웹 구축으로 UX 개선",
      "배포 프로세스 자동화로 3일 소요되던 작업을 '즉시(0분)'로 단축"
    ]
  },
  {
    company: "모아프렌즈",
    role: "ICT 인턴",
    description: "데이터 관제 대시보드 개발 및 레거시 마이그레이션.",
    achievements: [
      "데이터 집계 시간 일 1시간 → 0분(실시간) 단축"
    ]
  }
]

const education = [
  {
    institution: "항해 플러스",
    program: "프론트엔드 제7기 심화 과정",
    period: "2025.10 - 2026.01",
    note: "Best Practice 5회 선정"
  },
  {
    institution: "코드스테이츠",
    program: "프론트엔드 엔지니어링 부트캠프",
    period: "2022.12 - 2023.06",
    note: "기수 1위 수료"
  },
  {
    institution: "전남대학교",
    program: "멀티미디어 전공",
    period: "2015.03 - 2024.08"
  }
]

const intro = "단순한 기능 구현을 넘어 '왜(Why)'를 끊임없이 질문하며, 서비스 자체에 대한 오너십을 가지고 제품을 만듭니다. 웹 접근성 컨설팅 경험을 통해 다양한 환경의 사용자를 고려하는 포용적인 인터페이스 설계 역량을 길렀으며, 이를 바탕으로 코드의 표준 준수와 품질을 타협하지 않는 견고함을 지향합니다."

function TimelineItem({ experience, index }: { experience: typeof experiences[0], index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 pb-8"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 rounded-full bg-primary border-4 border-background" />
      
      <Card className="ml-4">
        <CardHeader>
          <CardTitle className="text-xl">{experience.company}</CardTitle>
          <CardDescription className="text-base font-medium mt-1">
            {experience.role}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 break-keep">
            {experience.description}
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">핵심 성과:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {experience.achievements.map((achievement, idx) => (
                <li key={idx} className="break-keep">{achievement}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function AboutPage() {
  const handleDownloadResume = () => {
    const link = document.createElement("a")
    link.href = "/resume.pdf"
    link.download = "resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              박수범
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium mb-6">
            Frontend Developer
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto break-keep">
            비즈니스 임팩트를 고민하며 근본적인 문제 해결에 집중합니다.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button onClick={handleDownloadResume} size="lg" className="group">
            <FileDown className="mr-2 h-4 w-4" />
            Download Resume
          </Button>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="pt-6">
              <blockquote className="text-lg leading-relaxed text-foreground break-keep italic border-l-4 border-primary pl-6">
                {intro}
              </blockquote>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">경력</h2>
          </div>
          <p className="text-muted-foreground">타임라인 순서로 정렬된 경력 내역입니다.</p>
        </motion.div>

        <div className="relative">
          {experiences.map((experience, index) => (
            <TimelineItem key={index} experience={experience} index={index} />
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">학력 & 교육</h2>
          </div>
        </motion.div>

        <div className="space-y-4">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">{edu.institution}</h3>
                      <p className="text-muted-foreground break-keep">{edu.program}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{edu.period}</p>
                      {edu.note && (
                        <p className="text-sm font-medium text-primary mt-1">{edu.note}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
