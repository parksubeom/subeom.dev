---
title: "A11yGym: 웹 접근성(KWCAG 2.2) 실습 플랫폼"
description: Monaco Editor와 axe-core를 iframe 내에서 연동하여 실시간 접근성 검증 시스템을 구축한 인터랙티브 학습 플랫폼
category: Web Platform
status: Completed
tech_stack: 
- Next.js 14
- TypeScript
- Monaco Editor
- axe-core
- Zustand
- Supabase
- TanStack Query
- Tailwind CSS
- shadcn/ui
github_url: "https://github.com/parksubeom/-A11yGym"
demo_url: "https://a11y-gym.vercel.app"
thumbnail_url: "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/a11ygym-thumbnail.png"
images: 
- "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/a11ygym-guide.png"
- "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/a11ygym-main.png"
featured: true
order: 2
start_date: 2024-01-01
end_date: 2024-02-28
detailInfo: 
overview: KWCAG 2.2 가이드라인을 이론이 아닌 실습으로 익힐 수 있는 플랫폼입니다. 사용자는 Monaco Editor에서 접근성 오류가 있는 코드를 수정하고, 실시간 미리보기와 axe-core 기반 접근성 검사 도구를 통해 즉각적인 피드백을 받습니다.
period: 2026.01 - 2026.02
team: 개인 프로젝트
role: Full Stack (기획/디자인/개발)
techStack: 
  - Next.js 14
  - TypeScript
  - Monaco Editor
  - axe-core
  - Zustand
  - Supabase
