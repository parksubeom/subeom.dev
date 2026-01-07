# subeom.dev
포트폴리오 & 기술블로그

## 프로젝트 개요

Next.js 14, TypeScript, Tailwind CSS, Supabase를 사용한 개발자 포트폴리오 및 기술 블로그입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase
- **Architecture**: FSD (Feature-Sliced Design)
- **Animation**: Framer Motion
- **Content**: MDX (next-mdx-remote)

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router 페이지
├── components/       # 공통 컴포넌트
├── entities/         # 비즈니스 엔티티 (FSD)
├── features/         # 기능 단위 (FSD)
├── widgets/          # 위젯 블록 (FSD)
├── shared/           # 공유 리소스 (FSD)
└── type/             # 타입 정의
```

## 배포

Vercel을 통해 배포할 수 있습니다:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/parksubeom/subeom.dev)
