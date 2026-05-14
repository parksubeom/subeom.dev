---
title: "claude-distill"
description: "Claude를 매일 새로 출근하는 알바생이라고 생각해보세요 — 어제 가르친 요령을 오늘 또 설명하지 않게, 인수인계 노트를 자동으로 적어두는 Stop hook 기반 npm CLI."
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
thumbnail_url: "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-distill/npm-logo.png"
images:
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-distill/npm-logo.png"
featured: true
order: 2
start_date: "2026-05-03"
end_date: null

detailInfo:
  overview: |
    Claude를 매일 새로 출근하는 알바생이라고 생각해보세요. 어제 가르친 요령을 오늘도 똑같이 다시 설명해야 합니다. `claude-distill`은 어제 배운 걸 **자동으로 인수인계 노트에 적어두는 도구** 입니다. 다음 날의 Claude가 출근하자마자 그 노트를 읽고 시작하니까, 같은 설명을 두 번 할 필요가 없습니다.

    **Stop hook + LLM 자동 추출** 으로 매 세션의 결정·페일·환경 quirk를 markdown에 누적하고, `CLAUDE.md` `@reference`로 다음 세션 system prompt에 자동 inject. 사용자 액션은 첫 `claude-distill init` **한 번이 끝**.
  period: "2026-05-03 ~ 진행 중 (npm v0.4.1 · 의존성 0 · 61KB)"
  team: "1인 개발"
  role: "전체 기획 · 설계 · 구현 · npm 배포 · 문서화"
  techStack:
    - Node.js 18+
    - Anthropic API (Claude Haiku / Sonnet / Opus)
    - Claude Code Hooks (Stop hook)
    - npm CLI
    - Markdown
    - Mermaid
  sections:
    - title: "한눈에 보기 — 설치 전 vs 설치 후"
      content: |
        ```
        설치 전:
          1번째 대화  →  주의할 점 발견   →  "Claude야, 이거 주의해"
          2번째 대화  →  같은 주의할 점   →  "Claude야, 이거 주의해"      (또?)
          3번째 대화  →  같은 주의할 점   →  "Claude야, 이거 주의해"      (세 번째…)

                                               └─ 대화마다 기억 리셋, 영원히 반복

        설치 후 (claude-distill init 한 번):
          1번째 대화  →  주의할 점 발견  →  자동으로 인수인계 노트에 기록
          2번째 대화  →  Claude가 이미 알고 시작 ✓  (출근하자마자 노트 읽음)
          3번째 대화  →  Claude가 이미 알고 시작 ✓

                                               └─ 한 번 배우면 모든 미래 대화 공유
        ```

        ### 동작 흐름

        ```
        당신이 Claude와 대화
                ▼
          [대화 끝] → 자동 분석 시작
                ▼
          쓸 만한 배움이 있나?
            │
            ├─ 없음 → 조용히 종료, 비용 0원
            │
            └─ 있음 → AI가 핵심만 추출
                       ▼
                   인수인계 노트에 추가
                   (판례 / 사고 기록)
                       ▼
              다음 대화 시작 시 자동 inject
                       ▼
              다음 대화는 "이미 아는 상태"로 시작
        ```
    - title: "데이터 모델 — 3개 markdown 파일의 역할"
      content: |
        | 파일 | 역할 | 작성 |
        |---|---|---|
        | **`CLAUDE.md`** | 법률 — 변하지 않는 보편 규칙 | 사람이 직접 |
        | **`knowledge.md`** | 판례 — "이 상황엔 이렇게 했다" | 자동 누적 |
        | **`gotchas.md`** | 사고 보고서 — "같은 실수 반복 금지" | 자동 누적 |

        법률은 사람이 쓰지만, **판례와 사고 보고서는 매일 쌓이는 거니까 자동화 가능** 하다는 인사이트에서 출발했습니다.

        ```
           ┌──────────────────────────────────────────┐
           │  ~/.claude/CLAUDE.md  (법률 — 사람이 작성)│
           │                                          │
           │    @~/.claude/knowledge.md  ─────────────┤
           │    @~/.claude/gotchas.md    ─────────────┤
           └──────────────────┬───────────────────────┘
                              │ Claude가 매 대화 시작 시
                              │ 자동으로 위 파일들을 읽음
                              ▼
              ┌─────────────────────────────┐
              │  knowledge.md  (판례)       │ ← claude-distill이
              │  gotchas.md    (사고 보고서)│   대화 끝마다 자동 추가
              └─────────────────────────────┘
        ```

        `claude-distill init`이 위 그림의 **`@reference` 두 줄** 을 `CLAUDE.md`에 자동 등록 → 그 후 매 대화 끝마다 distill이 노트에 자동 추가 → 다음 대화 시작 시 Claude가 자동으로 읽음.
    - title: "어떤 게 자동으로 누적되나 (실제 dogfood entry)"
      content: |
        세션 한 번 했더니 이런 entry들이 알아서 추출돼서 `~/.claude/gotchas.md` / `knowledge.md`에 추가된 **실제 결과** (편집 없음):

        ```
        ⚠️  npm link가 macOS 기본 prefix에서 sudo 없이 실패 — 절대경로로 우회
        ⚠️  Claude Code JSONL의 promptId가 항상 null — uuid + parentUuid 체인 사용
        ⚠️  Cursor 빌트인 Claude는 PATH에 `claude` 바이너리를 노출 안 함
        🧠  ffmpeg cropdetect의 limit은 어두운 padding에서 ≥32 필요
        🧠  Transcript를 마지막 user marker부터 slice하면 분석 prompt ~80% 감소
        🧠  CSP `connect-src 'none'`이 webview의 외부 fetch를 이중 차단
        ```

        각 entry는 `Symptom → Trap → Cause → Workaround` 4단으로 자동 정리됩니다 — 다음 세션의 Claude가 그대로 읽고 참조 가능한 형태로. 분석기 prompt가 보수적이라 자명한 사실 / 프로젝트 internal trivia / 검증 안 된 추측은 제외됩니다.
    - title: "카테고리 (11개 enum)"
      content: |
        분석기가 entry마다 다음 11개 중 하나로 분류합니다:

        **판례 (knowledge.md)**
        - `trade_off_decision` — 트레이드오프 결정
        - `environment_quirk` — 환경 특이점
        - `scale_transition` — 규모 전환점
        - `tooling_insight` — 도구 인사이트
        - `performance_insight` — 성능 인사이트

        **사고 (gotchas.md)**
        - `api_quirk` — API 함정
        - `type_shape` — 타입 모양
        - `concurrency_race` — 동시성 레이스
        - `build_deploy` — 빌드/배포 함정
        - `privacy_security` — 프라이버시/보안
        - `ux_regression` — UX 회귀

        > 카테고리 키는 머신 식별자라 **영어 enum 그대로 유지** — 자연어 본문만 ko/en 분기.
    - title: "내부 파이프라인 (4단 게이트)"
      content: |
        ```
        세션 끝
          └─ Stop hook이 `claude-distill analyze --quiet` 자동 실행
             ├─ [재귀 가드] 자식 claude 세션이면 즉시 종료 (CLAUDE_DISTILL_CHILD)
             ├─ [중복 방지] 같은 슬라이스 이미 분석됐으면 종료 (SHA1 12자)
             ├─ [게이트 1 — 휴리스틱] 짧은 세션 / 도구 사용 0 / 에러 키워드 0 → 종료
             ├─ [게이트 2 — Haiku] (API key 있을 때) yes/no 1토큰 응답, no면 종료
             ├─ 마지막 user marker 이후 turn slice (~120 turns / ~85K chars)
             ├─ Sonnet/Opus로 analyzer prompt 전달, JSON 응답 파싱
             ├─ confidence:high entry → ~/.claude/knowledge.md / gotchas.md 즉시 append
             └─ medium / low → drop (사용자 손 안 가게)

        다음 세션 시작
          └─ CLAUDE.md의 @reference로 누적된 markdown이 system prompt에 inject
             └─ Claude가 자연스럽게 참조 — 같은 함정 안 빠짐
        ```

        게이트 두 단계는 **"대부분의 세션은 인사이트가 없다"** 가정으로 본 추출 호출을 ~10× 줄입니다. 게이트가 차단된 세션은 dedup에 마킹돼 같은 슬라이스로 다시 호출돼도 즉시 종료.
    - title: "설치 & 사용법"
      content: |
        ```bash
        npm install -g claude-distill
        claude-distill init
        ```

        분석을 위한 LLM 호출 경로 둘 중 하나가 필요합니다:

        **옵션 A — Claude Code CLI 사용자**
        ```bash
        npm install -g @anthropic-ai/claude-code
        # 끝. distill이 자동으로 `claude --print` 호출
        ```

        **옵션 B — Cursor / VS Code Claude 익스텐션 사용자**
        빌트인 Claude는 PATH에 노출되지 않으니 API key 사용:
        ```bash
        # https://console.anthropic.com/ 에서 API key 발급 후
        echo 'export ANTHROPIC_API_KEY=sk-ant-...' >> ~/.zshrc
        source ~/.zshrc
        ```

        ### CLI 명령 (3개)

        | 명령 | 용도 | 빈도 |
        |---|---|---|
        | `claude-distill init` | hook + CLAUDE.md reference 등록 | **한 번** |
        | `claude-distill where` | path / 존재 여부 확인 (디버깅) | 가끔 |
        | `claude-distill analyze` | 수동 분석 | **거의 안 씀** (hook이 자동) |

        `init`이 idempotent하게 두 가지를 등록:
        1. `~/.claude/settings.json`의 **Stop hook** — 세션마다 자동 분석 호출
        2. `~/.claude/CLAUDE.md` 끝의 **`@knowledge.md` / `@gotchas.md` 참조**

        끝입니다. 더 이상 손 안 댑니다.
    - title: "i18n — 한국어 / 영어 자동 분기"
      content: |
        `knowledge.md` / `gotchas.md`는 한국어 또는 영어로 누적됩니다. 헤더 / 필드 라벨 (`상황` / `함정` / `근거` … vs `Context` / `Trap` / `Basis` …) 과 entry 본문이 모두 해당 언어로 작성됩니다.

        **언어 결정 우선순위 (5단계 폴백)**:
        1. `claude-distill analyze --lang=ko|en` (명시)
        2. `CLAUDE_DISTILL_LANG=ko|en` 환경변수
        3. **transcript 자동 감지** — 한글 음절 비율 5% 초과 → `ko`, 아니면 `en` ⭐ 기본
        4. `process.env.LANG` (예: `ko_KR.UTF-8` → `ko`)
        5. fallback: `en`

        **대부분 사용자는 3번 자동 감지로 충분** — 한국어 코딩 세션은 한국어로, 영어 세션은 영어로 자연스럽게 누적. 별도 설정 없이.
    - title: "핵심 기술 도전 & 해결"
      content: |
        **1. Stop hook 무한 재귀 차단**
        distill이 spawn한 자식 claude의 Stop hook이 다시 distill을 부르는 무한 루프 → `CLAUDE_DISTILL_CHILD` 환경변수 주입으로 자식 프로세스에서 즉시 종료. 단일 가드는 언제든 깨질 수 있어 dedup hash와 두 겹으로 방어.

        **2. LLM 호출 비용 90% 절감**
        "대부분 세션은 인사이트가 없다" 가정으로 휴리스틱(턴 수 / 도구 사용 / 에러 키워드) + Haiku 1토큰 yes/no 게이트 2단 적용. 본 추출 호출 ~10× 컷 → 세션당 평균 비용 ~$0, 게이트 통과 시에만 ~$0.10.

        **3. Slice 단위 dedup (프라이버시 + 성능)**
        같은 turn 묶음을 SHA1 12자로 해싱해 `~/.claude/.distill/analyzed.json`에 기록. **transcript 내용은 저장하지 않음** → 프라이버시 보장. Stop hook이 매 turn 반환되더라도 재분석 0.

        **4. i18n 자동화 — 식별자 vs 자연어 분리**
        Hangul 음절 비율 임계로 transcript 언어 자동 감지. 카테고리 enum은 영어 머신 키 그대로, 자연어 필드(헤더 / 본문)만 ko/en 분기 → 파이프라인 안정성 보장하면서 한국어 사용자 진입장벽 제거.

        **5. CLAUDE_DISTILL_CHILD 환경변수 패턴**
        Hook 기반 메타 도구는 자기 자신을 호출할 위험이 항상 있음. 자식 프로세스 환경에 명시 플래그 → 자식이 즉시 종료. **메타 도구 설계의 일반 패턴** 으로 정립.
    - title: "프라이버시 / 보안"
      content: |
        - **별도 서버 없음** — 본인 머신 ↔ Anthropic API 직통. distill 운영자에게도 transcript 안 감
        - **API key 저장 안 함** — distill은 key를 절대 파일에 안 씀. `~/.zshrc` 등의 환경변수만 읽음
        - **권한 범위 최소** — transcript는 read-only, 결과 markdown 2개만 append. 코드/repo 안 건드림
        - **잔존물도 hash만** — `~/.claude/.distill/analyzed.json`에는 SHA12자만 (transcript 내용 X)
        - **결과는 plain markdown** — 마음에 안 드는 entry는 줄째로 삭제, 다음부터 inject 안 됨
        - **완전 비활성화** — `~/.claude/settings.json`의 `hooks.Stop` 항목 삭제 또는 `npm uninstall -g`
        - **MIT License** — 50KB 미만 코드 그대로 [GitHub](https://github.com/parksubeom/claude-distill)에서 검수 가능
    - title: "성과 / 임팩트"
      content: |
        - **v0.4.1 npm 정식 배포** ([npmjs.com/package/claude-distill](https://www.npmjs.com/package/claude-distill)) — 첫 배포 후 3일 만에 **주간 522 다운로드**
        - **언팩 크기 61.4 KB · 13 파일 · 의존성 0개** — 사용자 머신 부담 0
        - **세션당 평균 비용 ~$0** (4단 게이트 차단 시), 게이트 통과 시에만 ~$0.10
        - **별도 서버 X · 락인 X** — 본인 머신 ↔ Anthropic API 직통, plain markdown 결과
        - **ko/en i18n 자동 분기** 로 한국어 사용자 진입장벽 제거
        - **Stop hook 메타 도구 패턴** 정립 — 환경변수 + dedup hash 두 겹 재귀 방어
        - **MIT License · 16 키워드** (claude-code-hook, knowledge-management, post-mortem, meta-tooling 등)
    - title: "회고 / 배운 점"
      content: |
        **"Zero-effort"가 진짜 zero-effort가 되려면 게이트가 필수** 였습니다. 매 turn 반환되는 Stop hook 환경에서는 비용 컷 메커니즘이 핵심이었고, 휴리스틱 + 1토큰 LLM yes/no 2단 구조가 최소 복잡도로 90% 컷을 달성했습니다. **"기능을 만드는 것"보다 "기능이 영향을 주는 비용 모델을 설계하는 것"** 이 진짜 일이었습니다.

        **Hook 기반 메타 도구의 무한 재귀는 흔한 함정** 입니다. 환경변수 + dedup hash 두 겹으로 방어 설계 — 단일 가드는 언제든 깨질 수 있다는 걸 dogfood 과정에서 직접 배웠습니다.

        **기술 식별자 vs 자연어 필드 분리** 가 i18n의 핵심이었습니다. enum 키 영어 고정, 문장만 분기 → 파이프라인 안정성 보장. 다국어는 데이터 모델 설계 단계에서 결정해야 한다는 걸 다시 확인했습니다.

        가장 메타적인 학습은 **"도구가 곧 도구의 사용자"** 라는 구조였습니다. claude-distill 자체를 Claude Code로 만들었고, 그 과정에서 발견한 페인 포인트(promptId가 null이라는 점 등)가 그대로 README의 첫 번째 dogfood entry로 들어갔습니다. 자기 자신이 가장 정직한 첫 사용자일 때 도구의 본질이 드러납니다.
  links:
    github: "https://github.com/parksubeom/claude-distill"
    demo: "https://www.npmjs.com/package/claude-distill"
    notion: null
---

Claude Code 사용자가 매 세션 잃어버리는 결정·페일·노하우를 transcript에서 자동 추출해 markdown으로 누적하는 Stop hook 기반 글로벌 npm CLI. 4단 게이트(휴리스틱 → Haiku LLM → SHA1 dedup → 재귀 가드)로 본 추출 호출 ~10× 절감, 의존성 0개·61KB 경량 패키지, transcript 언어 자동 감지(ko/en) i18n 구조로 별도 설정 0.
