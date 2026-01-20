# SEO 인증 다음 단계 가이드

환경변수를 등록하셨다면, 다음 단계를 진행하세요.

## ✅ 완료된 작업

- ✅ Google Search Console 인증 코드 수신 및 `.env.local` 등록
- ✅ Naver Search Advisor 인증 코드 수신 및 `.env.local` 등록
- ✅ 빌드 성공 확인

## 📋 다음 단계

### 1. 로컬에서 메타 태그 확인 (선택사항)

로컬 개발 서버에서 메타 태그가 제대로 생성되는지 확인할 수 있습니다:

```bash
pnpm run dev
```

브라우저에서 `http://localhost:3000` 접속 후:
1. 페이지 소스 보기 (Ctrl+U 또는 Cmd+Option+U)
2. `<head>` 섹션에서 다음 메타 태그 확인:

```html
<!-- Google Search Console -->
<meta name="google-site-verification" content="YOUR_GOOGLE_CODE" />

<!-- Naver Search Advisor -->
<meta name="naver-site-verification" content="YOUR_NAVER_CODE" />
```

⚠️ **주의**: 로컬 환경변수는 프로덕션 배포에 자동으로 포함되지 않습니다. Vercel에도 환경변수를 등록해야 합니다.

---

### 2. Vercel 프로덕션 환경변수 등록 (필수)

로컬 `.env.local` 파일의 환경변수는 **Vercel 프로덕션 환경에 자동으로 적용되지 않습니다**. 반드시 Vercel Dashboard에서도 설정해야 합니다.

#### 2-1. Vercel Dashboard 접속

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 해당 프로젝트 선택 (예: `subeom-dev`)

#### 2-2. 환경변수 추가

1. 프로젝트 → **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 선택
3. 다음 환경변수 추가:

   **Google Search Console:**
   ```
   Key: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
   Value: [Google에서 받은 인증 코드]
   Environment: Production, Preview, Development 모두 선택
   ```

   **Naver Search Advisor:**
   ```
   Key: NEXT_PUBLIC_NAVER_SITE_VERIFICATION
   Value: [Naver에서 받은 인증 코드]
   Environment: Production, Preview, Development 모두 선택
   ```

4. **Save** 버튼 클릭

⚠️ **중요**: 
- Value에 따옴표(`"`)를 포함하지 마세요
- 공백이 포함되지 않도록 주의하세요
- Environment는 **모두 선택**하는 것을 권장합니다

#### 2-3. 재배포 (Redeploy)

환경변수를 추가한 후 **반드시 재배포**해야 합니다:

1. Vercel Dashboard → **Deployments** 탭
2. 최신 배포 항목의 `...` 메뉴 클릭
3. **Redeploy** 선택
4. 재배포 완료까지 대기 (약 1-2분)

또는 자동으로 새로운 배포가 트리거되도록 Git에 푸시:

```bash
git add .
git commit -m "chore: SEO verification 환경변수 추가"
git push
```

---

### 3. 배포된 사이트에서 메타 태그 확인

재배포 완료 후:

1. `https://subeomdev.vercel.app` 접속
2. 페이지 소스 보기 (Ctrl+U 또는 Cmd+Option+U)
3. `<head>` 섹션에서 메타 태그 확인:

```html
<!-- Google Search Console -->
<meta name="google-site-verification" content="YOUR_GOOGLE_CODE" />

<!-- Naver Search Advisor -->
<meta name="naver-site-verification" content="YOUR_NAVER_CODE" />
```

✅ 메타 태그가 보인다면 성공입니다!

---

### 4. Google Search Console에서 인증 확인

1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 선택 (`https://subeomdev.vercel.app`)
3. **속성 설정** → **소유권 확인** 클릭
4. **확인** 버튼 클릭

✅ **인증 성공**: 속성 목록에 사이트가 표시되고, "소유 확인됨" 상태로 표시됩니다.

---

### 5. Naver Search Advisor에서 인증 확인

1. [Naver Search Advisor](https://searchadvisor.naver.com/) 접속
2. **사이트 설정** → **사이트 소유 확인** 클릭
3. **확인** 버튼 클릭

✅ **인증 성공**: 사이트 목록에 표시되고, "소유 확인됨" 상태로 표시됩니다.

---

## 🔍 인증 실패 시 확인사항

### 메타 태그가 보이지 않는 경우

1. **Vercel 환경변수 확인**
   - Key 이름이 정확한지 확인 (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`)
   - Value에 따옴표나 공백이 없는지 확인
   - Environment가 올바르게 선택되었는지 확인

2. **재배포 확인**
   - 환경변수 추가 후 반드시 재배포했는지 확인
   - 배포가 완료되었는지 확인

3. **캐시 문제**
   - 브라우저 캐시 삭제 후 재시도
   - 시크릿 모드에서 확인

### 인증 코드가 일치하지 않는 경우

1. **코드 확인**
   - Google/Naver에서 제공한 원본 코드 확인
   - 복사-붙여넣기 과정에서 문자 누락이나 추가가 없었는지 확인

2. **환경변수 확인**
   - `.env.local` 파일의 값 확인
   - Vercel Dashboard의 환경변수 값 확인

---

## ✅ 인증 완료 후 작업

인증이 완료되면 다음 작업을 진행할 수 있습니다:

### Google Search Console
- **Sitemap 제출**: `https://subeomdev.vercel.app/sitemap.xml`
- **URL 검사**: 개별 페이지 색인 요청
- **성능 모니터링**: 검색 순위 및 클릭률 확인

### Naver Search Advisor
- **Sitemap 제출**: `https://subeomdev.vercel.app/sitemap.xml`
- **URL 등록**: 개별 페이지 등록 요청
- **수집 현황**: 색인 상태 확인

---

## 📝 체크리스트

- [ ] 로컬 `.env.local`에 환경변수 등록 완료
- [ ] Vercel Dashboard에 환경변수 등록 완료
- [ ] Vercel 재배포 완료
- [ ] 배포된 사이트에서 메타 태그 확인
- [ ] Google Search Console 인증 완료
- [ ] Naver Search Advisor 인증 완료
- [ ] Google Search Console에 Sitemap 제출
- [ ] Naver Search Advisor에 Sitemap 제출

---

## 관련 파일

- `src/app/layout.tsx`: 메타데이터 및 verification 설정
- `src/app/sitemap.ts`: 동적 사이트맵 생성
- `src/app/robots.ts`: 로봇 파일 생성
- `.env.local`: 로컬 환경변수 (Git에 커밋하지 않음)

