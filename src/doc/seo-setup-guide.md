# SEO 설정 가이드

이 문서는 Google Search Console 및 Naver Search Advisor 인증 설정 방법을 안내합니다.

## 환경변수 설정

### 1. Google Search Console

1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 → URL 접두어로 `https://subeomdev.vercel.app` 추가
3. 소유권 확인 방법 선택:
   - **HTML 태그** 방법 선택
   - 제공된 메타 태그의 `content` 속성 값 복사
   - 예: `<meta name="google-site-verification" content="ABC123XYZ..." />`

4. `.env.local` 파일에 환경변수 추가:
```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=ABC123XYZ...
```

### 2. Naver Search Advisor

1. [Naver Search Advisor](https://searchadvisor.naver.com/) 접속
2. 사이트 등록 → 사이트 URL: `https://subeomdev.vercel.app`
3. 사이트 소유 확인:
   - **HTML 태그** 방법 선택
   - 제공된 메타 태그의 `content` 속성 값 복사
   - 예: `<meta name="naver-site-verification" content="DEF456UVW..." />`

4. `.env.local` 파일에 환경변수 추가:
```env
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=DEF456UVW...
```

### 3. Vercel 배포 환경 설정

로컬 개발 환경뿐만 아니라 **Vercel 프로덕션 환경**에도 환경변수를 설정해야 합니다:

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. 다음 환경변수 추가:
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: `ABC123XYZ...`
   - `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`: `DEF456UVW...`

4. **중요**: 환경변수 추가 후 **Redeploy** 필요
   - Vercel Dashboard → **Deployments** → 최신 배포 → **Redeploy**

## 메타 태그 생성 확인

환경변수 설정 후 다음 HTML 태그가 자동으로 생성됩니다:

### Google Search Console
```html
<meta name="google-site-verification" content="ABC123XYZ..." />
```

### Naver Search Advisor
```html
<meta name="naver-site-verification" content="DEF456UVW..." />
```

## 확인 방법

1. 배포된 사이트의 소스 코드 확인:
   - `https://subeomdev.vercel.app` 접속
   - 페이지 소스 보기 (Ctrl+U 또는 Cmd+Option+U)
   - `<head>` 섹션에서 메타 태그 확인

2. Google Search Console에서:
   - 속성 → 설정 → 소유권 확인 → **확인** 버튼 클릭

3. Naver Search Advisor에서:
   - 사이트 설정 → 사이트 소유 확인 → **확인** 버튼 클릭

## 주의사항

- ⚠️ 환경변수 값에 따옴표(`"`)를 포함하지 마세요
  - ❌ 잘못된 예: `"ABC123XYZ..."`
  - ✅ 올바른 예: `ABC123XYZ...`

- ⚠️ Vercel 환경변수 설정 시 공백이 포함되지 않도록 주의하세요

- ⚠️ 환경변수 변경 후 반드시 **Redeploy** 해야 변경사항이 적용됩니다

## 관련 파일

- `src/app/layout.tsx`: 메타데이터 및 verification 설정
- 환경변수 사용 위치:
  ```typescript
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  ```

