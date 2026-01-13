# subeom.dev

포트폴리오 & 기술블로그

## 프로젝트 개요

Next.js 14 App Router 기반의 **AI-Augmented (AI 증강)** 개발자 포트폴리오 및 기술 블로그입니다. 기획 단계부터 코드 구현, 디버깅까지 **AI Co-Pilot과의 유기적인 협업**을 통해 개발 생산성을 극대화했습니다.

FSD (Feature-Sliced Design) 아키텍처를 적용하여 확장 가능하고 유지보수가 용이한 코드베이스를 구축했으며, Supabase를 백엔드로 사용하여 풀스택 역량을 담아냈습니다. 서버 컴포넌트 우선 전략으로 최적의 성능과 SEO를 달성했습니다.

## 기술 스택

### Core

#### Framework: Next.js 14 (App Router)
- **서버 컴포넌트 우선 전략**: 초기 로딩 성능 최적화 및 SEO 개선
- **App Router**: 파일 기반 라우팅으로 직관적인 구조, 레이아웃과 중첩 라우팅 지원
- **SSG/ISR 지원**: 빌드 타임 최적화로 빠른 페이지 로딩
- **ImageResponse API**: 동적 OG 이미지 및 파비콘 생성 (`next/og`)

#### Language: TypeScript
- **타입 안전성**: 컴파일 타임 오류 감지로 런타임 오류 방지
- **Supabase 타입 정의**: 데이터베이스 스키마와 완벽한 타입 동기화
- **개발자 경험**: IDE 자동완성 및 리팩토링 지원

#### Styling: Tailwind CSS + shadcn/ui
- **Tailwind CSS**: 유틸리티 퍼스트 접근으로 빠른 개발, JIT 모드로 최적화된 번들 크기
- **shadcn/ui**: 
  - 복사-붙여넣기 방식으로 커스터마이징 용이
  - Tailwind CSS와 완벽한 통합
  - 접근성(A11y) 고려된 컴포넌트 제공
  - TypeScript 완전 지원
- **CSS 변수 시스템**: 다크모드 자동 지원 및 일관된 색상 관리

#### Database: Supabase (PostgreSQL)
- **풀스택 솔루션**: 인증, 데이터베이스, 스토리지 통합 제공
- **실시간 기능**: 향후 확장 가능성 (댓글, 알림 등)
- **Row Level Security (RLS)**: 보안 정책 관리
- **Server/Client 분리**: 서버 컴포넌트와 클라이언트 컴포넌트 각각 최적화된 클라이언트

#### Architecture: FSD (Feature-Sliced Design)
- **확장 가능한 구조**: 레이어별 명확한 책임 분리
- **의존성 규칙**: App → Widgets → Features → Entities → Shared 방향으로 일관성 유지
- **재사용성**: Features와 Entities의 독립적 관리
- **유지보수성**: 기능별 격리로 변경 영향도 최소화

### 주요 라이브러리

#### Animation: Framer Motion
- **성능 최적화**: 하드웨어 가속 애니메이션
- **Layout 애니메이션**: 필터 변경 시 자연스러운 카드 재배치
- **선언적 API**: 복잡한 애니메이션을 간결한 코드로 구현

#### Content: MDX (next-mdx-remote)
- **Next.js 14 호환**: App Router와 완벽 호환, 서버 컴포넌트 지원
- **유연성**: 데이터베이스에 MDX 콘텐츠 저장 가능 (파일 기반 대안 불필요)
- **빌드 타임 최적화**: 서버에서 MDX 직렬화로 클라이언트 번들 크기 감소

#### Code Highlighting: shiki + rehype-pretty-code
- **shiki**: VS Code와 동일한 코드 하이라이팅 엔진 (TextMate 문법)
- **rehype-pretty-code**: 라인 하이라이팅, 단어 하이라이팅 지원
- **테마 지원**: github-dark 등 다양한 테마

#### Markdown: react-markdown + remark-gfm
- **안전한 파싱**: XSS 방지
- **GitHub Flavored Markdown**: 테이블, 체크리스트 등 확장 문법 지원
- **플러그인 체인**: rehype 플러그인으로 유연한 확장

#### Theme: next-themes
- **Hydration 안전**: 서버/클라이언트 렌더링 불일치 방지
- **시스템 테마 감지**: 사용자 OS 설정 자동 감지
- **CSS 변수 통합**: Tailwind CSS와 완벽한 통합

#### Date: date-fns
- **트리쉐이킹 지원**: 필요한 함수만 번들에 포함
- **로케일 지원**: 한국어 날짜 포맷팅 (`ko` locale)
- **TypeScript 지원**: 타입 안전한 날짜 조작

