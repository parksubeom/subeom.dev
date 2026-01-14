# Phase 5: 블로그 UX 개선 (페이지네이션 및 TOC)

## 작업 개요

Phase 5에서는 블로그 시스템의 사용자 경험을 크게 개선했습니다. 블로그 목록 페이지에 페이지네이션을 추가하여 긴 목록을 효율적으로 탐색할 수 있도록 했고, 블로그 상세 페이지에 목차(TOC) 및 스크롤 스파이 기능을 구현하여 긴 글을 읽을 때 현재 위치를 파악하고 원하는 섹션으로 빠르게 이동할 수 있도록 했습니다.

## 구현 과정

### 1. 블로그 페이지네이션 구현

#### 1.1 문제 정의 및 요구사항

**문제점:**
- 블로그 포스트가 많아질 경우 모든 포스트를 한 번에 로드하여 성능 저하
- 긴 목록으로 인한 사용자 경험 저하
- 검색 기능만으로는 원하는 포스트를 찾기 어려움

**요구사항:**
- 한 페이지에 5개의 포스팅만 표시
- 페이지 번호를 통한 네비게이션
- URL 쿼리 파라미터로 페이지 상태 관리

#### 1.2 데이터 페칭 로직 개선

**파일: `src/entities/post/api/get-posts.ts`**

**구현 전략:**
```typescript
export async function getPosts(page: number = 1, limit: number = 5): Promise<Post[]> {
  const supabase = createStaticClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .range(from, to);  // Supabase의 range 메서드 활용

  return data as Post[];
}
```

**추론 과정:**
- **Supabase `range()` 메서드 사용**: `offset`과 `limit` 대신 `range(from, to)`를 사용한 이유는 Supabase의 권장 방식이며, 더 명확한 범위 지정이 가능하기 때문
- **기본값 설정**: `page = 1, limit = 5`로 설정하여 기존 코드와의 호환성 유지
- **서버 사이드 페칭**: 클라이언트 사이드 필터링과 달리 서버에서 필요한 데이터만 가져와 성능 최적화

**전체 포스트 개수 조회 함수 추가:**
```typescript
export async function getTotalPostsCount(): Promise<number> {
  const supabase = createStaticClient();
  
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  return count || 0;
}
```

**고려사항:**
- `head: true` 옵션으로 데이터를 가져오지 않고 개수만 조회하여 성능 최적화
- 에러 발생 시 0을 반환하여 UI가 깨지지 않도록 방어적 프로그래밍

#### 1.3 App Layer 수정

**파일: `src/app/blog/page.tsx`**

**구현:**
```typescript
interface BlogPageProps {
  searchParams: { page?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const limit = 5;
  
  const [posts, totalCount] = await Promise.all([
    getPosts(currentPage, limit),
    getTotalPostsCount(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <PostListSection 
      initialPosts={posts} 
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
```

**추론 과정:**
- **`Promise.all` 사용**: 포스트 목록과 전체 개수를 병렬로 조회하여 성능 최적화
- **URL 쿼리 파라미터 처리**: Next.js 14의 `searchParams`를 활용하여 페이지 상태를 URL에 반영
- **기본값 처리**: `page`가 없거나 잘못된 값일 경우 1페이지로 기본 설정

#### 1.4 페이지네이션 UI 구현

**파일: `src/widgets/blog/ui/post-list-section.tsx`**

**구현 특징:**
- **이전/다음 버튼**: 첫 페이지와 마지막 페이지에서 비활성화
- **페이지 번호 표시**: 현재 페이지 주변 2페이지씩만 표시하여 UI 단순화
- **스크롤 최상단 이동**: 페이지 변경 시 `window.scrollTo`로 부드럽게 상단으로 이동
- **URL 업데이트**: `router.push`로 URL 쿼리 파라미터 업데이트

**페이지 번호 표시 로직:**
```typescript
{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
  // 현재 페이지 주변 2페이지씩만 표시
  if (
    page === 1 ||
    page === totalPages ||
    (page >= currentPage - 2 && page <= currentPage + 2)
  ) {
    return <Button key={page} ...>{page}</Button>;
  } else if (page === currentPage - 3 || page === currentPage + 3) {
    return <span key={page}>...</span>;  // 생략 표시
  }
  return null;
})}
```

**고려사항:**
- **UI 단순화**: 모든 페이지 번호를 표시하지 않고 현재 페이지 주변만 표시하여 가독성 향상
- **접근성**: 버튼에 `aria-label` 추가 고려 (향후 개선 가능)
- **검색 기능과의 충돌**: 현재는 페이지네이션된 포스트만 검색하지만, 향후 전체 검색 기능 추가 가능

