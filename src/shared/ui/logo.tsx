import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 group select-none", className)}>
      {/* 심볼 박스 */}
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all duration-300 group-hover:bg-primary/90 group-hover:scale-105 border border-primary-foreground/10">
        
        {/* 텍스트 B (Primary Foreground 색상 - 보통 흰색) */}
        <span className="text-2xl font-black leading-none">
          B
        </span>
        
        {/* ✨ AI Spark Dot: 보라색 (Purple) */}
        <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse"></div>
      </div>

      {/* 텍스트 로고 */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
            subeom.dev
          </span>
        </div>
      )}
    </div>
  );
}