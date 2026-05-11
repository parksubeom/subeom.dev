---
slug: "claude-skills-panel-build-story"
title: "Claude Code 슬래시 커맨드 30개를 외우다가 결국 도구를 만들었다 — Claude Code Skills Panel 개발기"
excerpt: "기억할 커맨드가 30개를 넘어가면서 시작된 페인 포인트. 7일 만에 v0.20에서 v0.44.6까지 45개 릴리즈를 거치며 4개 IDE · 4개 언어로 배포한 1인 사이드 프로젝트의 압축 사이클."
tags: ["VS Code Extension", "Claude Code", "Developer Tools", "JavaScript", "Vanilla JS", "i18n"]
date: "2026-05-11"
---

## 시작은 작은 마찰이었다

Claude Code는 모든 기능을 슬래시 커맨드로 트리거하는 구조다. `/full-flow`, `/commit-prepare`, `/security-review` 같은 명령들이 본인이 작성한 SKILL, 설치한 플러그인, 마켓플레이스에서 받은 패키지에 흩어져 있다. 처음에는 5~6개 정도였다. 외울 만했다.

문제는 플러그인을 하나씩 설치할 때마다 커맨드가 함께 늘어난다는 점이었다. 어느 순간 `~/.claude/` 안의 SKILL과 commands를 다 합치면 30개를 넘어갔다. "이번에 쓸 만한 게 뭐였더라" 하고 디렉토리를 뒤지는 시간이 자꾸 누적됐다.

도구를 만드는 사람의 직업병이라고 해야 할까. 같은 짜증을 세 번째 겪었을 때 결심했다. "자주 쓰는 커맨드만 한눈에 보고 클릭으로 실행하면 어떨까."

## MVP — 7일 전의 v0.20.0

첫 버전은 단순했다.

1. `~/.claude/skills/<name>/SKILL.md` 와 `~/.claude/commands/<name>.md` 를 재귀 스캔
2. 발견한 커맨드를 카드 그리드로 렌더링
3. 클릭하면 클립보드에 `/command-name` 복사

VS Code Extension API의 Webview만으로 충분했다. 단일 `extension.js` 약 200줄. 일주일 뒤 1,700줄이 될 거라고는 그때 예상하지 못했다.

## v0.39 — Auto 모드의 실패

처음에 욕심을 부렸다. 카드를 클릭하면 클립보드 복사가 아니라 **자동으로 채팅창에 입력까지** 되면 어떨까. macOS는 `osascript`, Windows는 `SendKeys`, Linux는 `xdotool` 로 키 입력을 시뮬레이션할 수 있다.

세 OS 분기 처리를 다 만들고 환호했다. 그런데 Claude Code의 채팅 입력창이 React 컴포넌트라는 게 문제였다. 시스템 레벨 키 입력은 React의 controlled input에서 종종 무시되거나 중간에 잘렸다. 어떤 환경에서는 잘 되고 어떤 환경에서는 안 됐다.

3일을 디버깅하다가 결정했다. 잘 안 되는 기능보다 잘 되는 기능이 낫다. v0.39에서 Auto 모드를 삭제하고 두 가지로 좁혔다.

- `▶ Paste`: 클립보드 복사 후 활성 입력창에 자동 붙여넣기 (이건 안정적이었다)
- `▶💬 Term`: 활성 터미널로 직접 전송. 터미널에서는 키 입력이 항상 작동한다.

기능을 빼는 결정이 가장 어려웠지만 가장 옳았다.

## v0.40.0 — `window.confirm()` 이 조용히 막혔다

설정 import 기능을 만들 때였다. 사용자가 잘못된 JSON 을 붙여넣을 수 있으니 "정말 덮어쓸까요?" 확인 모달이 필요했다. `window.confirm()` 한 줄이면 끝나는 일이다. 적어도 일반 웹에서는.

VS Code 와 Cursor의 Webview는 `window.confirm()` 을 **조용히 차단한다**. 에러도 안 띄운다. 그냥 함수가 호출되고 `false` 가 반환되는 것처럼 동작한다. Reincarnate(전체 초기화), 그룹 삭제, 설정 import — 게이팅이 필요한 세 흐름이 모두 아무 반응 없이 실패하고 있었다.

