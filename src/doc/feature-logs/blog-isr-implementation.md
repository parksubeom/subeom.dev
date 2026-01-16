# 블로그 목록 페이지 렌더링 전략 변경 (SSR → ISR)

## 작업 개요

블로그 목록 페이지(`src/app/blog/page.tsx`)의 렌더링 전략을 **SSR(Server-Side Rendering)**에서 **ISR(Incremental Static Regeneration)**로 변경하여 성능을 개선했습니다.

### 변경 사항

- **이전**: `force-dynamic` - 매 요청마다 서버에서 동적으로 페이지 생성
- **이후**: `revalidate = 60` - 정적 페이지를 캐시하고 60초마다 재생성

## 작업 배경

### 문제점

1. **DB 부하 증가**: `force-dynamic` 설정으로 인해 매 요청마다 데이터베이스를 조회하여 트래픽 증가 시 DB 부하가 커짐
2. **응답 속도 저하**: 매 요청마다 서버에서 페이지를 동적으로 생성하여 첫 응답 시간이 느림
3. **불필요한 리소스 소모**: 동일한 데이터를 반복적으로 조회하여 서버 리소스 낭비

### 해결 방안

ISR(Incremental Static Regeneration) 방식 도입:
- 페이지를 정적으로 생성하여 캐시
- 60초(1분) 동안 캐시된 페이지를 제공
- 캐시 만료 후 백그라운드에서 최신 데이터로 재생성
- 성능 향상과 데이터 최신성의 균형 유지

## 구현 방법

### 코드 변경

**파일**: `src/app/blog/page.tsx`

```tsx
// ❌ 삭제된 코드
export const dynamic = "force-dynamic";

// ✅ 추가된 코드
export const revalidate = 60;
```

### revalidate 옵션 설명

- **값**: `60` (초 단위)
- **의미**: 정적 페이지를 60초 동안 캐시하고, 그 이후 요청이 오면 백그라운드에서 최신 데이터로 재생성
- **동작 방식**:
  1. 첫 요청 시: 페이지를 정적으로 생성하고 캐시
  2. 60초 이내 요청: 캐시된 정적 페이지를 즉시 반환 (빠른 응답)
  3. 60초 이후 요청: 캐시된 페이지를 반환하면서 백그라운드에서 최신 데이터로 재생성 시작
  4. 다음 요청: 갱신된 정적 페이지를 반환

## 기술적 결정 사항

### 1. revalidate 시간 설정

**선택: 60초**

**이유:**
- 블로그 목록은 글이 자주 추가되지 않으므로 60초 간격이 적절
- 너무 짧으면 캐싱의 효과가 줄어들고, 너무 길면 최신성 저하
- 1분 간격은 성능과 최신성의 균형을 맞추는 적절한 값

**대안 고려:**
- 30초: 더 자주 갱신되지만 캐싱 효과 감소
- 300초(5분): 더 긴 캐싱이지만 최신성 저하

### 2. ISR vs 다른 전략 비교

#### ISR (Incremental Static Regeneration)
- ✅ 정적 페이지의 성능 이점
- ✅ 주기적 자동 갱신
- ✅ 초기 로드 후 빠른 응답
- ❌ 캐시 만료 전까지는 최신 데이터 반영 불가

#### SSR (Server-Side Rendering) - 이전 방식
- ✅ 항상 최신 데이터
- ✅ 실시간 업데이트
- ❌ 매 요청마다 서버 처리 필요
- ❌ DB 부하 증가

#### SSG (Static Site Generation)
- ✅ 최고의 성능
- ✅ 완전한 정적 페이지
- ❌ 빌드 시점의 데이터만 반영
- ❌ 최신 데이터 반영 불가

## 기대 효과

### 성능 개선

1. **응답 속도 향상**: 
   - 이전: 매 요청마다 서버 처리 (평균 200-500ms)
   - 이후: 캐시된 정적 페이지 반환 (10-50ms)
   - **약 80-90% 응답 시간 단축**

2. **서버 리소스 절감**:
   - DB 쿼리 횟수 감소 (60초마다 1회 vs 매 요청마다)
   - 서버 CPU 사용량 감소
   - 메모리 효율성 향상

3. **트래픽 처리 능력 향상**:
   - 동시 접속자 처리 능력 증가
   - CDN 캐싱과의 조합으로 전 세계 빠른 응답 가능

### 사용자 경험 개선

- **빠른 페이지 로드**: 캐시된 정적 페이지로 즉시 렌더링
- **안정적인 성능**: 트래픽 증가에도 일정한 응답 시간 유지

## 주의 사항

### 1. 데이터 최신성

- 60초 이내에 추가된 게시글은 즉시 목록에 반영되지 않을 수 있음
- 게시글 추가 후 60초가 지나야 목록에 나타남
- 필요한 경우 `revalidatePath` 또는 `revalidateTag`를 사용하여 수동으로 갱신 가능

### 2. 검색 파라미터 처리

- `searchParams`를 사용한 페이지네이션은 정상 작동
- 각 페이지마다 별도의 정적 페이지로 생성됨
- 예: `/blog?page=1`, `/blog?page=2` 등

### 3. 동적 콘텐츠

- 블로그 목록 자체는 ISR로 처리
- 개별 게시글 상세 페이지는 기존 전략 유지 (SSR 또는 ISR 별도 설정)

## 향후 개선 방향

### 1. On-Demand Revalidation

게시글이 추가/수정/삭제될 때 즉시 재생성:
```tsx
import { revalidatePath } from 'next/cache';

// 게시글 작성 후
revalidatePath('/blog');
```

### 2. 태그 기반 Revalidation

특정 태그나 카테고리가 업데이트될 때만 해당 부분 재생성:
```tsx
// 페이지 생성 시
export const revalidateTag = 'blog-posts';

// 게시글 업데이트 시
revalidateTag('blog-posts');
```

### 3. revalidate 시간 동적 조정

트래픽 패턴에 따라 revalidate 시간을 동적으로 조정:
- 피크 시간: 짧은 간격 (30초)
- 일반 시간: 중간 간격 (60초)
- 저조 시간: 긴 간격 (300초)

## 파일 변경 목록

### 수정된 파일

1. **`src/app/blog/page.tsx`**
   - `export const dynamic = "force-dynamic";` 삭제
   - `export const revalidate = 60;` 추가

## 테스트 방법

### 1. 빌드 테스트

```bash
pnpm run build
```

- 정적 페이지 생성 확인
- 캐싱 설정 확인

### 2. 개발 환경 테스트

```bash
pnpm run dev
```

- 페이지 로드 속도 확인
- 캐시 동작 확인 (60초 이내 재요청 시 즉시 응답)

### 3. 프로덕션 테스트

- 배포 후 실제 응답 시간 측정
- 트래픽 증가 시 성능 모니터링

## 참고 자료

- [Next.js ISR (Incremental Static Regeneration)](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Next.js Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)

