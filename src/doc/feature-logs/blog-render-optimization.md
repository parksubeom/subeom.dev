# 블로그 페이지 리렌더링 최적화 문서

## 작업 개요

블로그 목록 페이지에서 태그 필터링 및 검색 시 발생하는 불필요한 리렌더링을 제거하여 성능을 개선했습니다. 특히 헤더와 검색창이 필터 변경 시마다 함께 리렌더링되던 문제를 해결했습니다.

### 발견된 문제
1. **태그 필터링 시**: 헤더와 검색창이 함께 리렌더링됨
2. **검색어 입력 시**: 헤더가 실시간으로 리렌더링됨
3. **불필요한 DOM 업데이트**: 정적 콘텐츠까지 매번 업데이트되어 성능 저하

## 추론 과정

### 1. 문제 분석

#### 1.1 React 리렌더링 메커니즘

**React의 기본 동작:**
- 부모 컴포넌트가 리렌더링되면 자식 컴포넌트도 리렌더링됨
- `React.memo`는 props가 변경되지 않으면 리렌더링을 방지하지만, 부모가 리렌더링되면 자식도 함께 리렌더링될 수 있음

**현재 구조:**
```
PostListSection (부모)
├── BlogHeader (자식, memo 적용)
├── BlogSearch (자식, memo 미적용)
└── 태그 목록 및 포스트 목록
```

#### 1.2 리렌더링 발생 시나리오

**시나리오 1: 태그 클릭 시**
1. `selectedTag` prop 변경
2. `PostListSection` 리렌더링
3. `BlogHeader` 리렌더링 (props 없지만 부모 리렌더링으로 인해)
4. `BlogSearch` 리렌더링 (`handleSearchChange` 함수가 재생성될 수 있음)

**시나리오 2: 검색어 입력 시**
1. `search` 상태 변경
2. `PostListSection` 리렌더링
3. `BlogHeader` 리렌더링 (불필요)
4. `BlogSearch` 리렌더링 (필요, value 변경)

### 2. 근본 원인 파악

#### 2.1 BlogHeader 리렌더링 원인

**문제:**
- `BlogHeader`는 `React.memo`로 감쌌지만 props가 없음
- 부모(`PostListSection`)가 리렌더링되면 자식도 리렌더링됨
- React.memo는 props 비교만 하므로, props가 없으면 항상 리렌더링됨

**확인 방법:**
```typescript
// 현재 코드
const BlogHeader = memo(function BlogHeader() {
  // props 없음 → memo가 효과 없음
});
```

**해결 방향:**
- `BlogHeader`를 완전히 독립적인 컴포넌트로 분리
- 또는 props를 명시적으로 전달하여 memo가 제대로 작동하도록

#### 2.2 BlogSearch 리렌더링 원인

**문제:**
- `BlogSearch`가 `React.memo`로 감싸지지 않음
- `handleSearchChange` 함수가 `search` 의존성으로 인해 재생성될 수 있음
- 함수가 재생성되면 `onChange` prop이 변경되어 리렌더링 발생

**확인 방법:**
```typescript
// 문제가 있는 코드
const handleSearchChange = useCallback((value: string) => {
  setSearch(value);
  if (search.trim().length === 0 && value.trim().length > 0) {
    setSearchPage(1);
  }
}, [search]); // search 의존성으로 인해 함수가 재생성됨
```

**해결 방향:**
- `BlogSearch`를 `React.memo`로 감싸기
- `handleSearchChange`의 의존성 배열에서 `search` 제거
- `setSearch`의 함수형 업데이트 사용

### 3. 해결 방안

#### 3.1 BlogHeader 최적화

**선택: 완전히 독립적인 컴포넌트로 분리**

**이유:**
- props가 없는 정적 컴포넌트
- 부모 리렌더링과 완전히 분리 필요
- `React.memo`만으로는 부족함

