# Phase 2: 포트폴리오 시스템 구현

## 작업 개요

Phase 2에서는 Supabase의 `projects` 테이블을 기반으로 포트폴리오 목록 페이지와 상세 페이지를 구현했습니다. 정적 생성(SSG)과 클라이언트 사이드 인터랙션을 적절히 혼합하여 최상의 성능과 UX를 제공하도록 설계했습니다.

## 구현 과정

### 1. 패키지 설치 및 설정

#### 1.1 필수 패키지 설치
- **react-markdown**: 마크다운 콘텐츠 렌더링
- **remark-gfm**: GitHub Flavored Markdown 지원 (테이블, 체크리스트 등)
- **@tailwindcss/typography**: 마크다운 스타일링을 위한 플러그인
- **shadcn/ui 컴포넌트**: `tabs`, `badge` 추가

#### 1.2 Tailwind 설정 업데이트
- `@tailwindcss/typography` 플러그인 추가
- `prose` 클래스를 사용하여 마크다운 스타일링 지원

### 2. 데이터 핸들링 (`src/actions/projects.ts`)

#### 2.1 Server Actions 구현
- **"use server"** 디렉티브 사용: 서버 사이드에서만 실행
- 타입 안전성: `Tables<'projects'>` 타입 활용

#### 2.2 구현된 함수들

**`getProjects()`**
- 모든 프로젝트를 `order` 순으로 조회
- 에러 발생 시 빈 배열 반환
- 반환 타입: `Promise<Project[]>`

**`getProjectById(id: string)`**
- 특정 ID의 프로젝트 상세 정보 조회
- `.maybeSingle()` 사용: 레코드가 없을 때 null 반환
- 반환 타입: `Promise<Project | null>`

**`getAllProjectIds()`**
- `generateStaticParams`를 위한 모든 프로젝트 ID 조회
- 최적화: `select('id')`로 필요한 필드만 조회
- 반환 타입: `Promise<string[]>`

#### 2.3 추론 과정
```typescript
// Server Actions를 선택한 이유:
// 1. 타입 안전성: 클라이언트와 서버 간 타입 공유
// 2. 보안: API 엔드포인트 노출 없이 직접 데이터베이스 접근
// 3. 성능: 서버에서 직접 실행되어 네트워크 오버헤드 감소
```

### 3. 컴포넌트 구현

#### 3.1 ProjectCard 컴포넌트 (`components/portfolio/project-card.tsx`)

**구현 특징:**
- **Framer Motion 애니메이션**: `layout` prop으로 부드러운 재배치
- **반응형 이미지**: Next.js Image 컴포넌트, 16:9 비율
- **기술 스택 표시**: 최대 3개만 표시, 나머지는 "+N" 형식
- **카드 전체 링크**: 카드 클릭 시 상세 페이지로 이동
- **호버 효과**: 이미지 확대, 그림자 증가

**디자인 결정:**
- `line-clamp-2`: 제목과 설명을 2줄로 제한
- 카테고리와 상태를 Badge로 표시
- 그룹 호버 효과로 인터랙션 피드백 제공

#### 3.2 PortfolioList 컴포넌트 (`components/portfolio/portfolio-list.tsx`)

**구현 특징:**
- **카테고리 필터**: 동적으로 카테고리 추출 및 필터링
- **Framer Motion**: `AnimatePresence`로 필터 변경 시 부드러운 전환
- **반응형 그리드**: 모바일 1열, 태블릿 2열, 데스크탑 3열
- **빈 상태 처리**: 필터 결과가 없을 때 메시지 표시

**카테고리 추출 로직:**
```typescript
// 중복 제거 및 정렬
const categories = Array.from(
  new Set(projects.map((p) => p.category).filter(Boolean) as string[])
)
const allCategories = ["All", ...categories]
```

**애니메이션 전략:**
- `layout` prop: 카드가 자동으로 재배치되는 애니메이션
- `AnimatePresence`: 필터 변경 시 페이드 인/아웃
- `mode="wait"`: 이전 애니메이션이 완료된 후 다음 시작

