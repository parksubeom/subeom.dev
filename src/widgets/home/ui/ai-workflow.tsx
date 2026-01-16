"use client";

import { 
  BrainCircuit, 
  GitMerge, 
  FileText, 
  ShieldCheck, 
  Target, 
  Cpu, 
  Undo2,
  BookOpen 
} from "lucide-react";

export function AiWorkflow() {
  const steps = [
    {
      step: "01",
      title: "맥락 주입 & 제약 설정",
      subTitle: "Context Injection & Constraints",
      tool: "Gemini Gems",
      icon: BrainCircuit,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      lineGradient: "from-purple-500",
      desc: "AI의 자유도를 보장하기보다 '극단적으로 제한'합니다. 프로젝트의 전후 맥락과 엣지 케이스를 사전에 학습시켜, AI가 창의성을 발휘하기보다 정해진 레일 위에서 정교하게 움직이도록 통제합니다."
    },
    {
      step: "02",
      title: "단계별 설계와 위임",
      subTitle: "Phased Prompting",
      tool: "Strategy",
      icon: GitMerge,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      lineGradient: "from-blue-500",
      desc: "구현 속도에서의 경쟁은 무의미합니다. 작업을 한 번에 요청하지 않고 페이즈(Phase)별로 쪼개어 지시하며, 저는 전체적인 컨텍스트 흐름을 쥐고 AI 에이전트에게 구현을 '100% 아웃소싱' 합니다."
    },
    {
      step: "03",
      title: "문서 기반 검증",
      subTitle: "Doc-Driven Verification",
      tool: "Cursor",
      icon: FileText,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      lineGradient: "from-cyan-500",
      desc: "AI가 작성한 코드를 바로 수용하지 않습니다. 먼저 '추론 과정'과 '변경 사항'을 문서화하도록 지시합니다. 이 문서는 제가 의도한 요구 스펙과 일치하는지 검수하는 강력한 필터가 됩니다."
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
      desc: "잘못된 구현은 언제든 발생할 수 있습니다. 하지만 체크포인트가 명확하다면 두렵지 않습니다. 문제가 발생하면 즉시 이전 상태로 롤백하고, 맥락을 수정한 뒤 다시 지시하여 안전하게 프로덕트를 완성합니다."
    }
  ];

  const philosophies = [
    {
      icon: Cpu,
      title: "코더가 아닌, 지휘자",
      desc: "AI의 압도적인 구현 속도와 경쟁하지 않습니다. 저는 컨텍스트를 쥐고 지휘하는 설계자로서, AI를 도구로써 적극 활용합니다."
    },
    {
      icon: Target,
      title: "극단적인 제약 설정",
      desc: "AI에게 막연한 자유를 주지 않습니다. 엣지 케이스를 배제하고 입력값을 뾰족하게 다듬어 하나의 일을 정교하게 수행하도록 만듭니다."
    },
    {
      icon: Undo2,
      title: "안전 장치와 롤백",
      desc: "100% 위임하되 100% 신뢰하지 않습니다. 디테일한 검수와 언제든 돌아갈 수 있는 롤백 지점을 확보하여 안전한 개발을 지향합니다."
    },
    {
      icon: BookOpen,
      title: "지속적인 기술 탐구",
      desc: "AI가 코드를 짠다고 해서 제가 몰라도 되는 것은 아닙니다. 아는 것을 시키는 것과 모르는 것을 맡기는 것은 천지차이입니다. AI의 산출물을 학습 노트 삼아 끊임없이 원리를 탐구합니다."
    }
  ];

  return (
    <section className="space-y-16 max-w-5xl mx-auto py-16 px-4 md:px-0">
      
      {/* 1. 헤더 섹션: 철학적 배경 강조 */}
      <div className="space-y-6 text-center md:text-left">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AI-Native Workflow
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          AI와 경쟁하지 않고,<br className="md:hidden"/> <span className="text-primary">지휘</span>합니다.
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
          개발에서의 AI는 자유도보다 <strong>'제약'</strong>이 필요합니다.<br className="hidden md:block" />
          컨텍스트를 장악하고 구현을 위임하되, 철저한 검증과 롤백 전략으로<br className="hidden md:block" />
          가장 빠르고 안전하게 요구 스펙을 달성하는 저만의 파이프라인입니다.
        </p>
      </div>

      {/* 2. 버티컬 타임라인 (Process) */}
      <div className="relative mt-8">
        {/* 중앙 수직선 */}
        <div className="absolute top-2 bottom-0 left-8 md:left-1/2 w-0.5 bg-gradient-to-b from-border via-border to-transparent -translate-x-1/2 z-0" />

        <div className="space-y-0">
          {steps.map((item, idx) => (
            <div key={idx} className={`relative flex flex-col md:flex-row items-center md:items-start group ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* === 중앙 아이콘 (Timeline Point) === */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border-4 border-muted flex items-center justify-center z-20 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-foreground/50 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>

              {/* === 가로 연결선 (Connector) === */}
              <div className={`hidden md:block absolute top-6 h-0.5 w-12 z-0 
                ${idx % 2 === 0 
                  ? 'right-[50%] bg-gradient-to-r to-transparent' 
                  : 'left-[50%] bg-gradient-to-l to-transparent' 
                } 
                ${`from-${item.color.split('-')[1]}-500`}
                ${item.bg.replace('/10', '')}
               `} 
              />
              
              {/* === 빈 공간 === */}
              <div className="hidden md:block w-1/2" />

              {/* === 컨텐츠 카드 === */}
              <div className={`w-full md:w-1/2 pl-20 md:pl-0 pb-12 md:pb-8 
                ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                
                <div className={`relative bg-card border ${item.border} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 overflow-hidden`}>
                  
                  {/* 배경 장식 (은은한 Glow) */}
                  <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${item.bg.replace('/10', '')}`} />

                  {/* Step Number */}
                  <div className={`absolute top-4 text-4xl font-black text-foreground/5 select-none
                    ${idx % 2 === 0 ? 'left-6' : 'right-6'}
                  `}>
                    {item.step}
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className={`flex flex-col gap-1 ${idx % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.bg} ${item.color}`}>
                        {item.tool}
                      </span>
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        {item.subTitle}
                      </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-sm break-keep">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* 카드 측면 컬러 바 */}
                  <div className={`absolute top-4 bottom-4 w-1 rounded-full ${item.bg.replace('/10', '')}
                    ${idx % 2 === 0 ? 'right-0 rounded-r-none' : 'left-0 rounded-l-none'}
                  `} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 핵심 철학 (Philosophy Grid) */}
      <div className="border-t pt-12">
        <h3 className="text-2xl font-bold mb-8 text-center md:text-left">Core Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {philosophies.map((phil, idx) => (
            <div key={idx} className="bg-muted/30 border border-border rounded-xl p-6 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-background border flex items-center justify-center mb-4 text-foreground shadow-sm">
                <phil.icon className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2">{phil.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed break-keep">
                {phil.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}