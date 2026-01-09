"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { PROFILE } from "@/shared/config/profile";

// ✨ 1. 타이핑 효과 컴포넌트
function TypewriterEffect({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // 커서 깜빡임
  useEffect(() => {
    const timeout = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  // 타이핑 로직
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2000); // 2초 대기
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="inline-flex items-center">
      {words[index].substring(0, subIndex)}
      <span className={`ml-1 w-[3px] h-[1em] bg-primary block ${blink ? "opacity-100" : "opacity-0"}`} />
    </span>
  );
}

// ✨ 2. 배경 효과
function BackgroundEffect() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse delay-1000" />
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" 
        style={{
            backgroundImage: `linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

export function HeroSection() {
  // 사용할 문구들 정의
  const TYPING_WORDS = [
    "포용성 있는 웹을 만드는",
    "데이터로 문제를 증명하는",
    "실질적인 가치를 만드는"
  ];

  // ✨ 가장 긴 문장을 찾아서 공간 확보용으로 사용
  const longestWord = TYPING_WORDS.reduce((a, b) => a.length > b.length ? a : b);

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
      <BackgroundEffect />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
            
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
         
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight pb-2 leading-tight flex flex-col md:flex-row flex-wrap justify-center items-center gap-2 md:gap-3">
              
              <span className="whitespace-nowrap">저는</span>
              
              {/* ✨ 레이아웃 고정의 핵심: Grid 겹치기 기법 */}
              <div className="relative grid place-items-center mx-1">
                {/* 1. 투명한 지지대 (공간 확보용 - 절대 안 보임) */}
                <span className="text-transparent opacity-0 pointer-events-none px-2 whitespace-nowrap select-none" aria-hidden="true">
                  {longestWord}
                </span>

                {/* 2. 실제 타이핑 효과 (위로 겹쳐짐) */}
                <span className="absolute inset-0 flex items-center justify-center text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 whitespace-nowrap">
                  <TypewriterEffect words={TYPING_WORDS} />
                </span>
              </div>
              
              <span className="whitespace-nowrap">개발자 박수범입니다.</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {PROFILE.bio}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button size="lg" className="gap-2 h-11 px-8 text-base rounded-full" asChild>
              <Link href="/portfolio">
                View Projects <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}