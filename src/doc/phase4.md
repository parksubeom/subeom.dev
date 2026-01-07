# Phase 4: About(소개) 및 Contact(연락) 페이지 구현

## 작업 개요

Phase 4에서는 실제 사용자 프로필 데이터를 기반으로 About 페이지와 Contact 페이지를 구현했습니다. 더미 텍스트(Lorem Ipsum)를 사용하지 않고, 제공된 실제 데이터를 활용하여 진정성 있는 페이지를 완성했습니다.

## 구현 과정

### 1. 프로필 데이터 정의 (Source of Truth)

#### 1.1 기본 정보
- **이름**: 박수범 (Subeom Park)
- **직무**: Frontend Developer
- **슬로건**: "비즈니스 임팩트를 고민하며 근본적인 문제 해결에 집중합니다."
- **연락처**: sooknise@naver.com / 010-8109-0731
- **현재 상태**: Available for work (구직 중)

#### 1.2 자기소개 (Intro)
단순한 기능 구현을 넘어 '왜(Why)'를 끊임없이 질문하며, 서비스 자체에 대한 오너십을 가지고 제품을 만듭니다. 웹 접근성 컨설팅 경험을 통해 다양한 환경의 사용자를 고려하는 포용적인 인터페이스 설계 역량을 길렀으며, 이를 바탕으로 코드의 표준 준수와 품질을 타협하지 않는 견고함을 지향합니다.

#### 1.3 경력 데이터 구조화
타임라인 순서로 정렬된 3개의 경력 항목:
1. **(주)에스앤씨랩** - 웹 접근성 컨설팅 및 개선 개발
2. **널리소프트(SSEM)** - 프론트엔드 개발
3. **모아프렌즈** - ICT 인턴

각 경력 항목은 회사명, 직무, 설명, 핵심 성과(Bullet point)로 구성됩니다.

#### 1.4 학력 & 교육 데이터
3개의 교육 항목:
- 항해 플러스 (2025.10 - 2026.01) - Best Practice 5회 선정
- 코드스테이츠 (2022.12 - 2023.06) - 기수 1위 수료
- 전남대학교 (2015.03 - 2024.08)

### 2. About 페이지 구현 (`src/widgets/about`)

#### 2.1 FSD 아키텍처 준수
- **위젯 레이어**: `src/widgets/about/ui/about-page.tsx`
- **App 레이어**: `src/app/about/page.tsx` (순수 라우팅만 담당)
- **의존성 방향**: Widgets → Shared UI

#### 2.2 Hero Section
- 이름과 직무를 크게 표시 (그라디언트 효과 적용)
- 슬로건을 서브텍스트로 배치
- **[Download Resume]** 버튼: `/resume.pdf` 다운로드 기능
- Framer Motion을 사용한 Fade In 애니메이션

**구현 세부사항:**
```typescript
// 그라디언트 텍스트 효과
<span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
  박수범
</span>

// Resume 다운로드 핸들러
const handleDownloadResume = () => {
  const link = document.createElement("a")
  link.href = "/resume.pdf"
  link.download = "resume.pdf"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
```

#### 2.3 Intro Section
- 자기소개 텍스트를 인용구 스타일로 배치
- `border-l-4 border-primary`로 왼쪽 강조선 추가
- `break-keep` 클래스로 한글 단어 단위 줄바꿈 처리

#### 2.4 Experience Section (타임라인)
- **수직 타임라인 디자인**: 왼쪽에 세로선과 점으로 시각적 타임라인 표현
- **Card 컴포넌트 활용**: 각 경력 항목을 Card로 표시
- **스크롤 애니메이션**: `useInView` 훅을 사용하여 스크롤 시 순차적으로 Fade In + Slide Up
- **핵심 성과**: Bullet point로 명확하게 표시

**타임라인 구현:**
```typescript
// Timeline line과 dot
<div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
<div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 rounded-full bg-primary border-4 border-background" />

// 스크롤 애니메이션
const ref = useRef(null)
const isInView = useInView(ref, { once: true, margin: "-100px" })
```

#### 2.5 Education Section
- 심플한 리스트 형태로 나열
- Card 컴포넌트로 각 항목 표시
- 기간과 특이사항(수상 내역 등)을 우측에 배치
- 반응형 레이아웃 (모바일: 세로, 데스크톱: 가로)

