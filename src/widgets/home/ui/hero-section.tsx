"use client"

import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface HeroSectionProps {
  name?: string | null
  title?: string | null
  bio?: string | null
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function HeroSection({ name, title, bio }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      
      <div className="relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl mb-6"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              {name || "개발자"}
            </span>
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="mt-6 text-xl text-muted-foreground sm:text-2xl md:text-3xl font-medium"
          >
            {title || "풀스택 개발자"}
          </motion.p>
          
          {bio && (
            <motion.p
              variants={itemVariants}
              className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              {bio}
            </motion.p>
          )}
          
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="group">
              <Link href="/portfolio">
                포트폴리오 보기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/contact">
                연락하기
                <span className="ml-2 transition-transform group-hover:scale-105 inline-block">→</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
