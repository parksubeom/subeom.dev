# Phase 1: 프로젝트 기본 구조 및 홈페이지 구현

## 작업 개요

Phase 1에서는 Next.js 14 App Router 기반 포트폴리오 및 기술 블로그의 기본 구조를 구축하고 홈페이지를 완성했습니다. 주요 목표는 확장 가능한 아키텍처를 설계하고, Supabase와의 연동, 다크모드 지원, 반응형 디자인을 구현하는 것이었습니다.

## 구현 과정

### 1. 프로젝트 설정 및 의존성 관리

#### 1.1 shadcn/ui 초기화
- **결정 사항**: shadcn/ui를 선택한 이유
  - Tailwind CSS와 완벽한 통합
  - 복사-붙여넣기 방식으로 커스터마이징 용이
  - TypeScript 완전 지원
  - 접근성(A11y) 고려된 컴포넌트 제공

- **구현 과정**:
  1. `components.json` 생성하여 shadcn/ui 설정
  2. `tsconfig.json`의 path alias 확인 (`@/*` 매핑)
  3. 필수 컴포넌트 설치: `button`, `card`, `skeleton`
  4. `tailwindcss-animate` 패키지 추가 (애니메이션 지원)

#### 1.2 Tailwind CSS 설정 업데이트
- **기존 상태**: 기본 Next.js 템플릿의 간단한 Tailwind 설정
- **변경 사항**:
  - `darkMode: ["class"]` 추가 (next-themes와 호환)
  - shadcn/ui의 CSS 변수 시스템 통합
  - 색상 팔레트 확장 (card, popover, primary, secondary, muted, accent, destructive 등)
  - border-radius 변수화

- **추론 과정**:
  - 다크모드를 `prefers-color-scheme`이 아닌 `class` 기반으로 변경한 이유: 사용자가 명시적으로 테마를 선택할 수 있도록 하기 위함
  - CSS 변수 사용: 테마 전환 시 부드러운 애니메이션과 일관된 색상 관리

### 2. Supabase 클라이언트 설정

#### 2.1 클라이언트/서버 분리
- **파일 구조**:
  - `src/lib/supabase/client.ts`: 브라우저용 클라이언트
  - `src/lib/supabase/server.ts`: 서버 컴포넌트용 클라이언트
  - `src/lib/supabase/queries.ts`: 데이터 페칭 함수

- **구현 결정**:
  - **서버 컴포넌트 우선**: Next.js 14 App Router의 서버 컴포넌트를 활용하여 초기 로딩 성능 최적화
  - **쿠키 기반 인증**: 서버 클라이언트에서 `cookies()` API를 사용하여 인증 상태 관리
  - **타입 안전성**: `src/type/supabase.ts`의 타입 정의를 활용하여 컴파일 타임 타입 체크

- **추론 과정**:
  ```typescript
  // 서버 클라이언트에서 cookies()를 사용하는 이유
  // - 서버 컴포넌트에서만 접근 가능
  // - RLS(Row Level Security) 정책과 함께 작동
  // - 인증 토큰을 안전하게 관리
  ```

#### 2.2 쿼리 함수 설계
- **함수별 역할**:
  - `getFeaturedProjects()`: `featured: true`인 프로젝트 3개 조회
  - `getLatestPosts()`: `published: true`인 최신 게시글 4개 조회
  - `getProfile()`: 프로필 정보 조회 (단일 레코드)

- **에러 처리 전략**:
  - 에러 발생 시 빈 배열 또는 null 반환
  - 콘솔에 에러 로깅 (개발 환경)
  - UI에서 빈 상태를 우아하게 처리

- **타입 안전성 확보**:
  ```typescript
  // 명시적 타입 지정으로 타입 오류 방지
  type Project = Tables<'projects'>
  export async function getFeaturedProjects(): Promise<Project[]>
  ```

### 3. 다크모드 구현

