---
slug: "building-my-own-react"
title: "나만의 React 만들기 - 프레임워크 내부 동작 원리 이해하기"
excerpt: "React의 Virtual DOM, Reconciliation, Hook 시스템을 바닥부터 구현하며 깨달은 프레임워크 설계 원칙과 최적화 메커니즘"
tags: ["React", "Deep Dive", "TypeScript", "Virtual DOM", "Reconciliation"]
date: "2024-12-31"
---

## 프로젝트 개요

React의 핵심 동작 원리를 이해하기 위해 Virtual DOM, Reconciliation, Hook 시스템을 직접 구현한 프로젝트입니다. 단순히 React API를 '사용'하는 것을 넘어, 그 '동작 원리'를 바닥부터 구현하며 React가 왜 특정 규칙을 강요하는지, 내부적으로 어떻게 작동하는지 깊이 있게 이해할 수 있었습니다.

### 기술 스택
- TypeScript
- Vite
- Vitest

### 개발 기간
약 2주 (2024.12)

---

## 구현 단계

### Phase 1-2: VNode와 컨텍스트 시스템
JSX를 Reconciler가 이해할 수 있는 VNode 구조로 변환하고, 렌더링 컨텍스트를 관리하는 기초를 구축했습니다.

**주요 구현**
- `createElement`: JSX를 VNode로 변환
- `normalizeNode`: 텍스트/숫자/배열 자식 정규화
- 루트 컨텍스트와 훅 컨텍스트 관리

### Phase 3: DOM 인터페이스
VNode의 props를 실제 DOM 속성, 스타일, 이벤트로 변환하는 인터페이스를 구현했습니다.

**주요 구현**
- `setDomProps`: 초기 DOM 속성 적용
- `updateDomProps`: 변경된 속성만 업데이트
- 이벤트 리스너, 스타일, boolean 속성 처리

### Phase 4: 렌더 스케줄링
마이크로태스크 큐를 활용한 비동기 렌더링 시스템을 구현했습니다.

**주요 구현**
- `enqueue`: 마이크로태스크 큐 구성
- `enqueueRender`: 렌더 요청 배칭
- 루트 렌더 사이클 구현

### Phase 5: Reconciliation
Virtual DOM diff 알고리즘과 효율적인 DOM 업데이트 로직을 구현했습니다.

**주요 구현**
- 마운트/업데이트/언마운트 처리
- key 기반 자식 비교 및 재배치
- anchor 기반 DOM 삽입 위치 계산

### Phase 6: Hook 시스템
React의 핵심인 Hook 시스템을 구현했습니다.

**주요 구현**
- `useState`: 상태 관리 및 리렌더링 트리거
- `useEffect`: 사이드 이펙트 관리 및 cleanup
- 훅 커서 증가 및 미사용 훅 정리

### Phase 7: 확장 Hook & 최적화
성능 최적화를 위한 추가 Hook과 HOC를 구현했습니다.

**주요 구현**
- `useRef`, `useMemo`, `useCallback`
- `memo`, `deepMemo`: 컴포넌트 메모이제이션
- shallow/deep 비교 유틸리티

---

## 주요 트러블슈팅

### 1. HTML Attribute vs DOM Property

**문제 상황**

`<select>` 요소의 초기값이 URL 파라미터나 스토어 값과 다르게 표시되는 버그가 발생했습니다.
- URL/스토어: `limit=20`, `sort=price_asc`
- 실제 화면: `limit=100`, `sort=name_asc` (마지막 option이 선택됨)

**원인 분석**

브라우저는 `<option>`에 `selected` attribute가 있으면 값이 `"false"`여도 선택된 것으로 처리했습니다. MiniReact는 **attribute만 갱신**했기 때문에 브라우저 렌더링 이후 `setAttribute('selected', 'true')`를 호출해도 화면의 선택값은 변하지 않았습니다.

**해결 방법**

