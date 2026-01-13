import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // 1. 기본 (Solid): 강한 강조 (기존 유지)
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
        
        // 2. Secondary (기존): 약간 더 진하게 수정하여 가시성 확보
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        // 3. Destructive (기존): 에러/삭제
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        
        // 4. Outline (기존): 테두리만
        outline: "text-foreground",

        // ✨ 5. Brand (추천): 프라이머리 색상의 연한 배경 + 진한 글씨 (가장 많이 쓰임)
        brand: 
          "border-transparent bg-primary/15 text-primary hover:bg-primary/25",

        // ✨ 6. Purple (AI/Point): 아까 설정한 보라색 포인트 배지
        purple: 
          "border-transparent bg-purple-500/15 text-purple-700 dark:text-purple-400 hover:bg-purple-500/25",
        
        // ✨ 7. Gray (Subtle): 너무 튀지 않는 일반 태그용 (WCAG AA 대비율 확보)
        gray: 
          "border-transparent bg-slate-500/15 text-slate-700 dark:text-slate-300 hover:bg-slate-500/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }