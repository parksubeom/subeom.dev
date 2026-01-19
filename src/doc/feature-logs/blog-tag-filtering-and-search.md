# 블로그 태그 필터링 및 검색 기능 구현 문서

## 작업 개요

블로그 목록 페이지에 태그 기반 필터링과 클라이언트 사이드 검색 기능을 구현했습니다. 사용자는 태그를 클릭하여 관련 게시물만 필터링하거나, 검색어를 입력하여 제목, 요약, 태그에서 키워드를 검색할 수 있습니다.

### 구현된 기능
- **태그 기반 필터링**: 모든 태그를 상단에 나열하고 클릭 시 해당 태그로 필터링
- **검색 기능**: 제목, 요약, 태그에서 키워드 검색
- **하이브리드 페이지네이션**: 검색 시 클라이언트 사이드, 일반 시 서버 사이드 페이지네이션
- **모바일 최적화**: 터치 영역 확보 및 반응형 레이아웃
- **접근성**: 키보드 네비게이션 및 ARIA 레이블 지원

## 추론 과정

### 1. 문제 정의

**초기 요구사항:**
- 블로그 포스트의 태그를 클릭하여 해당 태그로 필터링된 게시물 목록 보기
- 모든 태그를 상단에 나열하여 키워드처럼 접근 가능하게 하기

**발견된 문제:**
1. 검색 결과가 1개여도 서버 사이드 페이지네이션이 2페이지를 표시하는 문제
2. 검색 결과가 많을 때(예: 9개) 페이지네이션이 제대로 동작하지 않는 문제
3. 모바일 환경에서 태그 클릭 영역이 작아 사용성이 떨어지는 문제

### 2. 아키텍처 결정

#### 2.1 태그 필터링: 서버 사이드 vs 클라이언트 사이드

**선택: 서버 사이드 필터링**

**이유:**
- 태그 필터링은 URL 파라미터(`?tag=react`)로 관리되어 북마크/공유 가능
- 서버에서 필터링하면 불필요한 데이터 전송 없음
- 페이지네이션과 자연스럽게 통합 가능

**구현:**
```typescript
// Supabase의 contains 연산자 활용
if (tag) {
  query = query.contains("tags", [tag]);
}
```

#### 2.2 검색 기능: 서버 사이드 vs 클라이언트 사이드

**선택: 하이브리드 접근**

**이유:**
- **검색어 없을 때**: 서버 사이드 페이지네이션으로 성능 최적화
- **검색어 있을 때**: 클라이언트 사이드 필터링으로 즉각적인 반응

**문제점:**
- 초기 구현에서는 검색어가 있을 때 현재 페이지의 5개 포스트만 필터링하여 전체 검색 결과를 볼 수 없었음

**해결:**
- 검색어가 있을 때는 모든 포스트를 가져와서 클라이언트에서 필터링
- 필터링된 결과를 기반으로 클라이언트 사이드 페이지네이션 구현

### 3. 데이터 흐름 설계

```
┌─────────────────────────────────────────────────────────┐
│                    Blog Page (Server)                    │
├─────────────────────────────────────────────────────────┤
│ 1. getPosts(page, limit, tag)                          │
│    → 현재 페이지의 포스트만 가져오기 (서버 페이지네이션) │
│                                                          │
│ 2. getAllPosts(tag)                                     │
│    → 검색을 위해 모든 포스트 가져오기                    │
│                                                          │
│ 3. getAllTags()                                         │
│    → 모든 고유 태그 목록 가져오기                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│            PostListSection (Client)                      │
├─────────────────────────────────────────────────────────┤
│ 검색어 없음:                                             │
│   - initialPosts 사용 (서버 페이지네이션)                │
│   - totalPages 사용                                      │
│                                                          │
│ 검색어 있음:                                             │
│   - allPosts 사용 (전체 포스트)                          │
│   - 클라이언트 필터링                                    │
│   - 클라이언트 페이지네이션                              │
└─────────────────────────────────────────────────────────┘
```

## 구현 세부사항

### 1. 서버 사이드 API 함수

#### 1.1 `getPosts()` - 페이지네이션된 포스트 가져오기

```typescript
export async function getPosts(
  page: number = 1, 
  limit: number = 5, 
  tag?: string
): Promise<Post[]>
```

**기능:**
- 페이지네이션 지원 (`range(from, to)`)
- 태그 필터링 지원 (`contains("tags", [tag])`)
- 공개된 포스트만 조회 (`eq("published", true)`)

#### 1.2 `getAllPosts()` - 모든 포스트 가져오기

```typescript
export async function getAllPosts(tag?: string): Promise<Post[]>
```