#### 3.3 ProjectDetail 컴포넌트 (`components/portfolio/project-detail.tsx`)

**섹션 구성:**

1. **Header Section**
   - 프로젝트 제목, 설명
   - 날짜 범위 포맷팅 (`date-fns` 사용)
   - 카테고리, 상태 Badge
   - 데모/GitHub 링크 버튼

2. **Gallery Section**
   - `images` 배열을 그리드로 표시
   - 반응형: 모바일 1열, 태블릿 2열, 데스크탑 3열
   - `aspect-video`로 16:9 비율 유지

3. **Description Section**
   - `long_description` 필드를 `react-markdown`으로 렌더링
   - `prose` 클래스로 마크다운 스타일링
   - 다크모드 지원: `dark:prose-invert`

4. **Navigation Section**
   - 이전/다음 프로젝트 링크
   - 호버 시 아이콘 이동 애니메이션
   - 프로젝트 순서는 `order` 필드 기준

**날짜 포맷팅:**
```typescript
const formatDate = (date: string | null) => {
  if (!date) return null
  return format(new Date(date), "MMM yyyy")
}
// 결과: "Jan 2024" 형식
```

### 4. 페이지 구현

#### 4.1 포트폴리오 목록 페이지 (`app/portfolio/page.tsx`)

**구현 전략:**
- 서버 컴포넌트에서 데이터 페칭
- 클라이언트 컴포넌트에 데이터 전달
- SEO를 위한 메타데이터 설정

**구조:**
```tsx
// 서버 컴포넌트
export default async function PortfolioPage() {
  const projects = await getProjects()
  return <PortfolioList projects={projects} />
}
```

#### 4.2 프로젝트 상세 페이지 (`app/portfolio/[id]/page.tsx`)

**SSG 구현:**
- `generateStaticParams`: 빌드 타임에 모든 프로젝트 페이지 생성
- `generateMetadata`: 동적 메타데이터 생성
- `notFound()`: 프로젝트가 없을 때 404 페이지 표시

**이전/다음 프로젝트 로직:**
```typescript
const allProjects = await getProjects()
const currentIndex = allProjects.findIndex((p) => p.id === id)
const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null
const nextProject = currentIndex < allProjects.length - 1 
  ? allProjects[currentIndex + 1] 
  : null
```

**추론 과정:**
- 모든 프로젝트를 다시 조회하는 이유: `order` 필드 기준으로 정렬된 순서 유지
- 인덱스 기반 접근: 간단하고 직관적인 로직

### 5. 스타일링 및 UX

#### 5.1 반응형 디자인
- **목록 그리드**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **상세 페이지**: 모바일에서 패딩 조정, 폰트 크기 최적화
- **이미지**: `aspect-video`로 일관된 비율 유지

#### 5.2 다크모드 대응
- 모든 텍스트와 배경색에 `dark:` 클래스 적용
- `prose-invert`: 다크모드에서 마크다운 가독성 향상
- Badge, Button 등 shadcn/ui 컴포넌트 자동 다크모드 지원

#### 5.3 애니메이션
- **Framer Motion**: 부드러운 레이아웃 전환
- **호버 효과**: 카드 확대, 아이콘 이동
- **전환 애니메이션**: 필터 변경 시 페이드 효과

### 6. 성능 최적화

#### 6.1 정적 생성 (SSG)
- `generateStaticParams`로 빌드 타임에 모든 페이지 생성
- 초기 로딩 시간 단축
- SEO 최적화

#### 6.2 이미지 최적화
- Next.js Image 컴포넌트 사용
- `fill` prop으로 반응형 이미지
- `object-cover`로 비율 유지

#### 6.3 데이터 페칭 최적화
- 필요한 필드만 조회 (`getAllProjectIds`에서 `select('id')`)
- 서버 컴포넌트에서 직접 페칭하여 클라이언트 번들 크기 감소

## 파일 구조

