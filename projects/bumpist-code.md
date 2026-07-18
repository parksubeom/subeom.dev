---
title: "bumpist-code"
description: "npx 한 번으로 Vue·React·Next.js 프로젝트에 통일된 컨벤션·디자인 시스템·Claude Code 스킬 14종을 세팅하는 프론트엔드 표준 배포 CLI. FSD 아키텍처 · WCAG AA 기본 준수."
category: "Developer Tools"
status: "active"
tech_stack:
  - Node.js
  - npm CLI
  - Claude Code Skills
  - FSD Architecture
  - TypeScript
github_url: "https://github.com/parksubeom/bumpist-fe-guide"
demo_url: "https://www.npmjs.com/package/bumpist-code"
thumbnail_url: "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-distill/npm-logo.png"
images:
  - "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/claude-distill/npm-logo.png"
featured: true
order: 1
start_date: "2026-06-01"
end_date: null

detailInfo:
  overview: |
    새 프론트엔드 프로젝트를 시작할 때마다 반복되는 세팅 — 폴더 구조 컨벤션, 린트·포맷 규칙, 디자인 토큰, 접근성 기준, 그리고 최근에는 Claude Code 스킬 세트까지 — 을 매번 손으로 옮겨 붙이는 대신, **명령 한 줄로 프로젝트에 주입**하는 CLI 입니다.

    `npx bumpist-code@latest init` 한 번이면 Vue / React / Next.js 프로젝트에 **FSD(Feature-Sliced Design) 아키텍처**, 공통 디자인 베이스라인, **WCAG AA** 기준, 그리고 **Claude Code 스킬 14종**이 일괄 설정됩니다. "팀마다 다르게 굳어지는 표준"을 "설치 한 번으로 합쳐지는 표준"으로 바꾸는 것이 목표입니다.
  period: "2026-06 ~ 진행 중 (npm v0.5.1 · 주간 23 다운로드 · 223KB)"
  team: "1인 개발"
  role: "전체 기획 · 설계 · CLI 구현 · 스킬 허브 큐레이션 · npm 배포 · 문서화"
  techStack:
    - Node.js 18+
    - npm CLI (npx 실행)
    - Claude Code Skills (스킬 허브)
    - FSD (Feature-Sliced Design)
    - TypeScript
    - ESLint / Prettier
  sections:
    - title: "한눈에 보기 — 설치"
      content: |
        ```bash
        # Vue · React · Next.js 프로젝트 루트에서 한 줄
        npx bumpist-code@latest init
        ```

        실행하면 아래가 프로젝트에 세팅됩니다.

        ```
        bumpist-code init
                ▼
          프레임워크 감지 (Vue / React / Next.js)
                ▼
          ├─ FSD 폴더 구조 · 컨벤션 배치
          ├─ 디자인 베이스라인 (토큰 · 공용 컴포넌트 기준)
          ├─ 접근성 기준 (WCAG AA)
          └─ Claude Code 스킬 14종 설치
                ▼
          팀 어디서 시작하든 동일한 표준 위에서 개발
        ```
    - title: "무엇을 해결하나"
      content: |
        **1. 표준의 파편화 방지**
        프로젝트·팀마다 폴더 구조, 린트 규칙, 디자인 토큰이 조금씩 달라지는 문제를 "설치 한 번"으로 합칩니다. 신규 프로젝트/신규 합류자가 같은 출발선에 섭니다.

        **2. Claude Code 스킬 허브**
        커밋 준비, 컴포넌트 생성, 슬라이스 생성, API 타입 생성 등 반복 작업을 표준화한 **Claude Code 스킬 14종**을 프로젝트에 함께 배치. 도구가 프로젝트 컨벤션을 이미 알고 시작하도록 만듭니다.

        **3. 접근성·아키텍처를 기본값으로**
        WCAG AA 접근성 기준과 FSD 아키텍처를 나중에 얹는 것이 아니라 프로젝트 출발 시점의 기본값으로 제공합니다.
    - title: "설계 관점"
      content: |
        - **프레임워크 무관 표준, 프레임워크별 배치**: Vue·React·Next.js 각각의 관례를 존중하면서도 컨벤션·디자인·접근성이라는 상위 표준은 공유하도록 분리 설계.
        - **스킬을 코드와 함께 배포**: 문서로만 존재하는 컨벤션은 지켜지지 않습니다. Claude Code 스킬로 컨벤션을 "실행 가능한 도구"로 내려 팀 규칙과 도구의 간극을 없앴습니다.
        - **npx 일회 실행 우선**: 전역 설치 없이 `npx ...@latest init` 한 줄로 최신 표준을 주입 — 진입 비용을 최소화.
    - title: "성과"
      content: |
        - **npm 정식 배포** — 최신 npm v0.5.1, 주간 23 다운로드
        - **언팩 크기 223KB** — Vue·React·Next.js 3개 프레임워크 대응 표준 번들
        - **Claude Code 스킬 14종** 을 프로젝트에 함께 배치해 컨벤션을 실행 가능한 도구로 제공
  links:
    github: "https://github.com/parksubeom/bumpist-fe-guide"
    demo: "https://www.npmjs.com/package/bumpist-code"
    notion: null
---

`npx bumpist-code@latest init` 한 줄로 Vue·React·Next.js 프로젝트에 FSD 아키텍처, 공통 디자인 베이스라인, WCAG AA 접근성 기준, Claude Code 스킬 14종을 일괄 세팅하는 프론트엔드 표준 배포 CLI. "팀마다 파편화되는 표준"을 "설치 한 번으로 합쳐지는 표준 + 실행 가능한 스킬 허브"로 전환하는 것을 목표로 하는 1인 개발 npm 도구입니다.
