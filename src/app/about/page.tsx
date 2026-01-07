import { AboutPage } from "@/widgets/about"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | 박수범",
  description: "Frontend Developer 박수범의 경력 및 소개",
}

export default function About() {
  return <AboutPage />
}
