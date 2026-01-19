"use client";

import { memo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const BlogSearch = memo(function BlogSearch({ value, onChange }: BlogSearchProps) {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="검색어를 입력하세요... (예: React, Next.js)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border/50 focus:bg-card transition-all"
      />
    </div>
  );
});