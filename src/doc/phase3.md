# Phase 3: 블로그 시스템 구현 (MDX Engine)

## 작업 개요

Phase 3에서는 Supabase의 `posts` 테이블을 활용하여 MDX 기반 기술 블로그 시스템을 구현했습니다. 검색/필터링 기능, 목차(TOC), 코드 하이라이팅 등 개발자 블로그에 필요한 기능들을 FSD 아키텍처 원칙에 따라 체계적으로 구축했습니다.

## 구현 과정

### 1. 패키지 설치 및 환경 설정

#### 1.1 필수 패키지 설치
- **next-mdx-remote**: 서버 컴포넌트에서 MDX 렌더링을 위한 라이브러리
- **rehype-pretty-code**: 코드 블록 신택스 하이라이팅
- **rehype-slug**: 헤딩에 slug 자동 생성 (목차용)
- **rehype-autolink-headings**: 헤딩에 앵커 링크 자동 생성
- **shiki**: 코드 하이라이팅 엔진 (rehype-pretty-code의 의존성)
- **gray-matter**: 메타데이터 파싱 (향후 확장용)

#### 1.2 패키지 선택 이유
- **next-mdx-remote**: Next.js 14 App Router와 완벽 호환, 서버 컴포넌트 지원
- **rehype 플러그인 체인**: MDX 파이프라인을 유연하게 구성 가능
- **shiki**: VS Code와 동일한 하이라이팅 엔진 사용

### 2. Shared Layer 구현 (`src/shared/mdx`)

#### 2.1 MDX 컴포넌트 맵 (`components.tsx`)

**디자인 토큰 준수:**
- 하드코딩된 색상 대신 Semantic Token 사용
- `text-foreground`, `text-muted-foreground`, `bg-card` 등 활용
- 다크모드 자동 지원

**구현된 컴포넌트:**
- **헤딩 (h1-h4)**: 계층적 스타일링, `scroll-mt-20`으로 앵커 링크 오프셋
- **문단 (p)**: `text-lg leading-7`로 가독성 최적화
- **리스트 (ul, ol, li)**: 적절한 간격과 들여쓰기
- **링크 (a)**: 외부 링크 자동 감지 및 `target="_blank"` 적용
- **이미지 (img)**: Next.js Image 컴포넌트로 최적화
- **코드 (code, pre)**: 인라인 코드와 코드 블록 구분
- **테이블 (table)**: 반응형 래퍼 포함

**추론 과정:**
```typescript
// 외부 링크 자동 감지 로직
const isExternal = href?.startsWith("http")
const Component = isExternal ? "a" : Link

// 이유: 내부 링크는 Next.js Link로, 외부 링크는 일반 <a> 태그로 처리
// 성능 최적화 및 SEO 개선
```

#### 2.2 CodeBlock 컴포넌트 (`code-block.tsx`)

**구현 특징:**
- **복사 버튼**: 클립보드 API 활용
- **언어 표시**: 코드 블록 상단에 언어 뱃지
- **상태 관리**: 복사 성공 시 피드백 제공
- **접근성**: `aria-label` 추가

**디자인 결정:**
- 코드 블록 헤더: `bg-muted`로 구분
- 복사 버튼: 호버 시 색상 변경으로 인터랙션 피드백
- 코드 영역: `bg-muted` 사용 (디자인 토큰 준수)

**추론 과정:**
```typescript
// Optimistic UI 패턴 적용
const [copied, setCopied] = useState(false)
// 즉시 UI 업데이트 후 실제 복사 작업 수행
// 사용자 경험 향상
```

#### 2.3 MdxComponent (`mdx-component.tsx`)

**구현 전략:**
- `next-mdx-remote/rsc` 사용: 서버 컴포넌트 지원
- 커스텀 컴포넌트 맵 통합
- CodeBlock을 pre 태그에 매핑

#### 2.4 MDX 옵션 설정 (`mdx-options.ts`)

**플러그인 체인:**
1. **rehypeSlug**: 헤딩에 id 속성 자동 추가
2. **rehypeAutolinkHeadings**: 헤딩에 앵커 링크 자동 생성
3. **rehypePrettyCode**: 코드 블록 하이라이팅

