import { ContactPage } from "@/widgets/contact"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | 박수범",
  description: "박수범에게 연락하기",
}

export default function Contact() {
  return <ContactPage />
}
