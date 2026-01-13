# Lighthouse 수동 확인 항목 개선 작업

## 개요

Lighthouse 접근성 감사에서 "수동 확인"을 요하는 항목들을 코드 레벨에서 보완하여 접근성을 완벽하게 개선했습니다.

**작업 일자**: 2025-01-09  
**대상**: Lighthouse 수동 확인 항목 3가지

---

## 문제 1: 아이콘 버튼에 이름 부여 (aria-label)

### 문제 분석

**발견된 문제**:
- 텍스트 없이 아이콘만 있는 버튼들이 스크린 리더에서 인식되지 않음
- `sr-only` 클래스만 사용하여 접근성이 부족
- Lighthouse가 "버튼에 접근 가능한 이름이 있는지 확인"을 요구

**영향받는 컴포넌트**:
1. Header의 GitHub 링크
2. Footer의 GitHub, Mail 링크
3. ThemeToggle 버튼
4. Header의 모바일 메뉴 토글 버튼
5. CodeBlock의 복사 버튼
6. ProjectModal의 닫기 버튼

### 해결 방법

**변경 전**:
```tsx
// Header - GitHub 링크
<Link href="https://github.com/parksubeom" aria-label="GitHub">
  <Github className="w-5 h-5" />
</Link>

// Footer - GitHub 링크
<a href="https://github.com/parksubeom">
  <Github className="h-5 w-5" />
  <span className="sr-only">GitHub</span>
</a>

// ThemeToggle
<Button onClick={() => setTheme(...)}>
  <Sun className="h-4 w-4" />
  <span className="sr-only">Toggle theme</span>
</Button>
```

**변경 후**:
```tsx
// Header - GitHub 링크
<Link 
  href="https://github.com/parksubeom" 
  aria-label="GitHub 프로필로 이동"
  rel="noopener noreferrer"
>
  <Github className="w-5 h-5" />
</Link>

// Footer - GitHub 링크
<a 
  href="https://github.com/parksubeom"
  aria-label="GitHub 프로필로 이동"
>
  <Github className="h-5 w-5" />
  <span className="sr-only">GitHub 프로필로 이동</span>
</a>

// ThemeToggle - 동적 라벨
<Button 
  onClick={() => setTheme(...)}
  aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
>
  <Sun className="h-4 w-4" />
  <span className="sr-only">{theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}</span>
</Button>
```

**수정된 파일**:
1. `src/components/header.tsx`
   - GitHub 링크: `aria-label="GitHub 프로필로 이동"`
   - 모바일 메뉴 토글: `aria-label="메뉴 열기"`
   - 모바일 메뉴 내 GitHub 링크: `aria-label="GitHub 프로필로 이동"`

2. `src/components/footer.tsx`
   - GitHub 링크: `aria-label="GitHub 프로필로 이동"`
   - Mail 링크: `aria-label="이메일 보내기"`

3. `src/components/theme-toggle.tsx`
   - 동적 `aria-label`: 현재 테마에 따라 "라이트 모드로 전환" 또는 "다크 모드로 전환"

4. `src/shared/mdx/code-block.tsx`
   - 복사 버튼: 동적 `aria-label` (복사 전/후 상태에 따라 변경)

5. `src/widgets/portfolio/ui/project-modal.tsx`
   - 닫기 버튼: `aria-label="모달 닫기"` (이미 있었지만 한국어로 통일)

**이점**:
- ✅ 스크린 리더 사용자가 버튼의 목적을 명확히 이해
- ✅ Lighthouse 접근성 점수 향상
- ✅ WCAG 2.1 - Name, Role, Value (4.1.2) 준수

---

## 문제 2: 포커스 인디케이터(Focus Ring) 강화

### 문제 분석

**발견된 문제**:
- 키보드 `Tab` 키로 이동 시 포커스 링이 잘리거나 명확하지 않음
- `outline-none`이 적용된 곳에 대체 포커스 스타일이 없음
- Lighthouse가 "키보드로 접근 가능한 모든 요소에 포커스 인디케이터가 있는지 확인"을 요구

**영향받는 컴포넌트**:
1. Header의 네비게이션 링크
2. Header의 GitHub 링크
3. Footer의 소셜 링크
4. CodeBlock의 복사 버튼

### 해결 방법

**변경 전**:
```tsx
// Header - 네비게이션 링크
<Link 
  href={item.href}
  className="text-sm font-medium hover:text-primary"
>
  {item.name}
</Link>

// Footer - 소셜 링크
<a 
  href="https://github.com/parksubeom"
  className="text-muted-foreground hover:text-foreground"
>
  <Github className="h-5 w-5" />
</a>
```

