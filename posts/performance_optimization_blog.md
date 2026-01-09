---
slug: "code-level-performance-optimization"
title: "코드 관점의 성능 최적화 - React 렌더링 최적화 실전"
excerpt: "API 병렬화, 메모이제이션, 렌더링 격리를 통해 Lighthouse 성능 점수를 획기적으로 개선한 최적화 여정"
tags: ["React", "Performance", "Optimization", "Memoization", "렌더링 최적화"]
date: "2025-12-27"
---

## 프로젝트 개요

대학 시간표 관리 애플리케이션의 성능을 측정하고, 병목 지점을 찾아 체계적으로 개선한 프로젝트입니다. API 호출 최적화부터 렌더링 격리까지, 실제 사용자가 체감할 수 있는 성능 개선에 집중했습니다.

### 개발 기간
약 3주 (2025.12)

### 성능 개선 결과

| 구분 | 최적화 전 | 최적화 후 |
|------|----------|----------|
| Lighthouse 성능 점수 | 68점 | 100점 |
| LCP (최대 콘텐츠 렌더링) | 2.89s | 1.2s |
| 초기 API 호출 시간 | 6회 (순차) | 2회 (병렬) |

---

## 1일차: 검색 다이얼로그(SearchDialog) 최적화

### API 호출 병렬화 및 중복 제거

**문제 분석**

```typescript
// Before: await로 인한 순차 실행
const fetchAllLectures = async () => await Promise.all([
  (console.log('API Call 1'), await fetchMajors()),
  (console.log('API Call 2'), await fetchLiberalArts()),
  // ... 동일한 API를 총 6번 중복 호출
]);
```

- `Promise.all` 내부에 `await` 키워드를 사용하여 API가 순차적으로 호출됨
- 동일한 리소스(`fetchMajors`, `fetchLiberalArts`)를 3번씩 중복 호출
- LCP 2.89s로 측정되며 초기 로딩 지연 발생

**해결 방법**

```typescript
// After: Promise를 먼저 생성하여 병렬 실행
const fetchAllLectures = async () => {
  const start = performance.now();
  
  // 1. Promise 객체를 먼저 생성 (호출 시작)
  const majorsPromise = fetchMajors();
  const liberalArtsPromise = fetchLiberalArts();

  // 2. Promise.all로 병렬 대기
  const results = await Promise.all([
    majorsPromise,
    liberalArtsPromise
  ]);

  console.log(`API 완료: ${performance.now() - start}ms`);
  return results;
};
```

**개선 효과**
- 네트워크 순차 대기 현상 제거로 초기 로딩 속도 획기적 단축
- 중복 호출 제거로 서버 부하 감소 및 사용자 경험 개선

---

### 검색 필터링 연산 메모이제이션

**문제 분석**

```typescript
// Before: 렌더링마다 매번 실행
const getFilteredLectures = () => {
  const { query = '', credits, ... } = searchOptions;
  return lectures
    .filter(lecture => ...)
    // 수천 번의 루프와 파싱 작업
}
const filteredLectures = getFilteredLectures();
```

- 컴포넌트 리렌더링(입력, 스크롤 등)마다 필터링 함수가 매번 실행됨
- 수천 개의 강의 데이터를 대상으로 필터링, 문자열 파싱 등 무거운 연산 반복
- 검색어 한 글자 입력 시마다 메인 스레드 점유로 입력 지연 발생

**해결 방법**

```typescript
// After: useMemo로 의존성 변경 시만 재계산
const filteredLectures = useMemo(() => {
  const { query = '', credits, ... } = searchOptions;
  return lectures
    .filter(lecture => ...)
}, [searchOptions, lectures]);
```

**개선 효과**
- 검색어 입력 시 발생하는 렉 현상 제거
- 메인 스레드 부하 감소로 전반적인 UI 반응성 향상

---

### 검색 필터 UI 분리 및 불필요한 리렌더링 방지

**문제 분석**

