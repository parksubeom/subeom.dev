# 프로젝트 폴더 구조

```
subeom-dev/
├── .env.local                    # 환경 변수 (로컬)
├── components.json               # shadcn/ui 설정
├── next.config.mjs              # Next.js 설정
├── package.json                 # 의존성 패키지 목록
├── package-lock.json            # npm 패키지 락 파일
├── pnpm-lock.yaml               # pnpm 패키지 락 파일
├── postcss.config.mjs           # PostCSS 설정
├── README.md                    # 프로젝트 설명서
├── tailwind.config.ts           # Tailwind CSS 설정
├── tsconfig.json                # TypeScript 설정
│
├── src/                         # 소스 코드 루트
│   │
│   ├── actions/                 # Server Actions
│   │   └── projects.ts          # 프로젝트 관련 Server Actions
│   │
│   ├── app/                     # Next.js App Router (라우팅 전용)
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── page.tsx             # 홈 페이지
│   │   ├── globals.css          # 전역 스타일
│   │   ├── favicon.ico          # 파비콘
│   │   │
│   │   ├── fonts/               # 폰트 파일
│   │   │   ├── GeistVF.woff
│   │   │   └── GeistMonoVF.woff
│   │   │
│   │   ├── about/               # 소개 페이지
│   │   │   └── page.tsx
│   │   │
│   │   ├── blog/                # 블로그 페이지
│   │   │   ├── page.tsx         # 블로그 목록
│   │   │   └── [slug]/          # 블로그 상세 (동적 라우팅)
│   │   │       └── page.tsx
│   │   │
│   │   ├── contact/             # 연락처 페이지
│   │   │   └── page.tsx
│   │   │
│   │   └── portfolio/           # 포트폴리오 페이지
│   │       ├── page.tsx         # 포트폴리오 목록
│   │       └── [id]/            # 포트폴리오 상세 (동적 라우팅)
│   │           └── page.tsx
│   │
│   ├── components/              # 공통 컴포넌트 (레거시/공통 UI)
│   │   ├── header.tsx           # 헤더 컴포넌트
│   │   ├── footer.tsx           # 푸터 컴포넌트
│   │   ├── theme-provider.tsx   # 테마 프로바이더
│   │   ├── theme-toggle.tsx     # 테마 토글 버튼
│   │   │
│   │   ├── portfolio/           # 포트폴리오 관련 컴포넌트
│   │   │   └── portfolio-list.tsx
│   │   │
│   │   ├── sections/            # 섹션 컴포넌트 (레거시)
│   │   │   ├── hero-section.tsx
│   │   │   ├── featured-projects.tsx
│   │   │   ├── latest-posts.tsx
│   │   │   └── skills-section.tsx
│   │   │
│   │   └── ui/                  # shadcn/ui 컴포넌트 (레거시)
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── skeleton.tsx
│   │       └── tabs.tsx
│   │
│   ├── entities/                # FSD: Entities (비즈니스 엔티티)
│   │   │
│   │   ├── post/                # 포스트 엔티티
│   │   │   ├── api/             # 데이터 페칭
│   │   │   │   ├── get-all-post-slugs.ts
│   │   │   │   ├── get-deep-dive-posts.ts
│   │   │   │   ├── get-post-by-slug.ts
│   │   │   │   ├── get-posts.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/           # 타입 정의
│   │   │   │   └── types.ts
│   │   │   └── ui/              # UI 컴포넌트
│   │   │       └── post-card.tsx
│   │   │
│   │   └── project/             # 프로젝트 엔티티
│   │       ├── api/             # 데이터 페칭
│   │       │   ├── get-all-project-ids.ts
│   │       │   ├── get-project-by-id.ts
│   │       │   ├── get-projects.ts
│   │       │   └── index.ts
│   │       ├── model/           # 타입 정의
│   │       │   └── types.ts
│   │       └── ui/              # UI 컴포넌트
│   │           └── project-card.tsx
│   │
│   ├── features/                # FSD: Features (기능 단위)
│   │   │
│   │   ├── blog-search/         # 블로그 검색 기능
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── blog-search.tsx
│   │   │
│   │   ├── contact/             # 문의 폼 기능
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── contact-form.tsx
│   │   │
│   │   ├── post-interaction/    # 포스트 상호작용 (좋아요, 조회수)
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── post-interaction.tsx
│   │   │
│   │   ├── post-toc/            # 포스트 목차 (Table of Contents)
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── post-toc.tsx
│   │   │
│   │   └── project-filter/      # 프로젝트 필터 기능
│   │       ├── index.ts
│   │       └── ui/
│   │           └── project-filter.tsx
│   │
│   ├── shared/                  # FSD: Shared (공유 리소스)
│   │   │
│   │   ├── config/              # 설정 파일
│   │   │   └── profile.ts       # 프로필 설정
│   │   │
│   │   ├── lib/                 # 유틸리티 함수
│   │   │   ├── supabase/        # Supabase 클라이언트
│   │   │   │   ├── client.ts    # 클라이언트 사이드 클라이언트
│   │   │   │   ├── server.ts    # 서버 사이드 클라이언트
│   │   │   │   └── static.ts    # 정적 클라이언트
│   │   │   └── utils.ts         # 공통 유틸리티
│   │   │
│   │   ├── mdx/                 # MDX 관련 설정 및 컴포넌트
│   │   │   ├── code-block.tsx   # 코드 블록 컴포넌트
│   │   │   ├── components.tsx   # MDX 커스텀 컴포넌트
│   │   │   ├── mdx-component.tsx # MDX 래퍼 컴포넌트
│   │   │   └── mdx-options.ts   # MDX 옵션 설정
│   │   │
│   │   └── ui/                  # shadcn/ui 공유 컴포넌트
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── markdown-viewer.tsx
│   │       ├── tabs.tsx
│   │       └── textarea.tsx
│   │
│   ├── widgets/                 # FSD: Widgets (위젯 블록)
│   │   │
│   │   ├── about/               # 소개 페이지 위젯
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── about-page.tsx
│   │   │
│   │   ├── blog/                # 블로그 위젯
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       ├── post-detail-section.tsx
│   │   │       └── post-list-section.tsx
│   │   │
│   │   ├── contact/             # 연락처 위젯
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── contact-page.tsx
│   │   │
│   │   ├── home/                # 홈 페이지 위젯
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       ├── featured-projects.tsx
│   │   │       ├── hero-section.tsx
│   │   │       ├── home-page.tsx
│   │   │       ├── latest-deep-dives.tsx
│   │   │       ├── latest-posts.tsx
│   │   │       └── skills-section.tsx
│   │   │
│   │   ├── portfolio/           # 포트폴리오 위젯
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       ├── portfolio-grid.tsx
│   │   │       └── project-modal.tsx
│   │   │
│   │   └── project-detail/      # 프로젝트 상세 위젯
│   │       ├── index.ts
│   │       └── ui/
│   │           └── project-detail.tsx
│   │
│   ├── type/                    # 타입 정의
│   │   └── supabase.ts          # Supabase 타입 정의
│   │
│   ├── lib/                     # 레거시 라이브러리
│   │   ├── supabase/            # 레거시 Supabase 클라이언트
│   │   │   ├── client.ts
│   │   │   ├── queries.ts
│   │   │   └── server.ts
│   │   └── utils.ts             # 레거시 유틸리티
│   │
│   └── doc/                     # 문서
│       ├── code-review-report.md
│       ├── phase1.md
│       ├── phase2.md
│       ├── phase3.md
│       └── phase4.md
│
└── node_modules/                # 의존성 패키지 (자동 생성)
```

