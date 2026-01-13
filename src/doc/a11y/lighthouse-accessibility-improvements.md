# Lighthouse 접근성 점수 개선 작업

## 개요

Next.js 14, Tailwind CSS, shadcn/ui(Radix UI) 기반 프로젝트의 Lighthouse 접근성 점수를 개선하기 위해 두 가지 심각한 문제를 해결했습니다.

**작업 일자**: 2025-01-09  
**대상**: Lighthouse 접근성 감사에서 발견된 심각한 문제 2건

---

## 문제 1: [aria-*] 속성 유효성 오류

### 문제 분석

**에러 로그**:
```
button#radix-:R12puukq:-trigger-All 요소에서 유효한 값이 없다고 나옵니다.
```

**원인 파악**:
1. `src/widgets/portfolio/ui/portfolio-grid.tsx`와 `src/features/project-filter/ui/project-filter.tsx`에서 `Tabs` 컴포넌트를 필터링 용도로 사용
2. `TabsTrigger`는 존재하지만 대응하는 `TabsContent`가 없음
3. Radix UI의 `Tabs` 컴포넌트는 각 `TabsTrigger`에 대응하는 `TabsContent`가 필수
4. `TabsContent`가 없으면 `aria-controls` 속성이 유효하지 않은 ID를 참조하게 됨

**추론 과정**:
- Radix UI의 Tabs는 탭 패널을 표시하는 용도로 설계됨
- 필터링 버튼 그룹으로 사용하는 것은 적절하지 않음
- WAI-ARIA 표준에 따르면 `role="tablist"`와 `role="tab"`을 가진 버튼 그룹이 더 적합

### 해결 방법

**변경 전** (`portfolio-grid.tsx`):
```tsx
<Tabs defaultValue="All" className="w-full" onValueChange={setActiveCategory}>
  <TabsList className="bg-muted/50 backdrop-blur-sm p-1 inline-flex flex-wrap h-auto">
    {categories.map((category) => (
      <TabsTrigger 
        key={category} 
        value={category}
        className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
      >
        {category}
      </TabsTrigger>
    ))}
  </TabsList>
</Tabs>
```

**변경 후**:
```tsx
<div 
  role="tablist" 
  aria-label="프로젝트 카테고리 필터"
  className="flex flex-wrap gap-2"
>
  {categories.map((category) => (
    <Button
      key={category}
      variant={activeCategory === category ? "default" : "outline"}
      onClick={() => setActiveCategory(category)}
      role="tab"
      aria-selected={activeCategory === category}
      aria-controls={`category-${category}`}
      className={cn(
        "transition-all",
        activeCategory === category && "bg-background text-primary shadow-sm"
      )}
    >
      {category}
    </Button>
  ))}
</div>
```

**변경 사항**:
1. `Tabs` 컴포넌트 제거 → 일반 `div`에 `role="tablist"` 추가
2. `TabsTrigger` 제거 → `Button` 컴포넌트에 `role="tab"` 추가
3. `aria-selected` 속성으로 선택 상태 명시
4. `aria-label`로 필터 그룹의 목적 설명
5. `aria-controls`로 각 탭이 제어하는 영역 연결 (향후 확장 가능)

**이점**:
- ✅ ARIA 속성 유효성 오류 해결
- ✅ 시맨틱 HTML 구조 개선
- ✅ 스크린 리더 사용자 경험 향상
- ✅ 필터링 용도에 더 적합한 구조

---

## 문제 2: 제목(Heading) 계층 구조 오류

### 문제 분석

**에러 로그**:
```
제목 요소가 내림차순으로 표시되지 않음
```

**원인 파악**:
1. `src/widgets/about/ui/about-page.tsx`에서 `h1` 다음에 `h2` 대신 `h2`가 잘못 사용됨
2. `h1` 다음에 바로 `h3`가 나와서 계층 구조가 깨짐
3. `h4`가 `h3` 없이 사용됨

**페이지별 Heading 구조 분석**:

| 페이지 | 구조 | 문제 |
|--------|------|------|
| `/about` | h1 → h2(잘못된 사용) → h3 → h4 | h2가 h1 바로 다음에 잘못 사용, h3가 h2 없이 사용 |
| `/portfolio` | h1 → h2 | 정상 |
| `/blog` | h1 | 정상 |
| `/blog/[slug]` | h1 | 정상 |
| `/` (홈) | h1 → h2 → h3 | 정상 |

### 해결 방법

**변경 전** (`about-page.tsx`):
```tsx
<h1 className="text-4xl font-bold tracking-tight">About Me</h1>
<div className="space-y-2">
  <h2 className="text-xl font-medium text-muted-foreground">
    Frontend Developer, <span className="text-foreground font-semibold">박수범</span>
  </h2>
  ...
</div>

<section className="space-y-8">
  <motion.h3 className="text-2xl font-bold flex items-center gap-2">
    <Briefcase className="w-6 h-6 text-primary" />
    Experience
  </motion.h3>
  ...
  <h4 className="text-xl font-bold">{exp.company}</h4>
</section>
```

