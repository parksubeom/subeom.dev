# FSD 아키텍처 & 디자인 시스템 코드 리뷰 리포트

**검토 일자**: 2024년  
**검토 범위**: `src/` 전체  
**검토 기준**: FSD (Feature-Sliced Design) 원칙 및 디자인 시스템 규칙

---

## 📊 종합 평가

| 항목 | 상태 | 점수 |
|------|------|------|
| 폴더 구조 및 의존성 (FSD) | ⚠️ **부분 준수** | 6/10 |
| 디자인 시스템 및 스타일링 | ✅ **양호** | 9/10 |
| 성능 및 모범 사례 (Next.js) | ✅ **양호** | 9/10 |

---

## 1. 폴더 구조 및 의존성 (FSD)

### ❌ **FAIL: App Layer에서 하위 레이어 직접 import**

**문제점:**
- `src/app/page.tsx`에서 `@/components/sections`와 `@/lib/supabase/queries`를 직접 import
- FSD 원칙: App Layer는 Widgets만 import해야 함

**위반 파일:**
```typescript
// ❌ src/app/page.tsx
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { LatestPosts } from "@/components/sections/latest-posts"
import { SkillsSection } from "@/components/sections/skills-section"
import { getFeaturedProjects, getLatestPosts, getProfile } from "@/lib/supabase/queries"
```

**올바른 구조:**
```typescript
// ✅ src/app/page.tsx (수정 후)
import { HomePage } from "@/widgets/home-page"

export default async function HomePage() {
  return <HomePage />
}
```

**리팩토링 필요:**
1. `components/sections` → `widgets/home`으로 이동
2. 데이터 페칭 로직을 위젯 내부로 이동
3. App Layer는 순수하게 라우팅만 담당

---

### ⚠️ **WARNING: App Layer에 비즈니스 로직 포함**

**문제점:**
- `src/app/blog/[slug]/page.tsx`에서 이전/다음 게시글 찾기 로직이 있음
- 이는 위젯으로 이동해야 함

**위반 코드:**
```typescript
// ❌ src/app/blog/[slug]/page.tsx (53-58줄)
// 이전/다음 게시글 찾기
const allPosts = await getPosts()
const currentIndex = allPosts.findIndex((p) => p.slug === slug)
const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
```

**리팩토링:**
- 이 로직을 `PostDetailSection` 위젯 내부로 이동

---

### ✅ **PASS: Widgets vs Features 분리**

**상태**: 양호
- `Widgets`는 독립적인 UI 블록으로 잘 구성됨
- `Features`는 재사용 가능한 기능 단위로 분리됨
- 의존성 방향 준수: Widgets → Features → Entities → Shared

**예시:**
```typescript
// ✅ src/widgets/blog/ui/post-list-section.tsx
import { BlogSearch } from "@/features/blog-search"  // Features
import { PostCard } from "@/entities/post/ui/post-card"  // Entities
```

---

### ⚠️ **WARNING: components/sections가 FSD 구조에 맞지 않음**

**문제점:**
- `src/components/sections/`가 FSD 구조에 포함되지 않음
- 이들은 `widgets`로 이동해야 함

**위반 파일:**
- `src/components/sections/hero-section.tsx`
- `src/components/sections/featured-projects.tsx`
- `src/components/sections/latest-posts.tsx`
- `src/components/sections/skills-section.tsx`

**리팩토링 필요:**
```
src/components/sections/ → src/widgets/home/
```

---

### ⚠️ **WARNING: components/ui와 shared/ui 중복**

**문제점:**
- `src/components/ui/`와 `src/shared/ui/`에 동일한 컴포넌트가 중복 존재
- FSD 원칙: 공유 컴포넌트는 `shared/ui`에만 있어야 함

**중복 파일:**
- `badge.tsx` (components/ui, shared/ui)
- `button.tsx` (components/ui, shared/ui)
- `card.tsx` (components/ui, shared/ui)
- `tabs.tsx` (components/ui, shared/ui)
- `input.tsx` (components/ui, shared/ui)

**리팩토링 필요:**
- `components/ui/` 폴더 제거
- 모든 import를 `@/shared/ui`로 통일

---

### ✅ **PASS: Entities 구조**

**상태**: 양호
- `api/`, `model/`, `ui/`가 잘 분리됨
- 타입 정의가 명확함

---

## 2. 디자인 시스템 및 스타일링

### ✅ **PASS: Semantic Tokens 사용**

**상태**: 양호
- 하드코딩된 색상 값 없음
- 모든 색상이 Semantic Token 사용 (`bg-primary`, `text-foreground` 등)
- CSS 변수 기반으로 다크모드 자동 지원

**검증 결과:**
- `bg-blue-500`, `#ffffff` 같은 하드코딩 없음 ✅
- `bg-primary`, `bg-background` 등 Semantic Token 사용 ✅

