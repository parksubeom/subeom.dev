---
title: AI 협업 포트폴리오 (subeom.dev)
description: Next.js 14와 FSD 아키텍처, Supabase로 구축하고 AI와 협업하여 완성한 나만의 포트폴리오 플랫폼
category: Web Platform
status: Completed
tech_stack: 
- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- FSD Architecture
- MDX
github_url: "https://github.com/parksubeom/subeom.dev"
demo_url: "https://subeomdev.vercel.app"
thumbnail_url: "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/subeom-portfolio.png"
images: 
- "https://kndxpccohandhwfcotyh.supabase.co/storage/v1/object/public/portfolio/subeom-portfolio_detail.png"
featured: true
order: 1
start_date: 2025-12-27
end_date: 2026-01-13
detailInfo: 
overview: |
    기획부터 배포까지 자체 정립한 'AI-Native 파이프라인'을 통해 구축한 Next.js 14 기반의 포트폴리오 플랫폼입니다.
    AI의 환각(Hallucination)을 제어하고 의도를 정확히 투영하기 위해 단계적 프롬프팅과 문서 기반 개발(Doc-Driven) 방법론을 적용했으며, 이를 통해 1인 개발의 한계를 넘어 FSD 아키텍처와 높은 완성도의 UX를 구현했습니다.
period: 2025.12 - 2026.01
team: 개인 프로젝트 (with AI Agent)
role: Full Stack (기획/디자인/개발)
techStack: 
  - Next.js 14
  - TypeScript
  - Supabase
  - FSD Architecture
  - Giscus
  - Tailwind CSS
sections: 
  - title: "AI-Native Pipeline: 고품질 프로덕트를 위한 3단계 전략"
    content: |
        단순히 코드를 요청하는 것이 아니라, **'설계된 파이프라인'** 을 통해 AI를 엔지니어링 도구로 제어했습니다.
        
        **1. Context Injection (맥락 주입)**
        - Gemini Gems 등을 활용하여 프로젝트의 아키텍처(FSD), 코딩 컨벤션, 기술 스택 제약사항을 사전에 '시스템 프롬프트'로 주입했습니다. 이를 통해 AI가 프로젝트의 전후 맥락을 이해하고 일관성 있는 코드를 생산하도록 만들었습니다.
        
        **2. Phased Prompting (단계적 프롬프팅)**
        - 복잡한 기능을 한 번에 요청하지 않고 **'기획(전략) → 인터페이스(Type) → 구현(Code)'** 의 3단계로 쪼개어 지시했습니다. 앞 단계의 산출물이 다음 단계의 완벽한 프롬프트가 되는 연쇄 작용을 설계하여 구현 오류를 획기적으로 줄였습니다.
        
        **3. Doc-Driven Verification (문서 기반 검증)**
        - 구현 전, AI에게 **'변경 사항에 대한 명세서'** 를 먼저 작성하게 했습니다. 코드를 작성하기 전 인간(Human)이 논리적 오류를 먼저 검수하고 승인하는 절차를 두어, 롤백 비용을 최소화하고 요구 스펙에 정확히 부합하는 결과물을 얻어냈습니다.
  - title: 아키텍처 및 기술적 결정
    content: |
        **Core & Framework**
        - **Next.js 14 (App Router)**: 서버 컴포넌트(RSC) 기반으로 초기 로딩 속도를 최적화했습니다.
        - **FSD Architecture**: 기능(Features) 단위로 폴더를 분리하여 높은 응집도와 낮은 결합도를 실현했습니다.
        
        **Data & Content**
        - **Supabase**: PostgreSQL 기반의 메타데이터 관리 및 RPC 함수를 활용한 조회수 로직 구현.
        - **MDX Engine**: `next-mdx-remote`와 `rehype` 플러그인을 커스텀하여 고성능 블로그 엔진을 구축했습니다.
  - title: "성능 최적화: SSR에서 ISR로의 전환"
    content: |
        **Problem**
        초기에는 `force-dynamic`을 사용하여 매 요청마다 DB를 조회했으나, 트래픽 증가 시 DB 부하와 응답 지연이 우려되었습니다. 반대로 정적(Static) 배포 시에는 새 글이 반영되지 않는 문제가 있었습니다.
        
        **Solution: ISR (Incremental Static Regeneration) with Environment-Based Strategy**
        `revalidate` 옵션을 환경별로 다르게 설정하여 **개발 편의성과 프로덕션 성능을 모두 확보** 했습니다:
        - **개발 환경**: `revalidate: 0` - 캐시 없이 항상 최신 데이터를 가져와 Supabase 데이터 변경 시 즉시 반영
        - **프로덕션 환경**: `revalidate: 60` - 정적 페이지를 60초 동안 캐시하여 응답 속도 80-90% 개선 (200-500ms → 10-50ms)
        
        이를 통해 **정적 페이지의 빠른 속도** 와 **동적 페이지의 데이터 최신성** 이라는 두 마리 토끼를 잡았으며, 프로덕션 환경에서 불필요한 DB 요청을 90% 이상 절감했습니다.
  - title: Serverless 댓글 시스템 구축 (Giscus)
    content: |
        별도의 백엔드 구축 없이 GitHub Discussions API를 활용한 **Giscus** 를 도입했습니다.
        - **Theme Sync**: `next-themes`와 연동하여 시스템/유저 설정에 따라 다크모드가 즉시 반영되도록 구현.
        - **Security**: Repo ID 등 민감 정보를 환경 변수(`NEXT_PUBLIC_`)로 분리하여 보안성을 확보했습니다.
  - title: "트러블슈팅: 배포 환경 이슈 해결"
    content: |
        **1. Vercel 환경 변수와 따옴표 이슈**
        - **Issue**: 로컬에선 잘 되던 Giscus가 배포 환경에서 `Repository not found` 에러 발생.
        - **Cause**: Vercel 환경 변수 설정 시 값에 따옴표(`"`)를 포함하여 입력한 것이 원인 (문자열 리터럴로 인식됨).
        - **Fix**: 따옴표를 제거하고 순수 문자열만 입력 후 Redeploy하여 해결.
        
        **2. Supabase Schema Cache (PGRST202)**
        - **Issue**: RPC 함수(`increment_view_count`) 생성 직후 API 호출 시 `Function not found` 에러 발생.
        - **Fix**: DB에는 존재하지만 API Gateway의 캐시가 갱신되지 않음을 파악, 대시보드에서 `Reload Schema Cache`를 수행하여 해결.
links: 
  demo: "https://subeomdev.vercel.app"
  github: "https://github.com/parksubeom/subeom.dev"
  notion: null
---

# subeom.dev\n\nAI Co-Pilot과 함께 만든 FSD 아키텍처 기반의 포트폴리오 사이트입니다.
