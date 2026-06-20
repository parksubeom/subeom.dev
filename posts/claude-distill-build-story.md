---
slug: "claude-distill-build-story"
title: "Claude에게 같은 함정을 세 번째 설명하다가 만든 npm CLI — claude-distill 개발기"
excerpt: "매 세션 휘발되는 결정·페일·노하우를 자동 누적하는 Stop hook 기반 글로벌 CLI. 4단 게이트로 비용 ~10× 절감하고, 첫 배포 3일 만에 주간 16 다운로드를 기록했다."
tags: ["Claude Code", "npm CLI", "Anthropic API", "Hooks", "Meta Tooling", "i18n"]
date: "2026-05-11"
---

## 같은 설명을 또 하고 있었다

Claude Code 로 일을 하다 보면 매번 같은 함정을 가르치게 된다.

- "`Cursor` 빌트인 Claude 는 PATH 에 `claude` 바이너리가 안 보이니까 API 키를 써."
- "`promptId` 는 항상 `null` 이라 `uuid` 체인으로 매칭해야 해."
- "`ffmpeg cropdetect` 는 어두운 padding 에서 `limit` 을 32 이상으로 줘야 해."

세션이 끝나면 transcript 와 함께 다 휘발된다. 다음 세션의 Claude 는 어제의 Claude 가 아니다. 매일 새로 출근하는 알바생이라고 생각하면 정확하다. 어제 가르친 요령을 오늘 또 설명하고 있는 자신을 발견한 게 세 번째였을 때, 결심했다.

`CLAUDE.md` 를 매번 갱신하면 된다고 누가 말할 수 있다. 맞는 말이다. 그런데 솔직히 안 한다. 마찰이 크다. 흐름이 끊긴다. 한 줄 추가하려고 에디터를 열고 카테고리를 고민하고 — 실제로 그 일이 일어나는 빈도는 거의 0 에 가까웠다.

자동화 가능한 일이라면 자동화하는 게 옳다.

## 컨셉 — 인수인계 노트의 자동화

세 종류의 markdown 을 구분해서 봤다.

| 파일 | 역할 | 작성 |
|---|---|---|
| `CLAUDE.md` | 법률 — 변하지 않는 보편 규칙 | 사람이 직접 |
| `knowledge.md` | 판례 — "이 상황엔 이렇게 했다" | 자동 누적 |
| `gotchas.md` | 사고 보고서 — "같은 실수 반복 금지" | 자동 누적 |

법률은 사람이 쓴다. 변하지 않으니까. 그런데 판례와 사고 보고서는 매일 쌓이는 것이다 — 그건 자동화될 수 있다.

설치 한 번 → 세션 끝날 때마다 transcript 자동 분석 → markdown 에 append → 다음 세션 시작 시 `CLAUDE.md` 의 `@reference` 로 자동 inject. 사용자 액션은 첫 `claude-distill init` 한 번이 끝.

## Stop hook 의 발견

Claude Code 에는 `~/.claude/settings.json` 에 hook 을 등록할 수 있는 메커니즘이 있다. 그중 `Stop` hook 은 매 세션 종료 직전에 자동으로 실행된다. 이게 핵심 발견이었다.

```json
{
  "hooks": {
    "Stop": [
      { "command": "claude-distill analyze --quiet" }
    ]
  }
}
```

사용자가 명시적으로 명령을 칠 필요가 없다. 그저 평소처럼 대화하다가 세션을 끝내면, 그 transcript 가 자동으로 분석되어 noteworthy entry 들이 markdown 에 추가된다. **Zero-effort 가 진짜 zero-effort 가 되는 조건** 이 갖춰졌다.

문제는 비용이었다.

## 문제 1 — 매 세션 LLM 호출이 너무 비싸다

Stop hook 은 매 turn 이 아니라 매 세션마다 발동된다. 하루 평균 5~10 세션이라 치고, 모든 세션을 Sonnet 으로 분석하면 세션당 약 $0.10. 한 달이면 $15~30. 혼자 쓰기엔 부담이고 다른 사람에게 추천하기엔 더 부담이었다.

가정을 세웠다. **"대부분의 세션은 인사이트가 없다."** 짧은 질의응답, 코드 한 줄 수정, 단순 검색 — 이런 세션의 transcript 를 분석해봐야 confidence:high entry 가 나올 가능성은 거의 0 이다. 본 추출 호출 전에 사전 차단하면 비용을 크게 줄일 수 있다.

4단 게이트를 설계했다.

