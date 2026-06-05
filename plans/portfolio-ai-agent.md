# 포트폴리오 전용 AI 에이전트 계획

## 요약
> **요약**: 포트폴리오 헤더 중앙에 `ask me!` 메뉴를 추가하고, 클릭하면 상단 중앙에서 Dynamic Island 스타일 AI 채팅 팝업이 열린다. 이 에이전트는 기존 포트폴리오 데이터에 있는 내용만 답변하고, 지원하지 않거나 관련 없는 질문은 고정 거절 문구로 답변한다.
> **산출물**:
> - `llms.txt`와 채팅 API가 함께 쓰는 포트폴리오 컨텍스트 빌더.
> - 입력 검증, 주제 게이트, 근거 확인, 고정 거절 동작을 포함한 Gemini 기반 서버 API.
> - 헤더의 `ask me!` 버튼으로 열리는 접근 가능한 Dynamic Island 스타일 채팅 팝업.
> - 단위 테스트, API 테스트, UI 테스트, 빌드, 린트, 브라우저 QA 증거.
> **예상 규모**: 중간.
> **병렬화**: 가능. 총 3개 작업 웨이브.
> **크리티컬 패스**: 작업 1 -> 작업 2 -> 작업 3 -> 작업 4 -> 최종 검증.

## 배경

### 원 요청
사용자는 포트폴리오에 대화형 AI를 만들고 싶어 한다. 에이전트는 사용자의 포트폴리오에 대한 내용만 답변해야 한다. 관련 없거나 포트폴리오에서 확인할 수 없는 질문에는 절대 일반 답변을 하지 않고, 그 내용은 확인할 수 없다고 답해야 한다.

### 인터뷰 요약
사용자가 후속 선호 질문에 답하지 않았기 때문에 아래 기본값을 확정한다.

- 상호작용 위치는 포트폴리오 헤더 중앙의 `ask me!` 메뉴다. 클릭하면 상단 중앙에서 Dynamic Island 스타일 채팅 팝업이 애니메이션과 함께 열린다.
- AI 제공자는 Gemini를 우선 사용한다. v1에서는 멀티 provider 추상화를 만들지 않는다.
- 답변 언어는 질문 언어를 따른다. 언어가 섞였거나 불명확하면 한국어로 답변한다.
- 지식 출처는 기존 포트폴리오 소스 파일만 사용한다.
- 검색 방식은 요청 시점에 압축 컨텍스트를 만드는 방식이다. v1에서는 임베딩이나 벡터 DB를 만들지 않는다.
- 연락처 안내는 이메일, GitHub, LinkedIn, contact 페이지까지만 허용한다. 채팅에서는 전화번호를 노출하지 않는다.
- 방문자 데이터는 저장하지 않는다. v1에서는 리드 수집 폼도 만들지 않는다.

### Metis 검토 반영
Metis는 모순은 없지만 범위 경계, 거절 문구, SDK 선택, 라우트 계약, 토큰 길이, 근거 확인, 남용 방지, 개인정보, 접근성, 브라우저 QA가 부족하다고 지적했다. 이 계획은 해당 지점을 고정된 기술 선택과 검증 기준으로 반영한다.

## 작업 목표

### 핵심 목표
포트폴리오 질문에는 유용하게 답하고, 포트폴리오 근거 밖의 질문에는 엄격히 거절하는 대화형 포트폴리오 에이전트를 만든다.

### 산출물
- `src/lib/portfolio-context.ts`: 공유 포트폴리오 컨텍스트 빌더.
- `src/app/llms.txt/route.ts`: 공개 텍스트 의도는 유지하되 공유 빌더를 사용하도록 리팩터링.
- `src/lib/portfolio-assistant.ts`: 주제 게이트, 프롬프트 빌더, provider 래퍼, 응답 근거 확인 helper.
- `src/app/api/assistant/route.ts`: 채팅 요청을 처리하는 `POST` 엔드포인트.
- `src/components/assistant/PortfolioAssistantIsland.tsx`: 클라이언트 Dynamic Island 스타일 채팅 팝업.
- `src/components/home/Header.tsx`: 중앙 `ask me!` 메뉴 트리거와 팝업 상태 연결.
- `src/lib/__tests__`, `src/app/api/assistant/__tests__`, `src/components/assistant/__tests__` 아래의 focused 테스트.
- `checklist.md`와 `context-notes.md`에는 진행 기록만 append 방식으로 추가.

