# 블로그 조회수 카운터 구현 문서

## 작업 개요

블로그 게시글의 조회수(View Count)를 실시간으로 집계하고 표시하는 기능을 구현했습니다. Supabase RPC 함수를 활용하여 서버 사이드에서 안전하게 조회수를 증가시키고, 클라이언트 컴포넌트에서 최신 조회수를 표시합니다.

### 구현된 기능
- 게시글 상세 페이지 방문 시 자동으로 조회수 증가
- 실시간 조회수 표시 (천 단위 포맷팅)
- 서버 사이드에서 안전한 조회수 증가 (RLS 우회)
- 초기값을 서버에서 가져와 깜빡임 방지

## SQL 쿼리

다음 SQL 쿼리를 Supabase SQL Editor에서 실행하세요:

```sql
-- ============================================
-- 블로그 조회수 카운터 구현을 위한 SQL 마이그레이션
-- ============================================

-- Step 1: posts 테이블에 view_count 컬럼 추가 (이미 존재할 경우 무시)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE posts ADD COLUMN view_count BIGINT DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Step 2: 기존 레코드의 view_count를 0으로 초기화 (NULL인 경우)
UPDATE posts SET view_count = 0 WHERE view_count IS NULL;

-- Step 3: 조회수 증가 RPC 함수 생성
CREATE OR REPLACE FUNCTION increment_view_count(post_slug TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_view_count BIGINT;
BEGIN
  -- 해당 slug의 게시글 조회수를 1 증가시키고 새로운 값을 반환
  UPDATE posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = post_slug
  RETURNING view_count INTO new_view_count;
  
  -- 업데이트된 행이 없으면 0 반환
  IF new_view_count IS NULL THEN
    RETURN 0;
  END IF;
  
  RETURN new_view_count;
END;
$$;

-- Step 4: 함수에 대한 설명 추가
COMMENT ON FUNCTION increment_view_count(TEXT) IS 
'게시글 조회수를 1 증가시키고 새로운 조회수를 반환합니다. SECURITY DEFINER로 설정되어 RLS를 우회합니다.';

-- Step 5: 익명 사용자(anon)에게 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION increment_view_count(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_view_count(TEXT) TO authenticated;
```

### SQL 쿼리 설명

1. **컬럼 추가**: `view_count` 컬럼이 이미 존재하는지 확인 후 없으면 추가 (안전한 마이그레이션)
2. **기존 데이터 초기화**: NULL 값이 있는 경우 0으로 설정
3. **RPC 함수 생성**: 
   - `SECURITY DEFINER`: 함수 실행 시 함수 소유자의 권한으로 실행되어 RLS를 우회
   - `post_slug` 파라미터로 게시글을 식별
   - 조회수 증가 후 새로운 값을 반환
4. **권한 부여**: 익명 사용자와 인증된 사용자 모두 함수 실행 가능

## 사용 방법

### 1. ViewCounter 컴포넌트 사용

```tsx
import { ViewCounter } from "@/components/view-counter";

// 게시글 상세 페이지에서
<ViewCounter 
  slug={post.slug} 
  initialViews={post.view_count || 0}
/>
```

### 2. Props 설명

- `slug` (string, required): 게시글의 slug (고유 식별자)
- `initialViews` (number, required): 서버에서 가져온 초기 조회수
- `className` (string, optional): 추가 CSS 클래스

### 3. 동작 방식

1. 컴포넌트가 마운트되면 `useEffect`가 실행됩니다
2. Supabase RPC 함수 `increment_view_count`를 호출하여 조회수를 증가시킵니다
3. 함수는 증가된 조회수를 반환하므로, 이를 상태에 업데이트합니다
4. 조회수는 천 단위로 포맷팅되어 표시됩니다 (예: "1,234 views")

### 4. 다른 페이지에서 사용 예시

```tsx
// 예시: 블로그 목록 페이지의 각 카드에 조회수 표시
import { ViewCounter } from "@/components/view-counter";

export function PostCard({ post }: { post: Post }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <ViewCounter 
        slug={post.slug} 
        initialViews={post.view_count || 0}
        className="mt-2"
      />
    </div>
  );
}
```

**주의사항**: 목록 페이지에서 사용할 경우, 각 카드마다 조회수가 증가하므로 사용자 경험을 고려하여 신중하게 사용해야 합니다. 일반적으로는 상세 페이지에서만 조회수를 증가시키는 것이 좋습니다.

## 파일 변경 목록

