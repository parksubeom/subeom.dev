// scripts/sync-projects.ts
//
// projects/ 폴더의 마크다운 파일을 Supabase projects 테이블로 동기화합니다.
//
// 실행: pnpm tsx scripts/sync-projects.ts
//
// 주의: SUPABASE_SERVICE_ROLE_KEY 가 .env.local 에 있어야 합니다.

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ .env.local 파일에 SUPABASE_SERVICE_ROLE_KEY 가 있는지 확인하세요!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// projects 테이블 컬럼 (DB 스키마와 일치해야 함)
type ProjectRow = {
  title: string;
  description: string | null;
  long_description: string | null;
  category: string | null;
  status: string | null;
  tech_stack: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  thumbnail_url: string | null;
  images: string[] | null;
  featured: boolean | null;
  order: number | null;
  start_date: string | null;
  end_date: string | null;
  detailInfo: Record<string, unknown> | null;
  updated_at: string;
};

async function syncProjects() {
  const projectsDir = path.join(process.cwd(), "projects");

  if (!fs.existsSync(projectsDir)) {
    console.error("❌ 루트에 'projects' 폴더가 없습니다.");
    return;
  }

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".md"));
  console.log(`📂 발견된 프로젝트 파일: ${files.length}개`);

  for (const filename of files) {
    const filePath = path.join(projectsDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: fm, content: body } = matter(fileContent);

    if (!fm.title) {
      console.warn(`⚠️ [Skip] ${filename}: title 이 없습니다.`);
      continue;
    }

    console.log(`🔄 처리 중: ${fm.title}`);

    const row: Partial<ProjectRow> = {
      title: fm.title,
      description: fm.description ?? null,
      long_description: body.trim() || null,
      category: fm.category ?? null,
      status: fm.status ?? null,
      tech_stack: fm.tech_stack ?? null,
      github_url: fm.github_url ?? null,
      demo_url: fm.demo_url ?? null,
      thumbnail_url: fm.thumbnail_url ?? null,
      images: fm.images ?? null,
      featured: fm.featured ?? null,
      order: fm.order ?? null,
      start_date: fm.start_date ?? null,
      end_date: fm.end_date ?? null,
      detailInfo: fm.detailInfo ?? null,
      updated_at: new Date().toISOString(),
    };

    // title 로 기존 프로젝트 조회 후 update / insert 분기
    const { data: existing, error: fetchError } = await supabase
      .from("projects")
      .select("id")
      .eq("title", fm.title)
      .maybeSingle();

    if (fetchError) {
      console.error(`❌ 조회 실패: ${fm.title}`, fetchError.message);
      continue;
    }

    if (existing) {
      const { error } = await supabase
        .from("projects")
        .update(row)
        .eq("id", existing.id);

      if (error) {
        console.error(`❌ 업데이트 실패: ${fm.title}`, error.message);
      } else {
        console.log(`✅ 업데이트: ${fm.title}`);
      }
    } else {
      const { error } = await supabase.from("projects").insert(row);

      if (error) {
        console.error(`❌ 생성 실패: ${fm.title}`, error.message);
      } else {
        console.log(`✅ 신규 생성: ${fm.title}`);
      }
    }
  }

  console.log("🎉 동기화 완료");
}

syncProjects();
