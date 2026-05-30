# 반도체 유니버스 (Semiconductor Universe)

반도체 산업을 **인터랙티브 3D**로 탐험하는 시각화 — 칩의 분류 체계와, 그 칩을 만드는 공급망을 함께 보여줍니다. React + Three.js 로 제작했고 **UI는 전부 한국어**입니다.

## 무엇인가

우측 상단 토글로 전환하는 두 가지 3D 뷰:

- **칩 분류 (Taxonomy)** — 반도체 카테고리가 패밀리별(로직·메모리·아날로그·전력·센서·RF·제조) 별자리처럼 배치된 발광 노드. 각 노드는 간단한 프로시저럴 아이콘으로 표현. 호버 시 강조, 클릭하면 카메라가 날아 들어가며 정의·역할·핵심 사양·예시 제품 패널이 열림.
- **공급망 (Supply Chain)** — 자전하는 **지구**를 둘러싼 궤도에 기업이 **앰블럼 배지**(공식 로고 또는 워드마크)로 떠 있고, 배지 크기 ∝ √시가총액. 기업 간 관계(설계→파운드리 발주, 파운드리/메모리→고객 납품, 장비→파운드리, IP·EDA→설계사)를 색상별 흐름 화살표(곡선 튜브 + 이동 입자)로 표현. 클릭하면 가치·사업·거래 관계 패널이 열림.

배경은 NASA 지구 텍스처(낮/노멀/구름/야간조명) + 프레넬 대기광 셰이더로 렌더한 지구. 부드러운 Bloom, 글래스모피즘 HUD, 호버 툴팁, 자동 회전(조작 시 일시정지), 매끄러운 카메라 fly-in을 갖춤. `prefers-reduced-motion`을 존중.

## 실행

```bash
npm install
npm run dev      # → http://localhost:5173 (점유 시 5174)
```

프로덕션 빌드 / 미리보기:

```bash
npm run build    # tsc 타입체크 + vite 프로덕션 번들
npm run preview
npm run lint     # eslint
```

## 기술 스택

Vite · React + TypeScript · Three.js ([`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) + [`@react-three/drei`](https://github.com/pmndrs/drei)) · `@react-three/postprocessing`(Bloom) · Tailwind CSS(HUD 오버레이) · framer-motion(패널 전환).

백엔드 없음. **런타임 외부 호출 0** — 모든 데이터·지구 텍스처·로고가 로컬이며, 폰트도 [`@fontsource`](https://fontsource.org)(Inter)로 자체 호스팅(한글은 OS 시스템 폰트로 폴백). 지구 텍스처와 기업 로고는 빌드 타임에 번들에 포함됨.

## 데이터 수정

모든 수치는 편집하기 쉬운 두 개의 평문 파일에 있음:

- **`src/data/semiconductors.ts`** — 칩 카테고리: `id, name, family, color, icon, definition, role, keySpecs[], exampleProducts[]` + 한글 라벨 맵 `FAMILY_LABEL_KO`.
- **`src/data/companies.ts`** — 기업 노드(`marketCapB`, `revenueB`, `type`, `group`, `note`)와 공급망 엣지(`from → to`, `relationship`, `label`) + 한글 라벨 맵 `GROUP_LABEL_KO`.

이 파일의 숫자/텍스트를 바꾸면 3D 씬(노드 크기·색·화살표·패널)이 자동으로 갱신됨.

## 정확도

> **수치는 ~2026년 초 기준 근사치이며 일러스트 목적입니다.** 시가총액·매출·점유율은 개념 매핑을 위한 반올림 추정값으로, 재무 데이터나 출처 기준이 아닙니다.

## 프로젝트 구조

```
src/
  data/semiconductors.ts   # 칩 카테고리 데이터 + 타입 + 한글 라벨
  data/companies.ts        # 기업 노드 + 공급망 엣지 + 한글 라벨
  scene/Scene.tsx          # 메인 R3F 캔버스 (모드, Bloom, 컨트롤, 카메라 fly-to)
  scene/Earth.tsx          # 지구 본체/구름/대기광 셰이더 (EARTH_RADIUS=5)
  scene/CategoryNode.tsx   # 카테고리별 3D 노드 + 프로시저럴 아이콘
  scene/CompanyGraph.tsx   # 공급망 그래프 (앰블럼 + 화살표 엣지)
  scene/CompanyEmblem.tsx  # 기업 앰블럼 배지 (simple-icons 로고/워드마크) + 글로우
  scene/companyLayout.ts   # 그룹 색·클러스터 좌표·노드 배치 계산
  scene/SupplyArrow.tsx    # 곡선 튜브 + 흐르는 입자 방향 화살표
  ui/InfoPanel.tsx         # 우측 슬라이드 상세 패널 (framer-motion)
  ui/Legend.tsx            # 모드별 색상 범례
  ui/ViewToggle.tsx        # 칩 분류 ↔ 공급망 토글
  App.tsx                  # 캔버스 + HUD 오버레이 + 로딩 + 접근성 대체 콘텐츠
public/textures/           # 지구 텍스처 5종 (로컬)
```

## 라이선스/출처 메모

- 지구 텍스처: 8K day/night 맵 — [Solar System Scope](https://www.solarsystemscope.com/textures) (CC BY 4.0). 노멀맵은 three.js 경유 NASA Blue Marble 계열. 모두 빌드 타임에 로컬 번들.
- 기업 로고: [`simple-icons`](https://simpleicons.org)(로컬 npm, 오픈소스 브랜드 아이콘). 상표권은 각 사 소유 — 일러스트용 명목적 사용.