#### 3.1 ThemeProvider 설정
- **구현 방식**: `next-themes` 라이브러리 활용
- **설정 옵션**:
  - `attribute="class"`: HTML 요소에 `class` 속성으로 테마 적용
  - `defaultTheme="system"`: 시스템 설정을 기본값으로 사용
  - `enableSystem`: 시스템 테마 감지 활성화
  - `disableTransitionOnChange`: 테마 전환 시 깜빡임 방지

- **추론 과정**:
  - 시스템 설정 감지: 사용자 경험 향상
  - `suppressHydrationWarning`: 서버/클라이언트 렌더링 불일치 경고 방지

#### 3.2 ThemeToggle 컴포넌트
- **구현 고려사항**:
  - **Hydration 문제 해결**: `mounted` 상태로 클라이언트에서만 렌더링
  - **접근성**: `sr-only` 클래스로 스크린 리더 지원
  - **아이콘**: `lucide-react`의 `Sun`/`Moon` 아이콘 사용

### 4. 레이아웃 구조

#### 4.1 Header 컴포넌트
- **디자인 결정**:
  - Sticky 포지션: 스크롤 시에도 네비게이션 접근성 유지
  - Backdrop blur: 반투명 배경으로 콘텐츠와의 시각적 분리
  - 반응형 네비게이션: 모바일에서는 숨김 (향후 모바일 메뉴 추가 예정)

- **구조**:
  ```
  [Logo] [Navigation Links] [Social Icons + Theme Toggle]
  ```

- **소셜 링크**: 하드코딩된 URL (향후 프로필 데이터에서 가져오도록 개선 가능)

#### 4.2 Footer 컴포넌트
- **심플한 디자인**: 저작권 표시와 소셜 링크만 포함
- **연도 동적 생성**: `new Date().getFullYear()` 사용

### 5. 홈페이지 섹션 구현

#### 5.1 Hero Section
- **디자인 요소**:
  - 큰 타이포그래피: `text-4xl` ~ `text-7xl` (반응형)
  - 배경 그래디언트: `from-primary/5`로 은은한 효과
  - CTA 버튼: Portfolio 보기, Contact 링크

- **데이터 소스**: `profiles` 테이블의 `name`, `title`, `bio` 필드

#### 5.2 Featured Projects
- **카드 디자인**:
  - 썸네일 이미지: Next.js Image 컴포넌트로 최적화
  - 기술 스택 태그: 최대 4개만 표시
  - 액션 버튼: Demo, Code 링크

- **데이터 페칭**:
  ```typescript
  .eq('featured', true)
  .order('order', { ascending: true })
  .limit(3)
  ```

- **빈 상태 처리**: "No featured projects yet." 메시지 표시

#### 5.3 Latest Posts
- **리스트 디자인**:
  - 그리드 레이아웃: `md:grid-cols-2`
  - 날짜 표시: `date-fns`로 포맷팅
  - 읽기 시간: `reading_time` 필드 활용
  - 태그: 최대 3개만 표시

- **데이터 페칭**:
  ```typescript
  .eq('published', true)
  .order('published_at', { ascending: false })
  .limit(4)
  ```

#### 5.4 Skills Section
- **유연한 데이터 처리**:
  - 프로필에 `skills` 배열이 있으면 사용
  - 없으면 기본 기술 스택 표시 (Frontend, Backend, Tools)

- **카테고리별 그리드**: `md:grid-cols-3` 레이아웃

### 6. 이미지 최적화

#### 6.1 Next.js Image 설정
- **remotePatterns 추가**:
  ```javascript
  {
    protocol: 'https',
    hostname: '**.supabase.co',
  }
  ```
- **이유**: Supabase Storage에서 호스팅되는 이미지 사용을 위해

