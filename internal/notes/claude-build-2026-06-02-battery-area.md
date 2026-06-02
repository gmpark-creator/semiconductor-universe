# 산업 3번째 영역 「2차전지(배터리)」 신설 — 2026-06-02 (Claude)

> 박사 지시(2026-06-02): Knowledgeverse 산업 대분류에 반도체·전력에 이어 **3번째 영역 = 2차전지(배터리)** 추가.
> 기준 베이스라인 main=d5e36bd, 작업 worktree=semiconductor-universe-newton(newton).

## 산출물
- **신규 `src/data/areas/battery.ts`** — `batteryArea: AtlasArea` (power.ts 자기완결형 미러링).
  - 분류(taxonomy) **13노드** · 4 family(Cell·Material·Equipment·Frontier).
  - 공급망(supply) **기업 21개** · 8 group(Cell·Cathode·AnodeFoil·ElyteSep·Equipment·Recycle·Demand·Regulator).
  - **edges 36개** (양극·음극/동박·전해질/분리막·장비 → 셀, 셀 → 완성차, 셀 → 재활용, 규제).
  - mapFocus=KOR(배터리 클러스터 도시 8: 청주/오창·포항·울산·군산/새만금·익산 등).
  - 상세지표(DETAILS) 21개사 listing/시총/주주/재무.
- **신규 `public/textures/battery-bg.svg`** — 배터리 셀·이온플로·충전 모티프(그린 액센트).
- **`src/data/areas/index.ts`** — `batteryArea` 등록(AREAS 배열). AreaSelector 데이터주도라 등록만으로 자동 노출.
- **신규 아이콘/컴포넌트 0** — 기존 IconKey 재사용(battery·cube·grid·fabric·sine·wave·wafer·atom·h2tank). CategoryNode 무수정(저위험).

## 데이터 출처/방법
- 워크플로 `battery-area-research`(6에이전트 병렬, WebSearch 교차검증): 셀3사 / 양극재 / 음극·동박 / 전해질·분리막·장비·재활용·수요·규제 / 분류 / 시장점유·edges.
- **본사 좌표는 실제 등기 본사 소재지 실좌표**(도시·구 단위 근사, 발명 금지 규칙 준수). 수치는 2025~2026.1 공개자료 근사(≈), 투자정보 아님.
- 점유율 출처 예: SNE/cnevpost(2025 글로벌 EV배터리 ≈1,187GWh, CATL ≈39%·BYD ≈16%·LG엔솔 ≈9%·SK온 ≈3.7%·삼성SDI ≈2.4%), K3사 합산 ≈15%.

## 게이트
- `npm run build`(tsc -b && vite build) PASS(타입 0에러), `npm run lint` exit 0.
- 참조 무결성 스크립트 검증: 21기업 고유, edge 36건 전부 실존 기업 참조, relationship 7종 정의, badge·DETAILS 21/21, icon/family/group 키 전부 유효.

## 적대적 사실검증(2렌즈) 결과 → 반영
워크플로 `battery-data-verify`(과학·기술 / 기업·산업·좌표). **BLOCK 0**, minor-issues. 핵심(NCM vs LFP 트레이드오프·46파이 ≈5~6배 부피검산·상장코드 16개사 전수일치·모자회사관계·2025 점유율·공급관계) 모두 사실 부합. 수정 4건 반영:
1. (WARN) 원통형 셀 keySpec ③↔④ '셀 수' 모순 → ④를 '원통형 vs 각형·파우치' 비교로 명확화.
2. (WARN) 씨아이에스(CIS) 본사 오류 → 등기본사 **대구 동구 봉무동**(신규투자처 달성 아님)으로 hqText·좌표(35.93/128.66)·detail 정정.
3. (NOTE) LFP 에너지밀도 상한 200 낙관 → '≈150~190Wh/kg급, 최신 셀 200 근접'으로 보수화.
4. (NOTE) LG엔솔 LG화학 지분 → '≈81.8%(2025 공시; 유동화로 점진 축소 중)' 단서 추가.
- 잔여 NOTE(엔켐 북미 50%+): 이미 '≈·비중국권 한정' 단서 있어 유지.

## 다음
- main 통합은 **박사 디렉팅 대기**(newton→main). 통합 후 대시보드 #8 데이터+라이브 프리뷰 재배포 예정.
- Codex 교차검수 대상(구현/구조 관점). codex 워크트리는 d5e36bd 정렬 필요(현재 1eda0dd).