**기능:**
- 페이지네이션 없이 모든 포스트 조회
- 검색 기능을 위해 사용
- 태그 필터링 옵션 지원

**성능 고려사항:**
- 검색어가 없을 때는 호출하지 않음 (조건부 로딩)
- ISR 캐싱으로 부하 완화

#### 1.3 `getAllTags()` - 고유 태그 목록

```typescript
export async function getAllTags(): Promise<string[]>
```

**기능:**
- 모든 공개 포스트에서 태그 추출
- 중복 제거 및 정렬
- 태그 필터 UI에 사용

### 2. 클라이언트 사이드 로직

#### 2.1 검색 필터링

```typescript
const filteredPosts = postsToFilter.filter(post => {
  const searchLower = search.toLowerCase();
  
  const matchTitle = post.title.toLowerCase().includes(searchLower);
  const matchExcerpt = post.excerpt?.toLowerCase().includes(searchLower) || false;
  const matchTags = post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false;
  
  return matchTitle || matchExcerpt || matchTags;
});
```

**검색 범위:**
- 제목 (title)
- 요약 (excerpt)
- 태그 (tags)

**대소문자 구분 없음**: `toLowerCase()`로 통일

#### 2.2 하이브리드 페이지네이션

```typescript
const hasSearchQuery = search.trim().length > 0;
const limit = 5;

// 검색어 있을 때: 클라이언트 사이드 페이지네이션
if (hasSearchQuery) {
  const searchTotalPages = Math.ceil(filteredPosts.length / limit);
  const searchStartIndex = (searchPage - 1) * limit;
  const searchEndIndex = searchStartIndex + limit;
  const paginatedFilteredPosts = filteredPosts.slice(searchStartIndex, searchEndIndex);
}

// 검색어 없을 때: 서버 사이드 페이지네이션
else {
  // initialPosts는 이미 페이지네이션된 상태
  const paginatedFilteredPosts = initialPosts;
}
```

**장점:**
- 검색 시 즉각적인 반응 (서버 요청 없음)
- 일반 탐색 시 성능 최적화 (서버 페이지네이션)

### 3. UI/UX 구현

#### 3.1 태그 목록 UI

```tsx
<div className="flex flex-wrap gap-2 -mx-1 px-1">
  {allTags.map((tag) => {
    const isSelected = selectedTag === tag;
    return (
      <Badge
        variant={isSelected ? "default" : "gray"}
        className={`px-3 py-2 text-sm font-normal cursor-pointer 
          transition-all touch-manipulation min-h-[2.5rem] flex items-center
          ${isSelected 
            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
            : "hover:bg-primary/10 hover:text-primary"
          }`}
        onClick={() => handleTagClick(tag)}
      >
        {tag}
      </Badge>
    );
  })}
</div>
```

**모바일 최적화:**
- `min-h-[2.5rem]`: 최소 터치 영역 40px 확보
- `touch-manipulation`: 터치 반응성 개선
- `flex-wrap`: 작은 화면에서 자동 줄바꿈

#### 3.2 태그 클릭 핸들러

```typescript
const handleTagClick = (tag: string) => {
  const params = new URLSearchParams();
  if (selectedTag === tag) {
    // 같은 태그를 다시 클릭하면 필터 해제
    params.delete("tag");
  } else {
    params.set("tag", tag);
  }
  params.delete("page"); // tag 변경 시 첫 페이지로
  router.push(`/blog?${params.toString()}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
```

**동작:**
- 태그 클릭 → URL 파라미터 업데이트 → 서버에서 필터링된 데이터 가져오기
- 같은 태그 재클릭 → 필터 해제
- 페이지를 1로 리셋하여 혼란 방지

#### 3.3 PostCard/PostDetailSection 태그 클릭

```typescript
const handleTagClick = (e: React.MouseEvent, tag: string) => {
  e.preventDefault();
  e.stopPropagation(); // 카드 클릭 이벤트와 분리
  router.push(`/blog?tag=${encodeURIComponent(tag)}`);
};
```

**이벤트 전파 방지:**
- `e.preventDefault()`: 기본 동작 방지
- `e.stopPropagation()`: 부모 요소(Link)의 클릭 이벤트와 분리

## 엣지 케이스 대비

### 1. 검색 결과 페이지네이션 문제

**문제:**
- 검색 결과가 1개여도 서버 사이드 페이지네이션이 2페이지를 표시
- 검색 결과가 9개일 때 페이지네이션이 제대로 동작하지 않음

**원인:**
- 검색은 클라이언트 사이드에서 `initialPosts`(현재 페이지의 5개)만 필터링
- 전체 검색 결과를 볼 수 없음

**해결:**
```typescript
// 검색어가 있을 때는 allPosts 사용
const postsToFilter = search.trim().length > 0 && allPosts 
  ? allPosts 
  : initialPosts;