### 2. 블로그 상세 페이지 TOC 구현

#### 2.1 문제 정의 및 요구사항

**문제점:**
- 긴 블로그 글에서 현재 읽고 있는 섹션을 파악하기 어려움
- 원하는 섹션으로 이동하기 위해 스크롤을 많이 해야 함
- 글의 구조를 한눈에 파악하기 어려움

**요구사항:**
- 헤딩 기반 목차 자동 생성
- 클릭 시 해당 섹션으로 부드럽게 스크롤
- 현재 읽고 있는 섹션 하이라이트
- 데스크탑에서는 고정 위치에 표시, 모바일에서는 상단에 표시

#### 2.2 MarkdownViewer 개선

**파일: `src/shared/ui/markdown-viewer.tsx`**

**구현:**
```typescript
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

<ReactMarkdown 
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[
    rehypeSlug,  // 헤딩에 id 자동 생성
    [
      rehypeAutolinkHeadings,  // 헤딩에 앵커 링크 추가
      {
        behavior: "wrap",
        properties: {
          className: ["anchor-link"],
        },
      },
    ],
  ]}
  components={{
    h1: ({ id, ...props }) => (
      <h1 id={id} className="scroll-mt-20" {...props} />
    ),
    h2: ({ id, ...props }) => (
      <h2 id={id} className="scroll-mt-20" {...props} />
    ),
    // ...
  }}
>
```

**추론 과정:**
- **`rehype-slug`**: 마크다운의 헤딩 텍스트를 기반으로 자동으로 id를 생성 (예: "구현 과정" → "구현-과정")
- **`rehype-autolink-headings`**: 헤딩에 앵커 링크를 자동으로 추가하여 URL 해시로 직접 접근 가능
- **`scroll-mt-20`**: 헤더 높이를 고려한 스크롤 오프셋 (Tailwind의 `scroll-margin-top`)
- **`react-markdown`과의 호환성**: `rehypePlugins` 옵션을 통해 rehype 플러그인 체인 구성

**고려사항:**
- **기존 MDX 시스템과의 차이**: 프로젝트에는 `next-mdx-remote`도 있지만, 현재는 `react-markdown`을 사용 중이므로 rehype 플러그인을 직접 적용
- **성능**: rehype 플러그인은 서버 사이드에서 실행되므로 클라이언트 성능에 영향 없음

#### 2.3 PostToc 컴포넌트 개선

**파일: `src/features/post-toc/ui/post-toc.tsx`**

**헤딩 추출 로직:**
```typescript
useEffect(() => {
  if (typeof window === "undefined") return

  // DOM이 완전히 렌더링된 후 헤딩을 찾도록 지연
  const timeoutId = setTimeout(() => {
    const headings = Array.from(
      document.querySelectorAll("article h2")
    ) as HTMLHeadingElement[]

    const items: TocItem[] = headings.map((heading) => {
      let id = heading.id;
      if (!id) {
        // rehype-slug가 id를 생성하지 않은 경우 대비
        const text = heading.textContent || "";
        id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        heading.id = id;
      }

      return {
        id,
        text: heading.textContent?.replace(/#\s*$/, "").trim() || "",
        level: 2,
      };
    })

    setTocItems(items)
  }, 100);

  return () => clearTimeout(timeoutId);
}, [content])
```

**추론 과정:**
- **지연 처리**: `setTimeout`을 사용한 이유는 마크다운이 렌더링되고 DOM에 반영되는 시간을 고려하기 위함
- **h2만 포함**: 초기에는 h2, h3, h4를 모두 포함했지만, 사용자 요청에 따라 h2만 포함하도록 단순화
- **방어적 프로그래밍**: `rehype-slug`가 id를 생성하지 않은 경우를 대비하여 텍스트 기반 id 생성 로직 추가
- **앵커 링크 제거**: `rehype-autolink-headings`가 추가한 `#` 기호를 텍스트에서 제거

**스크롤 스파이 구현:**
```typescript
useEffect(() => {
  if (tocItems.length === 0) return

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // 가장 위에 있는 헤딩을 활성화
        const sortedEntries = visibleEntries.sort((a, b) => {
          const aTop = a.boundingClientRect.top;
          const bTop = b.boundingClientRect.top;
          return aTop - bTop;
        });
        setActiveId(sortedEntries[0].target.id);
      }
    },
    {
      rootMargin: "-10% 0% -70% 0%",
      threshold: 0,
    }
  )

  tocItems.forEach((item) => {
    const element = document.getElementById(item.id)
    if (element) observer.observe(element)
  })

  return () => {
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.unobserve(element)
    })
  }
}, [tocItems])
```

