"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Send } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showToast = (message: string) => {
    // 간단한 토스트 구현
    const toast = document.createElement("div")
    toast.className = "fixed top-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-md shadow-lg z-50 animate-in slide-in-from-top"
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.style.opacity = "0"
      toast.style.transition = "opacity 0.3s"
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 이메일 주소
    const recipientEmail = "sooknise@naver.com"
    
    // 이메일 제목과 본문 구성
    const emailSubject = encodeURIComponent(`[포트폴리오 문의] ${formData.subject}`)
    const emailBody = encodeURIComponent(
      `이름: ${formData.name}\n` +
      `이메일: ${formData.email}\n\n` +
      `메시지:\n${formData.message}`
    )
    
    // mailto: 링크 생성하여 이메일 클라이언트 열기
    const mailtoLink = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`
    window.location.href = mailtoLink
    
    // 토스트 표시
    showToast("이메일 클라이언트가 열립니다.")

    // 폼 초기화
    setFormData({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            이름
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            이메일
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          제목
        </label>
        <Input
          id="subject"
          name="subject"
          type="text"
          required
          value={formData.subject}
          onChange={handleChange}
          placeholder="문의 제목을 입력하세요"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          메시지
        </label>
        <Textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="문의 내용을 입력하세요"
          rows={6}
          className="resize-none"
        />
      </div>
      
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
        <Send className="mr-2 h-4 w-4" />
        {isSubmitting ? "전송 중..." : "문의 보내기"}
      </Button>
    </form>
  )
}
