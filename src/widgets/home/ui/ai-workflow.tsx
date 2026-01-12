"use client";

import { BrainCircuit, GitMerge, FileText, ShieldCheck, Sparkles } from "lucide-react";

export function AiWorkflow() {
  const steps = [
    {
      step: "01",
      title: "맥락 주입",
      subTitle: "Context Injection",
      tool: "Gemini Gems",
      icon: BrainCircuit,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      // 그라데이션 라인 색상 (연결선용)
      lineGradient: "from-purple-500",
      desc: "프로젝트의 전후 맥락과 레퍼런스 자료를 AI(Gemini Gems)에게 사전에 학습시켜, 환각 현상 없이 의도된 목표를 정확히 이해하도록 설정합니다."
    },
    {
      step: "02",
      title: "단계별 설계",
      subTitle: "Phased Prompting",
      tool: "Strategy",
      icon: GitMerge,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      lineGradient: "from-blue-500",
      desc: "작업을 한 번에 요청하지 않습니다. 페이즈(Phase)별로 프롬프트를 나누어 실행하고, 각 단계의 맥락이 끊기지 않고 이어지도록 설계합니다."
    },
    {
      step: "03",
      title: "문서 기반 개발",
      subTitle: "Doc-Driven Dev",
      tool: "Cursor",
      icon: FileText,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      lineGradient: "from-cyan-500",
      desc: "AI(Cursor)에게 단순 코드 생성이 아닌 '추론 과정'과 '변경 사항'을 문서화하도록 지시합니다. 이 문서는 다음 단계의 입력값이자 검증 도구가 됩니다."
    },
    {
      step: "04",
      title: "통제 및 롤백",
      subTitle: "Control & Rollback",
      tool: "Human",
      icon: ShieldCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      lineGradient: "from-green-500",
      desc: "AI에게 전적으로 의존하지 않습니다. 기록된 문서를 기반으로 제가 완벽히 이해한 흐름 속에서 코드를 검수하고, 문제 발생 시 즉시 복구합니다."
    }
  ];

  return (
    <section className="space-y-8 max-w-5xl mx-auto py-12">
      {/* 1. 헤더 섹션 */}
      <div className="space-y-4 text-center md:text-left px-4">
        <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center md:justify-start gap-2">
          AI 협업 프로세스
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          AI는 단순한 코딩 기계가 아닙니다. <strong>컨텍스트 주입</strong>과 <strong>단계별 검증</strong>을 통해<br className="hidden md:block" />
          휴먼 에러를 제어하고 생산성을 극대화하는 저만의 개발 파이프라인입니다.
        </p>
      </div>

      {/* 2. 버티컬 타임라인 */}
      <div className="relative px-4 md:px-0 mt-8">
        
        {/* 중앙 수직선 */}
        <div className="absolute top-2 bottom-0 left-8 md:left-1/2 w-0.5 bg-border -translate-x-1/2 z-0" />

        <div className="space-y-0"> {/* 수직 간격 제거 (tight layout) */}
          {steps.map((item, idx) => (
            <div key={idx} className={`relative flex flex-col md:flex-row items-center md:items-start group ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* === 중앙 아이콘 (Timeline Point) === */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border-4 border-muted flex items-center justify-center z-20 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-foreground/50">
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>

              {/* === 가로 연결선 (Connector) === */}
              {/* 데스크탑: 중앙에서 카드로 뻗어나가는 선 */}
              <div className={`hidden md:block absolute top-6 h-0.5 w-12 z-0 
                ${idx % 2 === 0 
                  ? 'right-[50%] bg-gradient-to-r to-transparent' // 짝수: 왼쪽으로
                  : 'left-[50%] bg-gradient-to-l to-transparent'  // 홀수: 오른쪽으로
                } 
                ${`from-${item.color.split('-')[1]}-500`}
                ${item.bg.replace('/10', '')}
               `} 
              />
              
              {/* === 빈 공간 (레이아웃 균형용) === */}
              <div className="hidden md:block w-1/2" />

              {/* === 컨텐츠 카드 === */}
              <div className={`w-full md:w-1/2 pl-20 md:pl-0 pb-12 md:pb-8 
                ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                
                <div className={`relative bg-card border ${item.border} rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1`}>
                  
                  {/* 배경 장식 숫자 */}
                  <div className={`absolute -top-3 text-5xl font-black text-muted/10 select-none transition-opacity
                    ${idx % 2 === 0 ? 'left-4' : 'right-4'}
                  `}>
                    {item.step}
                  </div>

                  <div className="relative z-10 space-y-3">
                    {/* 툴 뱃지 & 타이틀 그룹 */}
                    <div className={`flex flex-col gap-1 ${idx % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${item.bg} ${item.color}`}>
                        {item.tool}
                      </span>
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        {item.subTitle}
                      </p>
                    </div>

                    {/* 설명 */}
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* 카드 측면 컬러 바 (시각적 포인트) */}
                  <div className={`absolute top-4 bottom-4 w-1 rounded-full ${item.bg.replace('/10', '')}
                    ${idx % 2 === 0 ? 'right-0 rounded-r-none' : 'left-0 rounded-l-none'}
                  `} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}