---
title: "claude-distill"
description: "Claude Code 세션 노하우를 자동 누적하는 메타 도구. Stop hook + LLM 추출 4단 게이트로 호출 비용 ~10× 절감, 의존성 0개 · 61KB · ko/en i18n 자동 분기."
category: "Developer Tools"
status: "active"
tech_stack:
  - Node.js
  - Anthropic API
  - Claude Code Hooks
  - npm CLI
  - Markdown
github_url: "https://github.com/parksubeom/claude-distill"
demo_url: "https://www.npmjs.com/package/claude-distill"
thumbnail_url: ""
images: []
featured: true
order: 2
start_date: "2026-05-03"
end_date: null

detailInfo:
  overview: |
    Claude Code(Anthropic의 공식 AI 코딩 CLI) 사용자들의 만성적 페인 포인트를 해결하는 글로벌 npm CLI. 매 세션마다 사용자가 가르친 노하우·결정·페일이 세션 종료와 함께 사라져 동일한 설명을 반복해야 하는 문제를, **Claude Code의 Stop hook + LLM 자동 추출 파이프라인**으로 zero-effort 누적합니다.

    설치 한 번 → 세션 끝날 때마다 자동 분석 → markdown 누적 → 다음 세션 자동 참조. 사용자 액션은 첫 `init` 한 번뿐.
  period: "2026-05-03 ~ 진행 중 (npm v0.4.1 배포)"
  team: "1인 개발"
  role: "전체 기획 · 설계 · 구현 · npm 배포"
  techStack:
    - Node.js 18+
    - Anthropic API (Claude Haiku / Sonnet / Opus)
    - Claude Code Hooks (Stop hook)
    - npm CLI
    - Markdown
    - Mermaid
  sections:
    - title: "문제 정의"
      content: |
        - 매 세션 결정·페일·환경 quirk가 transcript와 함께 휘발됨
        - `CLAUDE.md` 직접 갱신은 마찰이 커서 실제로 안 됨
        - 세션마다 같은 설명을 반복하는 비용 누적
        - 기존 메모리 도구들은 별도 서버 / 락인 / 사용자 액션 요구
    - title: "솔루션 아키텍처"
      content: |
        1. **Claude Code Stop hook**으로 매 세션 종료 시 자동 트리거 (사용자 액션 0)
        2. **4단 게이트로 ~90% 사전 차단** (휴리스틱 → Haiku 1회 토큰 → SHA1 dedup → 재귀 가드)
        3. 통과 세션만 **Sonnet/Opus로 핵심 추출** → `confidence:high` entry만 markdown append
        4. `CLAUDE.md` `@reference`로 다음 세션 system prompt에 자동 inject
    - title: "핵심 기술 도전 & 해결"
      content: |
        **Stop hook 무한 재귀 차단**
        distill이 spawn한 자식 claude의 Stop hook이 다시 distill을 부르는 무한 루프 → `CLAUDE_DISTILL_CHILD` 환경변수 주입으로 자식 프로세스에서 즉시 종료.

        **LLM 호출 비용 90% 절감**
        "대부분의 세션은 인사이트가 없다" 가정으로 휴리스틱(툴/도구/에러 키워드) + Haiku 1회 토큰 yes/no 게이트 2단 적용 → 본 추출 호출 ~10× 컷.

        **Slice 단위 dedup**
        같은 turn 묶음을 SHA1 12자로 해싱(transcript 내용 미저장 → 프라이버시) → Stop hook이 매 turn 반환되더라도 재분석 0.

        **i18n 자동화**
        Hangul 음절 비율 5% 임계로 transcript 언어 자동 감지 → 카테고리 enum은 영어 유지, 자연어 필드만 ko/en 분기 → 사용자 설정 0으로 모국어 누적.
    - title: "기술 스택 (선택 이유)"
      content: |
        - **Node.js 18+** — 빌트인 fetch로 의존성 0개. 50KB 미만 경량 패키지
        - **Anthropic API + Claude CLI 동일 백엔드** — `ANTHROPIC_API_KEY` 있으면 API 직통, 없으면 `claude --print` fallback (IDE 익스텐션 사용자도 지원)
        - **Claude Code Hooks** — `settings.json` `hooks.Stop` 배열 등록. 사용자 액션 0
        - **Markdown** — 결과물 락인 X, IDE에서 직접 편집 가능
        - **Mermaid** — GitHub 자동 렌더 README 다이어그램. 첫 사용자 진입장벽 ↓
    - title: "성과 / 임팩트"
      content: |
        - **v0.4.1 npm 정식 배포** ([npmjs.com/package/claude-distill](https://www.npmjs.com/package/claude-distill)) — 첫 배포 후 3일 만에 주간 233 다운로드 기록
        - **언팩 크기 61.4 KB (13 파일, 의존성 0개)** — 사용자 머신 부담 0
        - **4단 게이트로 세션당 비용 평균 ~$0** (게이트 통과 시에만 ~$0.10)
        - **ko/en i18n 자동 분기**로 한국어 사용자 진입장벽 제거
        - **별도 서버 X** — 본인 머신 ↔ Anthropic API 직통, 운영 비용 0
        - **MIT License · 16개 키워드** (claude-code-hook, knowledge-management, post-mortem, meta-tooling 등)
    - title: "회고 / 배운 점"
      content: |
        **"Zero-effort"가 진짜 zero-effort가 되려면 게이트가 필수**였습니다. 매 turn 반환되는 Stop hook 환경에서는 비용 컷 메커니즘이 핵심이었고, 휴리스틱 + 1토큰 LLM yes/no 2단 구조가 최소 복잡도로 90% 컷을 달성했습니다.

        **Hook 기반 메타 도구의 무한 재귀는 흔한 함정**입니다. 환경변수 + dedup hash 두 겹으로 방어 설계 — 단일 가드는 언제든 깨질 수 있습니다.

        **기술 식별자 vs 자연어 필드 분리**가 i18n의 핵심이었습니다. enum 키 영어 고정, 문장만 분기 → 파이프라인 안정성 보장. 다국어는 데이터 모델 설계 단계에서 결정해야 한다는 걸 다시 확인했습니다.
  links:
    github: "https://github.com/parksubeom/claude-distill"
    demo: "https://www.npmjs.com/package/claude-distill"
    notion: null
---

Claude Code 사용자가 매 세션 잃어버리는 결정·페일·노하우를 transcript에서 자동 추출해 markdown으로 누적하는 Stop hook 기반 CLI. 4단 게이트(휴리스틱 → Haiku LLM → SHA1 dedup → 재귀 가드)로 본 추출 호출 ~10× 절감 + transcript 언어 자동 감지(ko/en) i18n 구조 설계.