---

### ✅ **PASS: CVA 사용**

**상태**: 양호
- 변형이 필요한 컴포넌트가 CVA로 구현됨

**구현된 컴포넌트:**
- ✅ `shared/ui/button.tsx` - CVA 사용
- ✅ `shared/ui/badge.tsx` - CVA 사용
- ✅ `entities/project/ui/project-card.tsx` - CVA 사용

**예시:**
```typescript
// ✅ src/entities/project/ui/project-card.tsx
const projectCardVariants = cva(
  "h-full overflow-hidden transition-shadow group",
  {
    variants: {
      variant: {
        default: "hover:shadow-lg",
        featured: "hover:shadow-xl border-2 border-primary/20",
        compact: "hover:shadow-md",
      },
    },
  }
)
```

---

### ✅ **PASS: 다크 모드 구현**

**상태**: 양호
- CSS 변수 기반으로 자동 처리
- `dark:` 접두사 남발 없음
- `globals.css`에서 변수 정의로 일관성 유지

---

## 3. 성능 및 모범 사례 (Next.js)

### ✅ **PASS: Image Optimization**

**상태**: 양호
- 모든 이미지가 `next/image` 사용
- `<img>` 태그 사용 없음

**검증 결과:**
- `src/components/sections/featured-projects.tsx` - ✅ `Image` 사용
- `src/components/sections/latest-posts.tsx` - ✅ `Image` 사용
- `src/entities/project/ui/project-card.tsx` - ✅ `Image` 사용
- `src/entities/post/ui/post-card.tsx` - ✅ `Image` 사용

---

### ✅ **PASS: Link 사용**

**상태**: 양호
- 내부 이동에 `next/link` 사용
- 외부 링크는 `<a>` 태그 사용 (올바름)

**검증 결과:**
- 모든 내부 링크가 `Link` 컴포넌트 사용 ✅
- 외부 링크는 `target="_blank"`와 함께 `<a>` 사용 ✅

---

### ⚠️ **WARNING: Server Components 최적화**

**상태**: 대부분 양호, 일부 개선 필요

**문제점:**
- `src/app/blog/[slug]/page.tsx`에서 MDX 직렬화와 이전/다음 게시글 찾기가 App Layer에 있음
- 이는 위젯으로 이동하여 App Layer를 더 단순화할 수 있음

**현재:**
```typescript
// App Layer에서 MDX 직렬화 수행
const mdxSource = await serialize(post.content, {...})
```

**개선 제안:**
- 위젯 내부에서 직렬화 수행 (선택 사항, 현재 구조도 허용 가능)

---

## 📋 수정이 필요한 파일 목록

### 🔴 **긴급 (FSD 위반)**

1. **`src/app/page.tsx`**
   - `@/components/sections` import 제거
   - `@/lib/supabase/queries` import 제거
   - 위젯으로 대체

2. **`src/app/layout.tsx`**
   - `@/components/header`, `@/components/footer` import 확인
   - 필요시 `shared` 또는 `widgets`로 이동

3. **`src/components/sections/` 전체**
   - `src/widgets/home/`로 이동

4. **`src/components/ui/` 전체**
   - 중복 제거 (이미 `shared/ui`에 존재)

### 🟡 **개선 권장**

5. **`src/app/blog/[slug]/page.tsx`**
   - 이전/다음 게시글 찾기 로직을 위젯으로 이동

6. **`src/components/header.tsx`**
   - FSD 구조에 맞게 `shared` 또는 `widgets`로 이동 검토

7. **`src/components/footer.tsx`**
   - FSD 구조에 맞게 `shared` 또는 `widgets`로 이동 검토

---

## 🔧 리팩토링 코드 예시

### 예시 1: App Layer 정리

**Before (❌):**
```typescript
// src/app/page.tsx
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { LatestPosts } from "@/components/sections/latest-posts"
import { SkillsSection } from "@/components/sections/skills-section"
import { getFeaturedProjects, getLatestPosts, getProfile } from "@/lib/supabase/queries"

export default async function Home() {
  const [featuredProjects, latestPosts, profile] = await Promise.all([
    getFeaturedProjects(),
    getLatestPosts(),
    getProfile(),
  ])

  return (
    <>
      <HeroSection name={profile?.name} title={profile?.title} bio={profile?.bio} />
      <FeaturedProjects projects={featuredProjects} />
      <LatestPosts posts={latestPosts} />
      <SkillsSection skills={profile?.skills} />
    </>
  )
}
```

**After (✅):**
```typescript
// src/app/page.tsx
import { HomePage } from "@/widgets/home"

export default async function Home() {
  return <HomePage />
}
```

