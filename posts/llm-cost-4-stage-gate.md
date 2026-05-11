---
slug: "llm-cost-4-stage-gate"
title: "세션당 LLM 비용을 ~10× 줄인 4단 게이트 — claude-distill 의 비용 모델 설계"
excerpt: "매 세션 자동 실행되는 Stop hook 의 비용 부담을 4단 게이트(재귀 가드 → dedup → 휴리스틱 → Haiku)로 사전 차단. 본 추출 호출 비율을 ~10% 로 줄여 세션당 평균 비용을 ~$0 가까이 만든 설계."
tags: ["LLM", "Cost Optimization", "Claude API", "Heuristics", "System Design"]
date: "2026-05-11"
---

## "Zero-effort" 가 진짜 zero-effort 가 되려면

[claude-distill](https://www.npmjs.com/package/claude-distill) 은 매 세션 종료 시 transcript 를 자동으로 분석해 knowledge.md / gotchas.md 에 entry 를 누적하는 npm CLI 다. 핵심 가치는 사용자가 첫 `init` 한 번을 빼면 아무 액션도 하지 않아도 된다는 점.

문제는 "자동" 의 비용이었다. 매 세션 transcript 를 그대로 Sonnet 으로 분석하면 세션당 약 $0.10 가 든다. 하루 평균 5~10 세션이면 한 달에 $15~30. 혼자 쓰기엔 부담이고 다른 사람에게 추천하기엔 더 부담이다. "Zero-effort 가 진짜 zero-effort 가 되려면 비용도 zero 에 가까워야 한다" 는 게 출발점이었다.

이 글은 본 추출 호출 비율을 ~10% 로 줄여 세션당 평균 비용을 ~$0 가까이 만든 4단 게이트 설계 이야기다.

## 가정 — "대부분의 세션은 인사이트가 없다"

내가 하루에 Claude 와 5~10 세션을 한다면 그중 진짜 새로 배우는 게 있는 세션은 1~2 개 정도다. 나머지는

- 짧은 질문 답변 (`이 함수 이름 뭐가 좋을까`)
- 단순 코드 수정 (`이 변수명만 바꿔줘`)
- 검색성 질의 (`A 와 B 차이 알려줘`)

이런 세션의 transcript 를 LLM 으로 분석해봐도 `confidence:high` entry 가 나올 가능성은 거의 0 이다. 본 추출 호출 자체가 낭비다.

이 가정이 맞다면 본 추출 전에 "이 세션은 분석할 가치가 있는가" 를 저비용으로 판별하면 된다. 잘못 판별해서 false negative 가 발생해도(인사이트 있는 세션을 놓쳐도) 손실은 크지 않다 — 다음에 비슷한 함정이 또 발생하면 그때 잡으면 된다.

## 4단 게이트의 구조

```text
세션 끝
  └─ Stop hook → claude-distill analyze --quiet
     │
     ├─ [0. 재귀 가드]   CLAUDE_DISTILL_CHILD 환경변수 검사 (0 비용)
     ├─ [1. dedup]       같은 슬라이스 SHA1 해시 매칭 (0 비용)
     ├─ [2. 휴리스틱]    turn 수 / 도구 사용 / 에러 키워드 (0 비용)
     ├─ [3. Haiku 게이트] yes/no 1토큰 응답 (~$0.0001)
     │
     └─ 본 추출 (Sonnet/Opus) (~$0.10)
```

먼저 무료 또는 거의 무료인 단계를 통과해야 비싼 LLM 호출에 도달한다. 통과율이 단계마다 줄어들도록 설계했다.

## 단계 0 — 재귀 가드 (필수 안전장치)

`distill` 이 분석을 위해 `claude --print` 를 자식 프로세스로 spawn 한다. 그런데 자식 claude 의 종료에도 Stop hook 이 발동한다. 가만 두면 무한 재귀.

해결은 환경변수 한 줄.

```js
if (process.env.CLAUDE_DISTILL_CHILD) {
  process.exit(0);
}
```

자식을 spawn 할 때 `CLAUDE_DISTILL_CHILD=1` 을 주입한다. 자식 프로세스의 환경은 부모로부터 상속되므로 깔끔하게 전달된다. 비용은 0, 안전성은 무한 재귀 방지.

이건 게이트라기보단 안전장치지만, 가장 먼저 검사해야 다른 단계가 의미를 가진다.

## 단계 1 — Slice 단위 dedup (idempotency 보장)

Stop hook 은 어떤 경우 같은 transcript 를 두 번 트리거할 수 있다 — 사용자가 강제 종료 후 재시작했다거나, 다른 도구가 또 hook 을 부른다거나. 같은 slice 를 두 번 분석할 이유가 없다.

각 세션 분석 시 transcript 의 마지막 user marker 이후 부분을 slice 로 정의하고, 그 slice 의 SHA1 12자를 해싱해 `~/.claude/.distill/analyzed.json` 에 기록한다.

```js
const sliceHash = sha1(slice).slice(0, 12);
const analyzed = JSON.parse(fs.readFileSync(analyzedPath));
if (analyzed.hashes.includes(sliceHash)) {
  process.exit(0);
}
```

**중요한 디테일: transcript 내용은 저장하지 않는다.** 해시 12자만. 프라이버시 보장 + 디스크 부담 0. 누적된 해시 기록이 10MB 를 넘으면 오래된 것부터 잘라낸다.

비용 0, idempotency 보장, 그리고 부수 효과로 무한 재귀의 2차 방어선 역할도 한다(환경변수가 어떤 경로로 누락돼도 dedup 가 막아준다).

## 단계 2 — 휴리스틱 (가장 큰 이득)

가장 큰 효과를 낸 단계. 무료(LLM 호출 없음)인데도 전체 세션의 ~70% 를 차단한다.

세 가지 신호를 본다.

**1. Turn 수 임계값**

```js
if (turnCount < MIN_TURNS) {  // 기본 5
  process.exit(0);
}
```

5 turn 이하의 짧은 세션은 거의 인사이트가 없다. dogfood 로 튜닝한 임계값.

**2. 도구 사용 카운트**

assistant 라인에서 tool_use 가 0번이면 거의 단순 질의응답이다. 새로운 기술적 발견이 나올 가능성이 낮다.

```js
const toolUses = countToolUses(transcript);
if (toolUses === 0) {
  process.exit(0);
}
```

**3. 에러 키워드 매칭**

가장 가치 있는 인사이트는 에러를 만났을 때 나온다. transcript 본문에 에러 키워드(`Error`, `failed`, `undefined`, `cannot`, `traceback` 등) 가 하나도 없으면 트러블슈팅이 발생하지 않은 세션일 가능성이 높다.

```js
const errorKeywords = /Error|failed|undefined|cannot|traceback|exception/i;
if (!errorKeywords.test(transcript)) {
  process.exit(0);
}
```

세 신호 중 하나라도 통과 못 하면 즉시 종료. 무료에서 70% 컷.

**주의 — false negative 의 인정**

이 휴리스틱은 보수적이다. 도구 사용 0 인 토론 세션, 에러 없는 설계 결정 세션 등에서 false negative 가 발생할 수 있다. 의도적인 트레이드오프다. 비용을 줄이는 게 우선이고, 놓친 인사이트는 `claude-distill analyze --no-gate` 로 수동 분석할 수 있는 escape hatch 를 제공한다.

## 단계 3 — Haiku 게이트 (선택적)

휴리스틱을 통과한 세션 중에서도 분석할 만한 비율은 ~30~50% 정도다. 여기에 한 단계 더 — Haiku 1토큰 yes/no 응답으로 최종 판별.

```js
const prompt = `
다음 transcript 에 confidence:high 로 분류할 만한 인사이트가 있는가?
yes 또는 no 한 단어로만 답하라.

--- transcript ---
${slice.slice(0, 2000)}
--- end ---
`;

const response = await haiku.complete({
  prompt,
  max_tokens: 1,
  stop: ['\n']
});

if (response.text.trim().toLowerCase() !== 'yes') {
  process.exit(0);
}
```

응답이 1토큰이라 호출당 비용이 사실상 0 에 가깝다(~$0.0001). Haiku 가 빠르고(<1초) 정확도도 충분히 높다. `ANTHROPIC_API_KEY` 가 설정된 사용자에게만 활성화되는 선택적 단계다(CLI fallback 사용자는 단계 2 까지만 적용).

이 단계까지 통과하면 본 추출 호출에 도달한다.

## 본 추출 — Sonnet/Opus

```text
prompt: ~85K chars (~20K tokens) input + ~2K tokens output
비용: Sonnet 기준 약 $0.10/세션
```

JSON 응답을 받아 `confidence:high` entry 만 markdown 에 append. `medium` / `low` 는 drop. 사용자 손이 가지 않도록 보수적으로.

## 게이트별 통과율 (실측)

dogfood 7일간의 분포를 측정해봤다.

| 단계 | 통과율 | 누적 통과율 | 단계별 비용 |
|---|---|---|---|
| 0. 재귀 가드 | 99% | 99% | 0 |
| 1. dedup | 95% | 94% | 0 |
| 2. 휴리스틱 | 30% | 28% | 0 |
| 3. Haiku 게이트 | 35% | 10% | ~$0.0001 |
| 본 추출 | 100% | 10% | ~$0.10 |

전체 세션의 ~10% 만 본 추출에 도달한다. 세션당 평균 비용은 다음과 같다.

```text
평균 = (90% × 0) + (10% × 0.10) = $0.01
```

사실상 $0 에 가깝다. 한 달 150 세션 기준 $1.5. 부담 없이 누구에게나 추천할 수 있는 수준이 됐다.

## 일반화 — LLM 자동화의 비용 모델 패턴

claude-distill 외의 상황에도 적용 가능한 일반 원칙을 정리하면 다음과 같다.

**1. "대부분은 인사이트가 없다" 가정을 의심하지 말자.**

자동화 도구는 정의상 빈번하게 트리거된다. 빈번한 호출의 대부분은 무의미하다 — 이건 거의 모든 도메인에서 성립한다(로그 분석, 알림 시스템, 이상 탐지 등). 가정을 받아들이고 그 위에 게이트를 쌓는 게 효율적이다.

**2. 비용 계단식 구조**

게이트는 비용이 낮은 순서대로 배치한다. 0 비용 → 거의 0 → 작음 → 본 호출. 비싼 호출에 도달하기 전에 최대한 컷.

**3. 휴리스틱이 가장 비용 대비 효과적**

무료 휴리스틱이 ~70% 컷을 만들었다. LLM 호출 추가는 그 위에 보조적으로 얹는 정도가 좋다. "휴리스틱 → LLM" 순서지 그 반대가 아니다.

**4. False negative 를 의도적으로 받아들이고 escape hatch 제공**

완벽한 분류기는 비싸다. 90% 만 잡아도 충분하다는 트레이드오프를 명시적으로 받아들이고, 놓친 경우를 위한 수동 escape hatch (`--no-gate` 같은 옵션) 를 제공한다.

**5. 데이터 미저장으로 프라이버시 + 디스크 부담 동시 해결**

dedup 에 transcript 가 아니라 해시만 저장. 프라이버시 보장 + 디스크 부담 0 + 부수적으로 무한 재귀의 2차 방어선.

## 결론

claude-distill 의 가치 제안 중 가장 강한 한 줄은 "**세션당 평균 비용 ~$0**" 이다. 이게 가능한 건 4단 게이트 덕분이고, 4단 게이트가 가능한 건 "대부분의 세션은 인사이트가 없다" 는 가정을 받아들였기 때문이다.

기능을 만드는 것보다 **기능이 영향을 주는 비용 모델을 설계하는 것** 이 사용자에게 더 큰 가치를 줄 때가 많다. Stop hook 처럼 빈번하게 트리거되는 자동화에서는 특히 그렇다.

설계 패턴은 다른 LLM 자동화 도구에도 그대로 적용 가능할 것이다. 코드는 [github.com/parksubeom/claude-distill](https://github.com/parksubeom/claude-distill) 에 모두 공개되어 있다 — 코드 50KB 미만이라 가볍게 검수 가능하다.
