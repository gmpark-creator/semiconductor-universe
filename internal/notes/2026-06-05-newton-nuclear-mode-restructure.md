# Newton Receipt — 핵에너지를 전력 전용 「모드」로 재구성

- 작성: Newton (Claude), 2026-06-05
- 브랜치: `newton` (codex df133fb fast-forward 후 그 위에 재구성)
- 박사 지시: "지금 핵융합vs핵분열로 왼쪽 아래에 따로 창 눌러야되게끔 되어있는데, 전력 카테고리안에다가 따로 넣어서 구분해주고 만들어주라"

## 배경

Codex 1차 구현(df133fb)은 전력 영역에서 **좌하단 플로팅 런처 버튼**을 눌러 **모달**을 띄우는 방식이었다. 박사 요청 = 전력 카테고리 안에 분류·공급망과 **동급으로 구분된 모드**로 편입.

## 변경 (좌하단 팝업 → ViewToggle 전력 전용 모드)

데이터 주도 방식으로, 기존 `process`(반도체 전용) 모드와 동일한 패턴을 따랐다.

- `src/data/types.ts` — `NuclearModeInfo {hint, listTitle}` 인터페이스 + `AtlasArea.nuclear?` 선택 필드 추가.
- `src/scene/Scene.tsx` — `Mode` 유니언에 `"nuclear"` 추가. (nuclear 모드는 노드 없이 배경만 렌더 — 기존 조건부가 자연 처리.)
- `src/ui/ViewToggle.tsx` — `area.nuclear` 있으면 「핵에너지」 모드 버튼을 분류·공급망 옆에 추가(전력만 노출).
- `src/data/areas/power.ts` — `nuclear: { hint, listTitle:"핵에너지" }` 부여(전력 영역만).
- `src/ui/NuclearParadigmPanel.tsx` — **모달 → 모드 뷰로 전환**: `open`/`onClose` props·Escape 핸들러·dialog(aria-modal)·X 닫기 버튼 제거. 루트를 `role="region"` 풀-영역 패널로(상단 ViewToggle 아래 `pt-78`, `z-15`로 상단 크롬 아래). 헤더 문구를 "전력 유니버스의 한 모드" 안내로 수정. 콘텐츠(핵분열/핵융합 비교 그리드·연료 로그차트·GW 계산기·라우터 카드)는 그대로.
- `src/views/IndustryView.tsx` — 좌하단 런처 버튼 + `nuclearOpen` 상태 + 모달 호출 제거. `mode==="nuclear" && area.nuclear`일 때 `<NuclearParadigmPanel/>` 렌더. 핵 모드에서는 ItemList·Legend·InfoPanel·모드안내 숨김. sr-only 접근성 라벨에 핵에너지 분기 추가.

## 검증

```
npm run lint   PASS (eslint 0)
npm run build  PASS (tsc -b 타입체크 통과 + vite build; 기존 chunk-size warning만)
번들 확인: "핵에너지" 모드 라벨 present, power.ts nuclear hint present,
           좌하단 런처 eyebrow "Nuclear Paradigm" 0건(제거 확인), 패널 헤더 present
```

## 한계 / Codex 사후검수 요청

- 브라우저 라이브 렌더는 미실측(node 환경). 다음을 CDP/Playwright로 확인 요망:
  - 전력 영역 ViewToggle에 「핵에너지」 버튼 노출(반도체·타 영역엔 미노출)
  - 모드 클릭 시 핵 패널 표시 + 분류/공급망 복귀 정상, 영역 전환 시 taxonomy로 리셋
  - 패널이 상단 ViewToggle/AreaSelector를 가리지 않음(z-15·pt-78), 390px 수평 오버플로 0
  - GW 슬라이더/숫자 입력 → count-up 갱신, 로그차트 렌더, console error 0
  - 기존 Three/WebGL warning 외 신규 오류 0
- 본 작업은 `newton` 브랜치. main 통합은 별도(박사 디렉팅/Codex 검수 후).