### 완료 정의
- `npx vitest run src/lib/__tests__/portfolio-context.test.ts src/lib/__tests__/portfolio-assistant.test.ts src/app/api/assistant/__tests__/route.test.ts src/components/assistant/__tests__/PortfolioAssistantIsland.test.tsx src/components/home/__tests__/Header.test.tsx`가 0으로 종료된다.
- `npx vitest run`이 0으로 종료된다.
- `npm run lint`가 0으로 종료된다. 실패가 있다면 변경 파일 밖의 기존 실패임을 정확히 증명한다.
- `npm run build`가 0으로 종료된다.
- 실제 로컬 사이트를 브라우저로 열어 데스크톱과 모바일의 헤더 트리거 및 island 동작 스크린샷을 캡처한다.
- 실제 dev server의 `/api/assistant`에 `curl -i`를 호출해 지원 질문, 무관한 질문, 빈 메시지, API 키 누락 fallback을 확인한다.

### 반드시 포함할 것
- 에이전트가 답변할 수 있는 범위는 김상찬 프로필, `chan.works` 포트폴리오 브랜드, 역량, 기술 스택, `projects`에 있는 프로젝트 요약과 상세, 협업 범위, availability, 이메일, GitHub, LinkedIn, contact 페이지, `llms.txt`에 이미 있는 내용이다.
- 에이전트는 날씨, 정치, 일반 코딩 도움, 무관한 개인 질문, 비공개 개인정보, 추측성 주장, 포트폴리오 컨텍스트에 없는 모든 주제를 거절해야 한다.
- 고정 한국어 거절 문구는 `포트폴리오에서 확인할 수 없는 내용입니다. 김상찬의 프로젝트, 기술 스택, 협업 범위, 연락 방법에 대해서만 답변할 수 있습니다.`다.
- 고정 영어 거절 문구는 `I cannot confirm that from the portfolio. I can only answer questions about Kim Sangchan's projects, tech stack, collaboration scope, and contact options.`다.
- 서버는 모델 생성 전과 후에 모두 거절을 강제해야 한다. 프롬프트만으로 거절을 기대하는 설계는 허용하지 않는다.
- Gemini API 키는 서버 전용 `GEMINI_API_KEY`로만 사용한다.
- v1에서는 `@google/genai`와 `gemini-2.5-flash-lite` 모델을 사용한다.
- v1에서는 비스트리밍 단일 턴 응답만 사용한다. 클라이언트는 화면 표시용 로컬 기록을 가질 수 있지만, API에는 최신 사용자 메시지만 보낸다.
- 요청 body schema는 `{ "message": string }`이다.
- 성공 응답 schema는 `{ "answer": string, "refused": boolean, "sources": string[] }`이다.
- 오류 응답 schema는 `{ "message": string }`이다.
- 빈 문자열이나 공백 메시지는 HTTP 400을 반환한다.
- 1,000자를 초과하는 메시지는 HTTP 400을 반환한다.
- Gemini provider가 없거나 실패하면, 사전 게이트에서 결정적 거절이 가능한 경우를 제외하고 HTTP 503과 사용자에게 안전한 메시지를 반환한다.

### 만들지 말 것
- 벡터 DB, 임베딩, 별도 RAG 서비스, 데이터베이스 테이블, 채팅 저장, analytics 수집, 자율 브라우징, 웹 검색, 이력서 생성, 방문자 개인정보 수집, 채팅 내 전화번호 노출을 만들지 않는다.
- 클라이언트 컴포넌트에서 `GEMINI_API_KEY`를 import하거나 노출하지 않는다.
- 넓은 멀티 provider 추상화를 추가하지 않는다.
- 무관한 포트폴리오 레이아웃을 다시 쓰지 않는다.

## 검증 전략
> 검증은 사람이 직접 판정하지 않고 에이전트가 실행 가능한 방식으로 수행한다.

- 테스트 전략은 Vitest, Testing Library, mocked Gemini provider, route handler 테스트 기반 TDD다.
- 모든 작업에는 에이전트가 실행할 수 있는 QA 시나리오가 있어야 한다.
- 증거 경로는 명령과 API transcript의 경우 `evidence/task-{N}-{slug}.txt`, 브라우저 스크린샷의 경우 `evidence/task-{N}-{slug}.png`를 사용한다.
- 브라우저 도구는 Browser plugin 또는 Playwright를 우선 사용한다. Browser를 사용할 수 없으면 dev server를 띄우고 repo의 `npm run browse` 도구를 사용한다.
- API 도구는 `http://localhost:<port>/api/assistant`에 대한 `curl -i`다.
- `package.json`에 `test` script가 없으므로 검증 명령은 `npx vitest run`을 사용한다.

