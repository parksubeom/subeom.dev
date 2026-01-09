fix: 코드 품질 개선 및 타입 안전성 강화

- GitHub 프로필 링크를 parksubeom으로 변경
- 트위터 링크 제거 (Footer, 타입 정의)
- Resume 다운로드 기능 제거 (Hero, About 페이지, 프로필 설정)
- 프로젝트 폴더 구조 문서 추가 (FOLDER_STRUCTURE.md)

린터 에러 수정:
- skills-section.tsx: 사용하지 않는 Profile 타입 제거
- input.tsx: 빈 인터페이스를 type으로 변경
- post-card.tsx: 사용하지 않는 ThumbsUp import 제거
- MDX 관련 파일들: any 타입을 적절한 타입으로 변경
- about-page.tsx: 따옴표 HTML 엔티티로 이스케이프
- post-interaction.tsx: 사용하지 않는 postId 변수 처리
- project-filter.tsx: 사용하지 않는 useState import 제거

타입 안전성 개선:
- projects.ts: Supabase 타입 캐스팅을 unknown을 거쳐 안전하게 처리
- 모든 함수에 null 체크 추가

