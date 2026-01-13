"use client";

import { motion } from "framer-motion";
import { Badge } from "@/shared/ui/badge";

// 이력서 기반 실제 데이터
const skills = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand"],
  Backend: ["Node.js", "Supabase", "NestJS"],
  Tools: ["Git", "Figma", "Vercel", "Chrome DevTools"],
};

export function SkillsSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Skills & Tools</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {Object.entries(skills).map(([category, items], sectionIndex) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="brand" 
                  className="px-3 py-1 text-sm font-normal"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}