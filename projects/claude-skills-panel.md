---
title: "Claude Code Skills Panel"
description: "Claude Code 슬래시 커맨드를 한 번의 클릭으로 실행하는 VS Code 확장. Open VSX 6,084 다운로드 · 평점 5.0, 7일 만에 v0.44.6, 4개 IDE · 4개 언어 배포."
category: "Developer Tools"
status: "active"
tech_stack:
  - VS Code Extension API
  - Node.js
  - JavaScript
  - HTML/CSS
  - GitHub Actions
github_url: "https://github.com/parksubeom/claude-skills-panel"
demo_url: "https://open-vsx.org/extension/parksubeom/claude-skills-panel"
thumbnail_url: "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/panel-main.png"
images:
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/panel-main.png"
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/panel-bottom.png"
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/demo-card-click.gif"
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/demo-exec-mode.gif"
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/demo-edit-modal.gif"
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/demo-theme.gif"
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/demo-locale.gif"
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/buddy-lineup.png"
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/buddy-lineup-full.png"
featured: true
order: 1
start_date: "2026-05-03"
end_date: null

detailInfo:
  overview: |
    Claude Code(Anthropic 공식 CLI/IDE 도구)는 모든 기능을 슬래시 커맨드로 트리거하는 구조입니다. 플러그인이 늘어날수록 외워야 하는 커맨드가 30개를 넘어가면서 "자주 쓰는 커맨드만 한눈에 보고 클릭으로 실행하면 어떨까"라는 페인 포인트에서 출발했습니다.

    `~/.claude/` 하위(`skills/`, `commands/`, `plugins/cache/`)를 자동 스캔해 모든 슬래시 커맨드를 카드 그리드로 노출하고, 클릭 한 번으로 클립보드 복사 / 자동 붙여넣기 / 터미널 전송이 이루어지는 패널입니다. 부가적으로 사용 패턴에 따라 RPG 클래스가 결정되는 픽셀 버디 게이미피케이션을 결합해 "도구 + 사이드 프로젝트의 즐거움"을 동시에 제공하도록 설계했습니다.
  period: "2026-05-03 ~ 진행 중 (현재 v0.44.6, 7일간 45개 릴리즈)"
  team: "1인 개발 (기획 / 디자인 / 개발 / 배포 / 마케팅 전담)"
  role: "VS Code Extension 풀스택 · CI/CD 파이프라인 · 다국어 i18n · 픽셀 아트 디자인 검수"
  techStack:
    - VS Code Extension API
    - Node.js
    - Vanilla JavaScript
    - Webview API
    - HTML/CSS (CSS Custom Properties)
    - GitHub Actions
    - ffmpeg + gifski
  sections:
    - title: "스크린샷"
      content: |
        **메인 패널 뷰**

        ![Activity Bar 메인 패널](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/panel-main.png)

        Activity Bar에 도킹된 메인 패널. 자동 디스커버리된 슬래시 커맨드들이 카드 그리드로 표시됩니다.

        **하단 패널 뷰 (IDE 사용자용)**

        ![Bottom Panel 뷰](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/panel-bottom.png)

        IDE 환경에서는 하단 패널에 가로 레이아웃으로 노출됩니다.
    - title: "주요 기능"
      content: |
        **1. 자동 디스커버리**
        `~/.claude/skills/`, `commands/`, `plugins/cache/<marketplace>/<plugin>/<version>/`를 재귀 스캔해 모든 슬래시 커맨드를 자동 노출. 플러그인별 출처(예: `🧩 superpowers @claude-plugins-official`)가 카드 hover에 표시됩니다.

        **2. 3가지 실행 모드**

        ![3가지 실행 모드 데모](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/demo-exec-mode.gif)

        - `▶ Paste`: 클립보드 복사 후 활성 입력창에 자동 붙여넣기
        - `▶💬 Term`: 활성 터미널로 직접 전송, 카드별 프롬프트 템플릿(`{cmd}` 플레이스홀더) 지원
        - 초기 `▶ Auto` 모드는 React 입력 컴포넌트와 충돌이 잦아 v0.39에서 제거

        **3. 개인화 / 커스터마이징**

        ![카드 편집 모달](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/demo-edit-modal.gif)

        카드별 별칭·노트·아이콘·그룹·프롬프트 템플릿·숨김 처리, 6슬롯 Quick Bar(드래그&드롭 + 단축키 1–6), 설정 export/import(JSON 클립보드 동기화).

        ![3테마 토글](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/demo-theme.gif)

        3 테마(Dark / Retro CRT / Gameboy LCD) 토글 + 4 언어(en/ko/ja/zh) 토글.

        ![다국어 데모](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/demo-locale.gif)

        **4. 토큰 사용량 추적 (opt-in)**
        `~/.claude/projects/*.jsonl`의 `message.usage` 필드만 incremental 파싱. `<command-name>` 마커와 `uuid`/`parentUuid` 체인을 따라 슬래시 커맨드별 사용량을 귀속시켜 `22.6M tok/run` 형태로 회당 평균을 표시. **프롬프트/응답 본문은 일절 읽지 않으며 모든 데이터는 메모리에만 보존**.

        **5. 플러그인 마켓플레이스 브라우저**
        등록된 모든 마켓플레이스의 카탈로그를 모달에서 통합 검색. `/plugin install <name>@<marketplace>` 명령을 현재 실행 모드로 원클릭 발사.

        **6. 픽셀 게이미피케이션 (Buddy Yard)**

        ![Buddy Yard - RPG 클래스 라인업](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/buddy-lineup.png)

        사용자의 슬래시 커맨드 사용 패턴이 곧 RPG 클래스(검사/닌자/마법사 등 10종)로 결정. LV.1 견습 → LV.5 전설 5단계 성장.

        ![Buddy Yard 풀 라인업](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-skills-panel/buddy-lineup-full.png)

        Claude가 작업 중일 때 사이드 스크롤러식 몬스터 배틀 연출(클래스별 공격 이펙트·데미지 숫자·크리티컬). 작업 완료 시 8-bit 3-tone 차임.
    - title: "기술적 도전 & 트러블슈팅"
      content: |
        **1. JSONL 토큰 추적: `promptId` → UUID 체인 (v0.44.5)**
        토큰 추적 카드 라벨이 0건 매칭. 디버깅 결과 Claude Code의 JSONL은 어시스턴트 라인의 `promptId`를 항상 `null`로 기록. `promptId` 인덱스를 폐기하고 `uuidToCmd` + `uuidToParent` 두 인덱스로 교체. 어시스턴트 라인은 `parentUuid`부터 부모 체인을 최대 100홉까지 거슬러 올라가 가장 가까운 커맨드 마커에 사용량 귀속. 단일 세션 `/full-flow` 203M 토큰 정확 수집 성공.

        **2. 토큰 메트릭 의미 재정의: 누적 → 회당 평균 (v0.44.6)**
        `/full-flow 203M tokens` 누적 라벨은 "어떤 스킬이 무거운가"라는 진짜 질문에 답하지 못함. 회당 평균(`총합 ÷ 호출 횟수`)으로 전환해 `/full-flow 22.6M tok/run`처럼 호출당 무게가 한눈에 들어오도록 재설계. 같은 데이터지만 사용자 인지가 완전히 달라짐.

        **3. Webview의 `window.confirm()` 차단 (v0.40.0)**
        VS Code/Cursor의 Webview는 `window.confirm()`을 조용히 차단. 자체 픽셀 confirm 모달을 구현하고 z-index를 다른 모달보다 높게 두어 모든 게이팅 흐름 정상화.

        **4. CSS Grid `auto-fit` 회귀 (v0.38.0)**
        빈/잠긴 슬롯과 채워진 슬롯의 그리드 아이템 크기 계산이 달라 슬롯 겹침 발생. `repeat(6, minmax(0, 1fr))` 고정 6열로 전환 + `box-sizing: border-box` + `min-width: 0`. 280px 미만에선 컨테이너 쿼리로 2행 3열 자동 전환.

        **5. 보안 다층 방어 (v0.44.4)**
        자체 보안 리뷰에서 발견한 3가지 표면을 사전 방어:
        - **Prototype pollution**: `__proto__` / `constructor` / `prototype` 거부 가드, 설정 import 시 재귀 스트립
        - **HTML escape**: 서드파티 마켓플레이스 카탈로그 모든 필드를 `& < > " '` 풀 커버리지 escape
        - **Path traversal**: `resolveIconPath`가 `ICONS_DIR` 경계를 벗어나는 절대 경로/`../` 시도를 모두 차단

        **6. 클래스별 공격 이펙트 (v0.43.0)**
        10개 클래스 공격 모션을 단일 `ATTACK_EFFECTS` 맵 + 3개 키프레임(`projectile`/`melee`/`aura`)으로 추상화. CSS Custom Properties(`--dx`, `--dy`)로 발사체 궤적 계산 → 코드 한 줄로 새 공격 정의 가능.
    - title: "성과"
      content: |
        - **Open VSX 6,084 다운로드 · 평점 5/5.0** (VS Code Marketplace 합산 누적 6100+)
        - **7일 만에 v0.20.0(MVP) → v0.44.6** — 33개 버전을 Open VSX에 게시, GitHub Actions 자동 배포로 수동 작업 0
        - **4개 IDE × 2개 마켓플레이스** 배포 (VS Code · Cursor · Windsurf · VSCodium / VS Code Marketplace · OpenVSX)
        - **4개 언어 i18n 220+ 키** (en/ko/ja/zh) — 키 파리티 검증 스크립트로 회귀 방지
        - **243+ 플러그인이 검색 가능한 통합 마켓플레이스 브라우저** 내장
        - **3가지 보안 이슈를 외부 노출 전 자체 패치** (prototype pollution, XSS, path traversal)
        - **마케팅 자산 풀 셋업** — 한국어 README, 데모 GIF 5종, 스크린샷, FUNDING.yml, CONTRIBUTING.md, MIT License
    - title: "회고"
      content: |
        가장 큰 학습은 **"기능보다 메트릭의 정의가 중요하다"** 는 점입니다. 토큰 추적 기능은 v0.40에서 도입했지만 진짜 가치를 낸 시점은 v0.44.6에서 "누적 토큰 → 회당 평균"으로 메트릭을 다시 정의한 순간이었습니다. 같은 데이터, 같은 코드량인데 사용자 인지에 미치는 영향은 완전히 달랐습니다.

        기술적으로는 **Webview의 제약(`window.confirm` 차단, CSP, 메시지 패싱 보안)을 단순한 우회가 아닌 일관된 디자인 원칙으로 환원** 하는 경험이 인상적이었습니다. 자체 confirm 모달, prototype pollution 가드, HTML escape, path traversal 방어 모두 결국 "Webview는 외부 코드 실행 환경이며, 내부에서 들어오는 모든 경계 데이터는 검증한다"는 한 줄짜리 원칙의 다양한 적용이었습니다.

        마지막으로 **AI 협업 워크플로의 가능성을 실증한 프로젝트** 입니다. 7일 만에 45개 릴리즈, 4개 언어 220+ 키, 마케팅 자산 풀 셋업이 가능했던 것은 Claude Code 자체를 도구로 활용해 기획 → 구현 → 테스트 → 문서 → 배포 사이클을 1인 페이스로 돌릴 수 있었기 때문입니다. 도구가 곧 도구의 사용자이기도 한 메타 구조에서 가장 많은 인사이트를 얻었습니다.
  links:
    github: "https://github.com/parksubeom/claude-skills-panel"
    demo: "https://open-vsx.org/extension/parksubeom/claude-skills-panel"
    notion: null
---

Claude Code 슬래시 커맨드를 카드 그리드로 시각화하고 한 번의 클릭으로 실행할 수 있는 VS Code 확장 프로그램. 자동 디스커버리, 3가지 실행 모드, 토큰 사용량 추적, 플러그인 마켓플레이스 브라우저, 픽셀 RPG 게이미피케이션을 결합한 1인 사이드 프로젝트로 7일 만에 45개 릴리즈를 거치며 4개 IDE · 4개 언어 · 2개 마켓플레이스에 배포해 누적 3,500+ 다운로드를 기록했습니다.
