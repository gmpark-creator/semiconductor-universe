# HANDOFF — 반도체 유니버스 (이어받기용)

> 랩탑에서 여기까지 작업. 집 데스크탑에서 그대로 이어받아 아래 **수정 체크리스트**를 하나씩 처리하면 됩니다.
> 마지막 상태: `tsc + vite build` 통과, dev 서버 정상 구동 확인. 코드는 **건드리지 않은 깨끗한 베이스라인**입니다.

## 1) 이어받는 법

```bash
git clone https://github.com/gmpark-creator/semiconductor-universe
cd semiconductor-universe
npm install          # simple-icons 포함 모든 의존성 복원
npm run dev          # http://localhost:5173 (점유 시 5174로 뜸)
npm run build        # 타입체크 + 프로덕션 번들 (검증용)
```

- 포트 충돌(`Port 5173 is in use`)이면 이전 dev 프로세스가 살아있는 것 → 그 node 프로세스 종료 후 재실행.
- 모든 데이터·지구 텍스처·로고는 **로컬**. (단 폰트만 예외 → 수정 #7)

## 2) 이번 라운드에 끝낸 것 (DONE)

- **우주 배경 → 지구 배경**: `src/scene/Earth.tsx` — NASA 지구 텍스처(낮/노멀/구름/야간조명, `public/textures/`) + 프레넬 대기광 셰이더 + 자전. 별필드(Stars) 제거.
- **동그라미 → 기업 앰블럼**: `src/scene/CompanyEmblem.tsx` — 카메라를 향하는 빌보드 배지, 크기 ∝ √시가총액.
  - 공식 로고 8개사(simple-icons): NVIDIA·Apple·AMD·Qualcomm·Broadcom·Intel·Samsung·ARM
  - 워드마크 배지 8개사(로고 미보유): SK hynix·Micron·TI·TSMC·ASML·AMAT·Synopsys·Cadence
- **전체 한글화**: 데이터(`src/data/*`) + UI(`src/ui/*`, `src/App.tsx`, `index.html`) 한국어. 한글 라벨 맵 `FAMILY_LABEL_KO`/`GROUP_LABEL_KO` 추가. Noto Sans KR 폰트.
- 회사 클러스터를 지구 바깥 궤도(반경 ≈13)로 재배치.

## 3) 수정 체크리스트 (자동 다각도 검수 + 적대적 검증 결과)

> 출처: ultracode 검수 워크플로우(runtime·korean·visual·spec 4차원 → 발견별 적대적 재검증). ✅ = 검증 통과(진짜 이슈).

### P1 — 기능/시각 (눈에 띔)
- [ ] **#1 ✅ 자동 회전이 사실상 멈춤** — `src/scene/Scene.tsx` `useFrame`의 `camera.position.lerp`가 *선택이 없을 때도* 매 프레임 고정점으로 카메라를 당겨 `autoRotate`를 상쇄(정상 ~2.4°/s가 ~0.67° 고정으로 죽음).
  - 고치기: `selectedId`가 없을 땐 `camera.position.lerp`를 스킵(타깃이 이미 원점이라 부작용 없음). 선택 시에만 fly-to lerp 적용.
- [ ] **#2 ✅ (visual, major) Designer 클러스터가 지구 정면 정중앙** — `src/scene/CompanyGraph.tsx` `GROUP_CENTERS.Designer = [0,3,13]`이 카메라([0,7,44])→원점 축에 일직선. Designer는 **5개사**(NVIDIA·Apple·AMD·Qualcomm·Broadcom)이고 supply 기본 카메라에서 지구가 각반경 ~6.4° 차지 → 5개 앰블럼/글로우가 전부 지구 원반 위에 겹쳐 보임(`depthWrite:false`+`toneMapped:false`).
  - 고치기: ⚠️ **단순히 `[4,4,12]`로 바꾸는 건 부족**(궤도반경 3.4 > 오프셋 4라 5개 중 3개 여전히 겹침). 더 크게 축에서 비끼거나(예 x·z 합쳐 충분히), **또는** 배지 뒤에 어두운 스크림 추가, **또는** reset 시 카메라 타깃을 살짝 오프셋. 브라우저로 supply 뷰 확인하며 조정.
- [ ] **#3 (visual, major) Bloom 과다 위험** — `src/scene/Scene.tsx` Bloom `luminanceThreshold=0.22`(낮음) + 앰블럼/화살표 `toneMapped=false` + 가산 대기광 → 흰 로고·작은 워드마크(Synopsys/cadence) 번짐 가능.
  - 고치기: `luminanceThreshold ≈ 0.4~0.55`, `intensity ≈ 0.5`로 낮추고, **배지 plane(`CompanyEmblem.tsx`)의 `toneMapped={false}`는 글로우/입자에만** 남기고 배지엔 끄기 검토. 브라우저에서 supply 뷰(지구 앞 Designer)로 확인.

### P2 — 마감/일관성
- [ ] **#4 (visual, minor) 클러스터 내 투명 평면 정렬 깜빡임** — 밀집 클러스터(Designer/IDM)에서 `depthWrite:false` 배지들이 겹칠 때 카메라 회전 중 앞뒤 순서가 프레임마다 바뀜.
  - 고치기: 배지에 `renderOrder` 부여 / 글로우 `scale` 1.75 축소 / 클러스터 간격(`r`) 확대 중 택1.
- [ ] **#5 ✅ aria-label 영어 잔존** — `src/ui/InfoPanel.tsx:54` `aria-label="Close panel"` → `"패널 닫기"` (스크린리더 한글화).
- [ ] **#6 ✅ README가 옛 버전** — `README.md`가 아직 "starfield / company spheres / No external API calls"라고 적혀 있어 이번 변경과 불일치. 본 변경(지구/앰블럼/한글/폰트) 반영해 갱신.

### P3 — 정책/선택
- [ ] **#7 ✅ Google Fonts만 런타임 외부 로딩** — `index.html`의 `fonts.googleapis.com`/`fonts.gstatic.com`. "전부 로컬·런타임 외부호출 없음"을 100% 지키려면 `@fontsource/inter` + `@fontsource/noto-sans-kr`로 self-host 후 `<link>` 제거.
- [ ] **#8 워드마크 8개사 → 진짜 로고** — 공식 SVG 확보 시 `src/scene/CompanyEmblem.tsx`의 `LOGO_PATHS`에 path 추가하면 자동으로 로고 렌더. (SK hynix·Micron·TI·TSMC·ASML·AMAT·Synopsys·Cadence)

### 비이슈(참고로 확인된 것)
- 지구↔노드 **기하 간섭 없음**(최소 여유 ~3.7유닛). 카메라 프레이밍 OK.
- `public/textures/earth_specular_2048.jpg`는 현재 **미사용**(원하면 `Earth.tsx`에서 `roughnessMap`/`metalnessMap`로 활용 가능 — 단 바다=매끈 되도록 반전 주의).

## 4) 파일 맵 (어디를 만지나)

```
src/scene/Scene.tsx        # 카메라/자동회전(#1), Bloom(#3), 조명, 지구 배치
src/scene/Earth.tsx        # 지구 본체/구름/대기광 셰이더 (EARTH_RADIUS=5)
src/scene/CompanyEmblem.tsx# 앰블럼 배지/로고경로(#8)/글로우/크기(toneMapped #3)
src/scene/CompanyGraph.tsx # GROUP_CENTERS 클러스터 위치(#2), 화살표 렌더
src/scene/CategoryNode.tsx # 칩 분류 모드 프로시저럴 아이콘
src/scene/SupplyArrow.tsx  # 곡선 튜브 + 흐르는 입자 + 화살촉(toneMapped #3)
src/ui/InfoPanel.tsx       # 우측 슬라이드 패널 (aria #5)
src/ui/Legend.tsx, ViewToggle.tsx  # 범례 / 모드 토글
src/data/semiconductors.ts # 카테고리 데이터 + FAMILY_LABEL_KO
src/data/companies.ts      # 기업/엣지 데이터 + GROUP_LABEL_KO
index.html                 # 폰트 링크(#7), 제목/메타
README.md                  # 갱신 필요(#6)
public/textures/           # 지구 텍스처 5종(로컬)
```

## 5) 출처/라이선스 메모
- 지구 텍스처: three.js(MIT) 저장소 경유 NASA Blue Marble 계열(공개도메인 이미지). 빌드타임에 받아 로컬 번들.
- 기업 로고: `simple-icons`(로컬 npm, 오픈소스 브랜드 아이콘). 상표권은 각 사 소유 — 일러스트용 명목적 사용.