해결은 자체 픽셀 confirm 모달을 만드는 것뿐이었다. z-index 를 다른 모달보다 높게 두고, 키보드(Enter/Esc) 까지 처리. 모든 게이팅 흐름이 정상화됐다. **Webview 는 일반 브라우저가 아니라는 인식의 시작** 이었다.

## v0.44.5 — JSONL의 `promptId` 가 항상 null이었다

토큰 사용량 추적 기능을 도입하면서 가장 큰 함정을 만났다.

Claude Code 는 모든 세션 transcript 를 `~/.claude/projects/*.jsonl` 에 append-only 형식으로 저장한다. 각 라인은 user / assistant 메시지이고, assistant 라인에는 `message.usage` 필드에 토큰 사용량이 들어있다. 사용자 메시지에는 `<command-name>` 마커가 있다. 둘을 매칭하면 슬래시 커맨드별 토큰 사용량을 알 수 있을 것이다.

처음 설계는 `promptId` 매칭이었다. user 라인과 assistant 라인 모두 `promptId` 가 있으니 그걸로 묶으면 된다고 가정했다. 코드를 다 짜고 실행했더니 카드 라벨이 전부 비어있었다.

디버그 로그를 찍어봤다.

```text
user <command-name> markers: 7
assistant w/ usage: 1042
matching promptIds: 0
```

7개 마커, 1042개 assistant 응답. 매칭 0건. assistant 라인의 `promptId` 가 **항상 `null`** 이었다.

다행히 JSONL 의 모든 라인에는 `uuid` 와 `parentUuid` 가 있다. 응답이 어느 메시지의 답변인지 트리 구조로 추적 가능. `promptId` 인덱스를 폐기하고 두 개의 Map 으로 교체했다.

```js
const uuidToCmd = new Map();        // user 라인의 <command-name> 마커
const uuidToParent = new Map();     // 모든 라인의 부모 uuid
```

assistant 라인을 만나면 `parentUuid` 부터 부모 체인을 최대 100홉까지 거슬러 올라가, 가장 가까운 command 마커에 사용량을 귀속시킨다. 첫 시도에서 단일 세션 `/full-flow` 의 누적 토큰이 203M 으로 잡혔다. 통계 수집 성공.

## v0.44.6 — 누적 토큰이 답하지 못한 질문

기능은 됐는데 사용자 입장에서 보니 라벨이 이상했다.

```text
/full-flow         203M tokens
/commit-prepare     45M tokens
/security-review    12M tokens
```

"`/full-flow` 가 무겁다" 가 진짜 질문이 아니었다. 진짜 질문은 **"어떤 스킬이 한 번 부를 때 가장 비싼가"** 였다. 많이 부른 스킬이 누적으로 무겁게 보일 뿐이었다.

회당 평균(`총합 ÷ 호출 횟수`)으로 메트릭을 다시 정의했다.

```text
/full-flow         22.6M tok/run   (호출 9회)
/commit-prepare     1.2M tok/run   (호출 38회)
/security-review    3.0M tok/run   (호출 4회)
```

같은 데이터, 같은 코드. 사용자 인지는 완전히 달라졌다. 이 경험이 이번 프로젝트에서 가장 큰 학습이었다 — **메트릭의 정의가 기능보다 중요할 수 있다.** 정렬, 주간 리포트, 툴팁 모두 동일 메트릭으로 통일했다.

## 보안 다층 방어

자체 보안 리뷰에서 발견한 세 가지 표면을 외부 노출 전에 패치했다.

**Prototype pollution**: webview 메시지의 `msg.name` 을 동적 키로 사용하던 `saveConfig` 가 문제였다. `__proto__` / `constructor` / `prototype` 을 거부하는 `DANGEROUS_KEYS` 가드를 추가하고, 설정 import 시 재귀로 스트립.

**HTML escape**: 서드파티 마켓플레이스 카탈로그(`name`, `description`, `category` 등) 모든 필드를 webview 에 주입하기 전 `& < > " '` 풀 커버리지로 escape.

**Path traversal**: `resolveIconPath` 가 `ICONS_DIR` 경계를 벗어나는 절대 경로나 `../` 시도를 모두 `null` 로 차단.

