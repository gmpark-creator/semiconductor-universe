# 전기·전자 공학 카테고리 신설 — R1 Thesis (Claude/Newton 제안)

작성: 2026-07-09 · 박사 지시("기초과학 파트에 전기·전자 공학 공학 카테고리 신설, 기초→중급→고급, 알기 쉽게 / Opus 메인 설계·구현 + Codex 여러 라운드 토의·검수")
근거: 이해 워크플로(wf_1b8192c9, 렌더·콘텐츠스타일·도해·빌드 4스레드) + 설계 워크플로(wf_e7bff0b9, 커리큘럼 3안 + 아키텍처 + 심사 3렌즈) 종합.
작업 위치: `semiconductor-universe-newton` (branch **newton**). 대시보드 반영은 `project-dashboard`(master).

---

## 0. 해석 (과제 정의)

박사 지시 = 놀리지버스 **기초이론(기초과학, TheoryView)** 안에 **「전기·전자 공학」이라는 새 카테고리(과목)**를 신설하고, 내용을 **기초→중급→고급 3티어**로 알기 쉽게 설명. 학교 과학의 하위가 아니라 **공학**으로서 독립 카테고리.

---

## 1. 아키텍처 결정 (설계 워크플로 아키텍처안 + 심사 합의)

### 1-A. 새 TheorySubject 신설 (sublevel 아님) — 확정 권고
- `index.ts`에 `eeSubject: TheorySubject`(id `"ee"`, name `"전기·전자 공학"`) 신설, `THEORY_SUBJECTS = [scienceSubject, eeSubject]`.
- **근거**: scienceSubject(name "과학") 밑 레벨로 넣으면 브레드크럼이 "기초이론 › 과학 › …"로 찍혀 '학교 과학의 하위'로 오인 → 박사의 "공학 = 별개 카테고리" 의도 위반. 별도 과목이라야 "기초이론 › 전기·전자 공학 › …".
- **필수 UI 작업**: `THEORY_SUBJECTS`/`DEFAULT_SUBJECT_ID`는 현재 소비처 0인 **죽은 export**. TheoryView(:33)가 `const subject = scienceSubject`로 단일 하드코딩 → **데이터만 등록하면 화면에 안 뜬다**. TheoryView에 **과목 스위처(세그먼트 pill 탭)** 신설이 필수.

