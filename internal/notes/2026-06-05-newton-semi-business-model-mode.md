# Newton Receipt — 반도체 「사업 모델」(팹리스/파운드리/IDM) 모드 신설

- 작성: Newton (Claude), 2026-06-05
- 브랜치: `newton` (95a13c7 위)
- 박사 지시: "반도체 유니버스에서, 팹리스 회사 / 파운드리 회사 / IDM 회사별로 묶어서 업체별로 설계, 제조 각각 뭐뭐하는지 설명할 수 있는 항목을 다시 만들어서 추가"

## 구현 (반도체 전용 「사업 모델」 모드 — 핵에너지 모드와 동일 패턴)

데이터 주도 선택 모드. ViewToggle에 `분류 · 공급망 · 공정 · 사업 모델` 4번째 탭(반도체만 노출).

- `src/data/types.ts` — `BusinessModelCompany / BusinessModelGroup / BusinessModelInfo` + `AtlasArea.businessModel?`
- `src/scene/Scene.tsx` — `Mode`에 `"businessModel"` 추가(배경만 렌더)
- `src/ui/ViewToggle.tsx` — `area.businessModel` 있으면 「사업 모델」 모드 버튼
- `src/data/semiconductorBusinessModel.ts` (신규) — 데이터(워크플로 생성·검증)
- `src/data/areas/semiconductor.ts` — import + `businessModel: SEMI_BUSINESS_MODEL`
- `src/ui/BusinessModelPanel.tsx` (신규) — 모드 뷰: 그룹 3개 + 설계 vs 제조 요약 매트릭스 + 업체 카드(설계=초록 / 제조=파랑 + oneLiner + note)
- `src/views/IndustryView.tsx` — `overlayMode = nuclear || businessModel`로 일반화(2D 오버레이 모드는 목록/범례/인포패널 숨김), `mode==="businessModel"` 패널 렌더, sr-only 라벨 분기

## 콘텐츠 (워크플로 6에이전트: 초안 3 + 적대적 사실검증 3)

기존 `companies.ts` 기업 셋을 사업모델로 묶어 업체별 설계·제조 역할 서술(2024~2025 개념). 빈값 0·회사수 일치·id 중복 0 검증.

- **팹리스(6)**: NVIDIA·Apple·AMD·Broadcom·Qualcomm·MediaTek — 설계 O / 제조 X(TSMC 등 위탁)
- **파운드리(5)**: TSMC·Samsung Foundry·Intel Foundry·GlobalFoundries·SMIC — 설계 X(고객 위탁) / 제조 O
- **IDM(8)**: Intel·Samsung·SK hynix·Micron·TI·Infineon·STMicro·ADI — 설계 O / 제조 O

적대적 검증이 반영한 디테일: AMD의 GF 분사·I/O는 GF 위탁, Samsung의 LSI/메모리/파운드리 사업부 분리, GlobalFoundries 비선단(성숙·특화), SMIC EUV 제재 한계, Intel IDM 2.0(타일 TSMC 위탁), ADI 팹라이트 하이브리드, SK hynix HBM 베이스다이 TSMC 협력 등.

## 검증

```
npm run lint   PASS (eslint 0)
npm run build  PASS (tsc -b 타입 통과 + vite build; 기존 chunk-size warning만)
번들: "사업 모델" 모드 라벨·"팹리스 (Fabless)"·intro·"팹라이트"(ADI) 등 present
데이터 게이트: 그룹 3, fabless6/foundry5/idm8, 필드 빈값 0, 회사 id 중복 0
```

## 한계 / Codex 사후검수 요청

- 브라우저 라이브 미실측. CDP/Playwright로 확인 요망:
  - 반도체 영역 ViewToggle에 「사업 모델」 노출(타 영역 미노출), 클릭 시 패널 표시·복귀
  - 3그룹·19개사 카드, 설계/제조 구분, 390px 수평 오버플로 0, console error 0
  - 패널이 상단 토글/영역선택기 안 가림(z-15·pt-78)
  - 영역 전환 시 taxonomy 리셋
- 사실 정확성(분류·설계/제조 서술) 재검증 권장.
- newton 브랜치. main 통합은 별도(박사 디렉팅/Codex 검수 후).