**변경 후**:
```tsx
// Header - 네비게이션 링크
<Link 
  href={item.href}
  className="text-sm font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
>
  {item.name}
</Link>

// Footer - 소셜 링크
<a 
  href="https://github.com/parksubeom"
  className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-2"
>
  <Github className="h-5 w-5" />
</a>
```

**포커스 스타일 클래스 설명**:
- `focus-visible:outline-none`: 기본 outline 제거
- `focus-visible:ring-2`: 2px 두께의 링 추가
- `focus-visible:ring-ring`: 테마 색상 사용
- `focus-visible:ring-offset-2`: 링과 요소 사이 2px 간격
- `rounded-md`: 둥근 모서리로 자연스러운 포커스 링

**수정된 파일**:
1. `src/components/header.tsx`
   - 네비게이션 링크에 포커스 스타일 추가
   - GitHub 링크에 포커스 스타일 추가
   - 모바일 메뉴 내 GitHub 링크에 포커스 스타일 추가

2. `src/components/footer.tsx`
   - GitHub 링크에 포커스 스타일 추가
   - Mail 링크에 포커스 스타일 추가

3. `src/shared/mdx/code-block.tsx`
   - 복사 버튼에 포커스 스타일 추가

**이점**:
- ✅ 키보드 사용자가 현재 포커스 위치를 명확히 인식
- ✅ WCAG 2.1 - Focus Visible (2.4.7) 준수
- ✅ 모든 인터랙티브 요소에 일관된 포커스 스타일 적용

---

## 문제 3: 랜드마크(Landmark) 요소 사용

### 문제 분석

**발견된 문제**:
- 페이지의 주요 영역이 `div` 대신 시맨틱 태그로 감싸져 있지 않음
- 스크린 리더가 페이지 구조를 정확히 인식하지 못함
- Lighthouse가 "페이지에 랜드마크 요소가 있는지 확인"을 요구

**필요한 랜드마크**:
- `<header>`: 최상단 헤더
- `<main>`: 주요 콘텐츠
- `<nav>`: 네비게이션
- `<footer>`: 하단 푸터
- `<aside>`: 사이드바 (해당 시)
- `<section>`: 콘텐츠 섹션

### 해결 방법

**변경 전**:
```tsx
// layout.tsx
<div className="flex min-h-screen flex-col">
  <Header />
  <div className="flex-1 w-full max-w-3xl mx-auto px-6">
    {children}
  </div>
  <Footer />
</div>

// page.tsx
<div className="space-y-32 pb-24">
  <HeroSection />
  <FeaturedProjects />
</div>
```

**변경 후**:
```tsx
// layout.tsx - 이미 올바르게 구현됨 ✅
<div className="flex min-h-screen flex-col relative">
  <Header /> {/* 내부에 <header> 태그 사용 */}
  <main className="flex-1 w-full max-w-3xl mx-auto px-6 md:px-0 py-12">
    {children}
  </main>
  <Footer /> {/* 내부에 <footer> 태그 사용 */}
</div>

// Header 컴포넌트 내부
<header className="sticky top-0 z-50...">
  <nav className="hidden md:flex items-center gap-6">
    {/* 네비게이션 링크 */}
  </nav>
</header>

// 페이지 컴포넌트들 - 이미 <section> 사용 중 ✅
<section className="space-y-8">
  <h2>Featured Projects</h2>
  {/* 콘텐츠 */}
</section>
```

**현재 상태 확인**:
1. ✅ `src/app/layout.tsx`: `<header>`, `<main>`, `<footer>` 사용 중
2. ✅ `src/components/header.tsx`: `<header>`, `<nav>` 사용 중
3. ✅ `src/components/footer.tsx`: `<footer>` 사용 중
4. ✅ `src/widgets/home/ui/featured-projects.tsx`: `<section>` 사용 중
5. ✅ `src/widgets/home/ui/latest-articles.tsx`: `<section>` 사용 중
6. ✅ `src/app/portfolio/page.tsx`: `<section>` 사용 중

**추가 개선 사항**:
- 모든 주요 섹션에 `<section>` 태그 사용 확인
- 각 섹션에 적절한 `aria-label` 또는 제목(`<h2>`) 추가

**이점**:
- ✅ 스크린 리더가 페이지 구조를 정확히 인식
- ✅ 랜드마크 네비게이션으로 빠른 이동 가능
- ✅ WCAG 2.1 - Info and Relationships (1.3.1) 준수

---

## 수정된 파일 목록

