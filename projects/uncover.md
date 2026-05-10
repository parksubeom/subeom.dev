---
title: 언커버 (Uncover)
description: 저작권 문제없는 음원을 찾고 영상과 미리 매칭해보는 스트리밍 플랫폼. Recoil 상태 관리와 Audio/Video 동기화 로직 구현.
category: Web
status: Completed
tech_stack: 
- React
- TypeScript
- Recoil
- AWS S3
github_url: "https://github.com/sooknise"
demo_url: null
thumbnail_url: "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/uncover_thumnail.png"
images: []
featured: true
order: 2
start_date: 2023-05-01
end_date: 2023-05-30
detailInfo: 
overview: |
    저작권 문제없는 음원을 찾고, 영상과 미리 매칭해볼 수 있는 스트리밍 플랫폼입니다.
    부트캠프 전체 1위(31개 팀 중)를 수상했습니다.
period: 2023.05 - 2023.05
team: 팀 프로젝트 (FE 3명, BE 2명)
role: Frontend Developer
techStack: 
  - React
  - TypeScript
  - Recoil
  - AWS S3
sections: 
  - title: 서비스 소개
    content: |
        유튜브 크리에이터를 위한 음원 스트리밍 서비스입니다. 저작권 걱정 없는 음원을 파형(Waveform)으로 시각화하여 탐색할 수 있습니다.
        
        ![Main UI](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/uncover_main.png)
        
        *▲ Dark Theme 기반의 몰입감 있는 메인 UI*
  - title: "기술적 도전: 영상-음원 싱크(Sync) 제어"
    content: |
        **Context**
        영상 편집 툴 없이도 웹상에서 음원과 비디오의 어울림을 확인할 수 있는 `피팅룸` 기능이 필요했습니다.
        
        **Solution**
        Video와 Audio DOM 요소를 `useRef`로 직접 참조하여, 단일 컨트롤러에서 두 미디어의 **재생/일시정지/볼륨/Seek** 을 제어하는 동기화 로직을 구현했습니다.
  - title: "트러블슈팅: Client-Side OAuth2 인증 구현"
    content: |
        **Problem**
        백엔드 환경 제약으로 인해 서버 간 통신을 통한 표준 OAuth2 인증(인가 코드 교환)을 수행할 수 없는 상황이었습니다.
        
        **Workaround (Client-Side Flow)**
        부득이하게 클라이언트 주도적인 인증 흐름을 설계하여 해결했습니다.
        1. **Code Parsing**: 리다이렉트된 URL에서 `useParams()`로 인가 코드 추출
        2. **Token Exchange**: 클라이언트에서 직접 네이버로 액세스 토큰 요청
        3. **Sync**: 발급받은 토큰과 회원 정보를 자체 서버 DB로 전송 및 저장
        4. **Session**: 서버로부터 서비스 전용 JWT(Access/Refresh)를 발급받아 로컬 스토리지 관리
        
        ![OAuth Flow](https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/uncover_oauthflow.png)
        
        *▲ 시퀀스 다이어그램으로 도식화한 커스텀 인증 흐름*
        
        **Refactoring Plan**
        보안 강화를 위해 `axios interceptors`를 도입하여 토큰 만료 시 자동 갱신 로직을 구현하고, 추후 인증 로직을 서버 사이드로 이관하여 클라이언트의 책임을 최소화할 예정입니다.
links: 
  demo: null
  github: "https://github.com/sooknise"
  notion: null
---
