# 성능 최적화 작업 내역

## 작업 개요

기능에 무리가 없는 선에서 성능 최적화를 진행했습니다. React 렌더링 최적화, 메모이제이션, 코드 스플리팅 등을 적용하여 불필요한 리렌더링을 방지하고 초기 로딩 시간을 개선했습니다.

## 최적화 대상 컴포넌트

### 1. FeaturedProjects 컴포넌트 (`src/widgets/home/ui/featured-projects.tsx`)

**최적화 내용:**
- `displayedProjects` 필터링 로직을 `useMemo`로 메모이제이션
- `handleProjectClick`, `handleCloseModal` 핸들러를 `useCallback`으로 메모이제이션
- `ProjectModal`을 동적 import로 변경하여 코드 스플리팅 적용

**효과:**
- 부모 컴포넌트 리렌더링 시 불필요한 필터링 연산 방지
- 핸들러 참조 안정화로 자식 컴포넌트 불필요한 리렌더링 방지
- 초기 번들 크기 감소 (모달은 필요할 때만 로드)

**변경 전:**
```typescript
const displayedProjects = projects
  .filter(p => p.featured)
  .slice(0, 4);
```

**변경 후:**
```typescript
const displayedProjects = useMemo(() => {
  return projects
    .filter(p => p.featured)
    .slice(0, 4);
}, [projects]);
```

### 2. PortfolioGrid 컴포넌트 (`src/widgets/portfolio/ui/portfolio-grid.tsx`)

**최적화 내용:**
- `categories` 계산을 `useMemo`로 메모이제이션
- `filteredProjects` 필터링 로직을 `useMemo`로 메모이제이션
- `handleCategoryChange`, `handleProjectClick`, `handleCloseModal` 핸들러를 `useCallback`으로 메모이제이션
- `ProjectModal`을 동적 import로 변경하여 코드 스플리팅 적용

**효과:**
- 카테고리 변경 시에만 필터링 연산 실행
- 카테고리 목록 재계산 방지
- 초기 번들 크기 감소

**변경 전:**
```typescript
const categories = ["All", ...Array.from(new Set(
  initialProjects.map((p) => p.category).filter((c): c is string => c !== null)
))];

const filteredProjects = initialProjects.filter(
  (project) => activeCategory === "All" || project.category === activeCategory
);
```

**변경 후:**
```typescript
const categories = useMemo(() => {
  return ["All", ...Array.from(new Set(
    initialProjects.map((p) => p.category).filter((c): c is string => c !== null)
  ))];
}, [initialProjects]);

const filteredProjects = useMemo(() => {
  return initialProjects.filter(
    (project) => activeCategory === "All" || project.category === activeCategory
  );
}, [initialProjects, activeCategory]);
```

### 3. LatestArticles 컴포넌트 (`src/widgets/home/ui/latest-articles.tsx`)

**최적화 내용:**
- `React.memo`로 컴포넌트 메모이제이션

**효과:**
- props가 변경되지 않으면 리렌더링 방지

**변경 전:**
```typescript
export function LatestArticles({ posts }: LatestArticlesProps) {
```

**변경 후:**
```typescript
export const LatestArticles = memo(function LatestArticles({ posts }: LatestArticlesProps) {
```

### 4. ProjectCard 컴포넌트 (`src/entities/project/ui/project-card.tsx`)

**최적화 내용:**
- `React.memo`로 컴포넌트 메모이제이션
- `displayTechStack` 계산을 `useMemo`로 메모이제이션

**효과:**
- props가 변경되지 않으면 리렌더링 방지
- techStack 계산 최적화

**변경 전:**
```typescript
export function ProjectCard({ project, onClick, priority = false }: ProjectCardProps) {
  const displayTechStack = ('detailInfo' in project && project.detailInfo?.techStack) || project.tech_stack || [];
```

**변경 후:**
```typescript
export const ProjectCard = memo(function ProjectCard({ project, onClick, priority = false }: ProjectCardProps) {
  const displayTechStack = useMemo(() => {
    return ('detailInfo' in project && project.detailInfo?.techStack) || project.tech_stack || [];
  }, [project]);
```

### 5. ProjectModal 동적 Import

**최적화 내용:**
- `ProjectModal`을 `next/dynamic`을 사용하여 동적 import로 변경
- `ssr: false` 옵션으로 서버 사이드 렌더링 비활성화

**효과:**
- 초기 번들 크기 감소
- 모달이 필요할 때만 코드 로드 (지연 로딩)

**변경 전:**
```typescript
import { ProjectModal } from "@/widgets/portfolio/ui/project-modal";
```

**변경 후:**
```typescript
const ProjectModal = dynamic(
  () => import("@/widgets/portfolio/ui/project-modal").then(mod => ({ default: mod.ProjectModal })),
  { ssr: false }
);
```

## 최적화 원칙

1. **메모이제이션 전략**
   - 무거운 계산 작업은 `useMemo`로 메모이제이션
   - 함수 핸들러는 `useCallback`으로 메모이제이션
   - 정적 컴포넌트는 `React.memo`로 메모이제이션

2. **코드 스플리팅**
   - 사용 빈도가 낮은 컴포넌트(모달 등)는 동적 import 적용
   - 초기 번들 크기 감소로 LCP 개선

3. **렌더링 최적화**
   - 불필요한 리렌더링 방지
   - props 변경 시에만 리렌더링

## 기대 효과

- **초기 로딩 시간 개선**: 코드 스플리팅으로 초기 번들 크기 감소
- **렌더링 성능 개선**: 불필요한 리렌더링 방지로 메인 스레드 부하 감소
- **사용자 경험 개선**: 필터링, 검색 등 인터랙션 시 반응성 향상

## 참고사항

- 모든 최적화는 기능에 영향을 주지 않도록 주의하여 적용했습니다.
- 기존 동작과 동일하게 작동하며, 성능만 개선되었습니다.
- 추가 최적화가 필요한 경우, React DevTools Profiler를 사용하여 병목 지점을 확인할 수 있습니다.