**구현:**
```typescript
// 완전히 독립적인 컴포넌트
const BlogHeader = memo(function BlogHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
      <p className="text-muted-foreground text-lg">
        개발 경험과 기술적인 고민들을 기록합니다.
      </p>
    </motion.div>
  );
});
```

**추가 고려사항:**
- `motion.div`도 리렌더링될 수 있으므로 확인 필요
- 하지만 `motion.div`는 내부적으로 최적화되어 있음

#### 3.2 BlogSearch 최적화

**선택: React.memo + useCallback 최적화**

**이유:**
- `value`와 `onChange` props가 있음
- `onChange` 함수가 변경되지 않으면 리렌더링 방지 가능

**구현:**
```typescript
// BlogSearch를 memo로 감싸기
export const BlogSearch = memo(function BlogSearch({ value, onChange }: BlogSearchProps) {
  // ...
});

// handleSearchChange 최적화
const handleSearchChange = useCallback((value: string) => {
  setSearch((prevSearch) => {
    // 함수형 업데이트로 prevSearch 사용
    if (prevSearch.trim().length === 0 && value.trim().length > 0) {
      setSearchPage(1);
    } else if (value.trim().length === 0) {
      setSearchPage(1);
    }
    return value;
  });
}, []); // 의존성 배열 비움 → 함수가 재생성되지 않음
```

**핵심 개선:**
- `setSearch`의 함수형 업데이트 사용 (`prevSearch` 사용)
- 의존성 배열에서 `search` 제거
- `BlogSearch`를 `React.memo`로 감싸서 props 변경 시에만 리렌더링

## 구현 세부사항

### 1. BlogHeader 컴포넌트 분리

**파일:** `src/widgets/blog/ui/post-list-section.tsx`

**변경 전:**
```typescript
return (
  <section className="space-y-8 min-h-[60vh]">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
      <p className="text-muted-foreground text-lg">
        개발 경험과 기술적인 고민들을 기록합니다.
      </p>
    </motion.div>
    {/* ... */}
  </section>
);
```

**변경 후:**
```typescript
// 컴포넌트 외부에 정의 (PostListSection 리렌더링과 분리)
const BlogHeader = memo(function BlogHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
      <p className="text-muted-foreground text-lg">
        개발 경험과 기술적인 고민들을 기록합니다.
      </p>
    </motion.div>
  );
});

// 사용
return (
  <section className="space-y-8 min-h-[60vh]">
    <BlogHeader />
    {/* ... */}
  </section>
);
```

**효과:**
- `BlogHeader`는 props가 없으므로 항상 동일한 결과 반환
- `React.memo`로 감싸서 props 변경 시에만 리렌더링
- 부모가 리렌더링되어도 props가 변경되지 않으면 리렌더링 방지

### 2. BlogSearch 컴포넌트 메모이제이션

**파일:** `src/features/blog-search/ui/blog-search.tsx`

**변경 전:**
```typescript
export function BlogSearch({ value, onChange }: BlogSearchProps) {
  return (
    <div className="relative mb-8">
      {/* ... */}
    </div>
  );
}
```

**변경 후:**
```typescript
export const BlogSearch = memo(function BlogSearch({ value, onChange }: BlogSearchProps) {
  return (
    <div className="relative mb-8">
      {/* ... */}
    </div>
  );
});
```

**효과:**
- `value`와 `onChange`가 변경되지 않으면 리렌더링 방지
- 태그 필터링 시 `value`는 변경되지 않으므로 리렌더링 없음

### 3. handleSearchChange 최적화

**파일:** `src/widgets/blog/ui/post-list-section.tsx`

**변경 전:**
```typescript
const handleSearchChange = useCallback((value: string) => {
  setSearch(value);
  if (value.trim().length === 0) {
    setSearchPage(1);
  } else if (search.trim().length === 0 && value.trim().length > 0) {
    setSearchPage(1);
  }
}, [search]); // search 의존성으로 인해 함수가 재생성됨
```

