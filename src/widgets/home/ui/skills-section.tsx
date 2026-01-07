"use client"

import { Tables } from "@/type/supabase"
import { motion } from "framer-motion"

type Profile = Tables<'profiles'>

interface SkillsSectionProps {
  skills?: string[] | null
}

const defaultSkills = {
  프론트엔드: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  백엔드: ["Node.js", "PostgreSQL", "Supabase", "REST API"],
  도구: ["Git", "Docker", "VS Code", "Figma"],
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  // 프로필에 기술 스택이 있으면 사용, 없으면 기본 기술 스택 사용
  const skillCategories = skills && skills.length > 0
    ? {
        기술: skills,
      }
    : defaultSkills

  return (
    <section className="py-20 bg-muted/30">
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight mb-12 text-center"
        >
          기술 스택
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto"
        >
          {Object.entries(skillCategories).map(([category, items]) => (
            <motion.div key={category} variants={itemVariants} className="text-center">
              <h3 className="text-xl font-semibold mb-6">{category}</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {items.map((skill, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
