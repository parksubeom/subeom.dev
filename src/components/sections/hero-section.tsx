import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface HeroSectionProps {
  name?: string | null
  title?: string | null
  bio?: string | null
}

export function HeroSection({ name, title, bio }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      
      <div className="container relative px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {name || "Developer"}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground sm:text-2xl">
            {title || "Full Stack Developer"}
          </p>
          {bio && (
            <p className="mt-6 text-lg text-muted-foreground">
              {bio}
            </p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group">
              <Link href="/portfolio">
                View Portfolio
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