`selected`를 attribute가 아닌 **DOM Property**로 업데이트하도록 변경했습니다.

```typescript
// core/dom.ts
const isProperty = (key: string) => 
  key === "value" || 
  key === "checked" || 
  key === "selected";

if (isProperty(key)) {
  (dom as any)[key] = value;
} else {
  dom.setAttribute(key, value);
}
```

**배운 점**
- HTML Attribute는 초기 상태만 대변하고, 현재 상태를 변경하려면 DOM Property를 제어해야 합니다
- 동적인 UI 업데이트를 위해서는 이 차이를 명확히 이해하고 적절히 사용해야 합니다
- E2E 테스트가 아니었다면 발견하지 못했을 사각지대의 버그였습니다

### 2. 컴포넌트 이동 시 훅 상태 초기화

**문제 상황**

`[Item, Item, Item, Footer]` 구조에서 중간 Item이 삭제되면서 Footer가 이동했고, Footer의 훅 상태가 초기화되는 문제가 발생했습니다.

**원인 분석**

Reconciliation 과정에서 컴포넌트가 이동할 때, 기존 경로의 훅 상태를 새로운 경로로 이전하지 못했습니다.

**해결 방법**

이동 중인 컴포넌트의 훅 상태를 `orphanedHooks`에 임시 보관하고, 새 경로에 컴포넌트가 마운트될 때 복원하는 로직을 구현했습니다.

```typescript
// 컴포넌트 언마운트 시 훅 상태 보관
if (isMoving) {
  orphanedHooks.set(componentPath, hooks);
}

// 컴포넌트 마운트 시 훅 상태 복원
if (orphanedHooks.has(componentPath)) {
  restoreHooks(componentPath);
}
```

### 3. 순환 참조 해결

**문제 상황**

테스트는 모두 통과했지만, 실제 브라우저 환경에서 `hooks`와 `render` 모듈 간의 순환 참조로 인해 앱이 정상 구동되지 않았습니다.

**해결 방법**

의존성 주입(Dependency Injection) 방식으로 구조를 재설계했습니다. `useEffect`가 실제 사용될 때만 스케줄링이 발생하도록 변경하여 불필요한 함수 호출을 제거하고 책임 소재를 명확히 했습니다.

**배운 점**
- 테스트 통과와 런타임 안정성은 별개의 문제입니다
- 아키텍처 설계에서 역할 분리와 결합도 최소화가 얼마나 중요한지 체감했습니다

---

## 기술적 성장

### 1. React 규칙의 이유 이해

직접 구현하면서 React가 왜 특정 규칙을 강요하는지 명확히 이해하게 되었습니다.

- **왜 key를 요구할까?** → Reconciliation에서 동일한 컴포넌트를 식별하기 위해
- **왜 조건문/반복문 내에서 Hook을 사용하면 안 될까?** → 훅 커서 순서가 보장되어야 상태 매칭이 가능하기 때문
- **왜 Fragment가 필요할까?** → DOM을 만들지 않고 자식을 묶는 논리적 컨테이너

### 2. useState vs useRef의 본질적 차이

두 훅 모두 "리렌더링 간에 값을 유지"하지만, 구현 관점에서 명확한 차이가 있습니다.

```typescript
// useState: 값 변경 시 리렌더링 트리거
function useState(initialValue) {
  const state = getHookState(initialValue);
  const setState = (newValue) => {
    state.value = newValue;
    enqueueRender(); // 리렌더링 스케줄링
  };
  return [state.value, setState];
}

// useRef: 값 변경 시 리렌더링 없음
function useRef(initialValue) {
  const ref = getHookState({ current: initialValue });
  return ref.value; // 동일한 객체 참조 유지
}
```

### 3. 최적화의 메커니즘

최적화는 Hook과 Reconciler의 상호작용으로 완성됩니다.

- `useCallback`: 함수 참조를 고정
- `memo`: 고정된 참조를 비교하여 Reconciler가 렌더링을 건너뜀