**추론 과정:**
- **Intersection Observer API**: 스크롤 이벤트 리스너 대신 사용하여 성능 최적화
- **`rootMargin` 튜닝**: `-10% 0% -70% 0%`로 설정하여 화면 상단 10% 영역에 들어온 헤딩을 활성화
- **다중 헤딩 처리**: 여러 헤딩이 동시에 보일 경우 가장 위에 있는 것을 활성화
- **메모리 누수 방지**: cleanup 함수에서 observer 해제

**스크롤 이동 함수:**
```typescript
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100 // 헤더 높이 + 여유 공간
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
    
    // URL 해시 업데이트 (선택사항)
    window.history.pushState(null, "", `#${id}`)
  }
}
```

**고려사항:**
- **오프셋 계산**: 고정 헤더 높이를 고려하여 정확한 위치로 스크롤
- **부드러운 스크롤**: `behavior: "smooth"`로 사용자 경험 향상
- **URL 해시 업데이트**: 브라우저 뒤로가기/앞으로가기 지원 및 링크 공유 가능

#### 2.4 레이아웃 통합

**파일: `src/widgets/blog/ui/post-detail-section.tsx`**

**구현:**
```typescript
<div className="max-w-7xl mx-auto pb-20">
  <article className="max-w-3xl mx-auto space-y-12">
    {/* ... 헤더 영역 ... */}

    {/* TOC - 모바일/태블릿: 상단에 표시 */}
    <div className="lg:hidden border-b border-border/50 pb-6">
      <PostToc content={post.content || ""} />
    </div>

    {/* Content Area with TOC */}
    <div className="relative">
      {/* TOC - 데스크탑: 화면에 고정 */}
      <div className="hidden lg:block fixed top-24 left-1/2 translate-x-[calc(384px+2rem)] w-64">
        <PostToc content={post.content || ""} />
      </div>

      <motion.div className="min-h-[300px]">
        <MarkdownViewer content={post.content} />
      </motion.div>
    </div>
  </article>