## 파일 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (Header, Footer 포함)
│   ├── page.tsx             # 홈페이지
│   └── globals.css          # 전역 스타일 (다크모드 변수 포함)
├── components/
│   ├── header.tsx           # 헤더 컴포넌트
│   ├── footer.tsx           # 푸터 컴포넌트
│   ├── theme-provider.tsx   # 테마 프로바이더
│   ├── theme-toggle.tsx     # 테마 토글 버튼
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── featured-projects.tsx
│   │   ├── latest-posts.tsx
│   │   └── skills-section.tsx
│   └── ui/                  # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       └── skeleton.tsx
├── lib/
│   ├── utils.ts             # 유틸리티 함수 (cn)
│   └── supabase/
│       ├── client.ts        # 브라우저용 클라이언트
│       ├── server.ts        # 서버용 클라이언트
│       └── queries.ts       # 데이터 페칭 함수
└── type/
    └── supabase.ts          # Supabase 타입 정의
```

## 주요 기술적 결정 사항

### 1. 서버 컴포넌트 우선 전략
- **이유**: 초기 로딩 성능 최적화, SEO 개선
- **트레이드오프**: 클라이언트 상호작용이 필요한 부분만 클라이언트 컴포넌트로 분리

### 2. 타입 안전성
- Supabase 타입 정의를 활용하여 런타임 오류 방지
- 명시적 반환 타입 지정으로 함수 시그니처 명확화

### 3. 에러 처리
- 사용자에게는 빈 상태로 표시
- 개발자에게는 콘솔 로그로 디버깅 정보 제공

### 4. 반응형 디자인
- Mobile-first 접근
- `md:` 브레이크포인트로 태블릿/데스크톱 레이아웃 조정

## 고려했지만 미구현된 기능

### 1. 모바일 네비게이션 메뉴
- **이유**: 패키지 매니저 충돌 (npm/pnpm)로 인해 `sheet` 컴포넌트 설치 실패
- **향후 계획**: 모바일 메뉴를 위한 햄버거 메뉴 추가

### 2. 로딩 상태 (Skeleton UI)
- Skeleton 컴포넌트는 설치했으나 아직 활용하지 않음
- **향후 개선**: 데이터 로딩 중 스켈레톤 UI 표시

### 3. 프로필 데이터 기반 소셜 링크
- 현재 하드코딩된 소셜 링크를 프로필 데이터에서 가져오도록 개선 가능

## 성능 최적화 고려사항

### 1. 이미지 최적화
- Next.js Image 컴포넌트 사용
- `fill` prop으로 반응형 이미지 구현
- `object-cover`로 비율 유지

### 2. 데이터 페칭
- `Promise.all`로 병렬 페칭
- 서버 컴포넌트에서 직접 페칭하여 클라이언트 번들 크기 감소

### 3. CSS 최적화
- Tailwind CSS의 JIT 모드 활용
- 사용하지 않는 스타일 자동 제거

## 테스트 및 검증

### 린터 오류 해결
- 초기 타입 오류 발생: Supabase 쿼리 반환 타입 불일치
- **해결 방법**: 명시적 타입 캐스팅 및 `maybeSingle()` 사용

### 브라우저 호환성
- `supports-[backdrop-filter]`로 브라우저 기능 감지
- 폴백 스타일 제공

## 향후 개선 방향

1. **모바일 메뉴**: Sheet 컴포넌트를 활용한 사이드 메뉴
2. **로딩 상태**: Suspense와 Skeleton UI 통합
3. **에러 바운더리**: 에러 발생 시 사용자 친화적 메시지
4. **애니메이션**: Framer Motion을 활용한 페이지 전환 효과
5. **SEO 최적화**: 메타데이터 동적 생성
6. **프로필 데이터 연동**: 소셜 링크, 아바타 등 동적 로딩

## 참고 자료

- [Next.js 14 App Router 문서](https://nextjs.org/docs/app)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [Supabase 문서](https://supabase.com/docs)
- [next-themes 문서](https://github.com/pacocoursey/next-themes)