**설정 세부사항:**
- 테마: `github-dark` (VS Code 스타일)
- 하이라이트된 라인: `highlighted` 클래스 추가
- 하이라이트된 단어: `highlighted-word` 클래스 추가

### 3. Entities Layer 구현 (`src/entities/post`)

#### 3.1 API 함수들

**`getPosts()`**
- 모든 게시글 조회 (목록용)
- `published: true` 필터링
- `published_at` 기준 내림차순 정렬

**`getPostBySlug(slug: string)`**
- 특정 slug의 게시글 조회
- `.maybeSingle()` 사용: 레코드 없을 때 null 반환
- `published: true` 필터링

**`getAllPostSlugs()`**
- `generateStaticParams`를 위한 slug 목록 조회
- 최적화: `select('slug')`로 필요한 필드만 조회

#### 3.2 PostCard 컴포넌트

**디자인 특징:**
- `ProjectCard`와 유사한 디자인 언어
- 썸네일, 제목, 요약, 태그, 작성일, 읽기 시간 표시
- 호버 효과: 이미지 확대, 그림자 증가

**날짜 포맷팅:**
```typescript
// 한국어 로케일 사용
format(new Date(post.published_at), "yyyy년 M월 d일", { locale: ko })
// 결과: "2024년 1월 15일" 형식
```

**태그 표시:**
- 최대 3개만 표시, 나머지는 "+N" 형식
- `ProjectCard`와 일관된 UX

### 4. Features Layer 구현

#### 4.1 BlogSearch (`src/features/blog-search`)

**구현 특징:**
- **실시간 검색**: `useMemo`로 성능 최적화
- **태그 필터링**: 다중 선택 가능
- **검색 범위**: 제목, 요약, 본문 내용 검색

**상태 관리:**
```typescript
const [searchQuery, setSearchQuery] = useState("")
const [selectedTags, setSelectedTags] = useState<string[]>([])

// 필터링 로직
const filteredPosts = useMemo(() => {
  // 검색어 필터링
  // 태그 필터링
  return filtered
}, [posts, searchQuery, selectedTags])
```

**추론 과정:**
- **클라이언트 사이드 필터링**: 서버 요청 없이 즉시 결과 표시
- **useMemo 활용**: 불필요한 재계산 방지
- **부모 컴포넌트 콜백**: 필터링 결과를 위젯으로 전달

#### 4.2 PostToc (`src/features/post-toc`)

**구현 특징:**
- **자동 헤딩 감지**: `document.querySelectorAll("h2, h3")` 사용
- **Intersection Observer**: 현재 읽고 있는 섹션 감지
- **스무스 스크롤**: 클릭 시 해당 섹션으로 부드럽게 이동

**Intersection Observer 설정:**
```typescript
{
  rootMargin: "-20% 0% -80% 0%",
  // 뷰포트 상단 20% 지점에 들어오면 활성화
  // 뷰포트 하단 80% 지점을 벗어나면 비활성화
}
```

**스크롤 오프셋:**
```typescript
const offset = 80 // 헤더 높이 고려
const offsetPosition = elementPosition + window.pageYOffset - offset
// Sticky 헤더 때문에 오프셋 필요
```

**추론 과정:**
- **Sticky 포지션**: 목차를 고정하여 항상 접근 가능
- **레벨별 들여쓰기**: h3는 `pl-4`로 시각적 계층 표현
- **활성 상태 하이라이트**: `text-primary`로 현재 섹션 강조

#### 4.3 PostInteraction (`src/features/post-interaction`)

**구현 특징:**
- **Optimistic UI**: 좋아요 클릭 시 즉시 UI 업데이트
- **에러 처리**: 실패 시 롤백
- **조회수 표시**: 읽기 전용

**Optimistic UI 패턴:**
```typescript
// 1. 즉시 UI 업데이트
setIsLiked(true)
setLikeCount((prev) => prev + 1)

// 2. 서버 요청
try {
  // Supabase 업데이트
} catch (error) {
  // 3. 실패 시 롤백
  setIsLiked(false)
  setLikeCount((prev) => prev - 1)
}
```

**추론 과정:**
- **사용자 경험 우선**: 네트워크 지연을 느끼지 않도록 즉시 피드백
- **에러 복구**: 실패 시 원래 상태로 복원하여 일관성 유지
- **TODO 주석**: 향후 Supabase 연동을 위한 확장 포인트 명시

