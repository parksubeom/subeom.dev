"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Github, MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { PROFILE } from "@/shared/config/profile";

export function ContactPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROFILE.email); 
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <p className="text-muted-foreground text-lg">
          {PROFILE.bio} {/* ✨ 상수 사용 */}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-[1fr,1.5fr] gap-12">
        {/* Left Column: Contact Info */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Contact Info
            </h3>
            
            <Card className="p-4 space-y-4 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${PROFILE.email}`} className="text-sm hover:text-primary transition-colors">
                      {PROFILE.email}
                    </a>
                    <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{PROFILE.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm">{PROFILE.location}</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="w-full gap-2" asChild>
                <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Closing Statement */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-6 space-y-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">
                  비즈니스의 문제를 기술의 언어로 풀어내고, 사용자에게는 가치 있는 경험을 전달합니다.
                </strong>
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed">
                저는 개발을 단순히 코드를 치는 행위가 아니라, &apos;비즈니스 문제를 푸는 가장 강력한 도구&apos;라고 믿습니다.
                &apos;왜(Why)&apos;라는 질문을 통해 문제의 본질을 파악하고, 기술적 해결책이 실질적인 임팩트로 이어지는 과정에서 큰 보람을 느낍니다.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold tracking-tight">복잡함을 단순함으로</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                복잡하게 얽힌 레거시 환경을 단순하고 명확한 구조로 재정의하는 과정에서 희열을 느낍니다.
                당장의 구현에 매몰되지 않고, 지속 가능한 성장을 위해 기술적 부채를 관리하며 유지보수하기 좋은 코드를 작성하려 노력합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold tracking-tight">팀 생산성과 DX(개발자 경험)</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                동료의 시간을 아끼는 것이 곧 팀의 경쟁력이라고 생각합니다. 협업 가이드라인 배포와 크롬 개발자 도구 교육을 주도했던 것처럼,
                지식을 공유하고 협업의 병목을 제거하는 &apos;팀을 위한 엔지니어링&apos;을 지향합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold tracking-tight">사용자 중심 &amp; 데이터 기반</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                웹 접근성 컨설팅 경험을 바탕으로, 소외되는 사용자 없이 누구나 편리하게 이용할 수 있는 인터페이스를 고민합니다.
                주관적인 직관보다 데이터와 사용자 피드백을 통해 가설을 검증하며, 작은 개선을 쌓아 거대한 변화를 만드는 힘을 믿습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold tracking-tight">이런 팀과 함께하고 싶습니다</h2>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                <li>제품의 방향성을 함께 고민하고, &apos;정답&apos;보다는 &apos;최선의 실험&apos;을 지향하는 팀</li>
                <li>기술적 성장이 비즈니스의 성공으로 이어지는 과정을 즐기는 팀</li>
                <li>솔직한 피드백과 코드 리뷰를 통해 서로의 성장을 자극하는 건강한 문화가 있는 곳</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-border/50 space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                성장에 진심인 동료와 함께 제품의 내일을 치열하게 고민하고 싶습니다.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                왼쪽의 이메일이나 깃허브를 통해 연락 주시면, 24시간 이내에 기쁜 마음으로 답장드리겠습니다.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}