## 실행 전략

### 병렬 실행 웨이브
웨이브 1은 작업 1과 작업 2다. 두 작업은 참조 파일을 읽은 뒤 시작할 수 있지만, 작업 2는 최종 프롬프트 컨텍스트를 확정할 때 작업 1의 export 계약을 사용해야 한다.

웨이브 2는 작업 3과 작업 4다. 작업 3은 작업 1과 2에 의존한다. 작업 4는 작업 3의 API 계약이 고정된 뒤 UI shell 작업을 시작할 수 있다.

웨이브 3은 작업 5, 최종 통합, 브라우저 QA, 문서 정리다.

### 의존성 매트릭스
- 작업 1은 작업 2, 3, 5를 막는다.
- 작업 2는 작업 3과 5를 막는다.
- 작업 3은 작업 4의 API 통합과 작업 5를 막는다.
- 작업 4는 작업 5의 브라우저 QA를 막는다.
- 작업 5는 최종 검증을 막는다.

## TODO

- [ ] 1. 공유 포트폴리오 컨텍스트 빌더 만들기.

  **할 일**: `src/lib/portfolio-context.ts`를 추가하고 첫 줄에 한국어 역할 주석을 둔다. 현재 `src/app/llms.txt/route.ts` 안에 들어 있는 콘텐츠 생성 로직을 재사용 가능한 함수로 옮긴다. `buildPortfolioSummaryText()`, `buildAssistantContext()`, `portfolioAllowedTopics`를 export한다. `buildAssistantContext()`는 프로필 이름, 브랜드, title, tagline, descriptions, proof counters, collaboration scope, strengths, contact email, GitHub, LinkedIn, 각 프로젝트의 id, title, summary, origin, brandSignal, productFlow, keyDecisions, proofSignals, techStack, liveUrl, githubUrl, year, status, focus를 포함해야 한다. 기본값으로 전체 `project.description`은 제외하되 프로젝트마다 600자 이하의 detail excerpt는 포함한다. 전체 컨텍스트는 18,000자로 제한하고, 잘리면 truncation note를 붙인다.

  **하지 말 것**: 임베딩을 만들지 않는다. 런타임에 파일을 읽지 않는다. DB를 추가하지 않는다. 전화번호를 포함하지 않는다. 프로젝트 데이터를 바꾸지 않는다.

  **병렬화**: 가능. 웨이브 1. 작업 2, 3, 5를 막는다. 선행 작업은 없다.

  **참조**:
  - 패턴은 `src/app/llms.txt/route.ts`다. 현재 AI가 읽을 수 있는 포트폴리오 텍스트와 assistant guidance가 있다.
  - 데이터는 `src/data/profile.ts`다. 프로필, 브랜드, 연락처, 강점, 협업 범위가 있다.
  - 데이터는 `src/data/projects.ts`다. 표준 프로젝트 메타데이터와 긴 설명이 있다.
  - helper는 `src/lib/url.ts`다. 표준 사이트 경로 helper다.

  **수용 기준**:
  - [ ] `buildAssistantContext()`가 `김상찬`, `chan.works`, `Synapso.dev`, `AI Doc Agent`, contact email, allowed topic guidance를 포함한다.
  - [ ] `buildAssistantContext()`가 `profile.contact.phone`을 포함하지 않는다.
  - [ ] 컨텍스트 길이가 결정적으로 제한된다.
  - [ ] `src/app/llms.txt/route.ts`가 공유 빌더를 사용하면서도 `text/plain` 포트폴리오 guidance를 계속 반환한다.

  **TDD 테스트**:
  - `src/lib/__tests__/portfolio-context.test.ts`를 추가한다.
  - 테스트 ID는 `includes-core-portfolio-facts`다.
  - 테스트 ID는 `excludes-phone-number-from-assistant-context`다.
  - 테스트 ID는 `caps-context-length`다.
  - 테스트 ID는 `llms-route-uses-shared-summary`다.
  - 구현 전 RED 명령은 `npx vitest run src/lib/__tests__/portfolio-context.test.ts`다.
  - 구현 후 GREEN 명령도 동일하다.

  **QA 시나리오**:
  ```text
  Scenario: llms.txt still serves portfolio context
    Tool: curl
    Steps: curl -i http://localhost:3000/llms.txt
    Expected: HTTP 200, Content-Type text/plain, body contains "김상찬", "Portfolio Projects", and "AI Doc Agent"
    Evidence: evidence/task-1-llms-route.txt

  Scenario: assistant context excludes phone number
    Tool: PowerShell
    Steps: npx vitest run src/lib/__tests__/portfolio-context.test.ts -t excludes-phone-number-from-assistant-context 2>&1 | Tee-Object -FilePath evidence/task-1-context-no-phone.txt
    Expected: test passes and output includes `excludes-phone-number-from-assistant-context`
    Evidence: evidence/task-1-context-no-phone.txt
  ```

  **커밋**: YES. 메시지는 `feat(assistant): add portfolio context builder`다. 파일은 `src/lib/portfolio-context.ts`, `src/lib/__tests__/portfolio-context.test.ts`, `src/app/llms.txt/route.ts`, `checklist.md`, `context-notes.md`다.