## 프로젝트 배경

이 프로젝트는 개발자의 포트폴리오를 효과적으로 보여주고, 기술적 경험과 지식을 공유하기 위한 목적으로 시작되었습니다. 단순한 정적 페이지가 아닌, 현대적인 웹 개발 기술과 아키텍처 패턴을 적용한 실전 프로젝트로 구성했습니다.

### 주요 목표
1. **확장 가능한 아키텍처**: FSD를 적용하여 장기적으로 유지보수가 용이한 구조
2. **최적의 성능**: 서버 컴포넌트와 SSG를 활용한 빠른 로딩 속도
3. **개발자 경험**: TypeScript와 타입 안전성을 통한 안정적인 개발
4. **디자인 시스템**: 일관된 UI 컴포넌트와 Semantic Tokens 활용

## 개발 과정 (Phase별)

### Phase 1: 프로젝트 기본 구조 및 홈페이지 구현

**작업 기간**: 초기 설계 단계

**주요 작업**:
- Next.js 14 App Router 프로젝트 설정
- shadcn/ui 디자인 시스템 도입
- Supabase 클라이언트 설정 (서버/클라이언트 분리)
- 다크모드 구현 (next-themes)
- 홈페이지 기본 섹션 구현 (Hero, Featured Projects, Latest Posts, Skills)

**기술적 결정**:
- **서버 컴포넌트 우선 전략**: 초기 로딩 성능 최적화 및 SEO 개선
- **Tailwind CSS + CSS 변수**: 다크모드 자동 지원 및 일관된 색상 관리
- **Semantic Tokens**: 하드코딩된 색상 대신 의미 있는 토큰 사용

**트러블슈팅**:
- **Supabase 타입 오류**: 쿼리 반환 타입 불일치 문제 → 명시적 타입 캐스팅 및 `maybeSingle()` 사용으로 해결
- **Hydration 경고**: 테마 전환 시 서버/클라이언트 불일치 → `suppressHydrationWarning` 및 `mounted` 상태로 해결

### Phase 2: 포트폴리오 시스템 구현

**주요 작업**:
- 프로젝트 목록 및 상세 페이지 구현
- Server Actions를 활용한 데이터 페칭
- SSG (Static Site Generation) 적용
- Framer Motion을 활용한 필터링 애니메이션
- 마크다운 렌더링 (react-markdown)

**기술적 결정**:
- **Server Actions 선택**: 타입 안전성과 API 엔드포인트 관리 불필요
- **SSG vs ISR**: 프로젝트 데이터가 자주 변경되지 않아 SSG 선택
- **클라이언트 사이드 필터링**: 즉시 결과 표시를 위한 UX 최적화

**성능 최적화**:
- `generateStaticParams`로 빌드 타임에 모든 페이지 생성
- Next.js Image 컴포넌트로 이미지 최적화
- 필요한 필드만 조회 (`select('id')`)

### Phase 3: 블로그 시스템 구현 (MDX Engine)

**주요 작업**:
- MDX 기반 블로그 시스템 구축 (next-mdx-remote)
- 코드 하이라이팅 (shiki + rehype-pretty-code)
- 검색 및 태그 필터링 기능
- 목차(TOC) 구현 (Intersection Observer)
- 코드 블록 복사 기능

**기술적 결정**:
- **next-mdx-remote (RSC)**: Next.js 14 App Router와 완벽 호환, 서버 컴포넌트 지원
- **shiki**: VS Code와 동일한 코드 하이라이팅 엔진
- **Intersection Observer**: 네이티브 API로 목차 활성화 상태 추적
- **Optimistic UI**: 좋아요 기능에 즉시 UI 업데이트 패턴 적용

**트러블슈팅**:
- **MDX 직렬화**: 서버 컴포넌트에서 MDX 파싱 및 직렬화 구현
- **코드 하이라이팅 성능**: 빌드 타임에 하이라이팅 처리로 런타임 성능 최적화
- **목차 스크롤 오프셋**: Sticky 헤더를 고려한 오프셋 계산

### Phase 4: About 및 Contact 페이지 구현

**주요 작업**:
- 실제 프로필 데이터 기반 About 페이지 구현
- 타임라인 디자인으로 경력 표시
- Contact 페이지 및 문의 폼 구현
- Framer Motion을 활용한 스크롤 애니메이션

**디자인 결정**:
- **타임라인 디자인**: 경력의 시간적 흐름을 시각적으로 표현
- **한글 처리**: `break-keep` 클래스로 단어 단위 줄바꿈
- **2컬럼 레이아웃**: Contact 페이지의 정보 밀도 최적화

