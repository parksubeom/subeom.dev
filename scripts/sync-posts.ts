// scripts/sync-posts.ts
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import dotenv from "dotenv";

// 환경변수 로드
dotenv.config({ path: ".env.local" });

// ✨ 주의: 업로드는 관리자 권한이 필요하므로 SERVICE_ROLE_KEY를 사용해야 합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ .env.local 파일에 SUPABASE_SERVICE_ROLE_KEY가 있는지 확인하세요!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncPosts() {
  // 1. posts 폴더 찾기
  const postsDirectory = path.join(process.cwd(), "posts");
  
  if (!fs.existsSync(postsDirectory)) {
    console.error("❌ 루트에 'posts' 폴더가 없습니다.");
    return;
  }

  const files = fs.readdirSync(postsDirectory);
  console.log(`📂 발견된 파일: ${files.length}개`);

  for (const filename of files) {
    if (!filename.endsWith(".md")) continue;

    // 2. 파일 읽기 및 파싱
    const filePath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    // 필수 정보 확인
    if (!frontmatter.slug || !frontmatter.title) {
      console.warn(`⚠️ [Skip] ${filename}: slug 또는 title이 없습니다. (Frontmatter를 확인하세요)`);
      continue;
    }

    console.log(`🔄 업로드 중: ${frontmatter.title}`);

    // 3. Supabase에 업로드 (Upsert: 있으면 수정, 없으면 추가)
    const { error } = await supabase
      .from("posts")
      .upsert({
        slug: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt || "",
        content: content,
        tags: frontmatter.tags || [],
        published_at: frontmatter.date ? new Date(frontmatter.date) : new Date(),
        created_at: new Date(),
        published: true, 
      }, { onConflict: "slug" });

    if (error) {
      console.error(`❌ 실패: ${frontmatter.title}`, error.message);
    } else {
      console.log(`✅ 성공: ${frontmatter.title}`);
    }
  }
}

syncPosts();