```typescript
// src/widgets/home/ui/home-page.tsx
import { HeroSection } from "./hero-section"
import { FeaturedProjects } from "./featured-projects"
import { LatestPosts } from "./latest-posts"
import { SkillsSection } from "./skills-section"
import { getFeaturedProjects, getLatestPosts, getProfile } from "@/lib/supabase/queries"

export async function HomePage() {
  const [featuredProjects, latestPosts, profile] = await Promise.all([
    getFeaturedProjects(),
    getLatestPosts(),
    getProfile(),
  ])

  return (
    <>
      <HeroSection name={profile?.name} title={profile?.title} bio={profile?.bio} />
      <FeaturedProjects projects={featuredProjects} />
      <LatestPosts posts={latestPosts} />
      <SkillsSection skills={profile?.skills} />
    </>
  )
}
```

---

### 예시 2: 이전/다음 게시글 로직 이동

**Before (❌):**
```typescript
// src/app/blog/[slug]/page.tsx
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  // ❌ 비즈니스 로직이 App Layer에 있음
  const allPosts = await getPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  return (
    <PostDetailSection
      post={post}
      prevPost={prevPost}
      nextPost={nextPost}
      mdxSource={mdxSource}
    />
  )
}
```

**After (✅):**
```typescript
// src/app/blog/[slug]/page.tsx
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post || !post.content) {
    notFound()
  }

  const mdxSource = await serialize(post.content, {
    ...mdxOptions.mdxOptions,
    parseFrontmatter: true,
  })

  // ✅ 비즈니스 로직 제거, 위젯에 위임
  return <PostDetailSection post={post} mdxSource={mdxSource} />
}
```

```typescript
// src/widgets/blog/ui/post-detail-section.tsx
export async function PostDetailSection({ post, mdxSource }: PostDetailSectionProps) {
  // ✅ 위젯 내부에서 이전/다음 게시글 찾기
  const allPosts = await getPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  // ... 나머지 코드
}
```

---

### 예시 3: components/ui 중복 제거

**Before (❌):**
```typescript
// src/components/sections/featured-projects.tsx
import { Card } from "@/components/ui/card"  // ❌ 잘못된 경로
import { Button } from "@/components/ui/button"  // ❌ 잘못된 경로
```

**After (✅):**
```typescript
// src/widgets/home/ui/featured-projects.tsx
import { Card } from "@/shared/ui/card"  // ✅ 올바른 경로
import { Button } from "@/shared/ui/button"  // ✅ 올바른 경로
```

**작업 순서:**
1. 모든 `@/components/ui/*` import를 `@/shared/ui/*`로 변경
2. `src/components/ui/` 폴더 삭제

---

## 📊 체크리스트 요약

| 항목 | 상태 | 비고 |
|------|------|------|
| **App Layer**: 비즈니스 로직 없음 | ❌ FAIL | `components/sections` 직접 import |
| **App Layer**: 순수 라우팅만 | ⚠️ WARNING | 일부 비즈니스 로직 포함 |
| **Widgets vs Features 분리** | ✅ PASS | 잘 분리됨 |
| **의존성 방향 준수** | ⚠️ WARNING | App → Components 위반 |
| **Entities 구조** | ✅ PASS | api/model/ui 잘 분리 |
| **Semantic Tokens** | ✅ PASS | 하드코딩 없음 |
| **CVA 사용** | ✅ PASS | 변형 컴포넌트에 적용 |
| **다크 모드** | ✅ PASS | CSS 변수 기반 |
| **Image Optimization** | ✅ PASS | next/image 사용 |
| **Link 사용** | ✅ PASS | next/link 사용 |
| **Server Components** | ⚠️ WARNING | 일부 최적화 필요 |

---

## 🎯 우선순위별 개선 계획

### 🔴 **P0 (즉시 수정)**
1. `src/app/page.tsx` - FSD 위반 수정
2. `components/sections` → `widgets/home` 이동
3. `components/ui` 중복 제거

### 🟡 **P1 (단기 개선)**
4. `app/blog/[slug]/page.tsx` - 비즈니스 로직 이동
5. `components/header`, `components/footer` - FSD 구조 검토

### 🟢 **P2 (장기 개선)**
6. 전체 import 경로 통일
7. 문서화 및 가이드라인 작성

---

## ✅ 결론

**전체 평가**: ⚠️ **부분 준수** (7/10)

**강점:**
- 디자인 시스템 준수도 높음 (Semantic Tokens, CVA)
- Next.js 모범 사례 준수 (Image, Link)
- Entities/Features/Widgets 구조는 양호

**개선 필요:**
- App Layer의 FSD 위반 (가장 중요)
- `components/sections`의 FSD 구조 미준수
- 중복 파일 정리

**권장 사항:**
1. 즉시 App Layer 정리 작업 수행
2. `components/sections` → `widgets/home` 이동
3. 모든 import 경로를 FSD 구조에 맞게 통일

