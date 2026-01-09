"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Github, MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { ContactForm } from "@/features/contact/ui/contact-form";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { PROFILE } from "@/shared/config/profile";

export function ContactPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROFILE.email); 
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <p className="text-muted-foreground text-lg">
          {PROFILE.bio} {/* ✨ 상수 사용 */}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-[1fr,1.5fr] gap-12">
        {/* Left Column: Contact Info */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Contact Info
            </h3>
            
            <Card className="p-4 space-y-4 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${PROFILE.email}`} className="text-sm hover:text-primary transition-colors">
                      {PROFILE.email}
                    </a>
                    <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{PROFILE.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm">{PROFILE.location}</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="w-full gap-2" asChild>
                <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}