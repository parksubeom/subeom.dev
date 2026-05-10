---
title: 애니스쿨 (Anyschool)
description: 얼굴 공개 부담 없이 개성을 표현할 수 있는 랜덤 동물 캐릭터 생성 서비스. AWS Lambda를 활용한 이미지 처리 파이프라인 구축.
category: Web
status: Completed
tech_stack: 
- React
- AWS Lambda
- S3
- Dom-to-image
github_url: "https://github.com/parksubeom/Ani_School"
demo_url: "https://parksubeom.github.io/Ani_School/"
thumbnail_url: "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/anischool_thumnail.png"
images: []
featured: true
order: 1
start_date: 2023-02-01
end_date: 2023-03-31
detailInfo: 
overview: |
    얼굴 공개 부담 없이 개성을 표현할 수 있는 랜덤 동물 캐릭터 생성 서비스입니다.
    사용자가 선택한 파츠를 조합하거나 완전 랜덤 기능을 통해 나만의 캐릭터를 만들고 이미지로 저장할 수 있습니다.
period: 2023.02 - 2023.03
team: 개인 프로젝트
role: Full Stack (기획/디자인/개발)
techStack: 
  - React
  - AWS Lambda
  - S3
  - Dom-to-image
  - File-saver
sections: 
  - title: 확률 분포를 이용한 랜덤 알고리즘 설계
    content: |
        **1. 상태 기반의 파츠 조합 로직**
        `Math.random()`으로 생성된 인덱스 값을 상태(State)로 저장하여, 각 파츠 컴포넌트가 해당 인덱스의 이미지를 렌더링하도록 구현했습니다. 이 과정에서 부모-자식 간 Depth가 깊어질수록 **Props Drilling**으로 인한 코드 복잡도가 증가함을 체감했고, 이를 해결하기 위해 상태 끌어올리기(State Lifting) 패턴을 적용하며 전역 상태 관리(Global State)의 필요성을 학습했습니다.
        
        **2. 희귀(Rare) 아이템 확률 로직**
        단순 랜덤이 아닌 게임적 재미를 위해 희귀 파츠 등장 확률을 조정했습니다.
        - **Logic**: `Math.round()` 함수가 0.5 단위로 반올림하는 특성을 역이용했습니다.
        - **Implementation**: 0번(첫 번째)과 마지막 인덱스는 반올림 범위가 절반(0~0.49, n.5~n.99)밖에 되지 않으므로, 중간 숫자들보다 등장 확률이 자연스럽게 낮아지도록 설계하여 **별도의 가중치 함수 없이도 레어 아이템 확률을 구현**했습니다.
        
        **Lesson**: 보안이 중요하지 않은 토이 프로젝트라 `Math.random`을 사용했으나, 암호학적으로 안전한 난수가 필요한 경우에는 `window.crypto.getRandomValues()`를 사용해야 함을 학습했습니다.
  - title: Virtual DOM 환경에서의 이미지 캡처 구현
    content: |
        **Challenge**
        완성된 캐릭터 조합을 유저의 디바이스에 저장하기 위해선 렌더링 된 화면을 이미지화해야 했습니다. 하지만 React의 Virtual DOM 환경에서 직접적인 DOM 조작(`querySelector` 등)은 지양해야 했습니다.
        
        **Solution: useRef & Dom-to-image**
        - **Ref 활용**: 캡처 대상이 될 컨테이너에 `useRef`를 부착하여 리액트의 라이프사이클을 해치지 않고 안전하게 DOM 노드에 접근했습니다.
        - **Pipeline**: `dom-to-image`로 해당 노드를 Blob 데이터로 변환 → `File-saver` 라이브러리의 `saveAs()` 메서드로 클라이언트 다운로드를 트리거하는 비동기 파이프라인을 구축했습니다.
  - title: "Lighthouse 성능 최적화: 62점 → 90점"
    content: |
        **Analysis**
        초기 런칭 후 Lighthouse 측정 결과, 퍼포먼스 점수가 62점으로 측정되었습니다. SEO와 사용자 경험 향상을 위해 코드와 리소스 레벨에서 최적화를 진행했습니다.
        
        | Before (62점) | After (90점) |
        | :---: | :---: |
        | ![Before](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/anischool_lighthouse-before.png) | ![After](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/anischool_lighthouse-after.png) |
        
        **Optimization Strategy**
        1. **Resource**: 모든 PNG 에셋을 **WebP로 변환**하여 용량을 약 80% 절감하고, AWS Lambda를 통해 업로드 이미지를 자동 리사이징 처리했습니다.
        2. **Code**: 초기 로딩에 불필요한 리소스는 **Lazy Loading**을 적용하고, Tree Shaking을 통해 미사용 모듈을 제거하여 번들 사이즈를 줄였습니다.
        3. **Accessibility**: 이미지 `alt` 태그와 버튼 `aria-label`을 전수 조사 및 적용하여 웹 접근성 점수 또한 개선했습니다.
  - title: 사용자 피드백과 애자일한 유지보수
    content: |
        **Impact**
        - **User**: 실 사용자 200명 이상 유치
        - **Feedback**: 37건의 피드백 접수 및 기능 개선 반영
        
        **Insight**
        "내 눈에 보이지 않는 에러가 사용자 눈에는 보인다"는 것을 배웠습니다. 개발자 도구에서는 보이지 않던 UX 불편함들이 실제 사용자의 피드백을 통해 드러났고, 이를 즉각적으로 수정 배포하는 과정을 통해 **사용자 중심 개발(User-Centric Development)**의 중요성을 깊이 체감했습니다.
links: 
  demo: "https://parksubeom.github.io/Ani_School/"
  github: "https://github.com/parksubeom/Ani_School"
  notion: null
---