- [ ] 2. Assistant 정책과 Gemini provider 계층 추가하기.

  **할 일**: `@google/genai`를 설치한다. `src/lib/portfolio-assistant.ts`를 추가하고 첫 줄에 한국어 역할 주석을 둔다. 입력 정규화, 언어 감지, keyword/topic gate, 거절 helper, 프롬프트 빌더, Gemini 호출 wrapper, 생성 후 근거 확인을 구현한다. topic gate는 정의된 포트폴리오 주제 질문만 허용하고, 무관한 프롬프트는 Gemini 호출 전에 거절해야 한다. 생성 후 guard는 생성 답변이 지원되지 않는 주장을 포함하거나 포트폴리오 경계를 무시하면 거절해야 한다. provider wrapper는 작고 mock하기 쉽게 유지한다.

  **하지 말 것**: `as any`를 추가하지 않는다. v1에서 streaming을 만들지 않는다. Gemini에 채팅 기록을 보내지 않는다. Gemini가 혼자 거절 여부를 결정하게 하지 않는다.

  **병렬화**: 가능. 웨이브 1. 작업 3, 5를 막는다. 최종 프롬프트 컨텍스트는 작업 1에 의존한다.

  **참조**:
  - provider package는 `package.json`이다. 현재 AI SDK dependency가 없다.
  - 컨텍스트 계약은 작업 1의 `src/lib/portfolio-context.ts`다.
  - 검증 스타일은 `src/lib/geul/validation.ts`의 Zod 스타일을 따른다.

  **수용 기준**:
  - [ ] `shouldRefuseQuestion("오늘 서울 날씨 알려줘")`가 provider 호출 없이 한국어 거절을 반환한다.
  - [ ] `shouldRefuseQuestion("Write me a React hook")`가 provider 호출 없이 영어 거절을 반환한다.
  - [ ] `buildAssistantPrompt("Synapso.dev는 뭐야?")`가 assistant context와 refusal policy를 포함한다.
  - [ ] Gemini wrapper가 `process.env.GEMINI_API_KEY`만 읽는다.
  - [ ] API 키 누락은 typed provider-unavailable 결과로 노출된다.

  **TDD 테스트**:
  - `src/lib/__tests__/portfolio-assistant.test.ts`를 추가한다.
  - 테스트 ID는 `refuses-weather-before-provider`다.
  - 테스트 ID는 `refuses-general-coding-before-provider`다.
  - 테스트 ID는 `allows-known-project-question`다.
  - 테스트 ID는 `uses-fixed-korean-refusal`다.
  - 테스트 ID는 `uses-fixed-english-refusal`다.
  - 테스트 ID는 `missing-api-key-provider-unavailable`다.
  - 구현 전 RED 명령은 `npx vitest run src/lib/__tests__/portfolio-assistant.test.ts`다.
  - 구현 후 GREEN 명령도 동일하다.

  **QA 시나리오**:
  ```text
  Scenario: deterministic Korean refusal from library
    Tool: PowerShell
    Steps: npx vitest run src/lib/__tests__/portfolio-assistant.test.ts -t refuses-weather-before-provider 2>&1 | Tee-Object -FilePath evidence/task-2-policy-refusal.txt
    Expected: test passes and output includes `refuses-weather-before-provider`
    Evidence: evidence/task-2-policy-refusal.txt

  Scenario: provider is not called for unrelated prompt
    Tool: PowerShell
    Steps: npx vitest run src/lib/__tests__/portfolio-assistant.test.ts -t refuses-general-coding-before-provider 2>&1 | Tee-Object -FilePath evidence/task-2-no-provider.txt
    Expected: mock provider call count is 0
    Evidence: evidence/task-2-no-provider.txt
  ```

  **커밋**: YES. 메시지는 `feat(assistant): add portfolio-only policy layer`다. 파일은 `package.json`, `package-lock.json`, `src/lib/portfolio-assistant.ts`, `src/lib/__tests__/portfolio-assistant.test.ts`, `checklist.md`, `context-notes.md`다.

