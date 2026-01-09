import { Tables } from "@/type/supabase"

type Profile = Tables<'profiles'>

interface SkillsSectionProps {
  skills?: string[] | null
}

const defaultSkills = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  Backend: ["Node.js", "PostgreSQL", "Supabase", "REST API"],
  Tools: ["Git", "Docker", "VS Code", "Figma"],
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  // If skills from profile exist, categorize them
  // Otherwise use default skills
  const skillCategories = skills && skills.length > 0
    ? {
        Skills: skills,
      }
    : defaultSkills

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Skills & Technologies</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {Object.entries(skillCategories).map(([category, items]) => (
            <div key={category} className="text-center">
              <h3 className="text-xl font-semibold mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {items.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-background border text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


