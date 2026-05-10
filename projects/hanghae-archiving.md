---
title: 항해플러스 아카이빙
description: LMS 과제 제출 이력 영구 보존 서비스. 결함 허용 PR 매칭 알고리즘 설계 및 4-Layer Fallback 로직 구현.
category: Backend
status: Completed
tech_stack: 
- Node.js
- NestJS
- GitHub API
github_url: "https://github.com/parksubeom/hanghae_frontend_7th_archive"
demo_url: "https://parksubeom.github.io/hanghae_frontend_7th_archive/"
thumbnail_url: "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/hanghea_thumnail.png"
images: []
featured: true
order: 3
start_date: 2025-12-01
end_date: 2026-01-01
detailInfo: 
overview: |
    항해플러스 수강생들의 과제 제출 이력이 LMS 상에서 휘발되는 문제를 해결하기 위해 개발한 아카이빙 서비스입니다.
    단순 수집을 넘어, 결함 허용(Fault Tolerant) 알고리즘을 통해 데이터 유실률 0%를 달성했으며, 게이미피케이션 요소를 도입해 수강생들의 참여 동기를 강화했습니다.
period: 2025.12 - 2026.01
team: 개인 프로젝트
role: Full Stack Engineering
techStack: 
  - Node.js
  - NestJS
  - GitHub API
  - React
  - Tailwind CSS
  - Supabase
sections: 
  - title: 서비스 배경 및 성과
    content: |
        수강생들이 제출한 과제(PR) 링크가 변경되거나 ID가 달라져 LMS에서 누락되는 문제가 빈번했습니다. 이를 해결하기 위해 GitHub API 기반의 자동화된 수집 파이프라인을 구축했습니다.
        
        ![Dashboard UI](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/hanghea_list.png)
        
        **Key Metrics**
        - **데이터 정확도**: 초기 매칭 실패율 40% → **95% 이상** 으로 개선
        - **복구 성과**: 단순 URL 매칭으로 찾을 수 없었던 **40% 이상의 누락 데이터 복구**
        - **운영 효율**: 수동 개입이 필요한 케이스를 전체의 **5% 미만** 으로 단축
  - title: "핵심 기술: 4-Layer Fallback 매칭 알고리즘"
    content: |
        **Problem**
        수강생들의 PR Re-open, 리포지토리 포맷 변경, 계정 ID 불일치 등 다양한 변수로 인해 단순 문자열 매칭으로는 데이터 정합성을 보장할 수 없었습니다.
        
        **Engineering Solution**
        단일 매칭 실패 시 순차적으로 복구를 시도하는 **결함 허용(Fault Tolerant) 알고리즘** 을 독자 설계했습니다.
        
        ![Logic Diagram](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/hanghae_logic.png)
        
        1. **Normalization (전처리)**: `www` 제거, 트레일링 슬래시 통일 등 URL 포맷 표준화
        2. **Mapping Table (식별)**: 실명과 GitHub ID가 다른 케이스(약 5%)를 매핑 테이블로 관리하여 강제 연결
        3. **Heuristic Search (역추적)**: 과제명(Chapter info) 키워드로 유저의 Event History를 역추적하여 오기입된 링크 복구
        4. **Cross-Repo Validation (교차 검증)**: Fork된 리포지토리와 원본 리포지토리 간의 PR 번호를 대조하여 유실된 데이터 추적
  - title: 게이미피케이션 & 인터랙티브 UI 고도화
    content: |
        **Logic: 다차원 등급 산정 시스템**
        기존의 단순 점수제를 폐지하고, **완료율(Completion Rate)과 베스트 프랙티스(BP)** 달성 여부를 복합적으로 평가하는 로직(`ranking.utils.ts`)으로 재설계했습니다. 블랙(상위 100%+BP2)부터 화이트까지 6단계 등급 시스템을 구축하여 성취감을 고취시켰습니다.
        
        **UX/UI: 3D Flip Card Animation**
        사용자 프로필 카드에 **CSS 3D Transform** 을 적용하여 인터랙티브한 경험을 제공했습니다.
        - **Engineering**: `perspective`와 `rotateY`를 활용해 카드 뒤집기 효과 구현, `will-change` 속성으로 브라우저 렌더링 최적화
        - **Motion**: `cubic-bezier` 이징 함수를 커스텀하여 자연스럽고 무게감 있는 애니메이션 구현
        
        **Visual: 등급별 동적 테마링**
        등급 데이터에 따라 배경 그라데이션, 글래스모피즘(Backdrop Blur), SVG 뱃지, 그림자 효과가 자동으로 변경되는 **Dynamic Styling System** 을 구축하여 시각적 피드백을 강화했습니다.
  - title: 관측 가능성(Observability) 확보
    content: |
        **Challenge**
        매칭 로직이 복잡해질수록 "왜 매칭에 실패했는지" 원인을 파악하기 어려워졌습니다(Black Box 문제).
        
        **Action**
        매칭 프로세스 실행 시, 성공/실패 원인과 매칭 경로를 분석한 **디버깅 리포트(`matching-debug.md`) 자동 생성 시스템** 을 구현했습니다.
        
        ![Dashboard](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/hanghae_dashboard.png)
        
        **Impact**
        데이터 정합성을 투명하게 증명하고, 매칭 실패 시 원인 파악 시간을 수십 분에서 **즉시 확인** 으로 단축했습니다.
  - title: "트러블슈팅: SSR Hydration Mismatch"
    content: |
        **Issue**
        배포 서버(UTC)와 클라이언트(KST)의 타임존 차이로 인해 렌더링 된 날짜 데이터가 달라지며 Hydration Error가 발생했습니다.
        
        **Solution**
        1. **환경 통일**: 런타임 진입점에서 `process.env.TZ = 'Asia/Seoul'`을 강제 설정하여 서버 시간대 고정
        2. **UTC 포맷팅**: `getUTCFullYear()` 등을 사용하여 서버/클라이언트 간 날짜 포맷 일관성 보장
        3. **Safe Hooks**: `useMobile` 등 클라이언트 전용 훅의 초기값을 `false`로 통일하여 Mismatch 원천 차단
links: 
  demo: "https://parksubeom.github.io/hanghae_frontend_7th_archive/"
  github: "https://github.com/parksubeom/hanghae_frontend_7th_archive"
  notion: null
---