### 5. Widgets Layer 구현 (`src/widgets/blog`)

#### 5.1 PostListSection

**구현 특징:**
- **BlogSearch 통합**: 검색 및 필터링 기능
- **Framer Motion**: 필터링 결과 변경 시 애니메이션
- **빈 상태 처리**: 검색 결과 없을 때 메시지 표시

**상태 관리:**
```typescript
const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)

// BlogSearch에서 필터링 결과를 콜백으로 전달
<BlogSearch posts={posts} onFilteredPostsChange={setFilteredPosts} />
```

#### 5.2 PostDetailSection

**레이아웃 구조:**
```
[본문 (flex-1)] [목차 (250px, sticky)]
```

**구현 특징:**
- **서버 컴포넌트**: MDX 직렬화를 서버에서 수행
- **목차 사이드바**: 데스크톱에서만 표시 (`hidden lg:block`)
- **이전/다음 글 네비게이션**: 게시글 순서 기반

**MDX 직렬화:**
```typescript
const mdxSource = await serialize(post.content, {
  ...mdxOptions.mdxOptions,
  parseFrontmatter: true,
})
```

**추론 과정:**
- **서버 사이드 직렬화**: 빌드 타임에 MDX를 파싱하여 성능 최적화
- **목차 위치**: 본문 오른쪽에 고정하여 스크롤 시에도 접근 가능
- **반응형**: 모바일에서는 목차 숨김 (공간 절약)

### 6. App Layer 구현 (`src/app/blog`)

#### 6.1 블로그 목록 페이지 (`/page.tsx`)

**구현 전략:**
- 서버 컴포넌트에서 데이터 페칭
- SEO를 위한 메타데이터 설정
- 위젯에 데이터 전달

#### 6.2 게시글 상세 페이지 (`/[slug]/page.tsx`)

**SSG 구현:**
- `generateStaticParams`: 빌드 타임에 모든 게시글 페이지 생성
- `generateMetadata`: 동적 메타데이터 생성
- `notFound()`: 게시글 없을 때 404 페이지

**MDX 직렬화:**
- 서버 컴포넌트에서 `serialize` 함수 호출
- `mdxOptions` 적용하여 플러그인 체인 실행
- 직렬화된 결과를 위젯에 전달

**이전/다음 글 로직:**
```typescript
const allPosts = await getPosts()
const currentIndex = allPosts.findIndex((p) => p.slug === slug)
const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
const nextPost = currentIndex < allPosts.length - 1 
  ? allPosts[currentIndex + 1] 
  : null
```

## 주요 기술적 결정 사항

### 1. MDX 렌더링 전략

**선택: next-mdx-remote (RSC)**
- **이유**: 
  - Next.js 14 App Router와 완벽 호환
  - 서버 컴포넌트에서 직접 사용 가능
  - 빌드 타임 최적화 가능

**대안 고려:**
- `@next/mdx`: 파일 기반 MDX만 지원 (DB 저장 불가)
- `mdx-bundler`: 클라이언트 사이드 렌더링 필요

### 2. 코드 하이라이팅

**선택: rehype-pretty-code + shiki**
- **이유**:
  - VS Code와 동일한 하이라이팅 엔진
  - 테마 지원 (github-dark)
  - 라인 하이라이팅, 단어 하이라이팅 지원

**대안 고려:**
- `prismjs`: 더 가볍지만 기능 제한적
- `highlight.js`: 널리 사용되지만 커스터마이징 어려움

### 3. 목차 구현 방식

**선택: Intersection Observer**
- **이유**:
  - 네이티브 API로 성능 우수
  - 스크롤 위치에 따른 자동 업데이트
  - 추가 라이브러리 불필요

**대안 고려:**
- `react-intersection-observer`: 라이브러리 의존성 추가
- 스크롤 이벤트 리스너: 성능 이슈 가능

### 4. 검색 구현 방식

**선택: 클라이언트 사이드 필터링**
- **이유**:
  - 즉시 결과 표시 (서버 요청 없음)
  - 사용자 경험 향상
  - 게시글 수가 많지 않을 때 효율적

**향후 개선:**
- 게시글 수가 많아지면 서버 사이드 검색 고려
- Full-text search (PostgreSQL) 활용

