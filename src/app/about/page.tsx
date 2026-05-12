import { AboutPage } from "@/widgets/about"
import { Metadata } from "next"
import { SITE_URL } from "@/shared/config/site"

export const metadata: Metadata = {
  title: "About | 박수범",
  description: "Frontend Developer 박수범의 경력 및 소개",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
}

export default function About() {
  return <AboutPage />
}