## 아키텍처 설명

### FSD (Feature-Sliced Design) 구조

이 프로젝트는 **FSD 아키텍처**를 기반으로 구성되어 있습니다:

1. **`app/`** - 라우팅 전용, 비즈니스 로직 없음
2. **`widgets/`** - 페이지를 구성하는 큰 UI 블록
3. **`features/`** - 재사용 가능한 기능 단위
4. **`entities/`** - 비즈니스 모델 데이터 및 UI (api, model, ui 분리)
5. **`shared/`** - 공유 리소스 (shadcn/ui, 유틸리티, MDX 설정)

### 주요 폴더 설명

- **`src/app/`**: Next.js 14 App Router를 사용한 페이지 라우팅
- **`src/entities/`**: 도메인 엔티티별로 `api/`, `model/`, `ui/` 분리
- **`src/features/`**: 독립적인 기능 단위 (검색, 필터, TOC 등)
- **`src/widgets/`**: 여러 feature와 entity를 조합한 복합 위젯
- **`src/shared/`**: 프로젝트 전역에서 사용하는 공유 리소스
- **`src/components/`**: 레거시/공통 컴포넌트 (Header, Footer 등)
- **`src/lib/`**: 레거시 라이브러리 (점진적으로 `shared/lib`로 마이그레이션)