### Phase 5: 브랜드 아이덴티티 및 SEO 강화 (Recent)

**주요 작업**:
- **Code-as-Design 브랜딩**: 별도의 디자인 툴 없이 코드로 로고 및 아이콘 생성
- **Dynamic OG Image**: `next/og` (ImageResponse)를 활용한 동적 오픈 그래프 이미지 생성
- **Dynamic Favicon**: 다크/라이트 모드 및 브랜드 컬러에 반응하는 파비콘 구현
- **Tinted Badge System**: 가독성을 높인 배경색/글자색 조합(Tinted Style)으로 배지 시스템 전면 개편
- **모바일 네비게이션**: shadcn/ui Sheet 컴포넌트를 활용한 햄버거 메뉴 구현

**기술적 결정**:
- **ImageResponse 활용**: 빌드 타임에 CSS를 이미지로 변환하여 성능 저하 없이 일관된 브랜딩 유지
- **Edge Runtime**: 동적 이미지 생성 시 Edge 환경에서 실행하여 빠른 응답 시간 확보
- **Hex Code 사용**: HSL 색상 파싱 이슈를 피하기 위해 Hex Code로 변환

## 기술적 난관 및 해결 과정

### 1. FSD 아키텍처 적용

**문제점**:
- 초기에는 전통적인 컴포넌트 구조로 시작
- App Layer에서 하위 레이어(components, lib) 직접 import
- 중복된 UI 컴포넌트 (components/ui vs shared/ui)

**해결 과정**:
1. FSD 아키텍처 원칙 학습 및 적용
2. 레이어 구조 재설계: `components/sections` → `widgets/home`
3. 의존성 방향 명확화: App → Widgets → Features → Entities → Shared
4. 중복 컴포넌트 통합: `shared/ui`로 통일

**결과**:
- 확장 가능한 폴더 구조 확립
- 명확한 의존성 규칙으로 유지보수성 향상
- 코드 재사용성 증가

### 2. TypeScript 타입 안전성

**문제점**:
- Supabase 쿼리 반환 타입 불일치
- `.eq()` 필터 타입 에러
- 암시적 `any` 타입 에러

**해결 과정**:
```typescript
// 타입 안전한 쿼리 작성
if (!data) {
  return []
}
return (data as unknown as Project[]) // 안전한 타입 캐스팅

// .eq() 필터 타입 에러 해결
.eq('featured' as never, true) // 타입 단언 사용
```

**결과**:
- 컴파일 타임 타입 체크로 런타임 오류 방지
- 명시적 타입 지정으로 코드 가독성 향상

### 3. MDX 렌더링 최적화

**문제점**:
- 서버 컴포넌트에서 MDX 렌더링 성능 이슈
- 코드 하이라이팅 런타임 비용

**해결 과정**:
- `next-mdx-remote/rsc`로 서버 사이드 렌더링
- 빌드 타임에 MDX 직렬화 수행
- rehype 플러그인 체인으로 파이프라인 구성

**결과**:
- 초기 로딩 시간 단축
- 클라이언트 번들 크기 감소
- SEO 최적화

### 4. 디자인 시스템 일관성

**문제점**:
- 하드코딩된 색상 값
- 컴포넌트 variant 불일치
- 다크모드 지원 불완전

**해결 과정**:
- Semantic Tokens 도입 (`bg-primary`, `text-foreground` 등)
- CVA (Class Variance Authority)로 variant 시스템 구축
- CSS 변수 기반 테마 시스템

**결과**:
- 일관된 디자인 언어
- 다크모드 자동 지원
- 테마 변경 용이성

### 5. Edge Runtime 이미지 생성 오류

**문제점**:
- `ImageResponse`(`next/og`) 사용 시 CSS의 `hsl()` 함수가 포함된 그라데이션 파싱 실패 (500 Error)
- Next.js의 Edge 환경(Satori 엔진)과 복잡한 CSS 함수 간의 호환성 문제