**변경 후**:
```tsx
<h1 className="text-4xl font-bold tracking-tight">About Me</h1>
<div className="space-y-2">
  <p className="text-xl font-medium text-muted-foreground">
    Frontend Developer, <span className="text-foreground font-semibold">박수범</span>
  </p>
  ...
</div>

<section className="space-y-8">
  <motion.h2 className="text-2xl font-bold flex items-center gap-2">
    <Briefcase className="w-6 h-6 text-primary" />
    Experience
  </motion.h2>
  ...
  <h3 className="text-xl font-bold">{exp.company}</h3>
</section>
```

**변경 사항**:
1. `h2` → `p`: 부제목은 제목이 아닌 일반 텍스트로 변경 (시각적 스타일은 유지)
2. `h3` → `h2`: Experience, Education 섹션 제목을 h2로 변경
3. `h4` → `h3`: 회사명을 h3로 변경

**Heading 계층 구조 (수정 후)**:
```
h1: About Me
  p: Frontend Developer, 박수범 (시각적 스타일만 유지)
  h2: Experience
    h3: (주)에스앤씨랩
    h3: 널리소프트
    h3: 모아프렌즈
  h2: Education
```

**이점**:
- ✅ 올바른 Heading 계층 구조 (h1 → h2 → h3)
- ✅ 스크린 리더가 문서 구조를 정확히 인식
- ✅ 시각적 스타일은 Tailwind 클래스로 유지
- ✅ SEO 개선 (검색 엔진이 콘텐츠 구조를 더 잘 이해)

---

## 수정된 파일 목록

1. **`src/widgets/portfolio/ui/portfolio-grid.tsx`**
   - Tabs 컴포넌트를 role="tablist"를 가진 버튼 그룹으로 변경
   - ARIA 속성 추가 (`aria-label`, `aria-selected`, `aria-controls`)

2. **`src/features/project-filter/ui/project-filter.tsx`**
   - Tabs 컴포넌트를 role="tablist"를 가진 버튼 그룹으로 변경
   - ARIA 속성 추가 (`aria-label`, `aria-selected`, `aria-controls`)

3. **`src/widgets/about/ui/about-page.tsx`**
   - h2 → p: 부제목을 일반 텍스트로 변경
   - h3 → h2: 섹션 제목 레벨 조정
   - h4 → h3: 하위 제목 레벨 조정

---

## 검증 방법

### 1. Lighthouse 접근성 감사
```bash
# Chrome DevTools > Lighthouse > Accessibility
# 또는
npm run build
npm run start
# Lighthouse CLI 사용
```

### 2. 스크린 리더 테스트
- **NVDA** (Windows): 무료 스크린 리더
- **VoiceOver** (Mac): 내장 스크린 리더
- **JAWS** (Windows): 상용 스크린 리더

### 3. 브라우저 개발자 도구
- **Chrome DevTools > Elements > Accessibility**
- ARIA 속성 검증
- Heading 구조 확인

### 4. 자동화 도구
- **axe DevTools**: 브라우저 확장 프로그램
- **WAVE**: 웹 접근성 평가 도구
- **Pa11y**: CLI 기반 접근성 테스트

---

## 참고 자료

### WAI-ARIA 표준
- [ARIA Authoring Practices Guide - Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [ARIA Authoring Practices Guide - Tablist](https://www.w3.org/WAI/ARIA/apg/patterns/tablist/)

### WCAG 가이드라인
- [WCAG 2.1 - Info and Relationships (1.3.1)](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
- [WCAG 2.1 - Headings and Labels (2.4.6)](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html)

### Radix UI 문서
- [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)

---

## 향후 개선 사항

1. **키보드 네비게이션 개선**
   - 필터 버튼 그룹에 화살표 키 네비게이션 추가
   - Enter/Space 키로 선택 가능하도록 개선

2. **포커스 관리**
   - 필터 변경 시 포커스 이동 최적화
   - 스크린 리더 사용자에게 변경 사항 알림

3. **접근성 테스트 자동화**
   - CI/CD 파이프라인에 접근성 테스트 추가
   - Pa11y 또는 axe-core 통합

4. **문서화**
   - 컴포넌트별 접근성 가이드라인 작성
   - 개발자 온보딩 자료에 접근성 체크리스트 추가

---

## 결론

두 가지 심각한 접근성 문제를 해결하여 Lighthouse 접근성 점수를 개선했습니다. 특히:

1. **ARIA 속성 유효성**: Tabs 컴포넌트의 부적절한 사용을 올바른 ARIA 패턴으로 교체
2. **Heading 계층 구조**: 시맨틱 HTML 구조를 올바르게 정리하여 스크린 리더와 SEO 최적화

이러한 개선을 통해 모든 사용자가 웹사이트를 더 쉽게 접근하고 이해할 수 있게 되었습니다.

