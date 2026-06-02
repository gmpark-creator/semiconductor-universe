# 산업 4번째 영역 「디스플레이」 신설 + 자가 적대적 검수 — 2026-06-02 (Claude)

> 박사 지시(2026-06-02): Knowledgeverse 산업 대분류 4번째 영역 = 디스플레이. Codex 토큰 소진 → Claude 자가 검수.
> 베이스라인 main=d5e36bd, worktree=semiconductor-universe-newton(newton).

## 산출물
- **신규 `src/data/areas/display.ts`** — `displayArea: AtlasArea`(power.ts 자기완결형 미러링).
  - 분류 **12노드** · 4 family(Panel·FormFactor·Material·Frontier): RGB OLED·WOLED·QD-OLED·LCD / 리지드·플렉시블폴더블 / 발광재료·편광판·TFE·커버윈도우(UTG·CPI) / Micro-LED·투명롤러블.
  - 공급망 **기업 16개** · 6 group(Panel·Material·Equipment·Component·Demand·Regulator): 패널(삼성D·LGD)·소재(덕산네오룩스·솔루스·동우화인켐·코오롱·도우인시스·이녹스)·장비(AP시스템·힘스·야스·선익)·구동칩(LX세미콘)·수요(삼성전자·LG전자)·규제(산업부).
  - **edges 18** + mapFocus=KOR(8→11 도시).
- **신규 `public/textures/display-bg.svg`** — RGB 서브픽셀·스캔라인 모티프(마젠타 액센트 #d946ef).
- `index.ts`에 `displayArea` 등록. 신규 IconKey 0(기존 재사용, CategoryNode 무수정).

## 데이터/방법
- 워크플로 `display-area-research`(6에이전트 웹검증, 실HQ좌표). 점유율 출처: 2025 OLED 출하 SDC≈37%·LGD≈12%·중국 51%+, 애플 아이폰17 SDC≈65%·LGD≈33%.

## 자가 적대적 검수(6차원, `display-hard-review`) 결과 → 반영
**런타임 CLEAN**(데이터주도 검증: 6그룹·mapFocus·process없음·아이콘·좌표분산 전부 안전, area-id 하드코딩 0건). 나머지 minor. 수정 반영:
- **좌표**: solus/dongwoo 둘 다 익산이나 실제 함열(북부)/신흥동(남부)로 12km 떨어짐 → 실좌표 분리(solus 36.05/126.962, dongwoo 35.93/126.989). sdc 탕정·inox 둔포 미세 보정.
- **기업사실**: 도우인시스 '비상장·상장추진' → **2026 코스닥 상장** 반영(삼성D ≈27.7% 최대주주). ⚠️**삼성전자 시총 500조→≈2,000조·LG전자 15조→≈60조 복원** — 내가 1월 컷오프 지식으로 과잉수정했으나 웹검증 결과 원 리서치(2026.6 주가 급등)가 옳았음. lxsemicon 매출 1.7~1.8→1.6~1.8조. 힘스 감소율 20→21% 통일.
- **과학**: Micro-LED 전사수율 '99.99% 목표/현재 99.5~99.8%'(이중 오류) → **식스나인(99.9999%) 요구·파일럿 99.99% 시연**으로 정정. QD-OLED '컬러필터 없어 손실 적음' 오해 → 'QD 색변환 기전(보조 CF는 외광·명암용 병용)'. 청색인광 '주목' → **2025 양산검증 진입(LGD·UDC)**.
- **edges**: **apsystem→LGD ELA 허위 삭제**(LGD ELA는 JSW, AP시스템 ELA는 SDC 전용). **kolon→SDC CPI 허위 삭제**(코오롱 CPI 고객은 화웨이·BOE 등 해외, 삼성은 UTG 채택). duksan '독점급'→완화. inox 봉지 edge 위해 optical 범례를 '편광·광학·봉지·커버'로 확장. ※의심 5건(yas→sdc 등)은 검수 결과 모두 정확(yas→sdc는 애초 없었고 yas→lgd만 존재) — 무수정. ※kolon은 정직하게 **고립 노드 유지**(한국 패널사 연결 없음).
- **정합**: kolon weight 760→520(디스플레이 비중 작다는 자기서술 정합). 헤더 컷오프 2026.1→2026. 지도 도시 화성·인천·세종 추가. yas '증착원 유일급'으로 한정(선익 증착기와 중복 해소).

## 게이트(수정 후)
- `npm run build` PASS(타입 0), `npm run lint` exit 0, 참조무결성 OK(16기업·18edges·미존재참조0·중복0).

## 교훈
- **시장 시총 등 '현재값'은 웹검증 리서치 > 내 1월 컷오프 지식.** 삼성/LG 시총을 내가 "환각"으로 오판해 잘못 낮췄다가 검수에서 복원. 컷오프 이후 주가 급등을 반영 못한 것.
- 비상장→상장 같은 status 변화도 stale 위험(도우인시스).

## 다음
- main 통합·대시보드 반영은 박사 디렉팅 대기. (배터리 영역도 newton에 미통합 대기 중)