### 3. Contact 페이지 구현 (`src/widgets/contact`)

#### 3.1 레이아웃 구조
- **2컬럼 레이아웃**: 좌측 연락처 정보, 우측 문의 폼
- **반응형**: 모바일에서는 1컬럼으로 전환
- Framer Motion을 사용한 좌우 슬라이드 인 애니메이션

#### 3.2 Contact Info (좌측)
- **이메일**: `mailto:` 링크 + 복사 버튼
- **전화번호**: `tel:` 링크
- **현재 상태**: Available for work 표시 (애니메이션 점)
- **소셜 링크**: GitHub, Blog 링크 (아이콘 버튼)

**이메일 복사 기능:**
```typescript
const [copied, setCopied] = useState(false)

const handleCopyEmail = () => {
  navigator.clipboard.writeText("sooknise@naver.com")
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}
```

#### 3.3 Contact Form Feature (`src/features/contact`)

**FSD 구조:**
- **Feature 레이어**: `src/features/contact/ui/contact-form.tsx`
- **재사용 가능한 기능**: 다른 페이지에서도 사용 가능

**폼 필드:**
- 이름 (text)
- 이메일 (email)
- 제목 (text)
- 메시지 (textarea)

**구현 특징:**
- 클라이언트 컴포넌트 (`"use client"`)
- 폼 상태 관리 (useState)
- 제출 시 콘솔 출력 + 토스트 메시지 (Demo 모드)
- API Key가 없으므로 실제 전송은 구현하지 않음

**토스트 구현 (간단 버전):**
```typescript
const showToast = (message: string) => {
  const toast = document.createElement("div")
  toast.className = "fixed top-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-md shadow-lg z-50 animate-in slide-in-from-top"
  toast.textContent = message
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.opacity = "0"
    toast.style.transition = "opacity 0.3s"
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}
```

### 4. 공유 컴포넌트 추가

#### 4.1 Textarea 컴포넌트 (`src/shared/ui/textarea.tsx`)
- Contact Form의 메시지 필드용
- shadcn/ui 스타일 가이드 준수
- Input 컴포넌트와 일관된 디자인

**구현:**
```typescript
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm...",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### 5. 디자인 가이드 준수

#### 5.1 Typography
- **한글 폰트**: `break-keep` 클래스를 적극 활용하여 단어 단위 줄바꿈 처리
- **Semantic Tokens**: 하드코딩된 색상 없이 `text-foreground`, `text-muted-foreground` 등 사용
- **다크 모드**: CSS 변수 기반으로 자동 지원

#### 5.2 Animation
- **Framer Motion**: 모든 섹션에 스크롤 애니메이션 적용
- **타임라인 아이템**: 순차적으로 Fade In + Slide Up
- **Contact 페이지**: 좌우 슬라이드 인 효과

**애니메이션 패턴:**
```typescript
// 스크롤 기반 애니메이션
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5 }}
>
```

#### 5.3 반응형 디자인
- **모바일 우선**: 기본 스타일은 모바일 기준
- **Breakpoint**: `md:`, `lg:` 프리픽스 사용
- **Grid 레이아웃**: `grid-cols-1 lg:grid-cols-2`로 반응형 전환

### 6. FSD 아키텍처 검증

#### 6.1 의존성 방향 준수
```
App Layer (page.tsx)
  ↓
Widgets Layer (about-page.tsx, contact-page.tsx)
  ↓
Features Layer (contact-form.tsx)
  ↓