sections: 
  - title: 핵심 기능
    content: |
        ### 1. 인터랙티브 코드 에디터
        - Monaco Editor 통합으로 VSCode 수준의 편집 경험
        - 실시간 구문 강조 및 자동 완성
        - React JSX 및 HTML 코드 작성 지원
        
        ### 2. 실시간 미리보기 시스템
        - iframe 샌드박스 환경에서 사용자 코드를 안전하게 실행
        - React JSX를 HTML로 자동 변환하여 즉시 렌더링
        
        ### 3. 자동화된 접근성 검증
        - axe-core 엔진을 활용한 WCAG/KWCAG 준수 검사
        - 색 대비, alt 텍스트, 키보드 접근성 등 자동 검증
        - A11y 트리 시각화로 접근성 구조 이해 지원
        
        ### 4. 단계별 학습 챌린지
        - KWCAG 2.2의 4가지 원칙(POUR) 기반 챌린지 구성
        - 각 챌린지마다 초기 코드, 힌트, 정답 코드 제공
  - title: "기술적 도전 1: iframe 내 axe-core 실행"
    content: |
        ### CommonJS와 브라우저 호환성 문제
        
        **문제**: npm의 axe-core는 Node.js 환경을 전제로 exports 키워드를 사용합니다. 하지만 브라우저 iframe에는 이런 전역 변수가 없어 ReferenceError가 발생했습니다.
        
        **해결**: CommonJS 환경을 모방하는 Shim 스크립트를 먼저 주입했습니다. module, exports, process 같은 전역 변수를 미리 선언하여 호환성 문제를 해결했습니다.
        
        **학습 포인트**: Node.js용 라이브러리를 브라우저에서 실행할 때는 환경 변수와 모듈 시스템의 차이를 이해하고 적절한 Shim을 제공해야 합니다.
  - title: "기술적 도전 2: React JSX → HTML 변환"
    content: |
        ### 경량 파서 구현
        
        **문제**: 사용자가 작성하는 React JSX 코드를 iframe에서 렌더링하려면 className을 class로, tabIndex를 tabindex로 변환해야 합니다.
        
        **해결**: Babel이나 SWC 같은 무거운 번들러 대신, 정규식 기반의 경량 변환기를 직접 구현했습니다. className, htmlFor, tabIndex 등 주요 JSX 속성을 HTML 속성으로 변환합니다.
        
        **장점**: 빠른 실행 속도(밀리초 단위), 예측 가능한 동작, 학습 시나리오에 충분한 커버리지
        
        **한계**: 복잡한 이벤트 핸들러나 React 컴포넌트는 지원하지 않음
  - title: "기술적 도전 3: 비동기 분석 Race Condition"
    content: |
        ### 3단계 방어 메커니즘 구축
        
        **문제**: 사용자가 코드 실행 버튼을 빠르게 연타하거나 여러 이벤트가 동시에 발생하면 'Axe is already running' 에러가 발생했습니다. axe-core는 동시에 여러 분석을 실행할 수 없도록 설계되어 있기 때문입니다.
        
        **해결**: 3단계 방어 메커니즘을 구축했습니다.
        
        1단계 - 분석 프로세스 레벨: Promise를 ref로 추적하여 이전 실행이 완료될 때까지 대기
        
        2단계 - 스케줄링 중복 방지: 플래그를 사용하여 동일 이벤트의 중복 호출 방지
        
        3단계 - axe.run() 직접 호출 보호: API 레벨에서도 중복 실행 방지
        
        **핵심**: 각 레벨에서 중복을 방지하고 finally 블록에서 ref를 안전하게 초기화하여 안정성을 확보했습니다.
  - title: 트러블슈팅 사례
    content: |
        ### 1. shadcn/ui Tabs 언마운트 문제
        
        **Issue**: 탭 전환 시 iframe이 언마운트되어 렌더링 결과가 사라짐
        
        **Solution**: forceMount 속성으로 모든 탭의 콘텐츠를 DOM에 유지
        
        **Impact**: 탭 전환 시에도 iframe 상태가 보존되어 UX 크게 개선
        
        ### 2. CSV 인코딩 문제
        
        **Issue**: KWCAG 지침 CSV가 CP949 인코딩으로 되어 있어 Node.js에서 한글 깨짐
        
        **Solution**: PowerShell 스크립트로 UTF-8 변환 후 TypeScript 상수 자동 생성 파이프라인 구축
        
        **Result**: 33개 KWCAG 지침이 타입 안전하게 자동 생성
        
        ### 3. Next.js SSR과 Zustand persist 충돌
        
        **Issue**: 서버 렌더링 중 window is not defined 에러 발생
        
        **Solution**: 클라이언트 환경 감지 분기 추가하여 서버에서는 no-op 스토리지 반환
        
        ### 4. 사용자 피드백 기반 개선
        
        - 메인화면으로 돌아갈 방법이 없다는 피드백 → 홈 아이콘 버튼 추가
        - preview가 작동하지 않는다는 피드백 → JSX→HTML 변환 기능 구현
        - 챌린지 변경 시 이전 결과 표시 → 상태 초기화 로직 추가
  - title: 아키텍처 및 기술 선택
    content: |
        ### 프론트엔드 아키텍처
        
        app/ 폴더에 challenges 동적 라우팅, components에 Editor/PreviewPanel/A11yTree/IssuesList, hooks에 useAxeAnalysis/useChallenge, store에 Zustand 전역 상태를 구성했습니다.
        
        ### 기술 스택 선택 이유
        
        **Next.js 14**: Server Components로 초기 로딩 최적화
        
        **Monaco Editor**: VSCode와 동일한 편집 경험
        
        **axe-core**: 업계 표준 접근성 검사 엔진
        
        **Supabase**: PostgreSQL 기반 실시간 데이터베이스
        
        **TanStack Query**: 서버 상태 캐싱 및 동기화
  - title: 성과 및 학습
    content: |
        ### 개발 성과
        
        - 33개 KWCAG 2.2 지침 중 핵심 지침 챌린지 구현
        - 3단계 방어 메커니즘으로 axe-core 안정성 99% 이상 달성
        - 정규식 기반 파서로 평균 5ms 이내 JSX→HTML 변환
        - 실시간 피드백 루프: 코드 작성에서 검증까지 1초 이내
        
        ### 기술적 학습
        
        - 크로스 플랫폼 모듈 시스템: CommonJS, ESM, UMD 차이와 브라우저 호환성 처리
        - 비동기 프로그래밍: Promise 추적, Race Condition 방지
        - 샌드박스 환경: iframe 보안 모델, eval() 컨텍스트 제어
        - 접근성 도구: axe-core 내부 동작 원리, WCAG 규칙 구현
        
        ### 사용자 피드백
        
        이론으로만 배웠던 웹 접근성을 실제로 손으로 익힐 수 있어서 좋았다는 평가와 코드를 수정하고 바로 결과를 확인할 수 있어서 학습 속도가 빨랐다는 긍정적인 반응을 받았습니다.
  - title: 향후 개선 방향
    content: |
        ### 단기 계획
        
        1. Babel 파서 도입으로 모든 JSX 패턴 지원
        2. AST 기반 검증으로 정확도 향상
        3. 33개 지침 전체 챌린지화
        4. 난이도 시스템(입문/중급/고급)
        
        ### 중기 계획
        
        1. iframe 내 React 런타임 실행
        2. 실시간 협업 기능(Supabase Realtime)
        3. 진행도 트래킹 및 시각화
        4. 커뮤니티 솔루션 공유
        
        ### 장기 비전
        
        1. 다국어 지원(WCAG/KWCAG)
        2. AI 힌트 시스템(LLM 활용)
        3. Web Worker로 성능 최적화
        4. React Native 모바일 앱
  - title: 핵심 교훈
    content: |
        ### 1. 환경 불일치는 반드시 온다
        
        Node.js용 라이브러리를 브라우저에서 쓸 때는 항상 호환성 레이어를 고려해야 합니다. CommonJS Shim은 이제 제 기본 도구 상자에 포함되었습니다.
        
        ### 2. 비동기 작업은 추적하라
        
        Promise 기반 비동기 작업은 ref로 추적하고, 이전 실행이 완료될 때까지 대기하는 로직이 필수입니다.
        
        ### 3. 완벽한 파서보다 충분한 파서
        
        학습용 플랫폼에서는 Babel 같은 완벽한 파서보다 99% 사용 사례를 커버하는 간단한 정규식 파서가 더 나을 수 있습니다.
        
        ### 4. 사용자 피드백이 개발자의 추측보다 낫다
        
        아무리 잘 설계해도 실제 사용자가 어떻게 쓰는지 보기 전까진 모릅니다. 베타 테스터의 한 마디가 며칠간 고민한 설계보다 더 명확한 방향을 제시해줬습니다.
        
        ### 5. 접근성은 모두를 위한 것
        
        웹 접근성이 단순히 규정 준수가 아니라 모든 사람이 웹을 사용할 수 있게 만드는 일임을 깊이 이해하게 되었습니다.
  - title: 관련 글
    content: |
        이 프로젝트의 기술적 도전과 해결 과정을 상세히 다룬 블로그 글을 작성했습니다.
        
        [A11yGym 개발기: 웹 접근성 학습 플랫폼을 만들며 마주한 기술적 도전들](/blog/a11y-gym-development-challenges)
        
        블로그에서는 다음 내용을 더 깊이 있게 다룹니다:
        
        - iframe 내 axe-core 실행 시 exports is not defined 에러 해결
        - Axe is already running 에러를 위한 3단계 방어 메커니즘
        - React JSX to HTML 변환 정규식 패턴 전체 코드
        - 사용자 피드백 기반 개선 사례
        - CSV 인코딩 문제 해결 파이프라인
        
        GitHub 저장소에서 전체 소스 코드를 확인할 수 있습니다.
links: 
  blog: /blog/a11y-gym-development-challenges
  demo: "https://a11y-gym.vercel.app"
  github: "https://github.com/parksubeom/-A11yGym"
---

# A11yGym

KWCAG 2.2 가이드라인을 실습으로 익히는 웹 접근성 학습 플랫폼입니다.

iframe 샌드박스 환경에서 사용자 코드를 실행하고, axe-core로 실시간 접근성 검증을 제공합니다.