둘 중 하나만 사용해서는 최적화가 완성되지 않습니다.

### 4. Props는 '명령'이다

Props는 단순 데이터가 아니라 **DOM 상태를 조작하는 명령**입니다.

- `onClick={handler}` → 이벤트 리스너 등록
- `style={{ color: 'red' }}` → DOM style 속성 적용
- `disabled={true}` → DOM property 설정

선언적 UI에서 Props → DOM 번역의 정확도가 전체 UI 안정성을 좌우합니다.

---

## 코드 품질

### 만족스러운 구현

**`useRef` 최적화**

처음엔 `useState`를 래핑하는 쉬운 방법을 택했지만, 리팩토링을 통해 리렌더링을 유발하지 않는 별도의 훅 타입을 정의하여 성능과 목적에 부합하는 구현을 해냈습니다.

### 개선 가능한 부분

**DOM 조작 추상화**

`core/dom.ts`가 충분히 역할을 하고 있지만, `setAttribute`와 프로퍼티 설정 로직을 조금 더 명확한 인터페이스로 분리하면 유지보수에 유리할 것 같습니다.

---

## 프로젝트를 통해 배운 것

### 1. 깊이 있는 이해의 중요성

단순히 API를 사용하는 것과 내부 동작 원리를 이해하는 것은 완전히 다릅니다. 직접 구현하면서 "왜 이렇게 설계되었는가"를 이해하게 되었고, 이는 실무에서 더 나은 의사결정을 할 수 있는 기반이 되었습니다.

### 2. 계층별 필요 지식

어떤 계층을 만들고 있느냐에 따라 필요한 지식의 깊이가 달라집니다. 깊이를 내려가고 싶다면 해당 영역의 핵심 컨셉만 직접 구현해보면 됩니다. 상태관리, CSS Framework, SSR, 번들러 등 전부 구현할 필요 없이 핵심만 만들어보면 훨씬 쉽게 이해할 수 있습니다.

### 3. 테스트와 실제 환경의 차이

단위 테스트가 모두 통과해도 실제 런타임 환경에서는 예상치 못한 문제가 발생할 수 있습니다. 통합 환경에서의 검증과 E2E 테스트의 중요성을 깨달았습니다.

### 4. 아키텍처와 의존성 관리

순환 참조 문제를 해결하며 역할 분리와 결합도 최소화가 얼마나 중요한지 체감했습니다. 좋은 아키텍처는 미래의 변경을 쉽게 만듭니다.

---

## 멘토 피드백

> "HTML Attribute와 DOM Property의 결정적 차이를 깨달은 부분이 인상깊었어요. 이런 삽질(?)에서 얻는 지식이 진짜 몸에 새겨진다 생각해요."

> "isProperty 화이트리스트 방식은 현재로서는 적절한 선택이에요. 다만 그때 고민해볼 건 '이 속성이 Property인지 Attribute인지'를 매번 하드코딩할 게 아니라, 해당 DOM 요소에 실제로 그 프로퍼티가 존재하는지(key in element)를 런타임에 체크하는 방식도 있어요."

> "내가 어떤 계층을 만들고 있느냐에 따라 필요한 지식의 깊이가 달라진다는 걸 느꼈기를 바래요. 핵심만 만들어보면 훨씬 쉽게 이해할 수 있다는 방법을 이번에 배웠기를 바랍니다."

---

## 마치며

이 프로젝트는 단순히 React를 클론 코딩하는 것이 아니라, **왜 이런 API가 필요한지, 왜 이런 제약이 있는지**를 이해하는 여정이었습니다. 앞으로 React를 사용할 때 더 깊이 있는 통찰을 가지고 최적화와 디버깅에 임할 수 있을 것 같습니다.

"왜?"라는 질문에 답하고 싶다면, 직접 만들어보세요. 그것이 가장 확실한 이해의 방법입니다.