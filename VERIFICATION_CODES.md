# 검색 엔진 인증 코드

## Google Search Console

**메타 태그:**
```html
<meta name="google-site-verification" content="SLDD9fYNNfyCrlapumq_fkttmFMPdOgbwFaMGYp0G40" />
```

**환경변수:**
```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=SLDD9fYNNfyCrlapumq_fkttmFMPdOgbwFaMGYp0G40
```

## Naver Search Advisor

**메타 태그:**
```html
<meta name="naver-site-verification" content="3fdb8dcb05f6590d49087177aa55dddc8c15d9e5" />
```

**환경변수:**
```
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=3fdb8dcb05f6590d49087177aa55dddc8c15d9e5
```

## 설정 위치

### 로컬 환경
- `.env.local` 파일에 위 환경변수 추가 (이미 완료)

### Vercel 프로덕션 환경
- Vercel Dashboard → Settings → Environment Variables
- 위 환경변수들을 Production, Preview, Development 모두에 추가
- 재배포 필요

## 확인 방법

1. 로컬: `http://localhost:3000` 접속 후 페이지 소스 보기
2. 프로덕션: `https://subeomdev.vercel.app` 접속 후 페이지 소스 보기
3. `<head>` 섹션에서 위 메타 태그 확인