- [ ] 3. Assistant API route 추가하기.

  **할 일**: `src/app/api/assistant/route.ts`를 추가하고 첫 줄에 한국어 역할 주석을 둔다. `POST`만 구현한다. body는 Zod로 검증한다. 메시지 최대 길이는 1,000자로 제한한다. 작업 2의 `handlePortfolioAssistantMessage(message)`를 사용한다. 성공 시 `{ answer, refused, sources }` JSON을 반환한다. invalid, empty, oversized 요청은 `400`을 반환한다. 허용된 질문에서 provider를 사용할 수 없을 때만 `503`을 반환한다. `Cache-Control: no-store`를 추가한다. 메시지 길이와 비저장 원칙에 기반한 간단한 IP-free abuse guard를 둔다. 전체 사용자 메시지를 로그로 남기지 않는다.

  **하지 말 것**: 채팅을 저장하지 않는다. 쿠키를 추가하지 않는다. stack trace를 노출하지 않는다. 응답에 API 키를 포함하지 않는다. `GET` 채팅 동작을 구현하지 않는다.

  **병렬화**: 불가능. 웨이브 2. 작업 4, 5를 막는다. 작업 1과 2에 의존한다.

  **참조**:
  - API 패턴은 `src/app/api/geul/posts/route.ts`다. route handler 검증과 JSON 오류 패턴이 있다.
  - 세션 없는 공개 route 패턴은 `src/app/llms.txt/route.ts`다.
  - 정책 helper는 `src/lib/portfolio-assistant.ts`다.

  **수용 기준**:
  - [ ] mocked provider 기준으로 `{"message":"Synapso.dev는 어떤 프로젝트야?"}`를 `POST /api/assistant`에 보내면 HTTP 200, `refused:false`, 프로젝트 데이터 기반 답변을 반환한다.
  - [ ] 날씨 프롬프트는 `GEMINI_API_KEY` 없이도 HTTP 200, `refused:true`, 고정 한국어 거절을 반환한다.
  - [ ] 일반 영어 코딩 프롬프트는 HTTP 200, `refused:true`, 고정 영어 거절을 반환한다.
  - [ ] 빈 body, malformed JSON, 누락된 message, 공백 message, oversized message는 HTTP 400을 반환한다.
  - [ ] 허용된 질문에서 provider를 사용할 수 없으면 안전한 메시지와 함께 HTTP 503을 반환한다.

  **TDD 테스트**:
  - `src/app/api/assistant/__tests__/route.test.ts`를 추가한다.
  - 테스트 ID는 `answers-supported-project-question-with-mocked-provider`다.
  - 테스트 ID는 `refuses-weather-without-provider`다.
  - 테스트 ID는 `refuses-general-coding-without-provider`다.
  - 테스트 ID는 `rejects-empty-message`다.
  - 테스트 ID는 `rejects-oversized-message`다.
  - 테스트 ID는 `returns-503-when-provider-missing-for-allowed-question`다.
  - 구현 전 RED 명령은 `npx vitest run src/app/api/assistant/__tests__/route.test.ts`다.
  - 구현 후 GREEN 명령도 동일하다.

  **QA 시나리오**:
  ```text
  Scenario: supported API question
    Tool: curl
    Steps: curl -i -X POST http://localhost:3000/api/assistant -H "Content-Type: application/json" --data "{\"message\":\"Synapso.dev는 어떤 프로젝트야?\"}"
    Expected: HTTP 200 with JSON containing `"refused":false` and a portfolio-grounded answer, or HTTP 503 only if `GEMINI_API_KEY` is intentionally absent
    Evidence: evidence/task-3-api-supported.txt

  Scenario: unrelated API question
    Tool: curl
    Steps: curl -i -X POST http://localhost:3000/api/assistant -H "Content-Type: application/json" --data "{\"message\":\"오늘 서울 날씨 알려줘\"}"
    Expected: HTTP 200 with `"refused":true` and fixed Korean refusal
    Evidence: evidence/task-3-api-refusal.txt

  Scenario: invalid API input
    Tool: curl
    Steps: curl -i -X POST http://localhost:3000/api/assistant -H "Content-Type: application/json" --data "{\"message\":\"   \"}"
    Expected: HTTP 400 with `{ "message": "질문을 입력해야 합니다." }` or equivalent tested Korean validation text
    Evidence: evidence/task-3-api-invalid.txt
  ```

  **커밋**: YES. 메시지는 `feat(assistant): expose portfolio chat api`다. 파일은 `src/app/api/assistant/route.ts`, `src/app/api/assistant/__tests__/route.test.ts`, `checklist.md`, `context-notes.md`다.