```text
세션 끝
  └─ Stop hook → `claude-distill analyze --quiet`
     ├─ [재귀 가드] 자식 claude 세션이면 즉시 종료
     ├─ [중복 방지] 같은 슬라이스 이미 분석됐으면 종료
     ├─ [게이트 1 — 휴리스틱] 짧은 세션 / 도구 사용 0 / 에러 키워드 0 → 종료
     ├─ [게이트 2 — Haiku] (API key 있을 때) yes/no 1토큰 응답, no면 종료
     ├─ 마지막 user marker 이후 turn slice (~120 turns / ~85K chars)
     ├─ Sonnet/Opus 로 analyzer prompt 전달, JSON 응답 파싱
     ├─ confidence:high entry → ~/.claude/knowledge.md / gotchas.md append
     └─ medium / low → drop
```

게이트 1 은 무료(휴리스틱), 게이트 2 는 1토큰 응답이라 사실상 무료에 가깝다. 본 추출 호출이 ~10× 줄었다. 세션당 평균 비용이 ~$0 가까이로 떨어졌고, 게이트를 통과한 의미 있는 세션만 ~$0.10 가 든다.

## 문제 2 — 무한 재귀의 함정

처음 배포 직후 사용자(나) 머신이 멈췄다. CPU 100%, claude 프로세스가 수십 개. 디버깅해보니 명확했다.

- distill 이 분석을 위해 `claude --print` 를 spawn 한다
- spawn 된 자식 claude 가 작업을 끝내고 종료한다
- 자식 claude 의 종료에도 Stop hook 이 발동한다
- Stop hook 이 다시 distill 을 호출한다
- distill 이 또 자식 claude 를 spawn 한다
- 무한 재귀…

해결은 단순했지만 두 겹으로 방어해야 했다.

**1차 방어: 환경변수**

distill 이 자식을 spawn 할 때 `CLAUDE_DISTILL_CHILD=1` 환경변수를 주입한다. 모든 distill 실행 첫 단계에서 이 변수를 검사하고, 있으면 즉시 종료. 자식 프로세스의 환경은 부모로부터 상속되므로 깔끔하게 전달된다.

**2차 방어: dedup hash**

같은 transcript slice 를 SHA1 12자로 해싱해 `~/.claude/.distill/analyzed.json` 에 기록한다. **transcript 내용은 저장하지 않고 해시만**. Stop hook 이 어떤 이유로든 같은 슬라이스를 다시 분석하려 하면 hash 매칭으로 즉시 종료. 프라이버시도 함께 보장된다.

단일 가드는 언제든 깨질 수 있다. 환경변수가 어떤 경로로 누락되거나 dedup hash 가 충돌해도 다른 한쪽이 막아준다.

## 문제 3 — `promptId` 매칭이 안 됐다

대부분 도구가 Claude Code JSONL transcript 를 다룰 때 처음 가정하는 게 `promptId` 매칭이다. user 라인과 assistant 라인 모두 `promptId` 가 있으니 자연스러운 키 같다.

그런데 실제로 보면 **assistant 라인의 `promptId` 는 항상 `null` 이다**. 디버그 출력을 처음 보고 알았다.

```text
user <command-name> markers: 7
assistant w/ usage: 1042
matching promptIds: 0
```

dataset 의 ~3% 만 promptId 가 채워져 있고 나머지 97% 는 null. 매칭 신호로 쓸 수 없다. 다행히 모든 라인에 `uuid` 와 `parentUuid` 가 있어서 부모 체인을 거슬러 올라가면 가장 가까운 user marker 를 찾을 수 있다. 이게 사실상 표준 패턴이 됐다.

(이 발견은 자체적으로 `gotchas.md` 의 첫 번째 entry 가 됐다. 도구가 도구를 검증한 셈이다.)

## i18n 자동화

다국어 지원에는 두 가지 흔한 함정이 있다.

1. 사용자에게 언어 설정을 강요한다 (설정 마찰)
2. 기술 식별자(enum) 까지 번역해서 파이프라인이 깨진다

이걸 한 번에 해결했다.

**언어 자동 감지** — transcript 의 turn 들에서 한글 음절 비율이 5% 를 넘으면 `ko`, 아니면 `en`. 임계값은 dogfood 로 튜닝했다. 한국어로 코딩하는 세션은 한국어 entry 가 누적되고, 영어 세션은 영어로. 사용자 설정 0.

**기술 식별자 vs 자연어 분리** — 카테고리 enum (`api_quirk`, `trade_off_decision` 등 11개) 은 영어 머신 키로 고정. 자연어 필드(헤더 `상황 / 함정 / 근거`, entry 본문) 만 ko/en 분기. 파이프라인 안정성이 보장되면서 한국어 사용자 진입장벽은 사라진다.

언어 결정 우선순위는 5단계 폴백.

