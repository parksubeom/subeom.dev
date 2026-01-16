"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/shared/lib/supabase/client";

interface ViewCounterProps {
  slug: string;
  initialViews: number;
  className?: string;
}

export function ViewCounter({ slug, initialViews, className }: ViewCounterProps) {
  const [viewCount, setViewCount] = useState<number>(initialViews);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 조회수 증가 및 최신 조회수 가져오기
    const incrementViews = async () => {
      // 중복 호출 방지
      if (isLoading) return;
      
      setIsLoading(true);
      
      try {
        // RPC 함수 호출하여 조회수 증가 및 최신 값 가져오기
        const { data, error } = await supabase.rpc("increment_view_count", {
          post_slug: slug,
        });

        if (error) {
          console.error("조회수 증가 실패:", error);
          // 에러 발생 시에도 초기값 유지
          return;
        }

        // 반환된 최신 조회수로 상태 업데이트
        if (typeof data === "number") {
          setViewCount(data);
        }
      } catch (error) {
        console.error("조회수 업데이트 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    incrementViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]); // slug가 변경될 때만 실행

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