// 클라이언트 사이드 페이지네이션
const searchTotalPages = Math.ceil(filteredPosts.length / limit);
const paginatedFilteredPosts = filteredPosts.slice(searchStartIndex, searchEndIndex);
```

**결과:**
- 검색 결과가 9개 → 2페이지로 정확히 표시 (1페이지: 5개, 2페이지: 4개)
- 검색 결과가 1개 → 페이지네이션 숨김

### 2. 검색어 변경 시 페이지 리셋

**문제:**
- 검색어를 변경해도 이전 검색의 페이지 상태가 유지됨
- 예: "React" 검색 후 2페이지 → "Next.js" 검색 시에도 2페이지 표시

**해결:**
```typescript
const handleSearchChange = (value: string) => {
  setSearch(value);
  if (value.trim().length === 0) {
    setSearchPage(1); // 검색어 삭제 시 리셋
  } else if (search.trim().length === 0 && value.trim().length > 0) {
    setSearchPage(1); // 검색 시작 시 리셋
  }
};
```

**추가 고려사항:**
- 검색어가 변경되면 항상 첫 페이지로 이동하여 사용자 혼란 방지

### 3. 태그 필터와 검색어 동시 사용

**현재 동작:**
- 태그 필터와 검색어는 독립적으로 동작
- 태그 필터: 서버 사이드 (URL 파라미터)
- 검색어: 클라이언트 사이드 (상태)

**예시:**
1. "React" 태그 선택 → 서버에서 React 태그 포스트만 가져옴
2. 검색어 "hook" 입력 → React 태그 포스트 중 "hook" 포함된 것만 필터링

**장점:**
- 태그 필터로 범위 축소 → 검색으로 정밀 검색 가능
- 서버 부하 최소화 (태그 필터로 먼저 축소)

### 4. 모바일 터치 영역

**문제:**
- 모바일에서 태그 뱃지가 작아 터치하기 어려움
- iOS Safari의 기본 터치 영역(44x44pt) 미달

**해결:**
```tsx
<Badge
  className="min-h-[2.5rem] touch-manipulation"
  // min-h-[2.5rem] = 40px (최소 터치 영역)
  // touch-manipulation = 터치 지연 제거
/>
```

**추가 개선:**
- `active:` 상태로 터치 피드백 제공
- `hover:` 상태는 데스크탑에서만 동작

### 5. 빈 검색 결과 처리

**문제:**
- 검색 결과가 없을 때 빈 화면만 표시
- 사용자가 왜 결과가 없는지 알기 어려움

**해결:**
```tsx
{filteredPosts.length > 0 ? (
  filteredPosts.map((post) => <PostCard post={post} />)
) : (
  <motion.div className="text-center py-20 text-muted-foreground">
    검색 결과가 없습니다.
  </motion.div>
)}
```

### 6. 태그가 없는 포스트

**문제:**
- 일부 포스트에 태그가 없을 수 있음 (`tags: null`)

**대비:**
```typescript
// 옵셔널 체이닝으로 안전하게 처리
const matchTags = post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false;

// 태그 표시 시에도 안전하게 처리
{post.tags?.map((tag) => <Badge>{tag}</Badge>)}
```

### 7. URL 인코딩

**문제:**
- 태그 이름에 특수문자(예: "C++", "Node.js")가 포함될 수 있음
- URL 파라미터로 전달 시 인코딩 필요

**해결:**
```typescript
router.push(`/blog?tag=${encodeURIComponent(tag)}`);
```

**예시:**
- "C++" → `?tag=C%2B%2B`
- "Node.js" → `?tag=Node.js` (점은 인코딩되지 않지만 안전)

### 8. 페이지네이션 경계 조건

**문제:**
- 마지막 페이지에서 다음 버튼 클릭 가능
- 첫 페이지에서 이전 버튼 클릭 가능

**해결:**
```tsx
<Button
  onClick={() => handlePageChange(effectiveCurrentPage - 1)}
  disabled={effectiveCurrentPage === 1}
>
  이전
</Button>

<Button
  onClick={() => handlePageChange(effectiveCurrentPage + 1)}
  disabled={effectiveCurrentPage === effectiveTotalPages}
>
  다음
