"use client";

import { useEffect, useState, useRef } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/shared/lib/supabase/client";

interface ViewCounterProps {
  slug: string;
  initialViews: number;
  className?: string;
}

export function ViewCounter({ slug, initialViews, className }: ViewCounterProps) {
  const [viewCount, setViewCount] = useState<number>(initialViews);
  const hasIncremented = useRef<boolean>(false);

  useEffect(() => {
    // slug가 변경되면 리셋
    if (hasIncremented.current) {
      hasIncremented.current = false;
    }

    // 조회수 증가 (한 번만 실행)
    const incrementViews = async () => {
      if (hasIncremented.current) return;
      hasIncremented.current = true;

      try {
        // RPC 함수 호출하여 조회수 증가 및 최신 값 가져오기
        const { data, error } = await supabase.rpc("increment_view_count", {
          post_slug: slug,
        });

        if (error) {
          console.error("조회수 증가 실패:", error);
          hasIncremented.current = false; // 실패 시 리셋하여 재시도 가능하게
          return;
        }

        // 반환된 최신 조회수로 상태 업데이트
        if (typeof data === "number") {
          setViewCount(data);
        }
      } catch (error) {
        console.error("조회수 업데이트 중 오류:", error);
        hasIncremented.current = false; // 실패 시 리셋
      }
    };

    incrementViews();
  }, [slug]);

  // 숫자를 천 단위로 포맷팅 (예: 1234 -> "1,234")
  const formatViewCount = (count: number): string => {
    return new Intl.NumberFormat("ko-KR").format(count);
  };

  return (
    <div className={`flex items-center gap-1.5 text-sm text-muted-foreground ${className || ""}`}>
      <Eye className="h-4 w-4" />
      <span>{formatViewCount(viewCount)} views</span>
    </div>
  );
}