```
src/
├── actions/
│   └── projects.ts              # Server Actions (데이터 페칭)
├── app/
│   └── portfolio/
│       ├── page.tsx              # 목록 페이지
│       └── [id]/
│           └── page.tsx           # 상세 페이지 (SSG)
└── components/
    └── portfolio/
        ├── project-card.tsx      # 프로젝트 카드 컴포넌트
        ├── portfolio-list.tsx    # 목록 및 필터링 컴포넌트
        └── project-detail.tsx    # 상세 페이지 컴포넌트
```

## 주요 기술적 결정 사항

### 1. Server Actions vs API Routes
- **선택**: Server Actions
- **이유**: 
  - 타입 안전성 향상
  - API 엔드포인트 관리 불필요
  - 서버와 클라이언트 간 타입 공유

### 2. SSG vs ISR
- **선택**: SSG (Static Site Generation)
- **이유**:
  - 프로젝트 데이터가 자주 변경되지 않음
  - 최대 성능과 SEO 최적화
  - 빌드 타임에 모든 페이지 생성

### 3. Framer Motion 사용
- **선택**: layout 애니메이션
- **이유**:
  - 필터 변경 시 자연스러운 카드 재배치
  - 사용자 경험 향상
  - 성능 최적화된 애니메이션

### 4. 마크다운 렌더링
- **선택**: react-markdown + remark-gfm
- **이유**:
  - 안전한 마크다운 파싱
  - GitHub Flavored Markdown 지원
  - 커스터마이징 용이

## 고려했지만 미구현된 기능

### 1. 검색 기능
- 프로젝트 제목/설명 검색
- 향후 개선 가능

### 2. 정렬 옵션
- 날짜, 이름, 카테고리별 정렬
- 현재는 `order` 필드 기준만 지원

### 3. 페이지네이션
- 프로젝트가 많을 때를 대비한 페이지네이션
- 현재는 모든 프로젝트를 한 번에 표시

### 4. 이미지 라이트박스
- 갤러리 이미지 클릭 시 확대 보기
- 향후 개선 가능

### 5. 프로젝트 통계
- 조회수, 좋아요 등
- 데이터베이스 스키마 확장 필요

## 성능 최적화 고려사항

### 1. 이미지 최적화
- Next.js Image 컴포넌트의 자동 최적화
- WebP 형식 자동 변환
- Lazy loading

### 2. 코드 스플리팅
- 동적 import로 클라이언트 컴포넌트 분리
- Framer Motion은 클라이언트에서만 로드

### 3. 캐싱 전략
- SSG로 빌드 타임에 생성된 페이지는 CDN 캐싱
- Supabase 쿼리 결과는 서버에서 캐싱 가능

## 테스트 및 검증

### 린터 오류
- 모든 파일에서 린터 오류 없음 확인
- TypeScript 타입 체크 통과

### 반응형 테스트
- 모바일, 태블릿, 데스크탑 레이아웃 확인
- 다크모드 전환 테스트

## 향후 개선 방향

1. **검색 및 필터링 강화**
   - 제목/설명 검색
   - 기술 스택별 필터링
   - 날짜 범위 필터

2. **인터랙션 개선**
   - 이미지 라이트박스
   - 스크롤 애니메이션
   - 로딩 스켈레톤

3. **성능 최적화**
   - 이미지 CDN 활용
   - ISR 도입 검토 (데이터 업데이트 빈도에 따라)
   - 클라이언트 사이드 캐싱

4. **접근성 개선**
   - 키보드 네비게이션
   - 스크린 리더 지원
   - ARIA 레이블 추가

5. **SEO 강화**
   - Open Graph 메타데이터
   - 구조화된 데이터 (JSON-LD)
   - 사이트맵 생성

## 참고 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [Framer Motion 문서](https://www.framer.com/motion/)
- [react-markdown 문서](https://github.com/remarkjs/react-markdown)
- [Tailwind Typography 플러그인](https://tailwindcss.com/docs/plugins#typography)
- [Supabase 문서](https://supabase.com/docs)