</Button>
```

### 9. 검색어와 태그 필터 동시 해제

**현재 동작:**
- 태그 필터: "필터 초기화" 버튼으로 해제
- 검색어: 사용자가 직접 삭제

**개선 가능성:**
- "모두 초기화" 버튼 추가 고려 (향후 개선)

### 10. 성능 최적화

**문제:**
- 검색어가 없을 때도 `getAllPosts()`를 호출하면 불필요한 데이터 전송

**현재 구현:**
- 항상 `getAllPosts()` 호출 (검색 준비)
- ISR 캐싱으로 부하 완화

**향후 개선:**
- 검색어 입력 시에만 `getAllPosts()` 호출 (조건부 로딩)
- 또는 검색어를 서버 사이드로 전달하여 서버에서 검색

## 기술적 결정사항

### 1. Supabase `contains()` 연산자 사용

**선택:**
```typescript
query = query.contains("tags", [tag]);
```

**이유:**
- PostgreSQL의 배열 연산자 활용
- `tags` 배열에 특정 값이 포함되어 있는지 확인
- 인덱스 활용 가능 (성능 최적화)

**대안:**
- `textSearch()`: Full-text search (더 복잡한 설정 필요)
- `ilike()`: 부분 문자열 매칭 (배열에는 사용 불가)

### 2. 클라이언트 사이드 검색

**선택 이유:**
- 즉각적인 반응 (서버 요청 없음)
- 검색어 입력과 동시에 결과 표시
- 서버 부하 감소

**단점:**
- 모든 포스트를 클라이언트로 전송 (초기 로딩 시간 증가)
- 대량의 포스트가 있을 때 성능 저하 가능

**향후 개선:**
- 검색어를 서버 사이드로 전달
- Supabase Full-text search 활용
- 검색 결과도 서버 페이지네이션

### 3. 하이브리드 페이지네이션

**선택 이유:**
- 검색 시: 클라이언트 사이드 (즉각 반응)
- 일반 탐색 시: 서버 사이드 (성능 최적화)

**구현:**
```typescript
const effectiveTotalPages = hasSearchQuery ? searchTotalPages : totalPages;
const effectiveCurrentPage = hasSearchQuery ? searchCurrentPage : currentPage;
```

### 4. 상태 관리

**선택:**
- `useState`로 검색어와 검색 페이지 관리
- URL 파라미터로 태그 필터 관리

**이유:**
- 검색어: 클라이언트 사이드만 사용 (URL 동기화 불필요)
- 태그 필터: 북마크/공유 가능하도록 URL에 포함

**대안:**
- `useSearchParams`로 검색어도 URL에 포함 (북마크 가능)
- 단점: 검색어 입력마다 URL 변경 (성능 저하)

## 파일 변경 사항

### 1. `src/entities/post/api/get-posts.ts`

**추가:**
- `getAllPosts(tag?: string)`: 모든 포스트 가져오기
- `getAllTags()`: 고유 태그 목록 가져오기

**수정:**
- `getPosts()`: `tag` 파라미터 추가
- `getTotalPostsCount()`: `tag` 파라미터 추가

### 2. `src/app/blog/page.tsx`

**추가:**
- `getAllPosts()` 호출
- `allPosts` prop 전달

**수정:**
- `searchParams.tag` 처리
- `getPosts()`, `getTotalPostsCount()`에 `tag` 전달

### 3. `src/widgets/blog/ui/post-list-section.tsx`

**추가:**
- 태그 목록 UI
- 검색 페이지네이션 로직
- `allPosts` prop
- `searchPage` 상태

**수정:**
- 검색 필터링 로직 개선
- 하이브리드 페이지네이션 구현
- 모바일 최적화

### 4. `src/entities/post/ui/post-card.tsx`

**추가:**
- 태그 클릭 핸들러
- 이벤트 전파 방지

**수정:**
- 태그 뱃지에 클릭 이벤트 추가
- 호버 효과 추가

### 5. `src/widgets/blog/ui/post-detail-section.tsx`

**추가:**
- 태그 클릭 핸들러

**수정:**
- 태그 뱃지에 클릭 이벤트 추가
- 호버 효과 추가

## 테스트 시나리오

### 1. 태그 필터링

**시나리오:**
1. 블로그 페이지 접속
2. "React" 태그 클릭
3. React 태그가 있는 포스트만 표시되는지 확인
4. URL이 `/blog?tag=React`로 변경되는지 확인
5. 같은 태그를 다시 클릭하여 필터 해제 확인

**예상 결과:**
- ✅ React 태그 포스트만 표시
- ✅ URL 파라미터 업데이트
- ✅ 페이지네이션 정상 동작
- ✅ 필터 해제 시 모든 포스트 표시

### 2. 검색 기능

**시나리오:**
1. 검색어 "Next.js" 입력
2. 제목/요약/태그에 "Next.js"가 포함된 포스트만 표시
3. 검색 결과가 9개일 때 페이지네이션 확인
4. 검색어 삭제 시 모든 포스트 표시

**예상 결과:**
- ✅ 검색 결과 즉시 표시
- ✅ 9개 결과 → 2페이지로 표시
- ✅ 검색어 삭제 시 전체 포스트 표시

### 3. 태그 필터 + 검색 조합

**시나리오:**
1. "React" 태그 선택
2. 검색어 "hook" 입력
3. React 태그이면서 "hook"이 포함된 포스트만 표시

**예상 결과:**
- ✅ 두 조건 모두 만족하는 포스트만 표시
- ✅ 페이지네이션 정상 동작

### 4. 모바일 환경

**시나리오:**
1. 모바일 디바이스에서 블로그 페이지 접속
2. 태그 클릭 테스트
3. 검색 기능 테스트

**예상 결과:**
- ✅ 태그 터치 영역 충분 (40px 이상)
- ✅ 태그 목록 자동 줄바꿈
- ✅ 터치 피드백 제공

### 5. 엣지 케이스

**시나리오:**
1. 검색 결과 0개
2. 검색 결과 1개
3. 검색 결과 5개 (정확히 1페이지)
4. 태그가 없는 포스트
5. 특수문자가 포함된 태그 (예: "C++")

**예상 결과:**
- ✅ "검색 결과가 없습니다" 메시지 표시
- ✅ 페이지네이션 숨김
- ✅ 페이지네이션 숨김
- ✅ 태그 없음 오류 없음
- ✅ URL 인코딩 정상 동작

## 성능 고려사항

### 1. 초기 로딩 시간

**현재:**
- `getAllPosts()` 항상 호출 → 초기 로딩 시간 증가

**영향:**
- 포스트가 많을수록 로딩 시간 증가
- ISR 캐싱으로 완화

**향후 개선:**
- 검색어 입력 시에만 `getAllPosts()` 호출
- 또는 검색어를 서버 사이드로 전달

### 2. 메모리 사용량

**현재:**
- 모든 포스트를 클라이언트 메모리에 저장

**영향:**
- 포스트가 매우 많을 때(수백 개 이상) 메모리 사용량 증가

**향후 개선:**
- 가상화(Virtualization) 적용
- 또는 서버 사이드 검색으로 전환

### 3. ISR 캐싱

**현재:**
- `revalidate = 60` (개발 환경: 0)

**효과:**
- 60초 동안 캐시된 데이터 사용
- 서버 부하 감소
- 응답 속도 향상

## 향후 개선 방향

### 1. 서버 사이드 검색

**현재:** 클라이언트 사이드 검색
**개선:** Supabase Full-text search 활용

**장점:**
- 대량의 포스트에서도 빠른 검색
- 검색 결과도 서버 페이지네이션
- 초기 로딩 시간 감소

### 2. 검색어 URL 동기화

**현재:** 검색어는 클라이언트 상태만
**개선:** URL 파라미터로 관리

**장점:**
- 검색 결과 북마크 가능
- 검색 결과 공유 가능

**단점:**
- 검색어 입력마다 URL 변경 (성능 저하 가능)

### 3. 다중 태그 필터

**현재:** 단일 태그만 필터링 가능
**개선:** 여러 태그 동시 선택

**구현:**
- `?tag=react,nextjs` 형식
- 체크박스 UI로 다중 선택

### 4. 검색어 하이라이팅

**현재:** 검색 결과만 표시
**개선:** 검색어를 하이라이팅

**구현:**
- `mark.js` 또는 커스텀 하이라이팅
- 검색어를 `<mark>` 태그로 감싸기

### 5. 검색 기록

**현재:** 검색 기록 없음
**개선:** 최근 검색어 표시

**구현:**
- `localStorage`에 검색어 저장
- 드롭다운으로 최근 검색어 표시

## 결론

태그 필터링과 검색 기능을 성공적으로 구현했습니다. 하이브리드 접근 방식을 통해 검색 시 즉각적인 반응과 일반 탐색 시 성능 최적화를 모두 달성했습니다. 다양한 엣지 케이스를 고려하여 안정적인 사용자 경험을 제공합니다.

**주요 성과:**
- ✅ 태그 기반 필터링 (서버 사이드)
- ✅ 실시간 검색 (클라이언트 사이드)
- ✅ 하이브리드 페이지네이션
- ✅ 모바일 최적화
- ✅ 엣지 케이스 대비

**향후 개선:**
- 서버 사이드 검색으로 전환 검토
- 다중 태그 필터 지원
- 검색어 하이라이팅