- [ ] 4. 헤더 `ask me!` Dynamic Island 채팅 팝업 추가하기.

  **할 일**: `src/components/assistant/PortfolioAssistantIsland.tsx`를 추가하고 첫 줄에 한국어 역할 주석을 둔다. `src/components/home/Header.tsx`를 수정해 desktop navigation 중앙에 route가 아닌 `ask me!` 버튼을 넣는다. 모바일에서는 full-screen menu overlay의 첫 번째 action으로 `ask me!`를 추가한다. 모바일에서 이 버튼을 누르면 모바일 메뉴를 닫고 island를 열어야 한다. 현재 페이지와 어울리는 절제된 monochrome monospace 스타일을 사용한다. 닫힌 상태는 헤더와 메뉴 트리거뿐이며, bottom-right floating button은 만들지 않는다. 열린 상태는 fixed top-center island panel이다. 열릴 때 약 220px의 compact width에서 `min(92vw, 520px)`로 확장되며 rounded capsule에서 panel로 애니메이션된다. 로컬 전용 메시지 기록, textarea, send button, loading state, error state, clear button을 포함한다. 팝업은 `POST /api/assistant`를 호출한다. 키보드 접근이 가능해야 하며, 열릴 때 input에 focus해야 하고, Escape로 닫혀야 하며, 응답 영역에는 `aria-live`를 사용해야 한다. `framer-motion`은 이미 dependency에 있으므로 이를 사용한다. 팝업은 명시적으로 열린 뒤 header 위에 보여야 하므로 `z-[70]`을 사용한다. 모바일에서 `ask me!`를 누를 때는 메뉴를 먼저 닫아 overlay와 popup이 충돌하지 않게 한다.

  **하지 말 것**: 마케팅 문구를 추가하지 않는다. 방문자 연락처를 수집하지 않는다. 전화번호를 노출하지 않는다. nested card를 만들지 않는다. bottom-right launcher를 만들지 않는다. `ask me!`를 페이지 route로 만들지 않는다.

  **병렬화**: 가능. 웨이브 2. 작업 5를 막는다. 최종 API 계약은 작업 3에 의존한다.

  **참조**:
  - UI 스타일은 `src/app/page.tsx`의 monochrome font-mono 포트폴리오 스타일을 따른다.
  - navigation과 trigger surface는 `src/components/home/Header.tsx`다. desktop nav, mobile menu, z-index 값이 있다.
  - animation dependency는 `package.json`이다. `framer-motion`이 이미 설치되어 있다.
  - API 계약은 `src/app/api/assistant/route.ts`다.

  **수용 기준**:
  - [ ] desktop header가 navigation item 중앙에 `ask me!` 메뉴 버튼을 보여준다.
  - [ ] mobile menu overlay가 첫 action으로 `ask me!`를 보여주고, 누르면 overlay를 닫은 뒤 island를 연다.
  - [ ] `ask me!` 클릭 시 top-center Dynamic Island 스타일 팝업이 compact capsule에서 chat panel로 애니메이션된다.
  - [ ] island가 열리면 input에 focus된다.
  - [ ] `AI Doc Agent는 뭐야?`를 보내면 `/api/assistant`에 POST하고 응답을 렌더링한다.
  - [ ] `오늘 날씨 알려줘`를 보내면 고정 한국어 거절을 렌더링한다.
  - [ ] 빈 submit은 비활성화되거나 API 호출 없이 validation을 보여준다.
  - [ ] Escape를 누르면 열린 island가 닫힌다.
  - [ ] bottom-right launcher가 보이지 않는다.

  **TDD 테스트**:
  - `src/components/assistant/__tests__/PortfolioAssistantIsland.test.tsx`를 추가한다.
  - 테스트 ID는 `opens-from-ask-me-and-focuses-input`다.
  - 테스트 ID는 `submits-supported-question`다.
  - 테스트 ID는 `renders-refusal-response`다.
  - 테스트 ID는 `does-not-submit-empty-message`다.
  - 테스트 ID는 `escape-closes-island`다.
  - 테스트 ID는 `renders-no-bottom-right-launcher`다.
  - focused Header 테스트가 없다면 `src/components/home/__tests__/Header.test.tsx`를 추가하거나 갱신한다.
  - Header 테스트 ID는 `renders-centered-ask-me-trigger`다.
  - Header 테스트 ID는 `mobile-ask-me-closes-menu-and-opens-island`다.
  - global mount가 home 출력에 영향을 주는 경우에만 `src/app/__tests__/page.test.tsx`를 갱신한다.
  - 구현 전 RED 명령은 `npx vitest run src/components/assistant/__tests__/PortfolioAssistantIsland.test.tsx src/components/home/__tests__/Header.test.tsx`다.
  - 구현 후 GREEN 명령도 동일하다.

  **QA 시나리오**:
  ```text
  Scenario: desktop supported chat
    Tool: Browser
    Steps: Open http://localhost:3000, click the centered `ask me!` menu item, type `AI Doc Agent는 뭐야?`, click send
    Expected: top-center island expands with animation, shows a portfolio-grounded response, and stays within viewport
    Evidence: evidence/task-4-browser-desktop-island-supported.png

  Scenario: desktop refusal chat
    Tool: Browser
    Steps: Open http://localhost:3000, click the centered `ask me!` menu item, type `오늘 서울 날씨 알려줘`, click send
    Expected: top-center island shows fixed Korean refusal
    Evidence: evidence/task-4-browser-desktop-island-refusal.png

  Scenario: mobile ask me opens island
    Tool: Browser
    Steps: Open http://localhost:3000 at 390x844, open mobile menu, tap `ask me!`
    Expected: mobile menu closes, top-center island opens, input is focused, and no text overlaps
    Evidence: evidence/task-4-browser-mobile-island.png
  ```

  **커밋**: YES. 메시지는 `feat(assistant): add header ask me island chat`다. 파일은 `src/components/assistant/PortfolioAssistantIsland.tsx`, `src/components/assistant/__tests__/PortfolioAssistantIsland.test.tsx`, `src/components/home/Header.tsx`, optional `src/components/home/__tests__/Header.test.tsx`, optional `src/app/__tests__/page.test.tsx`, `checklist.md`, `context-notes.md`다.

