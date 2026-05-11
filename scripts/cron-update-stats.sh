#!/usr/bin/env bash
#
# cron-update-stats.sh
#
# 매일 정해진 시각에 통계를 자동 갱신하고 commit/push 까지 수행합니다.
# crontab 등록 예시 (한국 시간 매일 09:00):
#
#   0 9 * * * /Users/user/subeom.dev/scripts/cron-update-stats.sh
#
# 로그: ~/.cache/subeom-stats.log
# 실패해도 시스템에 영향 없도록 set -e + trap 으로 격리.

set -euo pipefail

# cron 환경은 PATH 가 비어있다시피 하므로 명시
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$HOME/.nvm/versions/node/*/bin"
# fnm / nvm 같은 도구 사용자라면 아래도 필요할 수 있음
export NODE_OPTIONS="${NODE_OPTIONS:-}"

REPO_DIR="/Users/user/subeom.dev"
LOG_FILE="$HOME/.cache/subeom-stats.log"
mkdir -p "$(dirname "$LOG_FILE")"

# 모든 출력 로그로 리다이렉트
exec >>"$LOG_FILE" 2>&1

echo
echo "═══════════════════════════════════════════"
echo "▶ $(date '+%Y-%m-%d %H:%M:%S')"
echo "═══════════════════════════════════════════"

cd "$REPO_DIR"

# pnpm 위치 자동 탐색 (cron PATH 에 없을 때 대비)
PNPM_BIN="$(command -v pnpm || true)"
if [ -z "$PNPM_BIN" ]; then
  for cand in \
    "$HOME/.local/share/pnpm/pnpm" \
    "$HOME/Library/pnpm/pnpm" \
    "/opt/homebrew/bin/pnpm" \
    "/usr/local/bin/pnpm"; do
    if [ -x "$cand" ]; then
      PNPM_BIN="$cand"
      break
    fi
  done
fi

if [ -z "$PNPM_BIN" ]; then
  echo "❌ pnpm not found in PATH. Aborting."
  exit 1
fi
echo "Using pnpm: $PNPM_BIN"

# 작업 트리가 깨끗하지 않으면(사용자가 작업 중) 안전상 skip
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "⚠️  Working tree has uncommitted changes. Skipping to avoid conflict."
  exit 0
fi

# 최신 main 으로 sync
git fetch origin main
git checkout main
git reset --hard origin/main

# 통계 갱신
"$PNPM_BIN" update:stats

# 변경 사항 검사
if git diff --quiet projects/ posts/; then
  echo "✓ No changes — stats already up to date."
  exit 0
fi

# commit + push
git add projects/ posts/
git commit -m "chore(stats): 자동 통계 갱신 ($(date '+%Y-%m-%d'))"
git push origin main

echo "✓ Pushed. Vercel will redeploy automatically."