### 1-B. domain — ScienceDomain 확장 + 방어 fallback (b안 기각)
- **채택(a)**: `ScienceDomain` 유니온에 `"전기·전자 공학"` 1개 추가 + `DOMAIN_META`에 `{ color:"#14b8a6"(틸), emoji:"🔌", label:"공학 · 전기·전자" }`. (색·이모지 최종 확정은 박사 취향 — 열린 결정, 아래 §8.)
- **b안(운동과에너지 재활용 + strand 라벨) 기각 이유**: 배지 색·이모지는 `DOMAIN_META[domain]`에서만 나오고 strand는 **라벨 텍스트만** override. b안이면 EE 전체가 물리 앰버(#f59e0b)+⚡로 렌더 → 정확히 박사가 배제하라는 "학교물리 전자기 재탕"처럼 보임.
- **타입 안전 보너스**: `DOMAIN_META`는 `Record<ScienceDomain,…>`이라, 유니온에 멤버를 넣으면 컴파일러가 META 항목을 강제 요구 → 반쪽 배포 불가.
- **방어 fallback 동시 도입**(현재 무방어 크래시 4곳: TheoryView 192/244/296, types.ts:86 unitLabel): `const FALLBACK_DOMAIN_META = { color:"#64748b", emoji:"📘", label:"기타" }; export function domainMeta(d){ return DOMAIN_META[d] ?? FALLBACK_DOMAIN_META; }` — 모든 참조를 `domainMeta()`로 교체. 미래 domain 오타를 회색 뱃지로 graceful degrade.
- 타입명 `ScienceDomain` 유지(리네임은 파급 커서 별도 티켓 — 열린 결정).

### 1-C. 3티어 스키마 매핑
- **티어 = SchoolLevel 3개** (기초/중급/고급, 모두 `status:"ready"`). 난이도가 headline 조직 원리("기초→중급→고급")이므로 최상위 탭(레벨탭)에 노출. SF 과목이 단일 Grade 레벨을 이미 렌더하는 선례 있음.
- 각 티어 SchoolLevel 안에 **Grade 1개**(단원 묶음 보유). `Grade.id` = `ee-basic`/`ee-inter`/`ee-adv`, `Grade.label` 필수 지정(`gradeLabel`이 label 없으면 "N학년" 오표기). `track` **미지정**(TRACK_ORDER 4값 닫힌 유니온과 난이도 개념 불일치 → groupGrades 드롭 버그 회피, null 버킷=항상 렌더).
- 대안(1 SchoolLevel + 3 Grade 칩): 심사관 다수 제안. 최종은 §8 열린결정 — 기본 권고는 3 SchoolLevel.

### 1-D. TheorySubject에 `emoji?` 필드 추가
- 현재 🔬 하드코딩(TheoryView 142,174). `TheorySubject.emoji?: string` 추가, 렌더를 `subject.emoji ?? "🔬"`로. scienceSubject.emoji="🔬", eeSubject.emoji="🔌".

### 1-E. 하드코딩 안내문 일반화(중우선)
- TheoryView 163/211-212/286-287의 "과학"·"초등·중등" 문구 → `subject.name` 기반 또는 `subject===science` 조건부. EE는 전 레벨 ready라 당장 미노출이나 정합성 위해 권장.

### 파일별 변경 요약
| 파일 | 변경 | 위험 |
|---|---|---|
| `src/data/theory/types.ts` | ScienceDomain +"전기·전자 공학", DOMAIN_META 항목, domainMeta() fallback, unitLabel→domainMeta, TheorySubject.emoji? | 낮음(컴파일러 강제) |
| `src/data/theory/index.ts` | eeSubject 정의 + THEORY_SUBJECTS 확장 + scienceSubject.emoji | 낮음 |
| `src/data/theory/ee-basic.ts`(신규) | 기초 3단원 데이터 | 콘텐츠 규율 |
| `src/data/theory/ee-inter.ts`(신규) | 중급 4단원 데이터 | 콘텐츠 규율 |
| `src/data/theory/ee-adv.ts`(신규) | 고급 4단원 데이터 | 콘텐츠 규율 |
| `src/views/TheoryView.tsx` | 과목 스위처 pill UI, THEORY_SUBJECTS 소비 전환, subject.emoji, domainMeta 교체, 안내문 일반화 | 중(상태 리셋 순서) |
| `public/figures/science/ee-*.svg`(신규 11) | 단원별 도해 | 미제작 시 onError로 img 숨김(크래시 없음) |

---

## 2. 커리큘럼 (11단원 · 33레슨 · 11도해) — 심사 합성

**합성 원칙**: 척추=안1 선수학습 사다리 / 집필=안2 동기훅(문단1을 실제 기기·문제로 열고 정의로 착지) / 이식=안3 전원회로 단원·시각분리. 각 단원에 **[전제]** 명시.

### 티어 기초 — SchoolLevel "기초" (Grade `ee-basic` "기초 · 회로 리터러시")
| U | 단원 | 레슨 3 | strand | figureId | 전제 |
|---|---|---|---|---|---|
| B1 | 전자 부품과 회로도 읽기 | 능동 소자와 수동 소자 / 저항·커패시터·인덕터 값 읽기(색띠·디커플링·코일) / 회로도 기호와 접지·전원 규약 | 전자 · 부품과 회로도 | ee-components-symbols | (학교물리 전압·전류·저항 = 배경) |
| B2 | 직류 회로 설계와 측정 | 전압 분배와 전류 분배 / 전원·접지와 기준 전위 / 멀티미터로 재기(전압=병렬·전류=직렬·로딩효과·프로브) | 전자 · 직류회로 | ee-voltage-divider-meter | B1 |
| B3 | 커패시터·RC와 신호의 기초 | RC 시간상수와 충·방전 곡선(τ=RC) / 주기 신호·파형·실효값 / RC 필터와 차단 주파수 | 전자 · RC와 신호 | ee-rc-curve-filter | B2 |

### 티어 중급 — SchoolLevel "중급" (Grade `ee-inter` "중급 · 반도체와 회로")
| U | 단원 | 레슨 3 | strand | figureId | 전제 |
|---|---|---|---|---|---|
| M1 | 다이오드 — 한 방향 소자 | 다이오드의 I-V 특성과 순방향 약 0.7V / LED·제너·포토다이오드 — 쓰임에 맞는 선택 / 정류 회로에서 다이오드 읽기(데이터시트·정격·한계) | 전자 · 반도체 소자 | ee-diode-iv | B1 (⚠️밴드/도핑 재교육 금지 — 도핑·pn은 물리 레슨 참조 1문장까지만) |
| M2 | 트랜지스터: 스위치와 증폭 | BJT의 전류 제어 / MOSFET과 전압 제어 스위치 / 스위치와 증폭 두 쓰임(+플라이백 다이오드) | 전자 · 트랜지스터 | ee-transistor-bjt-mosfet | M1 |
| M3 | 정류와 전원 회로 | 반파·전파·브리지 정류 / 커패시터 평활과 리플(전원 설계 사슬) / 전압 레귤레이터와 안정 DC | 전자 · 전원회로 | ee-power-supply-chain | M1, B3 |
| M4 | 디지털의 시작: 2진수와 논리 게이트 | 2진수와 논리 레벨 / 기본 논리 게이트 / 진리표와 불 대수 | 디지털 · 논리회로 | ee-logic-gates | M2 (트랜지스터=스위치) |

### 티어 고급 — SchoolLevel "고급" (Grade `ee-adv` "고급 · 집적·신호·임베디드")
| U | 단원 | 레슨 3 | strand | figureId | 전제 |
|---|---|---|---|---|---|
| A1 | 연산 증폭기(Op-Amp) | 이상적 op-amp와 음귀환·가상단락 / 반전·비반전 증폭기(이득 −Rf/Rin, 1+R2/R1) / 비교기·합산기·능동 필터 | 전자 · 연산증폭 | ee-opamp-inverting | M2, B2 |
| A2 | 집적회로와 순차 디지털 | 조합 논리와 집적회로(CMOS) / 플립플롭과 순차 논리 / 레지스터·카운터와 클록 | 디지털 · 집적회로 | ee-flipflop-timing | M4 |
| A3 | ADC/DAC와 신호처리 | 표본화와 양자화(나이퀴스트) / ADC와 DAC의 원리 / 디지털 필터와 신호처리(SNR) | 전자 · 신호처리 | ee-adc-sampling | B3, A2 |
| A4 | 마이크로컨트롤러와 임베디드 (캡스톤) | MCU 구조(CPU·메모리·GPIO·ADC) / 센서와 신호 입력(분압+서미스터/CDS) / 디지털 통신(UART/I2C)·PWM 제어와 임베디드 응용 | 임베디드 · 마이크로컨트롤러 | ee-mcu-block | A1, A2, A3 통합 |

---

## 3. 비중복 하드룰 (심사 3렌즈 만장일치 — 반드시 준수)
1. **옴·쿨롱·전기장·전위·전자기 유도·변압기·자기장·전동기 재유도 절대 금지.** 학교물리(high-physics, high-adv-em-quantum)가 소유. '주어진 배경'으로만 참조.
2. **반도체를 밴드이론·도핑으로 열지 않는다.** high-physics '에너지띠와 반도체'가 이미 밴드·n/p·pn·다이오드·트랜지스터·IC를 산문으로 덮음. EE 다이오드는 **I-V 특성 + 순방향 0.7V + 정류/스위칭**으로 직입(안2 방식). 도핑/pn 필요 시 물리 레슨 참조 한 문단으로만.
3. **커패시터/RC는 τ=RC 시간상수·차단주파수·필터의 공학적 쓰임으로만.** '에너지 저장·전기장' 재탕 금지(eq-capacitor 레슨 소유). 정류→평활→레귤레이터는 '전원 설계 사슬' 시스템 관점(커패시터 재소개 아님).
4. **산업 3D 반도체(공정)와 관점 분리**: EE=소자 회로 동작 / 산업3D=팹 공정. 반도체 단원 도입부에 명시.

---

## 4. 집필 규율 (콘텐츠 스타일 가이드)
- **body 정확히 3문단**(문단1=정의, 2=원리/관계, 3=응용/예시), 각 2~3문장·**110~180자**.
- **문단1 = 동기훅**: 실제 기기·문제로 한 문장 연 뒤 곧바로 정의로 착지(충전기 5V 2A / LED에 왜 저항 / 마이크 신호 증폭 / 손톱만 한 컴퓨터 / 0.7V 문턱 / 플라이백). funFact·문단3도 같은 기기로 회수.
- keyTerms **3개**(핵심 많으면 4), funFact **1개**(예외 없음).
- **평서체**("~한다/~이다/~된다"). 존댓말 금지(수사적 질문 1문장 훅은 허용).
- **수식 LaTeX 금지 — 유니코드만**: `₀ ₁ ₂ ² ³ Ω Δ ½ × − τ`. 관계는 서술 우선, 필요 시 괄호식(V=IR, τ=RC, 이득=−Rf/Rin 또는 1+R2/R1, P=VI). 단위 = 한글명(기호): 볼트(V)·암페어(A)·옴(Ω)·와트(W)·패럿(F)·헤르츠(Hz). 음전하 마이너스는 유니코드 `−`로 통일.
- id 규칙: Lesson.id = `<Unit.id>-<순번>` (예 `ee-diode-1`). Unit.id = `ee-<주제>`.

---

## 5. 도해 계획
- 11종 신규 SVG, 기존 `advphys-*.svg` 톤 계승: viewBox `0 0 480 320`, bg `#0f1729` rx16, font `'Noto Sans KR','Malgun Gothic'`, 제목 `#e2e8f0` y=38, 하단 캡션 `#94a3b8`.
- 의미색: 전류/강조=앰버(#f59e0b/#fbbf24), 신호=시안(#22d3ee), +/양=적(#f87171), −/음=청(#60a5fa), 힘/보조=녹(#34d399), 텍스트=slate(#94a3b8/#cbd5e1). **EE 도해도 앰버 강조 계승**(도메인 틸은 뱃지용, 도해 강조색은 물리 관례 유지).
- **회로 기호 표기 표준 하나로 통일**(IEC 또는 ANSI 중 택1, 혼용 금지). marker id 파일별 고유(복제 시 충돌 주의).
- 재사용 프리미티브: RC 곡선, 논리게이트 기호, I-V 곡선, D-FF 타이밍, 블록도.
- **미제작이어도 크래시 없음**(onError로 img 숨김) → 텍스트 먼저, 도해 세트로 보강 가능.

---

## 6. 게이트 (구현 검증)
1. `tsc -b` 통과(유니온+DOMAIN_META 세트 강제).
2. `eslint .` 0(noUnusedLocals — 미사용 import 금지).
3. `vite build` 성공.
4. **콘텐츠 규율 lint 스크립트**: 모든 Lesson.body.length===3, 문단 110~180자, keyTerms 3~4, funFact 존재, 존댓말('요/니다' 어미) 미검출, LaTeX(`\`,`$`,`^{}`) 미검출.
5. **도해 대조**: 각 Unit.figureId ↔ `public/figures/science/<id>.svg` 존재.
6. **도메인 방어**: 알 수 없는 domain → 회색 fallback(크래시 없음).
7. **렌더 스모크**(dev): 기초이론 → 과목 스위처 [과학][전기·전자 공학] → EE 선택 → 티어탭 기초/중급/고급 → 단원·레슨·용어·funFact 렌더, 콘솔 TypeError 0, 과목 왕복 후 stale 빈화면 없음.
8. **회귀**: 과학 과목 기본 진입·기존 뷰 불변.
9. worktree/브랜치 확인(newton).

---

## 7. 빌드·배포·라이브 반영 (세트 단위 — 전역 standing)
- 코드=newton 브랜치. 착수 시 `git merge origin/main`(딥링크 커밋 흡수, theory 무충돌).
- **티어(세트) 단위로 저장·커밋·프리뷰 갱신** — 큰 파일 1회 저장 금지. 기초 3단원 완성→저장→빌드→프리뷰 반영→중급→고급 순.
- 프리뷰 반영: newton에서 `npm run build` → `dist/*` → `project-dashboard/claude/previews/semiconductor-universe/` 통째 덮어쓰기(옛 해시 assets 정리) → 로컬 5500 직접경로 확인. 대시보드 카드/공개 반영은 project-dashboard(master) push + Pages 재빌드(iframe 절대 URL).
- knowledgeverse-hub '기초과학' 카드 설명에 전기·전자 공학 추가 여부 검토.

---

## 8. 위험·열린 결정 (박사/Codex 판정)
- **EE domain 색·이모지 최종 확정**: #14b8a6 틸 + 🔌 제안(과학 #38bdf8·물리 앰버와 시각 구분). 박사 취향/한국적 디자인 정체성 관점.
- **티어 매핑**: 3 SchoolLevel(권고) vs 1 SchoolLevel+3 Grade칩.
- **배포 방식**: 3티어 일괄 vs 기초 먼저 점진(전역 세트 저장과 정합 → 점진 권고).
- ScienceDomain 타입명 유지 vs 중립 리네임(유지 권고).
- '준비 중/초등·중등' 안내 카피 일반화 범위.

---

## 9. 구현 순서(GO 후)
1. `git merge origin/main` 정렬 + 브랜치 확인.
2. 스키마: types.ts(domain+fallback+emoji) → index.ts(eeSubject 골격, 빈 units) → tsc.
3. UI: TheoryView 과목 스위처 + domainMeta 교체 → dev 스모크(빈 EE 티어 노출 확인).
4. 콘텐츠 세트: 기초 3단원 → 저장·빌드·프리뷰 → 중급 4 → 고급 4 (각 세트 게이트).
5. 도해 세트: 티어별 SVG 부착.
6. Codex 사후검수 → PASS까지 반려루프 → 대시보드 반영·push.

---

## 10. R2 개정 (Codex R1 EXEC BLOCK 반영 — 2026-07-09)

Codex R1(gpt-5.5, xhigh, read-only)이 아키텍처 3결정(§1-A 새 과목 / §1-B domain 확장+fallback·틸+🔌 / §1-C 3 SchoolLevel+1 Grade·track 생략)을 **모두 확인**하고, 비중복·게이트 엄밀성에 대해 **BLOCK + R2 6항목**을 냄. 전량 수용:

1. **M1 3번째 레슨 교체(중복 제거)** — `소자는 어떻게 만들어지나(도핑·pn)` 폐기. high-physics.ts:549가 에너지띠·n/p·pn·다이오드·트랜지스터·IC까지 이미 산문으로 소유 → 충돌. 대체: `다이오드 I-V·0.7V` / `LED·제너·포토다이오드 선택` / `정류 회로에서 다이오드 읽기(데이터시트·정격·한계)`. 도핑·pn은 **물리 레슨 참조 1문장까지만**. (§2 표 M1 갱신 완료)
2. **B3/M3 중복 경계 명문화** —
   - B3(커패시터·RC)는 **τ=RC 시간상수·과도응답 읽기·차단주파수·필터 설계 용도만** 허용.
   - M3(정류·전원)는 **정류→리플→레귤레이터 시스템 사슬만** 허용.
   - 양쪽 모두 `축전기 정의`·`전기용량`·`유전체`·`저장 에너지` **재설명 금지**(eq-capacitor·high-adv-em-quantum:30 소유). B2도 middle2:267·high-physics:346 회로 기초 재유도 금지 → **설계·측정 예제 중심**.
3. **콘텐츠 lint 스코프 한정** — lint는 `eeSubject`/`ee-*.ts`만 검사(전체 스캔 시 기존 과학 콘텐츠의 존댓말·스타일로 오검출·실패). 출력은 **lesson id별 위반 목록**.
4. **과목 스위처 상태 계약(명시)** — `const [subjectId,setSubjectId]=useState(DEFAULT_SUBJECT_ID)`; `subject = THEORY_SUBJECTS.find(id) ?? [0]`. **과목 변경 시 `levelId`·`gradeIdx`·`unitId`를 새 과목의 첫 ready grade/첫 unit으로 함께 리셋**(단일 setState 핸들러 `pickSubject(id)`에서 원자적으로). stale id로 빈 화면 방지. 옵셔널 체이닝 방어 `lv.grades[0]?.units[0]?.id ?? ""`.
5. **domainMeta 시그니처** — `export function domainMeta(d: ScienceDomain | string){ return (DOMAIN_META as Record<string,…>)[d] ?? FALLBACK_DOMAIN_META; }`. TheoryView 192·244·296 + types.ts:86 **4지점 전부 교체**. **unknown-domain cast fixture**(예: `domainMeta("__nonexistent__" as ScienceDomain)`)로 회색 fallback·무크래시 실증(게이트 6-b).
6. **렌더 스모크 = 수동(dev)** — package.json:6에 test/Playwright 없음(build/lint/preview뿐). 게이트 7의 렌더 스모크는 **`npm run dev` 수동 확인**이 1차. 보강으로 node 기반 경량 DOM 존재 체크(옵션)를 추가할 수 있으나 필수 아님. R2에 수동임을 명시.

추가 판정: `figureUrl`(types.ts:90)이 `figures/science/`에 계속 묶이는 것은 **의도적 유지**(EE 도해도 같은 폴더에 ee-*.svg로 배치, 경로 스키마 변경 불필요·자산부채 감수).

→ 위 6건 반영 후 **Codex R2 재검수 요청**. GO 시 §9 구현 순서 착수.

---

## 11. R3 — 이해-완결성 보강 (완결성 감사 후 박사 결정 2026-07-09)

구현·Codex PASS·대시보드 반영 후, 5렌즈 완결성 감사(wf_1c81633c) 실시 → essential 공백 확인. **일부(옴법칙·전압/전류·전력·축전기·반도체 도핑)는 학교물리(과학 과목) 소유라 의도적 제외** = EE 단독 열람 시에만 공백. **진짜 EE 고유 essential 공백 3개**를 박사 지시로 보강("핵심 공백만" 선택). 새 단원 3개(9레슨·도해 3), 기존 스키마·규율·비중복 하드룰 그대로.

### 신설 단원
| U | 티어·위치 | 단원(id) | 레슨 3 | strand | figureId | 전제 |
|---|---|---|---|---|---|---|
| B4 | 기초 ④(rc-signal 뒤) | 임피던스와 교류 저항 (`ee-impedance`) | 임피던스·리액턴스 — 주파수에 따라 변하는 저항(Xc·XL) / 전압·전류 위상차 / 임피던스 정합·입출력 임피던스(버퍼가 하는 일) | 전자 · 교류·임피던스 | ee-impedance-reactance | ee-rc-signal |
| A2b | 고급(opamp 뒤) | 신호를 만드는 회로: 발진기 (`ee-oscillator`) | 양성 되먹임과 발진 조건 / RC·LC 발진기와 수정 진동자 / 슈미트 트리거·555 타이머 | 전자 · 발진·타이밍 | ee-oscillator | ee-opamp |
| A?c | 고급(ic-sequential 뒤, mcu 앞) | 컴퓨터는 어떻게 프로그램을 실행하나 (`ee-cpu`) | 명령어와 실행 사이클(인출-해독-실행·PC·ALU) / 메모리의 원리와 종류(RAM·ROM·플래시·주소·데이터) / 버스·폰노이만 구조·인터럽트 | 디지털 · 컴퓨터 구조 | ee-cpu-execution | ee-ic-sequential |

최종 구성: 기초 4단원 / 중급 4 / 고급 6 = **14단원 42레슨 도해 14**. 고급 순서: opamp→oscillator→ic-sequential→cpu→signal→mcu(캡스톤).

### 보강 비중복 하드룰
- **임피던스**: 학교물리 교류·축전기 '정의' 재탕 금지. "주파수 의존 저항(리액턴스)+위상+정합"이라는 **공학 프레이밍**에만 집중. RC(기초③)의 시간영역 직관을 주파수영역으로 확장하는 연결.
- **발진기**: 신규 영역(학교물리 무관). 음귀환(opamp)의 짝으로서 양성 되먹임. 클록·PWM·교류 '소비'만 하던 것의 '발생 원리' 보강.
- **CPU 실행**: 산업 3D 반도체(공정)와 무관(=소자 회로 아닌 컴퓨터 구조). MCU 단원(칩 구성·주변장치·응용)과 겹치지 않게 — 이 단원=**실행 원리 심화**, MCU 앞에 배치해 MCU가 이를 전제로 삼음.

### 구현 절차
콘텐츠 워크플로(9레슨, 저작→적대검증→수정) + 도해 워크플로(3 SVG) → 기존 ee-basic.ts(append)·ee-adv.ts(opamp 뒤·ic-sequential 뒤 insert) 스플라이스(현재 파일 eval→삽입→재작성, 기존 정정 보존) → lint/tsc/build → Codex 사후검수 → 프리뷰·newton·대시보드 반영.
