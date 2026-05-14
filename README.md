# subeom.dev

개인 포트폴리오 · 기술 블로그 (Next.js App Router + TypeScript).

**Live:** [subeomdev.vercel.app](https://subeomdev.vercel.app) — 또는 구글에 개발자 박수범 검색.

## 대표 프로젝트

한 줄·링크는 [`projects/`](./projects/) 의 `title` · `description` · `demo_url` · `github_url` 과 맞춰 둡니다.

- **[Claude Code Skills Panel](https://open-vsx.org/extension/parksubeom/claude-skills-panel)** — Claude Code 슬래시 커맨드를 패널에서 클릭 한 번으로 실행하는 VS Code 확장. [GitHub](https://github.com/parksubeom/claude-skills-panel)
- **[claude-distill](https://www.npmjs.com/package/claude-distill)** — Claude Code Stop hook으로 세션 인수인계 노트를 자동 기록하는 npm CLI. [GitHub](https://github.com/parksubeom/claude-distill)
- **[AI 협업 포트폴리오 (subeom.dev)](https://subeomdev.vercel.app)** — Next.js·FSD·Supabase 기반 포트폴리오·기술 블로그(이 저장소가 빌드하는 사이트). [GitHub](https://github.com/parksubeom/subeom.dev)
- **[A11yGym](https://a11y-gym.vercel.app)** — Monaco + axe-core로 KWCAG 2.2 실습·실시간 검증. [GitHub](https://github.com/parksubeom/-A11yGym)
- **[항해플러스 아카이빙](https://parksubeom.github.io/hanghae_frontend_7th_archive/)** — LMS 과제 제출 이력 보존·결함 허용 매칭. [GitHub](https://github.com/parksubeom/hanghae_frontend_7th_archive)
- **[애니스쿨 (Anyschool)](https://parksubeom.github.io/Ani_School/)** — 랜덤 동물 캐릭터 조합·Lambda 이미지 파이프라인. [GitHub](https://github.com/parksubeom/Ani_School)
- **언커버 (Uncover)** — 저작권 클린 음원·영상 매칭 스트리밍(팀 FE). 배포 URL 없음 · [GitHub](https://github.com/sooknise)

---

## 기술 스택 (요약)

| 영역 | 기술 |
|------|------|
| Framework | Next.js **15** (App Router) · React 18 · TypeScript 5 |
| 스타일 | Tailwind CSS · shadcn/ui (Radix) |
| 데이터 | Supabase(PostgreSQL) — **없으면** `posts/` · `projects/` 마크다운 폴백 |
| 콘텐츠 | MDX (`next-mdx-remote`) · Shiki · Giscus |
| 배포 | Vercel |

레이아웃은 **FSD** (`app` → `widgets` → `features` → `entities` → `shared`) 를 따릅니다.

---

## Quick start

```bash
pnpm install
pnpm dev    # http://localhost:3000
pnpm build && pnpm start   # 프로덕션 로컬 확인
```

**`.env.local`** (로컬에서 Supabase·동기화·일부 SEO를 쓸 때)

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 런타임 데이터 |
| `SUPABASE_SERVICE_ROLE_KEY` | `sync:*` 스크립트 (RLS 우회) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 등 | 검색 콘솔 메타 (선택) |
| `NEXT_PUBLIC_GA_ID` · Giscus 관련 | 분석·댓글 (선택) |

Supabase 변수가 **없으면** 블로그/포트폴리오 목록은 **저장소의 마크다운**을 읽습니다.

---

## 콘텐츠 & 스크립트

| 경로 / 명령 | 설명 |
|-------------|------|
| `posts/*.md` | 블로그 — `pnpm sync:posts` 로 DB upsert (키 필요) |
| `projects/*.md` | 포트폴리오 — `pnpm sync:projects` 로 DB upsert |
| `data/threads-insights.md` | 홈 **「요즘의 고민과 생각」** 한 편 (DB 아님, 파일만) |
| `pnpm update:stats` | Open VSX · npm 수치 → `src/shared/config/stats.ts` 등 갱신 |
| `pnpm upload:images` | 이미지 업로드 유틸 |

**CI:** `.github/workflows/update-stats.yml` — 매일 통계 커밋(기본적으로 Supabase sync 는 생략, `SKIP_SUPABASE_SYNC`).

---

## 도메인 · SEO

- 전역 URL: [`src/shared/config/site.ts`](src/shared/config/site.ts) 의 `SITE_URL` 한 곳.
- `sitemap.ts` · `robots.ts` · Person / BlogPosting JSON-LD 등은 앱 라우트 쪽에 정의.

---

## 더 읽을 곳

- 개발 단계·회고: [`src/doc/`](src/doc/) (`phase1.md` ~ `phase4.md` 등)
- SEO 절차: [`src/doc/seo-setup-guide.md`](src/doc/seo-setup-guide.md)

---

## 라이선스

개인 포트폴리오 저장소.