**변경 후:**
```typescript
const handleSearchChange = useCallback((value: string) => {
  setSearch((prevSearch) => {
    // 함수형 업데이트로 prevSearch 사용
    if (prevSearch.trim().length === 0 && value.trim().length > 0) {
      setSearchPage(1);
    } else if (value.trim().length === 0) {
      setSearchPage(1);
    }
    return value;
  });
}, []); // 의존성 배열 비움 → 함수가 재생성되지 않음
```

**핵심 개선:**
- `setSearch`의 함수형 업데이트 사용
- `prevSearch`를 통해 이전 값을 참조
- 의존성 배열에서 `search` 제거
- 함수가 한 번만 생성되어 `onChange` prop이 안정적

### 4. 검색어 Debounce 추가

**추가 최적화:**
- 검색어 입력 시 즉각적인 필터링 대신 300ms 지연
- 타이핑 중 불필요한 필터링 계산 방지

**구현:**
```typescript
const debouncedSearch = useDebounce(search, 300);

// debouncedSearch를 사용하여 필터링
const filteredPosts = useMemo(() => {
  if (!debouncedSearch.trim()) return postsToFilter;
  // ...
}, [postsToFilter, debouncedSearch]);
```

## 해결 근거

### 1. React.memo의 동작 원리

**React.memo는 어떻게 작동하는가:**
```typescript
// React.memo는 props를 얕은 비교(shallow comparison)함
const MemoizedComponent = memo(Component);

// props가 변경되지 않으면 리렌더링 방지
// 하지만 부모가 리렌더링되면 자식도 리렌더링될 수 있음
```

**문제:**
- `BlogHeader`는 props가 없음
- props 비교 시 항상 동일하지만, 부모 리렌더링으로 인해 함께 리렌더링됨

**해결:**
- `React.memo`로 감싸서 props 변경 시에만 리렌더링
- props가 없으므로 변경되지 않음 → 리렌더링 방지

### 2. useCallback의 의존성 배열

**문제:**
```typescript
const handleSearchChange = useCallback((value: string) => {
  setSearch(value);
  if (search.trim().length === 0) { // search 사용
    // ...
  }
}, [search]); // search 의존성
```

**문제점:**
- `search`가 변경될 때마다 함수가 재생성됨
- 함수가 재생성되면 `onChange` prop이 변경됨
- `BlogSearch`가 리렌더링됨

**해결:**
```typescript
const handleSearchChange = useCallback((value: string) => {
  setSearch((prevSearch) => { // 함수형 업데이트
    if (prevSearch.trim().length === 0) { // prevSearch 사용
      // ...
    }
    return value;
  });
}, []); // 의존성 배열 비움
```

**효과:**
- 함수가 한 번만 생성됨
- `onChange` prop이 안정적
- `BlogSearch`가 불필요하게 리렌더링되지 않음

### 3. 컴포넌트 분리 전략

**왜 BlogHeader를 별도 컴포넌트로 분리했는가:**

1. **관심사 분리**: 헤더는 정적 콘텐츠이므로 필터링 로직과 분리
2. **재사용성**: 다른 곳에서도 사용 가능
3. **테스트 용이성**: 독립적으로 테스트 가능
4. **성능 최적화**: memo로 감싸서 리렌더링 방지

## 수정 내용 요약

### 1. 파일 변경사항

#### `src/widgets/blog/ui/post-list-section.tsx`

**추가:**
- `BlogHeader` 컴포넌트를 별도로 분리하고 `React.memo`로 감싸기
- `handleSearchChange`의 의존성 배열 최적화 (함수형 업데이트 사용)

**수정:**
- 헤더 부분을 `<BlogHeader />` 컴포넌트로 교체
- `handleSearchChange`에서 `setSearch`의 함수형 업데이트 사용

#### `src/features/blog-search/ui/blog-search.tsx`

**추가:**
- `React.memo`로 컴포넌트 감싸기

**수정:**
- `export function` → `export const ... = memo(function ...)`

#### `src/shared/hooks/use-debounce.ts` (신규)

