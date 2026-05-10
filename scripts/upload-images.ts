// scripts/upload-images.ts
//
// projects/_assets/ 안의 이미지를 Supabase Storage `portfolio` 버킷으로 업로드합니다.
//
// 폴더 구조 예시:
//   projects/_assets/
//   ├── claude-distill/
//   │   ├── hero.png
//   │   ├── flow.png
//   │   └── demo.gif
//   └── claude-skills-panel/
//       └── panel-main.png
//
// 실행: pnpm upload:images
//
// 결과: public URL 목록이 콘솔에 출력됨. 마크다운에 복사해 사용.

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ .env.local 의 SUPABASE 환경변수를 확인하세요.");
  process.exit(1);
}

const BUCKET = "portfolio";
const supabase = createClient(supabaseUrl, serviceKey);

// 지원 확장자
const EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function listImages(rootDir: string): { local: string; remote: string }[] {
  const out: { local: string; remote: string }[] = [];

  function walk(currentDir: string, relative: string) {
    if (!fs.existsSync(currentDir)) return;
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const local = path.join(currentDir, entry.name);
      const rel = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) {
        walk(local, rel);
      } else if (EXTS.has(path.extname(entry.name).toLowerCase())) {
        out.push({ local, remote: rel });
      }
    }
  }

  walk(rootDir, "");
  return out;
}

async function main() {
  const assetsDir = path.join(process.cwd(), "projects", "_assets");

  if (!fs.existsSync(assetsDir)) {
    console.error(`❌ ${assetsDir} 폴더가 없습니다.`);
    console.error("   projects/_assets/<slug>/<image> 구조로 이미지를 두고 다시 실행하세요.");
    process.exit(1);
  }

  const files = listImages(assetsDir);
  if (files.length === 0) {
    console.warn("⚠️  업로드할 이미지가 없습니다.");
    return;
  }

  console.log(`📸 발견된 이미지: ${files.length}개\n`);

  type Result = { remote: string; ok: boolean; url?: string; error?: string };
  const results: Result[] = [];

  for (const { local, remote } of files) {
    const buffer = fs.readFileSync(local);
    const contentType = MIME[path.extname(local).toLowerCase()] ?? "application/octet-stream";

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(remote, buffer, {
        contentType,
        upsert: true, // 같은 경로에 재업로드 허용
        cacheControl: "31536000", // 1년 캐시
      });

    if (error) {
      console.error(`❌ ${remote} — ${error.message}`);
      results.push({ remote, ok: false, error: error.message });
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(remote);
    console.log(`✅ ${remote}`);
    console.log(`   ${data.publicUrl}\n`);
    results.push({ remote, ok: true, url: data.publicUrl });
  }

  // 마크다운 친화 출력
  console.log("\n=== 마크다운 복사용 ===\n");
  const grouped = new Map<string, Result[]>();
  for (const r of results.filter((r) => r.ok)) {
    const slug = r.remote.split("/")[0];
    if (!grouped.has(slug)) grouped.set(slug, []);
    grouped.get(slug)!.push(r);
  }
  for (const [slug, items] of grouped) {
    console.log(`# ${slug}`);
    for (const it of items) {
      const filename = path.basename(it.remote, path.extname(it.remote));
      console.log(`![${filename}](${it.url})`);
    }
    console.log();
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`🎉 완료 — 성공 ${results.length - failed}, 실패 ${failed}`);
}

main();