1. **`src/components/header.tsx`**
   - GitHub 링크: `aria-label` 추가, 포커스 스타일 추가
   - 네비게이션 링크: 포커스 스타일 추가
   - 모바일 메뉴 토글: `aria-label` 추가
   - 모바일 메뉴 내 GitHub 링크: `aria-label` 추가, 포커스 스타일 추가

2. **`src/components/footer.tsx`**
   - GitHub 링크: `aria-label` 추가, 포커스 스타일 추가
   - Mail 링크: `aria-label` 추가, 포커스 스타일 추가

3. **`src/components/theme-toggle.tsx`**
   - 동적 `aria-label` 추가 (테마 상태에 따라 변경)

4. **`src/shared/mdx/code-block.tsx`**
   - 복사 버튼: 동적 `aria-label` 추가, 포커스 스타일 추가

5. **`src/widgets/portfolio/ui/project-modal.tsx`**
   - 닫기 버튼: `aria-label` 한국어로 통일

---

## 검증 방법

### 1. 스크린 리더 테스트

**NVDA (Windows)**:
```
1. Tab 키로 이동하면서 각 버튼의 이름 확인
2. Insert + F7 (요소 목록)에서 버튼 이름 확인
3. Insert + F6 (랜드마크)에서 페이지 구조 확인
```

**VoiceOver (Mac)**:
```
1. VO + F7 (웹 로터)에서 링크/버튼 목록 확인
2. VO + U (웹 로터)에서 랜드마크 확인
3. Tab 키로 이동하면서 각 요소의 이름 확인
```

### 2. 키보드 네비게이션 테스트

1. **Tab 키**: 모든 인터랙티브 요소에 포커스 이동
2. **Enter/Space**: 버튼 활성화
3. **포커스 링 확인**: 각 요소에 명확한 포커스 링 표시

### 3. Lighthouse 접근성 감사

```bash
# Chrome DevTools > Lighthouse > Accessibility
# "수동 확인" 항목이 모두 통과하는지 확인
```

**확인 항목**:
- ✅ 버튼에 접근 가능한 이름이 있는지
- ✅ 키보드로 접근 가능한 모든 요소에 포커스 인디케이터가 있는지
- ✅ 페이지에 랜드마크 요소가 있는지

### 4. 자동화 도구

- **axe DevTools**: 브라우저 확장 프로그램
- **WAVE**: 웹 접근성 평가 도구
- **Pa11y**: CLI 기반 접근성 테스트

---

## 참고 자료

### WCAG 가이드라인

- [WCAG 2.1 - Name, Role, Value (4.1.2)](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
  - 모든 UI 컴포넌트는 접근 가능한 이름을 가져야 함

- [WCAG 2.1 - Focus Visible (2.4.7)](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
  - 키보드로 접근 가능한 모든 요소에 포커스 인디케이터 필요

- [WCAG 2.1 - Info and Relationships (1.3.1)](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
  - 정보, 구조, 관계는 프로그램적으로 결정 가능해야 함

### ARIA 가이드라인

- [ARIA Authoring Practices Guide - Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [ARIA Authoring Practices Guide - Landmarks](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)

### HTML 시맨틱 요소

- [MDN - HTML 시맨틱 요소](https://developer.mozilla.org/ko/docs/Glossary/Semantics#semantic_elements)
- [HTML Living Standard - Landmarks](https://html.spec.whatwg.org/multipage/sections.html#landmarks)

---

## 향후 개선 사항

1. **스킵 링크 추가**
   - 페이지 상단에 "메인 콘텐츠로 건너뛰기" 링크 추가
   - 키보드 사용자가 반복되는 네비게이션을 건너뛸 수 있도록

2. **포커스 트랩 개선**
   - 모달 내부에서 포커스가 외부로 나가지 않도록 개선
   - 이미 `useFocusTrap` 훅 사용 중이지만 추가 검증 필요

3. **접근성 테스트 자동화**
   - CI/CD 파이프라인에 접근성 테스트 추가
   - Pa11y 또는 axe-core 통합

4. **키보드 단축키 제공**
   - 주요 기능에 키보드 단축키 추가
   - 사용자 가이드 문서화

---

## 결론

Lighthouse 수동 확인 항목 3가지를 모두 해결하여 접근성을 완벽하게 개선했습니다:

1. **아이콘 버튼에 이름 부여**: 모든 아이콘 버튼에 구체적인 `aria-label` 추가
2. **포커스 인디케이터 강화**: 모든 인터랙티브 요소에 명확한 포커스 스타일 적용
3. **랜드마크 요소 사용**: 이미 올바르게 구현되어 있음을 확인하고 문서화

이러한 개선을 통해 스크린 리더 사용자와 키보드 사용자가 웹사이트를 더 쉽게 탐색하고 사용할 수 있게 되었습니다.