**추가:**
- `useDebounce` 커스텀 훅 생성
- 검색어 입력 시 300ms 지연 적용

### 2. 성능 개선 효과

**이전:**
- 태그 클릭 시: 헤더 + 검색창 + 포스트 목록 리렌더링
- 검색어 입력 시: 헤더 + 검색창 + 포스트 목록 리렌더링 (매번)

**이후:**
- 태그 클릭 시: 포스트 목록만 리렌더링 (헤더, 검색창 제외)
- 검색어 입력 시: 검색창만 리렌더링 (헤더 제외)
- 검색 필터링: 타이핑이 끝난 후에만 실행 (300ms 지연)

**예상 성능 개선:**
- 리렌더링 횟수: 약 50-70% 감소
- DOM 업데이트: 불필요한 업데이트 제거
- 사용자 경험: 더 부드러운 인터랙션

## 테스트 시나리오

### 1. 태그 클릭 시 리렌더링 확인

**테스트 방법:**
1. React DevTools Profiler 사용
2. 태그 클릭
3. 리렌더링된 컴포넌트 확인

**예상 결과:**
- ✅ `BlogHeader`: 리렌더링 없음
- ✅ `BlogSearch`: 리렌더링 없음 (value, onChange 변경 없음)
- ✅ 포스트 목록: 리렌더링됨 (정상)

### 2. 검색어 입력 시 리렌더링 확인

**테스트 방법:**
1. React DevTools Profiler 사용
2. 검색어 입력
3. 리렌더링된 컴포넌트 확인

**예상 결과:**
- ✅ `BlogHeader`: 리렌더링 없음
- ✅ `BlogSearch`: 리렌더링됨 (value 변경, 정상)
- ✅ 포스트 목록: 300ms 후에만 리렌더링됨 (debounce)

### 3. 성능 측정

**측정 항목:**
- 리렌더링 시간
- DOM 업데이트 횟수
- 메모리 사용량

**도구:**
- React DevTools Profiler
- Chrome DevTools Performance
- Lighthouse Performance Score

## 추가 고려사항

### 1. React.memo의 한계

**주의사항:**
- `React.memo`는 얕은 비교만 수행
- 객체나 배열 props는 참조 비교
- 복잡한 props는 커스텀 비교 함수 필요

**현재 구현:**
- `BlogHeader`: props 없음 → 문제 없음
- `BlogSearch`: `value`(string), `onChange`(function) → 문제 없음

### 2. Framer Motion과의 호환성

**고려사항:**
- `motion.div`는 내부적으로 최적화되어 있음
- 하지만 부모 리렌더링 시 애니메이션 재실행 가능

**현재 구현:**
- `BlogHeader`의 `motion.div`는 초기 렌더링 시에만 애니메이션 실행
- 이후 리렌더링 시에도 애니메이션 재실행되지 않음 (정상)

### 3. 향후 개선 방향

**추가 최적화 가능:**
1. **가상화(Virtualization)**: 포스트 목록이 많을 때 가상 스크롤 적용
2. **코드 스플리팅**: 태그 목록을 별도 청크로 분리
3. **서버 사이드 검색**: 검색어를 서버로 전달하여 서버에서 필터링

## 결론

헤더와 검색창의 불필요한 리렌더링을 제거하여 성능을 개선했습니다. `React.memo`와 `useCallback`의 적절한 사용, 그리고 함수형 업데이트를 통해 컴포넌트 리렌더링을 최소화했습니다.

**주요 성과:**
- ✅ 태그 필터링 시 헤더/검색창 리렌더링 제거
- ✅ 검색어 입력 시 헤더 리렌더링 제거
- ✅ 검색 필터링 debounce 적용
- ✅ 전체적인 성능 향상

**기술적 학습:**
- React.memo의 동작 원리와 한계
- useCallback의 의존성 배열 최적화
- 함수형 업데이트를 통한 의존성 제거
- 컴포넌트 분리를 통한 관심사 분리