### 5. Optimistic UI 패턴

**선택: 즉시 UI 업데이트 후 서버 동기화**
- **이유**:
  - 사용자가 네트워크 지연을 느끼지 않음
  - 인터랙티브한 사용자 경험
  - 실패 시 롤백으로 일관성 유지

## 성능 최적화 고려사항

### 1. SSG (Static Site Generation)
- 빌드 타임에 모든 게시글 페이지 생성
- 초기 로딩 시간 단축
- SEO 최적화

### 2. MDX 직렬화
- 서버에서 한 번만 수행
- 직렬화된 결과를 재사용
- 클라이언트 번들 크기 감소

### 3. 이미지 최적화
- Next.js Image 컴포넌트 사용
- 자동 WebP 변환
- Lazy loading

### 4. 코드 스플리팅
- 클라이언트 컴포넌트만 동적 import
- Framer Motion은 클라이언트에서만 로드

### 5. 메모이제이션
- `useMemo`로 필터링 결과 캐싱
- 불필요한 재계산 방지

## 고려했지만 미구현된 기능

### 1. 서버 사이드 검색
- 현재는 클라이언트 사이드 필터링만 지원
- 향후 Full-text search 도입 검토

### 2. 댓글 시스템
- Supabase의 실시간 기능 활용 가능
- 향후 Phase에서 구현 가능

### 3. 관련 게시글 추천
- 태그 기반 유사도 계산
- 머신러닝 기반 추천 시스템

### 4. 조회수 증가 로직
- 현재는 표시만 함
- Supabase 함수로 자동 증가 구현 가능

### 5. 게시글 시리즈
- `post_series` 테이블 활용
- 연재물 형태의 게시글 그룹화

## 테스트 및 검증

### 린터 오류
- 모든 파일에서 린터 오류 없음 확인
- TypeScript 타입 체크 통과

### 기능 테스트
- 검색 기능: 제목, 내용 검색 확인
- 태그 필터링: 다중 선택 동작 확인
- 목차: 헤딩 감지 및 스크롤 동작 확인
- 코드 복사: 클립보드 API 동작 확인

## 향후 개선 방향

1. **검색 기능 강화**
   - 서버 사이드 Full-text search
   - 검색어 하이라이팅
   - 검색 기록 저장

2. **성능 최적화**
   - ISR 도입 검토 (게시글 업데이트 빈도에 따라)
   - 이미지 CDN 활용
   - 코드 블록 하이라이팅 캐싱

3. **접근성 개선**
   - 키보드 네비게이션
   - 스크린 리더 지원
   - ARIA 레이블 추가

4. **SEO 강화**
   - Open Graph 메타데이터
   - 구조화된 데이터 (JSON-LD)
   - 사이트맵 생성

5. **사용자 경험 개선**
   - 읽기 진행률 표시
   - 다크모드 코드 블록 테마 전환
   - 인쇄 스타일 최적화

## 파일 구조

```
src/
├── shared/
│   └── mdx/
│       ├── components.tsx        # MDX 컴포넌트 맵
│       ├── code-block.tsx       # 코드 블록 컴포넌트
│       ├── mdx-component.tsx    # MDX 렌더링 컴포넌트
│       └── mdx-options.ts        # MDX 옵션 설정
├── entities/
│   └── post/
│       ├── api/                  # 데이터 페칭
│       ├── model/                # 타입 정의
│       └── ui/                   # PostCard
├── features/
│   ├── blog-search/              # 검색 및 필터링
│   ├── post-toc/                 # 목차
│   └── post-interaction/         # 좋아요 및 조회수
├── widgets/
│   └── blog/
│       ├── post-list-section.tsx # 목록 위젯
│       └── post-detail-section.tsx # 상세 위젯
└── app/
    └── blog/
        ├── page.tsx              # 목록 페이지
        └── [slug]/
            └── page.tsx          # 상세 페이지 (SSG)
```

## 참고 자료

- [next-mdx-remote 문서](https://github.com/hashicorp/next-mdx-remote)
- [rehype-pretty-code 문서](https://rehype-pretty-code.netlify.app/)
- [shiki 문서](https://shiki.matsu.io/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Next.js App Router 문서](https://nextjs.org/docs/app)