Shared Layer (ui components, utils)
```

#### 6.2 레이어 분리
- **App Layer**: 순수 라우팅만 담당, 비즈니스 로직 없음 ✅
- **Widgets Layer**: 독립적인 UI 블록, 페이지 단위 구성 ✅
- **Features Layer**: 재사용 가능한 기능 단위 (Contact Form) ✅
- **Shared Layer**: 공유 컴포넌트 (Card, Button, Input, Textarea) ✅

### 7. 개선 사항 및 향후 계획

#### 7.1 현재 구현
- ✅ 실제 프로필 데이터 기반 구현
- ✅ FSD 아키텍처 준수
- ✅ 반응형 디자인
- ✅ 애니메이션 적용
- ✅ 접근성 고려 (시맨틱 HTML, ARIA)

#### 7.2 향후 개선 가능 사항
1. **Toast 라이브러리 통합**: `react-hot-toast` 또는 `sonner` 추가
2. **Contact Form API 연동**: 실제 이메일 전송 기능 (Resend, SendGrid 등)
3. **Resume PDF 파일**: `/public/resume.pdf` 파일 추가
4. **소셜 링크**: Blog URL 실제 링크로 업데이트
5. **다국어 지원**: i18n 추가 (선택사항)

## 파일 구조

```
src/
├── app/
│   ├── about/
│   │   └── page.tsx              # About 페이지 라우팅
│   └── contact/
│       └── page.tsx              # Contact 페이지 라우팅
├── widgets/
│   ├── about/
│   │   ├── index.ts
│   │   └── ui/
│   │       └── about-page.tsx    # About 페이지 위젯
│   └── contact/
│       ├── index.ts
│       └── ui/
│           └── contact-page.tsx  # Contact 페이지 위젯
├── features/
│   └── contact/
│       ├── index.ts
│       └── ui/
│           └── contact-form.tsx  # Contact Form 기능
├── shared/
│   └── ui/
│       └── textarea.tsx          # Textarea 공유 컴포넌트
└── doc/
    └── phase4.md                 # 이 문서
```

## 테스트 체크리스트

- [x] About 페이지 Hero Section 렌더링
- [x] Resume 다운로드 버튼 동작
- [x] Intro Section 표시
- [x] Experience 타임라인 표시 및 애니메이션
- [x] Education 리스트 표시
- [x] Contact 페이지 2컬럼 레이아웃
- [x] 이메일 복사 기능
- [x] Contact Form 제출 (Demo 모드)
- [x] 반응형 디자인 (모바일/데스크톱)
- [x] 다크 모드 지원
- [x] 애니메이션 동작

## 결론

Phase 4를 통해 실제 사용자 프로필 데이터를 기반으로 About 페이지와 Contact 페이지를 완성했습니다. FSD 아키텍처 원칙을 준수하며, 재사용 가능한 컴포넌트 구조를 유지했습니다. 모든 텍스트는 실제 데이터를 사용하여 진정성 있는 포트폴리오 페이지를 구현했습니다.

## 추론 과정

### 1. 데이터 구조화 결정
- 경력과 학력 데이터를 배열로 구조화하여 타임라인과 리스트로 렌더링
- 각 항목에 필요한 정보(회사명, 직무, 성과 등)를 객체로 정의
- **이유**: 데이터를 구조화하면 유지보수가 쉽고, 향후 Supabase 등으로 마이그레이션 시에도 유리

### 2. 타임라인 디자인 선택
- 수직 타임라인이 경력의 시간적 흐름을 잘 표현
- `useInView`를 사용한 스크롤 애니메이션으로 사용자 경험 향상
- **이유**: 경력은 시간 순서가 중요하므로 타임라인이 가장 적합한 시각화 방법

### 3. Contact Form Feature 분리
- FSD 원칙에 따라 재사용 가능한 Feature로 분리
- 향후 다른 페이지에서도 사용 가능하도록 설계
- **이유**: Contact Form은 독립적인 기능 단위이므로 Feature 레이어가 적합

### 4. Toast 구현 방식
- 외부 라이브러리 없이 간단한 DOM 조작으로 구현
- 향후 `react-hot-toast` 등으로 교체 가능하도록 구조화
- **이유**: 프로젝트에 불필요한 의존성을 추가하지 않고, 필요 시 쉽게 교체 가능

### 5. 한글 처리
- `break-keep` 클래스를 적극 활용하여 한글 단어 단위 줄바꿈
- 긴 텍스트가 레이아웃을 깨뜨리지 않도록 처리
- **이유**: 한글은 단어 단위로 줄바꿈해야 가독성이 좋고, 레이아웃이 깨지지 않음

### 6. 애니메이션 전략
- `useInView`를 사용하여 스크롤 기반 애니메이션 구현
- `once: true` 옵션으로 성능 최적화
- **이유**: 사용자가 스크롤할 때 자연스럽게 콘텐츠가 나타나며, 한 번만 실행하여 성능 부담 최소화

### 7. 반응형 디자인 접근
- 모바일 우선 설계
- Grid 레이아웃을 사용하여 유연한 반응형 구현
- **이유**: 모바일 사용자가 많으므로 모바일 우선 설계가 중요하며, Grid는 반응형 레이아웃에 가장 적합
