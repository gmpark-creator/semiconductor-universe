# 신규 3영역 제품별 3D 아이콘 신설 — 2026-06-02 (Claude)

> 박사 지적: 배터리·디스플레이·철강 영역이 반도체/전력용 3D 아이콘을 재사용해 제품-이미지 불일치(예: 양극재 노드에 DIMM 메모리, OLED에 DIMM, 전기로에 전력 트랜지스터, 아연제련에 원자력 모형). "제품이랑 이미지랑 일치시켜라."

## 원인
`CategoryNode.tsx`의 `ProceduralIcon` switch가 IconKey별 절차적 3D 모델을 렌더하는데, 신규 영역들이 기존 17키(반도체 8·전력 9)를 재사용 → 미매칭 시 도메인 안 맞는 모델 + default는 반도체 IC패키지 폴백.

## 구현
- `types.ts` IconKey에 **신규 24키 추가**: (2차전지) cellStack·cellCyl·cellPrismatic·cellPouch·powder·beaker·film·coil·roller·solidBlock·recycle / (디스플레이) panel·foldable·molecule·microled·rollable / (철강·제련) furnace·arcFurnace·sheet·plate·rebar·wireRod·bar·ingot.
- `CategoryNode.tsx`에 **24개 제품 3D 모델 신설**(기존 패턴·PBR·카테고리색 emissive 동일):
  - 셀: 적층셀(cellStack)·원통형(cellCyl)·각형 캔+단자(cellPrismatic)·파우치+탭(cellPouch)
  - 소재: 분말+접시(powder)·비커 액체(beaker)·반투명 막(film)·동박/강판 롤(coil)
  - 장비/차세대: 롤투롤(roller)·고체결정(solidBlock)·재활용 화살표(recycle)
  - 디스플레이: 발광 패널+스탠드(panel)·힌지 폴더블(foldable)·볼-스틱 분자(molecule)·미세 화소격자(microled)·말린 패널(rollable)
  - 철강: 고로 타워+용융글로우(furnace)·전기로+전극3(arcFurnace)·판재(sheet)·후판 슬랩(plate)·리브 봉다발(rebar)·와이어 코일(wireRod)·둥근 봉다발(bar)·사다리꼴 잉곳적층(ingot)
- **카테고리 39개 아이콘 재매핑**(id별): 배터리 13·디스플레이 12·철강 13(steel-hyrex만 기존 h2tank 유지 — 수소탱크가 적합).
  - 공유: film(분리막·편광판·TFE·커버), coil(동박·열연), panel(RGB/WOLED/QD/LCD/리지드 5종), sheet(냉연·STS·전기강판), ingot(아연·동·귀금속), powder(양극·음극) — 동일 형상 제품군은 색·라벨로 구분.

## 게이트
- `npm run build` PASS(타입 0), `npm run lint` exit 0.
- 아이콘 커버리지: **5영역 전 카테고리 icon이 CategoryNode case로 해결**(default 폴백 0 = 반도체 칩 미스매치 완전 제거). CategoryNode 41 case(기존17+신규24).
- 런타임: 모든 모델이 표준 R3F intrinsic geometry(box/cylinder/sphere/torus/cone/octahedron 등)·valid material props·THREE import 사용. (헤드리스 렌더 도구 미설치 — 시각 최종확인은 대시보드 라이브 프리뷰에서 박사 확인 권장.)

## 비고
- 반도체·전력 기존 영역 아이콘은 그대로(영향 0).
- 동일 형상 다수 매핑(panel 5·sheet 3·ingot 3)은 제품군이 실제로 같은 형태라 색+라벨로 구분 — 추후 세분 아이콘 필요시 추가 가능.