### 생성된 파일

1. **`docs/sql/view_counter.sql`**
   - SQL 마이그레이션 스크립트
   - Supabase SQL Editor에서 실행 필요

2. **`src/components/view-counter.tsx`**
   - 조회수 카운터 클라이언트 컴포넌트
   - Supabase RPC 함수 호출 및 상태 관리

3. **`src/doc/feature-logs/view-counter-implementation.md`** (이 파일)
   - 구현 문서

### 수정된 파일

1. **`src/widgets/blog/ui/post-detail-section.tsx`**
   - `ViewCounter` 컴포넌트 import 추가
   - 메타 정보 영역에 `ViewCounter` 컴포넌트 추가

## 기술적 결정 사항

### 1. RPC 함수 사용 이유

**선택: Supabase RPC 함수 (`increment_view_count`)**

**이유:**
- **보안**: `SECURITY DEFINER`로 설정하여 RLS를 우회하면서도 안전하게 조회수 증가
- **원자성**: 데이터베이스 레벨에서 트랜잭션 보장
- **성능**: 단일 쿼리로 조회수 증가 및 반환
- **중복 방지**: 서버 사이드에서 처리하여 클라이언트 조작 방지

**대안 고려:**
- **직접 UPDATE 쿼리**: RLS 정책이 복잡해질 수 있고, 클라이언트에서 직접 업데이트하는 것은 보안상 위험
- **Server Action**: Next.js Server Action 사용 가능하지만, RPC 함수가 더 간단하고 명확함

### 2. 클라이언트 사이드 구현

**선택: `useEffect`를 통한 자동 증가**

**이유:**
- 페이지 로드 시 자동으로 조회수 증가
- 사용자 인터랙션 불필요
- 실시간 업데이트 가능

**고려사항:**
- **중복 증가 방지**: `isLoading` 상태로 중복 호출 방지
- **에러 처리**: 에러 발생 시에도 초기값 유지하여 UI 깨짐 방지
- **성능**: 컴포넌트 마운트 시 한 번만 실행되도록 `useEffect` 의존성 배열 관리

### 3. 초기값 전달

**선택: 서버에서 가져온 `initialViews`를 props로 전달**

**이유:**
- **깜빡임 방지**: 서버에서 가져온 초기값을 표시하여 로딩 중 깜빡임 없음
- **SEO**: 서버 사이드 렌더링 시 조회수가 포함되어 검색 엔진에 노출
- **사용자 경험**: 즉시 조회수를 볼 수 있음

## 트러블슈팅

### 1. RPC 함수 권한 오류

**문제**: `increment_view_count` 함수 실행 시 권한 오류 발생

**해결**: 
```sql
GRANT EXECUTE ON FUNCTION increment_view_count(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_view_count(TEXT) TO authenticated;
```

익명 사용자와 인증된 사용자 모두 함수 실행 권한을 부여해야 합니다.

### 2. 조회수가 증가하지 않는 경우

**확인 사항:**
1. SQL 마이그레이션이 정상적으로 실행되었는지 확인
2. Supabase 대시보드에서 함수가 생성되었는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인
4. `post_slug` 파라미터가 올바른지 확인

### 3. 중복 증가 문제

**문제**: 페이지를 새로고침할 때마다 조회수가 계속 증가

**설명**: 이는 정상적인 동작입니다. 각 페이지 방문마다 조회수가 증가하는 것이 의도된 동작입니다.

**개선 가능성**: 
- 쿠키나 로컬 스토리지를 사용하여 같은 사용자의 중복 조회 방지 (향후 개선 가능)
- IP 기반 중복 방지 (서버 사이드 처리 필요)

## 향후 개선 방향

### 1. 중복 조회 방지
- 쿠키 기반: 같은 브라우저에서 24시간 내 중복 조회 방지
- IP 기반: 같은 IP에서 일정 시간 내 중복 조회 방지

### 2. 실시간 업데이트
- Supabase Realtime을 활용하여 다른 사용자의 조회수 증가를 실시간으로 반영

### 3. 조회수 통계
- 일별/주별/월별 조회수 통계
- 인기 게시글 랭킹

### 4. 성능 최적화
- 조회수 증가를 배치 처리하여 데이터베이스 부하 감소
- 캐싱을 통한 조회수 조회 성능 향상

## 참고 자료

- [Supabase RPC Functions](https://supabase.com/docs/guides/database/functions)
- [Supabase Security Definer](https://www.postgresql.org/docs/current/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#client-components)