1. `claude-distill analyze --lang=ko|en` (명시 인자)
2. `CLAUDE_DISTILL_LANG=ko|en` 환경변수
3. transcript 자동 감지 (기본)
4. `process.env.LANG` (예: `ko_KR.UTF-8` → `ko`)
5. fallback: `en`

대부분 사용자는 3번 자동 감지로 충분하다.

## 첫 dogfood 결과

스스로 한 주 정도 써본 결과를 검열 없이 공개하는 게 도구의 신뢰도를 가장 빠르게 올린다. README 에 실제 누적된 entry 6건을 그대로 박았다.

```text
⚠️  npm link 가 macOS 기본 prefix 에서 sudo 없이 실패 — 절대경로로 우회
⚠️  Claude Code JSONL 의 promptId 가 항상 null — uuid + parentUuid 체인 사용
⚠️  Cursor 빌트인 Claude 는 PATH 에 `claude` 바이너리를 노출 안 함
🧠  ffmpeg cropdetect 의 limit 은 어두운 padding 에서 ≥32 필요
🧠  Transcript 를 마지막 user marker 부터 slice 하면 분석 prompt ~80% 감소
🧠  CSP `connect-src 'none'` 이 webview 의 외부 fetch 를 이중 차단
```

각 entry 는 `Symptom → Trap → Cause → Workaround` 4단으로 자동 정리된다. 다음 세션의 Claude 가 그대로 읽고 참조 가능한 형태. 분석기 prompt 가 보수적이라 자명한 사실 / 프로젝트 internal trivia / 검증 안 된 추측은 제외된다.

## 의도적으로 뺀 것들

기능을 추가하는 것보다 안 만든 결정이 더 중요할 때가 있다.

**별도 서버 없음** — distill 운영자(나) 에게도 transcript 가 가지 않는다. 본인 머신 → Anthropic API 직통. 운영 비용 0.

**UI 없음** — 결과는 plain markdown 두 개 파일. 마음에 안 드는 entry 는 그 줄을 삭제하면 끝. 락인 없음, 학습 비용 0.

**의존성 0개** — Node 18+ 의 빌트인 fetch 만 사용. 코드 50KB 미만, [GitHub](https://github.com/parksubeom/claude-distill) 에서 그대로 검수 가능. npm 패키지 unpacked 크기 61KB, 13 파일.

이 결정들이 README 의 "왜 부담 없는가" 섹션을 그대로 만들었다.

## 임팩트 — 첫 주 233 다운로드

- v0.4.1 npm 정식 배포 ([npmjs.com/package/claude-distill](https://www.npmjs.com/package/claude-distill))
- 첫 배포 후 3일 만에 **주간 16 다운로드**
- 의존성 0개 · 61KB · 본인 머신에서 실행
- 4단 게이트로 세션당 평균 비용 ~$0
- ko/en i18n 자동 분기

마케팅은 거의 안 했다. README 한 번 다듬은 게 전부. 233 이라는 숫자가 큰 건 아니지만, 첫 주 배포한 메타 도구치고는 분에 넘치는 반응이라고 본다.

## 회고

가장 큰 학습은 "**Zero-effort 가 진짜 zero-effort 가 되려면 게이트가 필수**" 였다. 매 turn 반환되는 Stop hook 환경에서는 비용 컷 메커니즘 자체가 가장 중요한 기능이다. 휴리스틱 + 1토큰 LLM yes/no 2단 구조가 최소 복잡도로 90% 컷을 달성했다는 점이 가장 만족스럽다.

기능을 만드는 것보다 **기능이 영향을 주는 비용 모델을 설계하는 것** 이 진짜 일이었다는 깨달음이 컸다.

두 번째 학습은 메타 도구의 무한 재귀가 흔한 함정이라는 점. 환경변수와 dedup hash 두 겹 방어 설계는 이후 비슷한 도구를 만들 때 일반 패턴으로 정립할 수 있을 것 같다.

세 번째는 i18n 의 핵심이 "기술 식별자 vs 자연어 필드 분리" 라는 점이었다. enum 키 영어 고정, 문장만 분기. 다국어는 데이터 모델 설계 단계에서 결정해야 하지 후처리로 못 한다.

그리고 가장 메타적인 학습 — **도구가 곧 도구의 사용자다.** claude-distill 자체를 Claude Code 로 만들었고, 그 과정에서 발견한 페인 포인트(`promptId` 가 null 이라는 점 등)가 그대로 README 의 첫 번째 dogfood entry 로 들어갔다. 자기 자신이 가장 정직한 첫 사용자일 때 도구의 본질이 드러난다.

설치는 한 줄.

```bash
npm install -g claude-distill && claude-distill init
```
