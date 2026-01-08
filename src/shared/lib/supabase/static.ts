// src/shared/lib/supabase/static.ts (새로 생성)
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/type/supabase"; // 타입 경로 확인 (없으면 any로 대체 가능)

export const createStaticClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};