</div>
```

**추론 과정:**
- **반응형 디자인**: 
  - 모바일/태블릿: TOC를 콘텐츠 상단에 배치하여 공간 효율성 확보
  - 데스크탑: TOC를 오른쪽에 고정하여 스크롤 시에도 항상 접근 가능
- **고정 위치 계산**: 
  - `left-1/2 translate-x-[calc(384px+2rem)]`: 본문 너비(max-w-3xl = 768px)의 절반 + 여유 공간
  - `top-24`: 헤더 높이를 고려한 상단 여백
- **스크롤 없음**: TOC 내부에 스크롤이 없도록 하여 사용자 요구사항 충족

**고려사항:**
- **접근성**: `aria-label` 추가로 스크린 리더 지원
- **성능**: TOC는 클라이언트 사이드에서만 동작하므로 서버 렌더링에 영향 없음
- **확장성**: 향후 h3, h4도 포함하도록 쉽게 확장 가능

## 주요 기술적 결정 사항

### 1. 페이지네이션 전략

**선택: 서버 사이드 페이지네이션**
- **이유**: 
  - 데이터베이스에서 필요한 데이터만 가져와 성능 최적화
  - SEO 친화적 (각 페이지가 고유한 URL을 가짐)
  - 초기 로딩 속도 향상

**대안 고려:**
- **클라이언트 사이드 페이지네이션**: 모든 데이터를 가져와 클라이언트에서 분할
  - ❌ 데이터가 많을 경우 초기 로딩 시간 증가
  - ❌ 불필요한 데이터 전송
- **무한 스크롤**: 스크롤 시 자동으로 다음 페이지 로드
  - ❌ SEO에 불리
  - ❌ 특정 페이지로 직접 이동 불가

### 2. TOC 구현 전략

**선택: 클라이언트 사이드 DOM 파싱**
- **이유**:
  - 마크다운 렌더링 후 DOM에서 직접 헤딩을 추출하여 정확성 보장
  - 서버 사이드에서 별도 파싱 불필요
  - 동적으로 업데이트 가능

**대안 고려:**
- **서버 사이드 파싱**: 마크다운을 서버에서 파싱하여 TOC 데이터 생성
  - ❌ 추가 서버 로직 필요
  - ❌ 마크다운 렌더링과 중복 작업

### 3. 스크롤 스파이 구현

**선택: Intersection Observer API**
- **이유**:
  - 스크롤 이벤트 리스너보다 성능 우수
  - 브라우저 네이티브 API로 안정성 높음
  - 복잡한 계산 로직 불필요

**대안 고려:**
- **스크롤 이벤트 리스너**: `window.addEventListener('scroll')`
  - ❌ 성능 저하 (throttle/debounce 필요)
  - ❌ 복잡한 위치 계산 로직 필요

## 구현 과정에서의 고려사항

### 1. 성능 최적화

- **병렬 데이터 페칭**: `Promise.all`로 포스트 목록과 전체 개수를 동시에 조회
- **필요한 데이터만 조회**: Supabase의 `range()` 메서드로 페이지네이션
- **Intersection Observer**: 스크롤 이벤트 대신 사용하여 성능 향상

### 2. 사용자 경험

- **부드러운 스크롤**: `behavior: "smooth"`로 자연스러운 이동
- **페이지 변경 시 상단 이동**: 새로운 페이지 로드 시 자동으로 상단으로 스크롤
- **현재 섹션 하이라이트**: 읽고 있는 위치를 시각적으로 표시

### 3. 접근성

- **키보드 네비게이션**: TOC 버튼이 키보드로 접근 가능
- **ARIA 레이블**: `aria-label`로 스크린 리더 지원 (향후 개선 가능)
- **시맨틱 HTML**: `<nav>` 태그 사용

### 4. 반응형 디자인

- **모바일 우선**: 작은 화면에서는 TOC를 상단에 배치
- **데스크탑 최적화**: 큰 화면에서는 고정 사이드바로 항상 접근 가능
- **유연한 레이아웃**: Tailwind의 반응형 클래스 활용

## 트러블슈팅

### 1. TOC가 헤딩을 찾지 못하는 문제

**문제**: 마크다운이 렌더링되기 전에 TOC가 헤딩을 찾으려고 시도

**해결**: `setTimeout`으로 100ms 지연 후 헤딩 추출

**추론**: React의 렌더링 사이클과 DOM 업데이트 타이밍을 고려한 지연 처리

### 2. 스크롤 스파이가 여러 헤딩을 동시에 활성화하는 문제

**문제**: 여러 헤딩이 화면에 보일 때 모두 활성화됨

**해결**: 화면에 보이는 헤딩 중 가장 위에 있는 것만 활성화하도록 정렬 로직 추가

**추론**: 사용자가 실제로 읽고 있는 섹션을 정확히 파악하기 위한 로직

### 3. 고정 위치 계산 오류

**문제**: 데스크탑에서 TOC가 본문과 겹침

**해결**: `translate-x-[calc(384px+2rem)]`로 정확한 위치 계산

**추론**: 본문 너비(max-w-3xl = 768px)의 절반 + 여유 공간을 고려한 계산

## 향후 개선 방향

### 1. 페이지네이션

- **전체 검색 기능**: 현재 페이지의 포스트만 검색하는 제한 해제
- **페이지 크기 선택**: 사용자가 한 페이지에 표시할 포스트 개수 선택 가능
- **URL 상태 관리 개선**: 검색어와 페이지 번호를 동시에 관리

### 2. TOC

- **접을 수 있는 TOC**: 모바일에서 TOC를 접었다 펼 수 있는 기능
- **진행률 표시**: 현재 읽고 있는 섹션의 진행률을 시각적으로 표시
- **h3, h4 포함 옵션**: 사용자 설정으로 하위 헤딩도 포함 가능하도록

### 3. 성능

- **가상 스크롤**: 매우 긴 목록의 경우 가상 스크롤 도입 검토
- **TOC 캐싱**: 헤딩 추출 결과를 캐싱하여 재계산 방지

## 파일 구조

```
src/
├── entities/
│   └── post/
│       └── api/
│           └── get-posts.ts          # 페이지네이션 로직 추가
├── features/
│   └── post-toc/
│       └── ui/
│           └── post-toc.tsx          # TOC 컴포넌트 개선
├── shared/
│   └── ui/
│       └── markdown-viewer.tsx       # rehype 플러그인 추가
└── widgets/
    └── blog/
        └── ui/
            ├── post-list-section.tsx  # 페이지네이션 UI 추가
            └── post-detail-section.tsx # TOC 통합
```

## 참고 자료

- [Supabase Range Query](https://supabase.com/docs/reference/javascript/range)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [rehype-slug](https://github.com/rehypejs/rehype-slug)
- [rehype-autolink-headings](https://github.com/rehypejs/rehype-autolink-headings)

