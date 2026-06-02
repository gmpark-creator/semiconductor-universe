# HANDOFF — Knowledgeverse(놀리지버스) · 이어받기용

> 노트북(랩탑)에서 2026-06-02 작업 종료. 집 데스크탑에서 그대로 이어받기 위한 문서.
> **마지막 상태: `tsc + vite build` + ESLint 0 통과, 모든 데이터 검수·교정 완료. main = newton = `db769c0`(origin 푸시됨), 대시보드 `8d9bfe7`.**

## 0) 한 줄 요약
프로젝트 #8 **Knowledgeverse** = 「정보·지식 모음」 상위 아카이브. 대분류 2층:
- **① 산업(3D 인터랙티브)**: 반도체 · 전력 · 2차전지 · 디스플레이 · 철강·제련 — **5개 영역**(영역 선택기로 전환, 각 영역 = 분류 + 공급망 모드, 반도체만 +8대공정 모드)
- **② 기초이론(읽기형 학습)**: 과학 133단원·도해 131종(초/중/고/심화/SF)

## 1) 이어받는 법 (데스크탑)
```bash
git clone https://github.com/gmpark-creator/semiconductor-universe   # 또는 기존 클론에서 git pull
cd semiconductor-universe
git checkout main && git pull          # 최신 db769c0
npm install                            # 의존성 복원(simple-icons·react-spring·@fontsource 등)
npm run dev                            # http://localhost:5173
npm run build                          # tsc -b + vite build (검증용, 0에러여야)
npm run lint                           # eslint . (0이어야)
```
- 데이터·텍스처·도해·폰트 전부 **로컬**(런타임 외부호출 0). 포트 점유 시 이전 dev 프로세스 종료 후 재실행.

## 2) 작업 구조 (worktree 물리 격리 — standing)
- `semiconductor-universe`(branch **main**) = **통합 전용**. 직접 구현 금지, 박사 디렉팅으로 newton/codex를 FF 통합하는 곳.
- `../semiconductor-universe-newton`(branch **newton**) = **Claude 작업 전용**.
- `../semiconductor-universe-codex`(branch **codex**) = **Codex 작업 전용**.
- 통합 사이클: 각자 자기 worktree서 구현 → 게이트(build/lint) → 자기 브랜치 push → 박사 디렉팅으로 main FF 통합 → 대시보드 재배포.
- **현재 main=newton=codex=`db769c0`로 전부 정렬됨** (다음 슬라이스는 db769c0 기준 시작).
- ⚠️ **Codex 부재 시**(오늘처럼): Claude가 6차원 적대적 자가검수 워크플로로 교차검수 대체. Codex 복귀 시 정상 양방향 교차검수 재개.

## 3) 오늘(2026-06-02) 한 것
1. 새벽 데스크탑 작업(놀리지버스 6커밋+대시보드) 노트북 동기화·검증·정정.
2. **산업 영역 3개 신설**: 2차전지(기업21·분류13·edges37) · 디스플레이(16·12·18) · 철강·제련(14·14·20). 각각 6에이전트 웹검증 리서치 + 6차원 자가검수.
3. **5영역 전체 딥 재검토**: 1차 검수가 잘못 고친 것 역교정(SK온 6위·삼성SDI 9위·에코프로 45.5%·풍산 매출 +11%) + 신규 BLOCK(도우인시스 2025상장·뉴파워프라즈마 최대주주·QD-OLED 청색5층) 등 30여 건.
4. **제품별 3D 아이콘 24종 신설**: 신규 영역들이 반도체/전력 아이콘 재사용해 미스매치(양극재→DIMM 등)였던 것을 제품 전용 모델로 교체, 39 카테고리 재매핑(`CategoryNode.tsx`·`types.ts` IconKey).
   - ⚠️ **시각 최종확인 미완**(노트북에 헤드리스 렌더 도구 없음): 데스크탑에서 `npm run dev`로 5영역 분류 모드를 돌려보고 아이콘이 어색하면 해당 case만 다듬을 것.

## 4) 다음 작업 후보 (박사 발화 대기)
- 산업 6번째 영역(자동차·모빌리티 / 조선·방산 등) — 동일 파이프라인(리서치→작성→자가검수→통합→대시보드).
- 기초이론 새 과목(수학·사회 등).
- 3D 아이콘 시각 점검 후 미세 조정(데스크탑 렌더 확인).
- 번들 코드 스플리팅(현재 2.2MB+) — 라이브 프리뷰 로딩 개선.

## 5) 핵심 컨벤션 / 파일맵
- **새 산업영역 추가법**: `src/data/areas/<name>.ts`에 `AtlasArea` 1개(power.ts 자기완결형 패턴 참고) 작성 → `src/data/areas/index.ts` `AREAS[]`에 등록 → 백드롭 `public/textures/<name>-bg.svg` → 카테고리 icon은 `CategoryNode.tsx`의 IconKey case 사용(없으면 신설). AreaSelector·엔진은 데이터주도라 자동 노출.
- **3D 아이콘**: `src/data/types.ts`의 `IconKey` union + `src/scene/CategoryNode.tsx`의 `ProceduralIcon` switch. 카테고리는 `icon: <IconKey>`로 매핑(없는 키 쓰면 default=반도체 IC 폴백이니 주의).
- **공급망 좌표**: 실제 등기 본사 실좌표만(발명 금지). mapFocus 도시 좌표 베끼지 말 것. 동일도시 다수는 엔진(`companyLayout.ts`)이 링 분산.
- **대시보드 반영**(통합 후): `project-dashboard/claude/js/projects-data.js` #8(`id:'knowledge'`) 갱신 + `npm run build` → `dist/*`를 `project-dashboard/claude/previews/semiconductor-universe/`에 통째 복사(미리보기 재배포) → push. **progress 숫자는 박사 발화로만**(현재 1).
- **데이터 정확성 교훈**(오늘 반복 확인): 시총·매출·순위·지분·상장상태 등 '현재값'은 LLM 컷오프 지식으로 고치면 위험 → **웹검증(SNE 연간확정·전자공시) 우선**. 전사 vs 사업부 매출 혼동 주의. edge는 '직납 vs 경유' 구분.

## 6) 검수·기록
- 모든 작업·검수는 `internal/notes/claude-*-2026-06-02-*.md`에 영속화(배터리·디스플레이·철강·재검토·제품아이콘).
- GitHub: https://github.com/gmpark-creator/semiconductor-universe (public, main/newton/codex). 대시보드: gmpark-creator/project-dashboard.
- 라이브 프리뷰: https://gmpark-creator.github.io/project-dashboard/claude/previews/semiconductor-universe/
