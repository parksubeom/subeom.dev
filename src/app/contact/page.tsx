import { ContactPage } from "@/widgets/contact"
import { Metadata } from "next"
import { SITE_URL } from "@/shared/config/site"

export const metadata: Metadata = {
  title: "Contact | 박수범",
  description: "박수범에게 연락하기",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
}

export default function Contact() {
  return <ContactPage />
}
