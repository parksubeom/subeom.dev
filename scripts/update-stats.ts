// scripts/update-stats.ts
//
// Skills Panel (Open VSX) · claude-distill (npm) 의 실시간 통계를 수집해
// 프로젝트 마크다운 + 블로그 글의 수치를 자동 갱신합니다.
//
// 실행:  pnpm update:stats
//
// 이후 변경된 파일은 자동으로 `pnpm sync:projects` + `pnpm sync:posts` 도 트리거합니다.
// CI(GitHub Actions) 등에서는 `SKIP_SUPABASE_SYNC=1` 로 동기화만 건너뛸 수 있습니다.

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

interface SkillsPanelStats {
  downloadCount: number;
  averageRating: number;
  reviewCount: number;
  version: string;
}

interface DistillStats {
  version: string;
  weeklyDownloads: number;
  unpackedSize: number;
  fileCount: number;
}

async function fetchSkillsPanel(): Promise<SkillsPanelStats> {
  const url = "https://open-vsx.org/api/parksubeom/claude-skills-panel";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open VSX fetch failed: ${res.status}`);
  const data = await res.json();
  return {
    downloadCount: data.downloadCount,
    averageRating: data.averageRating,
    reviewCount: data.reviewCount,
    version: data.version,
  };
}

async function fetchDistill(): Promise<DistillStats> {
  const regUrl = "https://registry.npmjs.org/claude-distill";
  const regRes = await fetch(regUrl);
  if (!regRes.ok) throw new Error(`npm registry fetch failed: ${regRes.status}`);
  const reg = await regRes.json();
  const latest = reg["dist-tags"].latest;
  const dist = reg.versions[latest].dist;

  const dlUrl = "https://api.npmjs.org/downloads/point/last-week/claude-distill";
  const dlRes = await fetch(dlUrl);
  if (!dlRes.ok) throw new Error(`npm downloads fetch failed: ${dlRes.status}`);
  const dl = await dlRes.json();

  return {
    version: latest,
    weeklyDownloads: dl.downloads,
    unpackedSize: dist.unpackedSize,
    fileCount: dist.fileCount,
  };
}

// 천 단위 콤마 포맷
const fmt = (n: number) => n.toLocaleString("en-US");

// 1000 단위 어림 (3,762 → 3,800+)
const round100 = (n: number) => `${Math.floor(n / 100) * 100 + 100}+`;

type Replacement = { pattern: RegExp; replace: string };

// === 치환 규칙 ===
function buildReplacements(sp: SkillsPanelStats, di: DistillStats): {
  [filepath: string]: Replacement[];
} {
  const downloads = fmt(sp.downloadCount);
  const rounded = round100(sp.downloadCount);

  return {
    "projects/claude-skills-panel.md": [
      // description 의 "Open VSX X,XXX 다운로드"
      {
        pattern: /Open VSX [\d,]+(\+)? 다운로드/g,
        replace: `Open VSX ${downloads} 다운로드`,
      },
      // 성과 섹션의 평점 합산 라인
      {
        pattern:
          /\*\*Open VSX [\d,]+ 다운로드 · 평점 [\d.]+\/5\.0\*\* \(VS Code Marketplace 합산 누적 [^)]+\)/g,
        replace: `**Open VSX ${downloads} 다운로드 · 평점 ${sp.averageRating}/5.0** (VS Code Marketplace 합산 누적 ${rounded})`,
      },
    ],
    "projects/claude-distill.md": [
      // description 의 의존성/크기/주간 다운로드
      {
        pattern: /의존성 0개 · \d+(\.\d+)?KB/g,
        replace: `의존성 0개 · ${Math.round(di.unpackedSize / 1024)}KB`,
      },
      // 성과 섹션의 npm 다운로드
      {
        pattern: /주간 \d+ 다운로드/g,
        replace: `주간 ${di.weeklyDownloads} 다운로드`,
      },
      // 언팩 크기/파일 수
      {
        pattern: /언팩 크기 [\d.]+ KB · \d+ 파일/g,
        replace: `언팩 크기 ${(di.unpackedSize / 1024).toFixed(1)} KB · ${di.fileCount} 파일`,
      },
      {
        pattern: /언팩 크기 [\d.]+ KB \(\d+ 파일, 의존성 0개\)/g,
        replace: `언팩 크기 ${(di.unpackedSize / 1024).toFixed(1)} KB (${di.fileCount} 파일, 의존성 0개)`,
      },
      // version
      {
        pattern: /v\d+\.\d+\.\d+ npm 정식 배포/g,
        replace: `v${di.version} npm 정식 배포`,
      },
      {
        pattern: /npm v\d+\.\d+\.\d+/g,
        replace: `npm v${di.version}`,
      },
    ],
    "posts/claude-skills-panel-build-story.md": [
      {
        pattern:
          /\*\*Open VSX 누적 [\d,]+ 다운로드\*\* \(글 작성 시점[^)]*\)/g,
        replace: `**Open VSX 누적 ${downloads} 다운로드** (글 작성 시점, VS Code Marketplace 합산 ${rounded})`,
      },
    ],
    "posts/claude-distill-build-story.md": [
      {
        pattern: /주간 \d+ 다운로드/g,
        replace: `주간 ${di.weeklyDownloads} 다운로드`,
      },
      {
        pattern: /\*\*주간 \d+ 다운로드\*\*/g,
        replace: `**주간 ${di.weeklyDownloads} 다운로드**`,
      },
      {
        pattern: /v\d+\.\d+\.\d+ npm 정식 배포/g,
        replace: `v${di.version} npm 정식 배포`,
      },
    ],
  };
}

async function main() {
  console.log("📡 통계 수집 중...\n");
  const [sp, di] = await Promise.all([fetchSkillsPanel(), fetchDistill()]);

  console.log("=== Claude Code Skills Panel (Open VSX) ===");
  console.log(`  downloads: ${fmt(sp.downloadCount)}`);
  console.log(`  rating: ${sp.averageRating}/5.0 (${sp.reviewCount} review)`);
  console.log(`  version: ${sp.version}\n`);

  console.log("=== claude-distill (npm) ===");
  console.log(`  version: ${di.version}`);
  console.log(`  weekly: ${di.weeklyDownloads}`);
  console.log(`  size: ${(di.unpackedSize / 1024).toFixed(1)} KB · ${di.fileCount} files\n`);

  // 라이브 통계 config 파일을 매번 덮어씀 (Hero 컴포넌트가 import).
  const statsTs = path.join(
    process.cwd(),
    "src/shared/config/stats.ts",
  );
  const statsContent = `// 자동 갱신되는 라이브 통계.
// \`pnpm update:stats\` — GitHub Actions(매일 09:00 KST) 또는 로컬 cron 이 이 파일을 덮어씁니다.
// 수동으로 손대지 마세요 — 다음 갱신 사이클에 덮어쓰입니다.

export const LIVE_STATS = {
  openVsxDownloads: ${sp.downloadCount},
  npmWeeklyDownloads: ${di.weeklyDownloads},
  lastUpdated: "${new Date().toISOString()}",
} as const;
`;
  let statsFileUpdated = false;
  if (fs.existsSync(statsTs)) {
    const prev = fs.readFileSync(statsTs, "utf-8");
    if (prev !== statsContent) {
      fs.writeFileSync(statsTs, statsContent);
      statsFileUpdated = true;
      console.log("✅ src/shared/config/stats.ts  (live stats 갱신)");
    }
  }

  const replacements = buildReplacements(sp, di);
  const root = process.cwd();
  const changed: string[] = [];

  for (const [rel, rules] of Object.entries(replacements)) {
    const fp = path.join(root, rel);
    if (!fs.existsSync(fp)) {
      console.warn(`⚠️  ${rel} 없음 — skip`);
      continue;
    }
    const original = fs.readFileSync(fp, "utf-8");
    let updated = original;
    for (const { pattern, replace } of rules) {
      updated = updated.replace(pattern, replace);
    }
    if (updated !== original) {
      fs.writeFileSync(fp, updated);
      const diff = original
        .split("\n")
        .filter((line, i) => line !== updated.split("\n")[i]).length;
      console.log(`✅ ${rel}  (${diff}줄 변경)`);
      changed.push(rel);
    } else {
      console.log(`-- ${rel}  변경 없음`);
    }
  }

  if (changed.length === 0) {
    if (statsFileUpdated) {
      console.log(
        "\n🎉 히어로용 src/shared/config/stats.ts 만 갱신되었습니다. (projects/posts 마크다운은 이미 동일 수치)",
      );
      console.log("\n   git add src/shared/config/stats.ts");
      console.log(
        `   git commit -m "chore(stats): live stats (Open VSX ${fmt(sp.downloadCount)}, npm weekly ${di.weeklyDownloads})"`,
      );
      console.log("   git push origin main");
    } else {
      console.log("\n🎉 모든 수치가 이미 최신입니다. (stats.ts 포함)");
    }
    return;
  }

  const skipSync =
    process.env.SKIP_SUPABASE_SYNC === "1" ||
    process.env.SKIP_SUPABASE_SYNC === "true";

  // 자동 sync
  const needsProjectSync = changed.some((p) => p.startsWith("projects/"));
  const needsPostSync = changed.some((p) => p.startsWith("posts/"));

  if (skipSync && (needsProjectSync || needsPostSync)) {
    console.log(
      "\n⚠️  SKIP_SUPABASE_SYNC=1 — Supabase 동기화는 건너뜁니다. DB 반영이 필요하면 로컬에서 pnpm sync:projects / sync:posts 를 실행하세요.",
    );
  } else {
    console.log("\n🔄 Supabase 동기화...");
    if (needsProjectSync) {
      execSync("pnpm sync:projects", { stdio: "inherit" });
    }
    if (needsPostSync) {
      execSync("pnpm sync:posts", { stdio: "inherit" });
    }
  }

  const gitAddPaths = [
    ...(statsFileUpdated ? ["src/shared/config/stats.ts"] : []),
    ...changed,
  ];
  console.log("\n🎉 완료 — 변경된 파일을 commit 하면 라이브에도 반영됩니다.");
  console.log("\n   git add " + gitAddPaths.join(" "));
  console.log(
    `   git commit -m "chore(stats): 통계 자동 갱신 (Open VSX ${fmt(sp.downloadCount)}, npm v${di.version} weekly ${di.weeklyDownloads})"`,
  );
  console.log("   git push origin main");
}

main().catch((err) => {
  console.error("❌ 실패:", err.message);
  process.exit(1);
});