세 가지 모두 결국 같은 원칙의 다양한 적용이었다. **"Webview 는 외부 코드 실행 환경이며, 내부에서 들어오는 모든 경계 데이터는 검증한다."**

## 픽셀 게이미피케이션 — Buddy Yard

기술적 도전과는 별개로 사이드 프로젝트의 즐거움도 챙기고 싶었다. 사용자의 슬래시 커맨드 사용 패턴을 분석하면 본인이 "어떤 스타일의 개발자"인지 분류할 수 있겠다는 생각이 들었다.

`/refactor` 를 많이 쓰면 — 정밀한 검사(Inspector)
`/debug` 가 많으면 — 추적의 닌자(Tracker)
`/full-flow` 가 많으면 — 통섭의 마법사(Architect)

이런 식으로 10개 RPG 클래스를 만들었다. LV.1 견습 → LV.5 전설까지 5단계 성장. Claude 가 작업 중일 때는 사이드 스크롤러 식 몬스터 배틀이 펼쳐진다. 8-bit 차임으로 작업 완료를 알리고. 도구지만 도구만은 아닌 무언가가 됐다.

10개 클래스의 공격 모션은 단일 `ATTACK_EFFECTS` 맵 + 3개 키프레임(`projectile` / `melee` / `aura`)으로 추상화했다. CSS Custom Properties(`--dx`, `--dy`)로 발사체 궤적을 계산하면 코드 한 줄 추가로 새 클래스 공격을 정의할 수 있다.

## 7일간의 압축

전체 타임라인을 다시 보면 비현실적이다.

- **2026-05-03**: v0.20.0 MVP (~200줄)
- **2026-05-10**: v0.44.6 (~1,700줄, 45개 릴리즈)
- 평균 하루 6건의 의미 있는 변경
- 4개 IDE × 2개 마켓플레이스 배포 — VS Code · Cursor · Windsurf · VSCodium / VS Code Marketplace · OpenVSX
- 4개 언어 i18n 220+ 키 — en / ko / ja / zh, 키 파리티 검증 스크립트로 회귀 방지

이게 가능했던 이유는 단 하나다. **Claude Code 자체를 도구로 활용해서 만들었다.** 기획 → 구현 → 테스트 → 문서 → 배포 사이클을 1인 페이스로 돌릴 수 있었던 건 AI 협업 워크플로의 가능성을 실증한 셈이다. 도구가 곧 도구의 사용자인 메타적 구조에서 가장 많은 인사이트를 얻었다.

GitHub Actions 로 `vX.Y.Z` 태그를 푸시하면 `vsce package` → Marketplace · OpenVSX 병렬 배포 + GitHub Release `.vsix` 자동 첨부까지 완전 자동화. 수동 작업 0.

## 사용자 반응

배포 직후의 작은 사이드 프로젝트치고는 분에 넘치는 반응을 받았다.

- **Open VSX 누적 3,762 다운로드** (글 작성 시점, VS Code Marketplace 합산 3800+)
- **평점 5.0/5.0** (리뷰 1건이지만 만점)
- **243+ 플러그인이 검색 가능한 통합 마켓플레이스 브라우저** 기능에 대한 긍정 피드백

VS Code Marketplace 다운로드 수치는 별도 카운트되니 합산하면 더 많을 거다. 첫 주에 이 정도면 만족스럽다.

## 회고

만들기 전에는 "기능이 곧 가치"라고 막연히 생각했다. 만들고 나니 다른 결론이 남았다.

- **기능보다 메트릭의 정의가 더 큰 인지 변화를 만든다.** 누적 토큰 → 회당 평균 전환이 그 증거.
- **기능을 빼는 결정이 가장 어렵고 가장 옳다.** Auto 모드 삭제의 교훈.
- **Webview의 모든 제약은 우회가 아닌 일관된 원칙으로 환원해야 한다.** confirm 차단, CSP, 메시지 패싱 보안, prototype pollution 가드, HTML escape, path traversal — 결국 한 줄짜리 원칙의 다양한 적용이었다.

레포는 [github.com/parksubeom/claude-skills-panel](https://github.com/parksubeom/claude-skills-panel) 에 있다. 설치는 VS Code / Cursor / Windsurf 의 확장 마켓에서 "Claude Code Skills Panel" 검색.
