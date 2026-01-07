"use client"

import { ContactForm } from "@/features/contact"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Mail, Phone, Github, ExternalLink, Copy, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function ContactPage() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("sooknise@naver.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          연락하기
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto break-keep">
          프로젝트 제안, 협업 문의, 또는 단순히 인사하고 싶으시다면 언제든지 연락주세요.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>연락처 정보</CardTitle>
              <CardDescription>
                아래 연락처로 직접 연락하실 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4 text-primary" />
                  이메일
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="mailto:sooknise@naver.com"
                    className="text-muted-foreground hover:text-foreground transition-colors break-all"
                  >
                    sooknise@naver.com
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyEmail}
                    className="h-8 w-8"
                    aria-label="이메일 복사"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-primary" />
                  전화번호
                </div>
                <a
                  href="tel:010-8109-0731"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  010-8109-0731
                </a>
              </div>

              {/* Status */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground break-keep">
                    Available for work (구직 중)
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t space-y-3">
                <div className="text-sm font-medium">소셜 링크</div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="group"
                  >
                    <a
                      href="https://github.com/sooknise"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                      <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="group"
                  >
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Blog
                      <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>문의하기</CardTitle>
              <CardDescription>
                아래 폼을 작성해주시면 빠르게 답변드리겠습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