- [ ] 5. 검증, 환경 메모, 프로세스 산출물 통합하기.

  **할 일**: `README.md`가 env var 또는 local setup을 이미 문서화하고 있다면 그 흐름에 맞춰 갱신한다. 그렇지 않다면 짧은 `## Portfolio Assistant` 섹션을 추가해 `GEMINI_API_KEY`와 local QA 명령을 적는다. 구현 결정과 검증 영수증을 `context-notes.md`에 append한다. `checklist.md`에서는 assistant 관련 항목만 체크한다. QA 중 `evidence/` 산출물을 만든다. focused test, full test, lint, build, API QA, browser QA를 실행한다. worktree가 clean atomic commit을 허용하면 논리 단위로 commit한다. touched file에 무관한 dirty 변경이 있으면 commit하지 말고 이유를 보고한다.

  **하지 말 것**: 기존 checklist나 notes를 덮어쓰지 않는다. 기존 evidence를 삭제하지 않는다. 사용자 변경을 commit하지 않는다. 테스트를 약화하지 않는다.

  **병렬화**: 불가능. 웨이브 3. 최종 검증을 막는다. 작업 1, 2, 3, 4에 의존한다.

  **참조**:
  - 프로세스 파일은 `checklist.md`다. assistant 항목만 append 또는 update한다.
  - 프로세스 파일은 `context-notes.md`다. assistant 결정과 QA receipt만 append한다.
  - script 참조는 `package.json`이다. `npx vitest run`, `npm run lint`, `npm run build`를 사용한다.

  **수용 기준**:
  - [ ] `checklist.md`의 assistant 항목이 실제 완료 상태를 정확히 반영한다.
  - [ ] `context-notes.md`가 provider, API 계약, 거절 정책, QA evidence, 기존 실패를 기록한다.
  - [ ] 필요한 경우 `GEMINI_API_KEY` setup note가 README에 있다.
  - [ ] API와 browser QA의 evidence 파일이 있다.
  - [ ] 최종 보고가 실행한 정확한 명령과 결과를 적는다.

  **TDD 테스트**:
  - 이 작업에는 새 production behavior가 없으므로 별도 테스트 파일은 필요 없다.
  - 검증 명령은 `npx vitest run`이다.

  **QA 시나리오**:
  ```text
  Scenario: full verification commands
    Tool: PowerShell
    Steps: npx vitest run 2>&1 | Tee-Object -FilePath evidence/task-5-full-verification.txt; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npm run lint 2>&1 | Tee-Object -FilePath evidence/task-5-full-verification.txt -Append; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npm run build 2>&1 | Tee-Object -FilePath evidence/task-5-full-verification.txt -Append
    Expected: commands exit 0, or pre-existing failures are captured with exact file paths outside assistant changes
    Evidence: evidence/task-5-full-verification.txt

  Scenario: no persistent chat data
    Tool: Browser
    Steps: Click `ask me!`, ask `김상찬의 연락 방법 알려줘`, refresh page, click `ask me!` again
    Expected: previous messages are gone after refresh because v1 has no persistence
    Evidence: evidence/task-5-browser-island-no-persistence.png
  ```

  **커밋**: YES. 메시지는 `docs(assistant): document portfolio chat setup`다. 파일은 `README.md`가 변경된 경우 해당 파일, `checklist.md`, `context-notes.md`, `evidence/**`다.

