# 새벽 데스크탑 작업 검증 — 2026-06-02 (Claude)

> 대상: 집 데스크탑에서 06-01 저녁~06-02 01:16 origin 푸시한 작업.
> 놀리지버스 `a06e3dd..d5e36bd`(6커밋) + project-dashboard `9c6109e..9bb751c`(6커밋).
> 노트북에서 `git fetch`+`merge --ff-only`로 동기화(충돌0) 후, 5차원 병렬 검증 워크플로(빌드/브랜드/8대공정/전력딥줌/대시보드)로 확인.

## 새벽 작업 내용 (3가지)
1. **전력 지도 도시 딥줌 + 시군구 LOD** — 기업 클릭 시 구글어스식 도시 줌인, 시·군·구까지(읍면동 제거). 신규 `public/geo/kr-municipalities.geojson`(251 피처), `KoreaCartoonMap.tsx`+190.
2. **반도체 8대 공정 모드(3D 웨이퍼 파이프라인)** — 신규 `src/data/semiconductorProcess.ts`, `src/scene/ProcessFlow.tsx`(+425), `src/ui/ProcessGuide.tsx`, ViewToggle/InfoPanel/Scene 연동. 8단계: 웨이퍼→산화→포토→식각→증착·이온주입→금속배선→EDS(테스트)→패키징.
3. **브랜드 최종 확정 = Knowledgeverse(놀리지버스)** — 놀리지 아틀라스→놀리지 코스모스→Knowledgeverse, `src/brand.ts` 단일 소스.

## 검증 판정
| 차원 | 판정 | 비고 |
|---|---|---|
| 빌드/타입/린트 | ✅ PASS | tsc -b·vite build·eslint 전부 0에러 (노트북 클린 빌드, `tsc -b --force`도 통과) |
| 브랜드 리네임 | 🔴→✅ | 앱은 클린. **대시보드 index.html:154 구브랜드 "Knowledge Atlas" 노출 1건** → 수정함 |
| 8대 공정 내용 | 🟡→✅ | 명칭·순서·코드정합 완벽. 내용 부정확 2건 수정함 |
| 전력 딥줌 | ✅ PASS | 로직·실좌표 정상, 읍면동 코드 잔재0. stale 주석 2건 수정함 |
| 대시보드 정합성 | ✅ | 카드·미리보기 최신(앱 dist와 바이트동일), progress 불변(박사전용 규칙 준수). README 보강함 |

## 수정 반영 (이 커밋)
**앱(newton):**
- `src/data/semiconductorProcess.ts:78` — 이온주입 "전자·정공을 더해" → "붕소·인 등 불순물(도펀트)을 심어, 정공(p형)·전자(n형) 캐리어를 만들어". (메커니즘 한 단계 건너뛴 과잉단순화 정정 — 학생 오해 방지)
- `src/data/semiconductorProcess.ts:29` — 산화 why "소자의 전력 효율을 좌우" → "막의 두께·품질이 소자 동작과 신뢰성에 직결". (인과 과장 완화)
- `src/scene/KoreaCartoonMap.tsx:17-18, 118` — 읍면동 LOD 잔존 주석(기능엔 이미 없음) → 시·군·구 기준으로 정정.

**대시보드(별도 repo, 별도 커밋):**
- `index.html:154` — "Knowledge Atlas(#8)" → "Knowledgeverse(놀리지버스, #8)". (홈 '현재 판단' 사용자 노출 BLOCK)
- `README.md` — 최신 반영에 브랜드 확정 항목 1줄 추가(기존 changelog의 「반도체 유니버스」 표기는 당시 명칭 기록으로 보존).

## 비이슈(확인됨, 변경 안 함)
- `AtlasArea` = 코드 인터페이스명(비노출), `STACK_ATLAS`/`.stack-atlas` = 무관한 대시보드 기능명. 브랜드 잔재 아님.
- projects-data.js changelog의 '아틀라스'/'반도체 유니버스' = 과거 변경이력 서술(보존).
- vite 번들 2.16MB(gzip 643KB) 권고 = 빌드 실패 아님(코드 스플리팅 여지).

## 박사 결정 대기(선택)
- AtlasArea 인터페이스명을 KnowledgeArea로 리네임할지(비노출, 우선순위 낮음).
- 8대 공정에 CMP(평탄화) 한 줄 보강 여부(현 삼성 공식 8대 프레이밍 유지 vs 9단계 확장).
- 8대 공정 국내/해외 대표기업 2026 기준 산업 정확성 별도 팩트체크 사이클.
