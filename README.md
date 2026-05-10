# subeom.dev

> **AI Co-Pilot과 페어프로그래밍하는 프론트엔드 개발자 박수범의 포트폴리오 & 기술 블로그**
>
> 🔗 Live: [subeomdev.vercel.app](https://subeomdev.vercel.app)

Next.js 14 App Router + Supabase 기반의 풀스택 개인 사이트. **FSD 아키텍처**, **서버 컴포넌트 우선 전략**, **MDX 블로그 엔진**, **동적 OG 이미지**, **Person JSON-LD 기반 SEO**까지 현대 웹 개발의 모범 사례를 실전 적용했습니다.

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| **Framework** | Next.js 14 (App Router) · TypeScript 5 |
| **Styling** | Tailwind CSS · shadcn/ui (Radix UI) |
| **Backend** | Supabase (PostgreSQL · RLS) |
| **Content** | MDX (`next-mdx-remote`) · Shiki · `rehype-pretty-code` |
| **Animation** | Framer Motion |
| **Comments** | Giscus (GitHub Discussions) |
| **Theming** | `next-themes` (다크모드 + CSS 변수) |
| **Deploy** | Vercel |

---

## 아키텍처 — FSD (Feature-Sliced Design)

```
src/
├── app/         # 라우팅 (페이지)
├── widgets/     # 페이지 단위 복합 블록
├── features/    # 재사용 기능 (검색, 필터, TOC, 좋아요)
├── entities/    # 도메인 모델 (post, project)
└── shared/      # 공통 자원 (UI, lib, mdx, config, hooks)
```

**의존성 방향**: `App → Widgets → Features → Entities → Shared` (단방향, 순환 참조 차단)

---

## 시작하기

### 1. 환경 변수 (`.env.local`)

```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # sync 스크립트용 (RLS 우회)

# SEO Verification (선택)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=

# Analytics & Comments (선택)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

### 2. 설치 & 실행

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # 프로덕션 빌드
```

---

## 콘텐츠 작성

블로그 글과 포트폴리오 프로젝트는 **로컬 마크다운 → Supabase 동기화** 패턴으로 관리됩니다.

### 블로그 글 추가
1. `posts/<slug>.md` 작성 (gray-matter frontmatter + 본문)
2. `pnpm sync:posts` 실행 → Supabase `posts` 테이블에 upsert

### 포트폴리오 프로젝트 추가
1. `projects/<slug>.md` 작성 (frontmatter에 `detailInfo` 중첩 객체 포함)
2. `pnpm sync:projects` 실행 → Supabase `projects` 테이블에 upsert (title 기준 update/insert)

> 두 스크립트 모두 `SUPABASE_SERVICE_ROLE_KEY`가 필요합니다. 키는 [Supabase 대시보드 → Project Settings → API](https://supabase.com/dashboard) 에서 복사.

---

## 도메인 & SEO

### 도메인 변경
모든 URL은 [`src/shared/config/site.ts`](src/shared/config/site.ts)의 `SITE_URL` 한 곳에서 관리합니다.

```ts
export const SITE_URL = "https://subeomdev.vercel.app";
// 도메인 변경 시 이 한 줄만 수정 → layout, sitemap, robots, JSON-LD 등 자동 반영
```

### SEO 자동화
- `app/sitemap.ts` — 정적 페이지 + 모든 블로그 포스트 URL 자동 등록
- `app/robots.ts` — 검색엔진 크롤링 정책
- `app/page.tsx` — **Person JSON-LD** (Google 동일인 판별용 `sameAs` 외부 프로필 + `alumniOf` 학력 + `knowsAbout` 키워드)
- `app/blog/[slug]/page.tsx` — **BlogPosting JSON-LD** (작성자/발행일/태그 → 리치 스니펫)

### 동적 이미지 생성 (Edge Runtime)
- `app/opengraph-image.tsx` — GitHub 아바타 + 브랜드 이름 자동 합성 OG 이미지 (1200×630)
- `app/icon.tsx` — 브랜드 컬러 기반 동적 파비콘

---

## 프로젝트 구조

```
subeom.dev/
├── src/
│   ├── app/                  # Next.js App Router (라우팅)
│   ├── widgets/              # 페이지 단위 위젯 (FSD)
│   ├── features/             # 재사용 기능 (FSD)
│   ├── entities/             # 도메인 모델 (FSD: api, model, ui)
│   ├── shared/
│   │   ├── config/           # site.ts, profile.ts (전역 설정)
│   │   ├── lib/supabase/     # Server / Client / Static 분리
│   │   ├── mdx/              # MDX 옵션 + 커스텀 컴포넌트
│   │   ├── ui/               # shadcn/ui 기반 공유 컴포넌트
│   │   └── hooks/            # 커스텀 훅
│   ├── components/           # Header / Footer / ThemeProvider 등
│   └── type/supabase.ts      # DB 자동 생성 타입
├── posts/                    # 블로그 글 (마크다운)
├── projects/                 # 포트폴리오 프로젝트 (마크다운)
└── scripts/
    ├── sync-posts.ts         # posts/ → Supabase
    └── sync-projects.ts      # projects/ → Supabase
```

---

## 주요 기능

| 영역 | 기능 |
|---|---|
| **포트폴리오** | 그리드 + 카테고리 필터 (Framer Motion) · 모달 프리뷰 · 마크다운 상세 설명 |
| **블로그** | MDX 렌더링 · 코드 하이라이팅 (Shiki) · 자동 TOC · 검색/태그 필터 · 좋아요(Optimistic UI) · 조회수 · Giscus 댓글 |
| **About** | 경력 타임라인 · 학력 · 기술 스택 |
| **SEO/브랜딩** | 동적 OG 이미지 · 동적 파비콘 · Person/BlogPosting JSON-LD · `sameAs` 외부 프로필 |
| **모바일** | shadcn/ui Sheet 햄버거 메뉴 · 반응형 그리드 |

---

## 개발 히스토리

| Phase | 핵심 작업 |
|---|---|
| **1. 기본 구조** | Next.js 14 App Router · shadcn/ui · Supabase 클라이언트 (Server/Client 분리) · 다크모드 |
| **2. 포트폴리오** | SSG + Server Actions · Framer Motion 필터 · 마크다운 렌더링 |
| **3. 블로그** | MDX (RSC) · Shiki 빌드타임 하이라이팅 · Intersection Observer TOC · Optimistic UI 좋아요 |
| **4. About / Contact** | 경력 타임라인 · 가치관 섹션 |
| **5. 브랜딩 & SEO** | Code-as-Design · 동적 OG (`next/og`) · Tinted Badge · 모바일 드로어 |
| **6. SEO 강화 & 콘텐츠 인프라** | `SITE_URL` 중앙화 · Person JSON-LD `sameAs`/`alumniOf` 보강 · sitemap 버그 수정 · `projects/` 동기화 시스템 도입 |

---

## 주요 트러블슈팅 기록

| 이슈 | 해결 |
|---|---|
| **Edge Runtime의 `hsl()` 파싱 실패 (500)** | `next/og`에서 그라데이션 색상을 모두 Hex Code로 하드코딩 |
| **Supabase 쿼리 타입 불일치** | `as unknown as Project[]` 안전 캐스팅 + `.eq('featured' as never, true)` 단언 |
| **MDX 직렬화 성능** | `next-mdx-remote/rsc`로 서버 측 빌드타임 직렬화 → 클라이언트 번들 감소 |
| **테마 전환 Hydration 경고** | `suppressHydrationWarning` + `mounted` 상태 가드 |
| **하드코딩 URL 5곳 산재** | `shared/config/site.ts` 단일 진실 소스로 통합 |
| **sitemap에 존재하지 않는 라우트** | `/projects` (404) → `/portfolio`로 정정, `/contact` 추가 |
| **JSON-LD `alumniOf` 잘못된 값** | `"프론트엔드 개발자"` 제거, 실제 학력 (대학교 + 부트캠프) 등록 |

> 각 Phase의 상세 회고는 [`src/doc/phase1.md` ~ `phase4.md`](src/doc/) 참조.

---

## 성능 최적화

- **서버 컴포넌트 우선**: 클라이언트 번들 최소화
- **SSG + ISR (60초)**: 초기 로딩 ↓ + 콘텐츠 신선도 ↑
- **`generateStaticParams`**: 모든 동적 라우트 빌드 타임 생성
- **동적 import**: 모달/무거운 클라이언트 컴포넌트만 분할 로딩
- **`useMemo` / `React.memo`**: 불필요한 재렌더 방지
- **Next.js Image**: 자동 최적화 + Supabase CDN 활용

---

## 참고 자료

- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)

---

## 라이선스

개인 포트폴리오 프로젝트.