## 최종 검증 웨이브
> 모든 항목이 통과해야 한다. 통합 결과를 사용자에게 제시하고 명시적 확인을 받은 뒤 구현 완료로 본다.

- [ ] F1. 계획 준수 감사.
  - 이 계획의 모든 TODO가 완료됐거나 사용자가 명시적으로 연기했는지 확인한다.
  - 각 작업에 적힌 파일이 기대한 위치에 있는지 확인한다.
  - 새 source file이 한국어 한 줄 역할 주석 없이 만들어지지 않았는지 확인한다.

- [ ] F2. 코드 품질 검토.
  - `git diff --check`를 실행한다.
  - `npx vitest run`을 실행한다.
  - `npm run lint`를 실행한다.
  - `npm run build`를 실행한다.
  - 가능하면 변경된 TypeScript와 TSX 파일의 LSP diagnostics를 확인한다.

- [ ] F3. 실제 Manual QA.
  - 사용 가능한 포트에서 `npm run dev`로 dev server를 시작한다.
  - 작업 1과 3의 모든 `curl -i` API 시나리오를 실행한다.
  - 작업 4와 5의 모든 Browser 시나리오를 실행한다.
  - 증거를 `evidence/` 아래에 저장한다.
  - dev server를 중지하고 cleanup을 기록한다.

- [ ] F4. 범위 충실도 확인.
  - 지원 질문으로 `김상찬은 어떤 개발자야?`, `Synapso.dev는 뭐야?`, `협업 문의는 어떻게 해?`를 묻는다.
  - 무관한 질문으로 `오늘 날씨 알려줘`, `대통령이 누구야?`, `React hook 만들어줘`, `김상찬의 집 주소 알려줘`를 묻는다.
  - 지원 질문 답변이 포트폴리오 사실에 근거하는지 확인한다.
  - 무관한 질문이 고정 거절 문구를 사용하고, 사전 게이트에서 막히는 경우 Gemini를 호출하지 않는지 확인한다.

## 커밋 전략
- 권장 커밋은 아래와 같다.
  - `feat(assistant): add portfolio context builder`
  - `feat(assistant): add portfolio-only policy layer`
  - `feat(assistant): expose portfolio chat api`
  - `feat(assistant): add header ask me island chat`
  - `docs(assistant): document portfolio chat setup`
- 무관한 dirty file은 commit하지 않는다.
- `checklist.md` 또는 `context-notes.md`에 기존 무관 변경이 섞여 있으면 assistant 추가분은 유지하되 commit 전에 mixed-file 상태를 언급한다. atomic commit이 안전하지 않으면 변경을 uncommitted로 남기고 draft commit message를 제공한다.

## 성공 기준
- 포트폴리오 헤더 중앙에 `ask me!` 트리거가 있고, 이를 누르면 상단 중앙 Dynamic Island 스타일 채팅 팝업이 열린다.
- API가 Gemini와 기존 포트폴리오 데이터를 사용해 포트폴리오 관련 질문에 답한다.
- API가 지원하지 않는 질문을 고정 지역화 거절 문구로 결정적으로 거절한다.
- 방문자 채팅 기록을 저장하지 않는다.
- assistant가 전화번호를 노출하지 않는다.
- 테스트가 허용 답변, 거절, invalid input, provider 누락 동작, UI 동작을 증명한다.
- 실제 브라우저 QA와 API QA 산출물이 사용자-facing surface에서 기능이 동작함을 증명한다.