![변경 전 구조](https://github.com/user-attachments/assets/67f4cb51-da9a-44ff-ba4b-90ef7d84f8e4)

```tsx
const SearchDialog = () => {
  const [page, setPage] = useState(1);
   
  // 렌더링마다 매번 재연산
  const allMajors = [...new Set(lectures.map(...))];
  const changeSearchOption = (...) => { ... }; // 매번 새로운 참조 생성

  return (
    <Stack>
      {/* page 변경 시 필터 UI도 함께 렌더링됨 */}
      <Input />
      <CheckboxGroup>
        {/* 수백 개의 전공 리스트가 매번 재생성 */}
      </CheckboxGroup>
    </Stack>
  );
}
```

- 무한 스크롤로 페이지 상태 변경 시 `SearchDialog` 전체가 리렌더링
- 변경 사항이 없는 검색 옵션 영역까지 매번 재생성되어 자원 낭비
- 전공 목록 생성 로직이 렌더링마다 반복 수행

**해결 방법**

![변경 후 구조](https://github.com/user-attachments/assets/b39eb5df-62a5-4ee2-bdbc-057742fff5d6)

```tsx
// 1. 별도 컴포넌트로 분리 및 React.memo 적용
const SearchFilter = memo(({ 
  searchOptions, 
  changeSearchOption, 
  allMajors 
}) => {
  return (
    <Stack>
      <Input />
      <CheckboxGroup />
    </Stack>
  );
});

const SearchDialog = () => {
  // 2. 데이터 연산 최적화 (참조 안정화)
  const allMajors = useMemo(() => 
    [...new Set(lectures.map(l => l.major))], 
    [lectures]
  );
  
  // 3. 핸들러 최적화
  const changeSearchOption = useCallback((key, value) => {
    setSearchOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <Stack>
      {/* 페이지가 변해도 props가 동일하므로 리렌더링 건너뜀 */}
      <SearchFilter 
        searchOptions={searchOptions}
        changeSearchOption={changeSearchOption}
        allMajors={allMajors}
      />
    </Stack>
  );
}
```

**개선 효과**
- 스크롤 시 검색 필터 영역의 불필요한 리렌더링 횟수 0회로 감소
- 복잡한 컴포넌트 구조 단순화로 가독성 및 유지보수성 증대

---

### 콜백 Ref 패턴으로 무한 스크롤 초기화 타이밍 이슈 해결

**문제 분석**

```tsx
// Before: useRef는 변화 감지 불가
const loaderRef = useRef(null);

useEffect(() => {
  if (!loaderRef.current) return; // null이면 그냥 종료
  
  const observer = new IntersectionObserver(...);
  observer.observe(loaderRef.current);
}, [searchInfo]);
```

- 모달 렌더링 특성상 `useEffect` 최초 실행 시점에 DOM 요소가 아직 `null`
- `useRef`는 리렌더링을 유발하지 않아 DOM 생성 후에도 `useEffect`가 재실행되지 않음
- 무한 스크롤이 작동하지 않는 버그 발생

**해결 방법**

```tsx
// After: useState로 DOM 생성 시 리렌더링 트리거
const [loader, setLoader] = useState(null);

useEffect(() => {
  if (!loader) return; // loader 상태가 업데이트되면 다시 실행
  
  const observer = new IntersectionObserver(...);
  observer.observe(loader);
}, [loader]); 

// JSX: ref 속성에 상태 설정 함수 전달
<Box ref={setLoader} />
```

**배운 점**
- `useRef`는 값이 변경되어도 컴포넌트를 다시 그리지 않음
- `useState`는 상태 변경 시 다시 그리기를 유발하여 변화 감지 가능
- 콜백 Ref: JSX의 `ref` 속성에 함수를 전달하면 DOM 생성 시 해당 함수 호출

---

### API 호출 시점 지연

**문제 분석**

![변경 전](https://github.com/user-attachments/assets/813a97ad-fe48-4bcc-a1d8-61ec29e85219)

```tsx
// Before: 컴포넌트 마운트 시 무조건 실행
useEffect(() => {
  fetchAllLectures().then(...);
}, []);
```

- 컴포넌트가 화면에 나타남과 동시에 대용량 데이터를 즉시 호출
- 페이지 초기 로딩 구간에서 불필요한 네트워크 대역폭 점유
- 사용자가 검색 버튼을 누르기 전까지는 해당 데이터가 필요하지 않음

**해결 방법**

![변경 후](https://github.com/user-attachments/assets/9000597b-bd6c-47b0-a081-b4594f648db1)

```tsx
// After: 모달이 열릴 때만 데이터 로딩
useEffect(() => {
  // 모달이 열리지 않았거나 이미 데이터를 가져온 경우 중단
  if (!searchInfo || lectures.length > 0) return;

  // 모달이 열리는 순간 데이터 로딩 시작
  fetchAllLectures().then(...);
}, [searchInfo]);
```

**개선 효과**
- 초기 페이지 로딩 시 발생하던 네트워크 병목 현상 제거
- LCP(최대 콘텐츠 렌더링 시간) 지표 개선
- 사용자 동작 기반 데이터 로딩으로 체감 성능 향상

---

### 검색 필터 렌더링 최적화

**문제 분석**

![변경 전](https://github.com/user-attachments/assets/a61d7692-ae9f-4a57-b021-95945ee5f4ff)

```tsx
const SearchFilter = memo(({ searchOptions, ... }) => {
  return (
    <Stack>
      <Input ... />
      {/* 인라인 핸들러로 매번 새로운 함수 생성 */}
      <CheckboxGroup onChange={(v) => changeSearchOption("majors", v)}>
        {/* 수백 개의 전공 리스트가 매번 재생성 */}
      </CheckboxGroup>
    </Stack>
  );
});
```

- 검색어 입력 시 필터 컴포넌트 전체가 다시 그려짐
- 텍스트 한 글자 입력마다 수백 개의 체크박스 가상 DOM 재생성
- 인라인 함수로 인해 렌더링마다 참조값이 변경되어 `React.memo`가 작동하지 않음

**해결 방법**

![변경 후](https://github.com/user-attachments/assets/81975216-83ff-4eeb-a32f-c5498a53cf5f)

```tsx
// 1. 컴포넌트 쪼개기 및 메모이제이션
const MajorCheckboxGroup = memo(({ 
  majors, 
  onChange 
}) => {
  return (
    <CheckboxGroup onChange={onChange}>
      {majors.map(major => <Checkbox key={major} value={major} />)}
    </CheckboxGroup>
  );
});

const SearchFilter = memo(({ searchOptions, ... }) => {
  // 2. 핸들러 참조 안정화
  const handleChangeMajors = useCallback(
    (v) => changeSearchOption("majors", v),
    []
  );

  return (
    <Stack>
      <Input ... /> {/* 검색어 입력 시 이 부분만 리렌더링 */}
      {/* props가 변경되지 않아 렌더링 건너뜀 */}
      <MajorCheckboxGroup 
        majors={allMajors}
        onChange={handleChangeMajors} 
      />
    </Stack>
  );
});
```

**개선 효과**
- 검색어 입력 시 CPU 사용량 최소화 및 렌더링 범위 국소화
- 사용자가 체감하던 입력 지연 현상 완전 제거

---

### 데이터 전처리를 통한 필터링 연산 최적화

**문제 분석**

- 필터링이 수행될 때마다 수천 개의 강의 객체에 대해 문자열 파싱 반복 실행
- 문자열 파싱은 비용이 큰 연산으로 메인 스레드를 장시간 점유

**해결 방법**

```typescript
// Before: 필터링 시마다 파싱 수행 (N × 파싱비용)
lectures.filter(lecture => {
  const schedules = parseSchedule(lecture.schedule); // 매번 파싱
  return schedules.some(...);
});

// After: 데이터 로드 시 단 1회만 파싱 (전처리)
setLectures(
  data.map((l) => ({
    ...l,
    schedules: l.schedule ? parseSchedule(l.schedule) : [],
  }))
);

// 필터링 시에는 이미 계산된 값만 참조 (N)
lectures.filter(lecture => lecture.schedules.some(...));
```

**핵심 원칙**
> "비싼 계산은 렌더링 경로 밖에서 한 번만 수행한다"

**개선 효과**
- 필터링 연산 비용 감소로 검색 및 필터 반응 속도 비약적 향상
- 데이터 규모가 증가하더라도 성능 저하 없이 확장 가능한 구조 확보

---

### 문자열 검색 전처리

**문제 분석**

```typescript
// Before: 매 필터링 루프마다 문자열 변환
lectures.filter(lecture => 
  lecture.title.toLowerCase().includes(query.toLowerCase())
);
```

- 필터링 로직 내부에서 소문자 변환 함수 호출
- 검색어 입력 시마다 수천 개의 임시 문자열 객체가 반복 생성/파괴
- 빈번한 가비지 컬렉션으로 메인 스레드 일시 정지

**해결 방법**

```typescript
// After: 데이터 로드 시 단 1회만 문자열 전처리
const processedLectures = lectures.map(lecture => ({
  ...lecture,
  titleLower: lecture.title.toLowerCase()
}));

// 필터링 시에는 변환 없이 비교만 수행
processedLectures.filter(lecture => 
  lecture.titleLower.includes(queryLower)
);
```

**개선 효과**
- 검색 시 메모리 사용량 그래프의 급격한 변동 제거
- 빠른 연속 타이핑 상황에서도 끊김 없는 부드러운 입력 반응성 확보

---

### 필터링 로직의 가독성 및 연산 효율 개선

**문제 분석**

```typescript
// Before: 모든 조건이 하나로 결합된 구조
return lectures.filter(lecture =>
  (!query || lecture.title.includes(query)) &&
  (grades.length === 0 || grades.includes(lecture.grade)) &&
  (days.length === 0 || lecture.schedules.some(s => days.includes(s.day))) &&
  // ... 더 많은 조건들
);
```

- 여러 조건이 하나의 긴 표현식으로 결합되어 로직 파악 어려움
- 모든 조건이 하나로 묶여 있어 실행 순서 제어 및 최적화 어려움

**해결 방법**

```typescript
// After: 보호 구문 패턴으로 조기 종료
return lectures.filter(lecture => {
  // 1. 가장 빠르게 판단 가능한 조건부터 검사
  if (query && !lecture.titleLower.includes(query)) return false;
  
  // 2. 비용이 적은 조건
  if (grades.length > 0 && !grades.includes(lecture.grade)) return false;
  
  // 3. 비용이 큰 조건 (배열 순회)
  if (days.length > 0 && !lecture.schedules.some(s => days.includes(s.day))) {
    return false;
  }
  
  return true;
});
```

**개선 효과**
- 조건 불만족 시 조기 종료로 불필요한 연산 차단
- 코드 가독성 향상으로 디버깅 속도 개선
- 필터 조건 추가 시 기존 로직 수정 없이 구문 하나만 추가

---

## 2일차: 시간표(ScheduleTable) 최적화

### 컴포넌트 리렌더링 방어 및 메모이제이션

**문제 분석**

```tsx
// Before: 핸들러가 매번 새로 생성
const ScheduleTable = ({ schedules }) => {
  const handleClick = (time) => {
    // 클릭 처리 로직
  };
  
  return (
    <>
      {schedules.map(schedule => (
        <Schedule 
          key={schedule.id}
          data={schedule}
          onClick={handleClick} // 매번 새로운 참조
        />
      ))}
    </>
  );
};
```

- 최상위 컴포넌트의 상태 변경 시 모든 하위 시간표 컴포넌트가 강제 리렌더링
- 이벤트 핸들러 함수가 렌더링마다 새로 생성되어 자식 컴포넌트는 props 변경으로 인식

**해결 방법**

```tsx
// 1. 핸들러 참조 고정
const ScheduleTable = memo(({ schedules }) => {
  const handleScheduleTimeClick = useCallback((time) => {
    // 클릭 처리 로직
  }, []);
  
  return (
    <>
      {schedules.map(schedule => (
        <DraggableSchedule 
          key={schedule.id}
          data={schedule}
          onClick={handleScheduleTimeClick}
        />
      ))}
    </>
  );
});

// 2. 렌더링 방어막 구축 (커스텀 비교 함수)
const DraggableSchedule = memo(({ data, bg, onClick }) => {
  return <div onClick={onClick}>{/* ... */}</div>;
}, (prev, next) => 
  prev.data === next.data && prev.bg === next.bg
);
```

**개선 효과**
- 모달 오픈 시 시간표 컴포넌트들의 불필요한 리렌더링 횟수 0회로 감소
- 렌더링 차단 해소로 모달 애니메이션 및 반응성 즉각 개선

---

### 드래그 앤 드롭 렌더링 격리 및 배경 최적화

**문제 분석**

![변경 전 구조](https://github.com/user-attachments/assets/e357db7d-12ed-4bf8-b02c-5c36d59a8d30)

```tsx
// Before: 전역 상태 관리
// App.tsx
<ScheduleDndProvider> {/* 전역에서 관리 */}
  <ScheduleTables />
</ScheduleDndProvider>

// ScheduleTable.tsx
const ScheduleTable = memo(({ schedules }) => {
  const dndContext = useDndContext(); // 전역 컨텍스트 구독
  
  return (
    <Grid>
      {/* 배경과 컨텐츠가 결합되어 있어 함께 리렌더링 */}
      {DAY_LABELS.map(day => <GridCell key={day} />)} 
      {schedules.map(schedule => <Schedule key={schedule.id} />)}
    </Grid>
  );
});
```

- 드래그 상태 관리자가 최상위에 위치하여 특정 테이블의 드래그 시 모든 테이블이 리렌더링
- 드래그 중이거나 데이터 변경 시 변하지 않는 배경 그리드(요일/시간 칸) 수백 개가 매번 재생성

**해결 방법**

![변경 후 구조](https://github.com/user-attachments/assets/112484bc-10c8-4f77-bdfd-4af9096bbb9a)

```tsx
// After: 개별 상태 관리 및 컴포넌트 분리
// App.tsx
// <ScheduleDndProvider> 제거 - 각 테이블이 독립적으로 관리

// 1. 정적 배경 분리 (메모이제이션)
const GridBackground = memo(() => (
  <>
    {DAY_LABELS.map(day => <GridCell key={day} label={day} />)}
    {TIME_SLOTS.map(time => <GridCell key={time} label={time} />)}
  </>
));

// 2. 개별 상태 관리 적용
export const ScheduleTable = memo(({ schedules }) => {
  return (
    <DndContext> {/* 이 테이블만의 독립된 드래그 컨텍스트 */}
      <Grid>
        <GridBackground /> {/* 배경은 렌더링 생략 */}
        {schedules.map(schedule => (
          <DraggableSchedule key={schedule.id} data={schedule} />
        ))}
      </Grid>
    </DndContext>
  );
});
```

**핵심 원칙**
> "상태는 사용하는 가장 가까운 위치에 둬야 한다"

**개선 효과**
- 하나의 테이블 조작 시 다른 테이블은 영향받지 않음
- 데이터가 변경되어도 배경 그리드는 다시 그려지지 않음
- 드래그 시 메인 스레드 부하 감소로 부드러운 움직임 제공

---

## 3일차: 접근성 최적화

### 메인 랜드마크 설정 적용

**문제 분석**

- 진단 도구에서 문서에 주요 랜드마크가 없다는 경고 발생
- 페이지의 핵심 콘텐츠 영역이 모두 의미 없는 `div` 태그로 구성
- 스크린 리더 사용자가 본문 영역을 식별하거나 바로 이동하기 어려움

**해결 방법**

```tsx
// Before: 기본 태그인 div로 렌더링
<Flex>
  {/* 시간표 목록 */}
</Flex>

// After: as props를 활용하여 실제 태그를 main으로 변경
<Flex as="main">
  {/* 시간표 목록 */}
</Flex>
```

**추가 개선 사항**
- 버튼 명도 대비를 WCAG 기준에 맞춰 3.5:1 → 10.5:1 고대비 색상으로 변경

**개선 효과**
- 주요 랜드마크 부재 경고 제거
- 스크린 리더 사용자의 본문 탐색 시간 단축
- 모든 사용자에게 동등한 콘텐츠 탐색 경험 제공

---

## 기술적 성장

### 1. memo는 만능이 아니다

**깨달은 점**

처음에는 `React.memo`만 감싸면 렌더링이 최적화될 줄 알았습니다. 하지만 프로파일러로 확인해 보니 여전히 리렌더링이 발생하고 있었고, 그 원인이 **참조값(Reference)이 매번 바뀌기 때문**이라는 사실을 알게 되었습니다.

이 과정을 통해 `useCallback`과 `useMemo`는 단순한 문법이 아니라, 불필요한 리렌더링을 막기 위한 **렌더링 방어막**이라는 점을 깊이 이해하게 되었습니다.

### 2. 메인 스레드를 쉬게 해주기

**깨달은 점**

이전에는 코드가 순서대로 실행되는 것만을 고려했지만, 이번 작업을 통해 메인 스레드 점유 여부가 체감 성능에 직접적인 영향을 준다는 사실을 배웠습니다.

API를 병렬(`Promise.all`)로 호출하고, 무거운 데이터 가공을 렌더링 중이 아닌 **데이터 로딩 시점**에 미리 처리하는 전처리(Pre-calculation) 방식으로 변경하자 체감 속도가 확연히 개선되는 경험을 했습니다.

### 3. 리액트와 DOM의 타이밍 맞추기

**깨달은 점**

무한 스크롤 구현 과정에서 `useRef`에 값이 할당되어도 리렌더링이 발생하지 않아 `IntersectionObserver`가 연결되지 않는 버그를 경험했습니다.

이를 통해 DOM이 실제로 마운트되는 타이밍과 리액트의 상태 업데이트 타이밍이 다를 수 있다는 점을 이해하게 되었고, **Callback Ref 패턴**을 사용해 해당 문제를 안정적으로 해결할 수 있었습니다.

---

## 코드 품질

### 코드가 읽기 좋아야 성능도 잡힌다

**경험한 점**

`ScheduleTable` 컴포넌트가 지나치게 비대해져 수정이 어려운 상태였습니다. 이를 **변하지 않는 배경(GridBackground)**과 **자주 변하는 강의(Schedule)** 컴포넌트로 분리하면서 코드 가독성과 렌더링 성능이 동시에 개선되는 경험을 했습니다.

이 과정을 통해 **관심사 분리와 구조 설계가 곧 성능 최적화로 이어진다**는 점을 체감했습니다.

### 상태는 필요한 곳에만 두기

처음에는 `DndContext`를 최상위에 두었지만, 드래그 이벤트 발생 시 모든 테이블이 리렌더링되는 문제가 있었습니다.

이를 각 테이블 내부로 이동해 상태를 격리하자 불필요한 렌더링이 제거되었고 체감 성능도 즉시 개선되었습니다. 이를 통해 **상태는 사용하는 가장 가까운 위치에 둬야 한다**는 원칙을 명확히 이해하게 되었습니다.

### 복잡한 조건문 정리하기

검색 필터링 로직이 여러 `&&` 조건으로 길게 연결되어 있어 가독성과 디버깅이 모두 어려운 상태였습니다.

이를 `if (!조건) return false` 형태의 **Guard Clause 패턴**으로 변경하니 코드 흐름이 명확해지고, 조건 불일치 시 조기 종료되어 연산 비용까지 자연스럽게 줄일 수 있었습니다.

---

## 마치며

이번 프로젝트는 단순히 성능 점수를 올리는 것이 아니라, **왜 느린지**, **어떻게 빠르게 만들 수 있는지**를 이해하는 여정이었습니다.

- memo는 만능이 아니며, 참조 안정성이 핵심
- 메인 스레드를 쉬게 해주는 것이 체감 성능 향상의 핵심
- 상태는 사용하는 가장 가까운 위치에 두어야 함
- 기술 선택에는 항상 트레이드오프가 따름

앞으로 실무에서 성능 이슈를 마주했을 때, 이번 경험을 바탕으로 체계적으로 접근하고 해결할 수 있을 것 같습니다.