**해결 과정**:
- HSL 값을 **Hex Code(#RRGGBB)**로 변환하여 하드코딩
- 파서가 해석하기 쉬운 단순한 문자열 형태로 색상 값 주입
- 그라데이션에도 Hex Code 사용

**결과**:
- 동적 파비콘 및 OG 이미지 생성 기능 안정화
- 다양한 환경(브라우저/카카오톡 등)에서 미리보기 이미지 정상 출력
- 빌드 타임 성능 향상

## 최근 개선 사항

### 브랜드 아이덴티티 및 SEO 강화
- **Code-as-Design 브랜딩**: 별도의 디자인 툴 없이 코드로 로고 및 아이콘 생성
- **Dynamic OG Image**: `next/og` (ImageResponse)를 활용한 동적 오픈 그래프 이미지 생성
- **Dynamic Favicon**: 다크/라이트 모드 및 브랜드 컬러에 반응하는 파비콘 구현

### 모바일 UX/UI 고도화
- **네비게이션 드로어(Drawer)**: shadcn/ui `Sheet` 컴포넌트를 활용한 햄버거 메뉴 구현
- **반응형 헤더**: 데스크탑(`md:flex`)과 모바일(`md:hidden`) 뷰 분기 처리로 최적화된 레이아웃 제공
- **자동 닫힘 처리**: 모바일 메뉴 클릭 시 `SheetClose` 트리거로 네비게이션 즉시 종료

### Badge Variant 최적화
- 사용 사례별로 적절한 variant 설정
  - 포스트 태그: `gray` (일반 태그용)
  - 프로젝트 카테고리: `brand` (중요 정보 강조)
  - Tech Stack: `brand` (중요 정보 강조)
  - 스킬: `brand` (중요 정보 강조)
- **Tinted Badge System**: 가독성을 높인 배경색/글자색 조합(Tinted Style)으로 배지 시스템 전면 개편
- 중복된 className 속성 제거 (variant에 이미 스타일 포함)

### 사용하지 않는 의존성 제거
- `zustand`: 설치되어 있었으나 사용하지 않아 제거
- `@tanstack/react-query`: 설치되어 있었으나 사용하지 않아 제거
- 트리쉐이킹을 통한 번들 크기 최적화

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router (라우팅 전용)
├── widgets/          # 위젯 블록 (FSD)
├── features/         # 기능 단위 (FSD)
├── entities/         # 비즈니스 엔티티 (FSD)
│   ├── post/         # 포스트 엔티티
│   └── project/      # 프로젝트 엔티티
├── shared/           # 공유 리소스 (FSD)
│   ├── ui/           # shadcn/ui 컴포넌트
│   ├── lib/          # 유틸리티 함수
│   ├── mdx/          # MDX 설정 및 컴포넌트
│   └── hooks/        # 커스텀 훅
├── components/       # 레거시/공통 컴포넌트
└── type/             # 타입 정의
```

### FSD 아키텍처 원칙

1. **App Layer**: 순수 라우팅만 담당, 비즈니스 로직 없음
2. **Widgets Layer**: 페이지를 구성하는 큰 UI 블록
3. **Features Layer**: 재사용 가능한 기능 단위
4. **Entities Layer**: 비즈니스 모델 데이터 및 UI (api, model, ui 분리)
5. **Shared Layer**: 프로젝트 전역에서 사용하는 공유 리소스

**의존성 방향**: App → Widgets → Features → Entities → Shared

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
# 프로덕션 빌드
pnpm build

```

## 주요 기능

### 포트폴리오
- 프로젝트 목록 및 상세 페이지
- 카테고리별 필터링
- 기술 스택 표시
- 이미지 갤러리
- 마크다운 기반 상세 설명

### 블로그
- MDX 기반 게시글 작성
- 코드 하이라이팅 (VS Code 스타일)
- 검색 및 태그 필터링
- 목차(TOC) 자동 생성
- 이전/다음 글 네비게이션
- 코드 블록 복사 기능

### About & Contact
- 경력 타임라인
- 학력 및 교육
- 문의 폼

### 브랜딩 & SEO
- Code-as-Design: 코드로 생성된 로고 및 아이콘
- 동적 OG 이미지: 소셜 미디어 공유 최적화
- 동적 파비콘: 다크/라이트 모드 반응형
- 반응형 네비게이션: 모바일 드로어 메뉴

## 성능 최적화

1. **서버 컴포넌트 우선 전략**: 클라이언트 번들 크기 감소
2. **SSG (Static Site Generation)**: 빌드 타임에 정적 페이지 생성
3. **이미지 최적화**: Next.js Image 컴포넌트 자동 최적화
4. **코드 스플리팅**: 클라이언트 컴포넌트만 동적 import
5. **메모이제이션**: `useMemo`로 불필요한 재계산 방지

## 배포

이 프로젝트는 Vercel을 통해 배포할 수 있습니다:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/parksubeom/subeom.dev)

## 참고 자료

- [Next.js 14 App Router 문서](https://nextjs.org/docs/app)
- [FSD 아키텍처 가이드](https://feature-sliced.design/)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [Supabase 문서](https://supabase.com/docs)
- [next-mdx-remote 문서](https://github.com/hashicorp/next-mdx-remote)

## 라이선스

이 프로젝트는 개인 포트폴리오 프로젝트입니다.
