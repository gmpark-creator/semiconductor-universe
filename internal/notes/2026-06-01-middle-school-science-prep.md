# Knowledge Atlas 기초이론 - 중학교 과학 준비 노트

Date: 2026-06-01
Slice: KA-MIDSCI-PREP-1

## 1. 현재 구현 감사

- 실제 Project 8 Knowledge Atlas 코드는 `C:\Users\User A\Desktop\새 폴더\semiconductor-universe`에 있다. `laptop PROJECT CODE`는 DDuim sports 계열 저장소라서 이번 작업 대상이 아니었다.
- 최신 `main` 커밋 `7ee3fbf`에서 대분류 2층 구조가 이미 들어갔다.
  - `App.tsx`: `industry` / `theory` 섹션 전환.
  - `src/views/IndustryView.tsx`: 기존 반도체, 전력 3D 아틀라스 유지.
  - `src/views/TheoryView.tsx`: 기초이론 2D 학습 뷰.
  - `src/data/theory/*`: 초등학교 과학 데이터.
- 초등 과학은 `grade3.ts`~`grade6.ts`와 `public/figures/science/*.svg` 22개가 준비되어 있다.
- `중학교`, `고등학교`는 `src/data/theory/index.ts`에서 `status: "coming"`, `grades: []` 상태다.
- 현재 도메인 타입은 4개뿐이다.
  - `운동과 에너지`
  - `물질`
  - `생명`
  - `지구와 우주`
- 2022 개정 중학교 과학에는 통합 성격의 `과학과 사회` 단원이 있으므로, 중학교 구현 전에 `ScienceDomain`에 `과학과 사회`를 추가하는 편이 맞다.

## 2. 조사 기준

중학교 과학은 2022 개정 교육과정을 기준으로 잡는다. 공식 교육과정은 학년별 고정 진도보다 `중학교 1~3학년군` 성취기준을 중심으로 제시된다. 앱에서는 사용자가 공부하기 쉽게 `중1`, `중2`, `중3`으로 나누되, 이는 구현 편의상의 순서다. 학교와 출판사에 따라 단원 배치가 일부 다를 수 있다.

참고 출처:

- NCIC 국가교육과정정보센터, 2022 개정 초중등학교 교육과정 고시 안내: https://ncic.go.kr/board/B0033.cs?act=read&bwrId=2105&pageIndex=1&pageUnit=10
- 교육부 고시 제2022-33호 [별책 9] 과학과 교육과정: 위 NCIC 고시의 과학과 교육과정 별책을 기준 출처로 둔다.
- 한국과학창의재단, 2022 개정 과학과 교육과정 시안 최종안 개발 연구: https://cdn.kosac.re.kr/files/legacy_data/jnrepo/upload/jnBrdBoard/202304/a6819baa69b640648e861c4080fba452_1682063071411.pdf
- 한국과학창의재단, 중등 과학 탐구활동 평가 방안 탐색 및 자료 개발 연구: https://cdn.kosac.re.kr/files/cms/attach/202503/ddc61f4282e54ab699b2f2939291f167_1743147470127.pdf
- 한국물리학회 웹진, 2022 개정 과학과 교육과정 개관: https://webzine.kps.or.kr/?idx=16893&p=5_view

## 3. 중학교 과학 구현 단원안

아래 23개 단원을 `middle1.ts`, `middle2.ts`, `middle3.ts`로 나누면 바로 데이터화하기 좋다.

### 중1 추천 배치

1. 과학과 인류의 지속가능한 삶
   - domain: `과학과 사회`
   - figureId: `science-society-sustainability`
   - lessons: 과학의 역할, 과학기술과 문명, 지속가능한 삶과 의사결정
   - keyTerms: 과학적 소양, 지속가능발전, 과학기술, 증거 기반 의사결정

2. 생물의 구성과 다양성
   - domain: `생명`
   - figureId: `cell-diversity`
   - lessons: 세포와 생물의 구성 단계, 생물다양성과 분류, 생물다양성 보전
   - keyTerms: 세포, 조직, 기관, 종, 생물다양성, 분류

3. 열
   - domain: `운동과 에너지`
   - figureId: `heat-transfer-middle`
   - lessons: 온도와 열의 차이, 전도 대류 복사, 열평형과 단열
   - keyTerms: 온도, 열, 열평형, 전도, 대류, 복사

4. 물질의 상태 변화
   - domain: `물질`
   - figureId: `state-change-particle`
   - lessons: 입자 운동과 세 가지 상태, 융해 응고 기화 액화 승화, 상태 변화와 열에너지
   - keyTerms: 입자, 상태 변화, 융해, 기화, 액화, 승화, 잠열

5. 힘의 작용
   - domain: `운동과 에너지`
   - figureId: `force-interaction`
   - lessons: 힘의 표현과 단위, 힘의 평형, 여러 가지 힘과 일상 사례
   - keyTerms: 힘, 뉴턴, 화살표, 평형, 중력, 마찰력, 탄성력

6. 기체의 성질
   - domain: `물질`
   - figureId: `gas-laws`
   - lessons: 기체 압력과 입자 운동, 압력-부피 관계, 온도-부피 관계와 확산
   - keyTerms: 기체 압력, 부피, 온도, 입자 모형, 보일 법칙, 샤를 법칙, 확산

7. 태양계
   - domain: `지구와 우주`
   - figureId: `solar-system-middle`
   - lessons: 태양계 천체, 지구형 행성과 목성형 행성, 달의 위상과 일식 월식
   - keyTerms: 행성, 위성, 소행성, 지구형 행성, 목성형 행성, 달의 위상, 식

8. 물질의 특성
   - domain: `물질`
   - figureId: `material-properties`
   - lessons: 물질을 구별하는 성질, 밀도와 용해도, 녹는점과 끓는점
   - keyTerms: 물질의 특성, 밀도, 용해도, 녹는점, 끓는점

### 중2 추천 배치

9. 지권의 변화
   - domain: `지구와 우주`
   - figureId: `geosphere-rock-cycle`
   - lessons: 지구 내부 구조, 암석과 암석 순환, 판의 경계와 지진 화산
   - keyTerms: 지권, 지각, 맨틀, 암석 순환, 판 구조론, 지진, 화산

10. 빛과 파동
   - domain: `운동과 에너지`
   - figureId: `light-wave`
   - lessons: 파동의 표현, 빛의 반사와 굴절, 색과 상
   - keyTerms: 파동, 진폭, 파장, 진동수, 반사, 굴절, 렌즈

11. 물질의 구성
   - domain: `물질`
   - figureId: `atom-periodic-table`
   - lessons: 원자와 분자, 원소와 주기율표, 이온과 전하
   - keyTerms: 원자, 분자, 원소, 주기율표, 이온, 전하

12. 식물과 에너지
   - domain: `생명`
   - figureId: `photosynthesis-respiration`
   - lessons: 식물의 기관, 광합성, 호흡과 양분 이동
   - keyTerms: 뿌리, 줄기, 잎, 엽록체, 광합성, 호흡, 증산작용

13. 동물과 에너지
   - domain: `생명`
   - figureId: `body-energy-systems`
   - lessons: 소화와 흡수, 순환과 호흡, 배설과 항상성의 기초
   - keyTerms: 소화, 흡수, 순환, 호흡, 배설, 영양소, 에너지

14. 전기와 자기
   - domain: `운동과 에너지`
   - figureId: `electricity-magnetism`
   - lessons: 전류 전압 저항, 전기 에너지와 안전, 전류의 자기 작용
   - keyTerms: 전류, 전압, 저항, 회로, 옴의 법칙, 자기장, 전자석

15. 별과 우주
   - domain: `지구와 우주`
   - figureId: `stars-galaxy-universe`
   - lessons: 별의 밝기와 색, 별자리와 거리, 은하와 우주 구조
   - keyTerms: 별, 등급, 색, 별자리, 광년, 은하, 우주

### 중3 추천 배치

16. 화학 반응의 규칙성
   - domain: `물질`
   - figureId: `chemical-reaction-laws`
   - lessons: 화학 반응식, 질량 보존, 일정 성분비와 기체 반응
   - keyTerms: 화학 반응, 반응물, 생성물, 질량 보존 법칙, 일정 성분비 법칙, 기체 반응 법칙

17. 날씨와 기후변화
   - domain: `지구와 우주`
   - figureId: `weather-climate-change`
   - lessons: 기권과 날씨 요소, 기압과 바람, 기후변화와 온실 기체
   - keyTerms: 기권, 기압, 바람, 구름, 강수, 기후, 온실 효과, 기후변화

18. 수권과 해수의 순환
   - domain: `지구와 우주`
   - figureId: `ocean-circulation`
   - lessons: 수권의 구성, 해수의 성질, 표층 순환과 대기 대순환의 연결
   - keyTerms: 수권, 해수, 염분, 수온, 해류, 표층 순환, 대기 대순환

19. 운동과 에너지
   - domain: `운동과 에너지`
   - figureId: `motion-energy-graph`
   - lessons: 속력과 운동 그래프, 일과 에너지, 역학적 에너지 전환
   - keyTerms: 속력, 시간-거리 그래프, 일, 에너지, 운동 에너지, 위치 에너지, 에너지 전환

20. 자극과 반응
   - domain: `생명`
   - figureId: `nerve-response`
   - lessons: 감각 기관, 신경계와 반응 경로, 호르몬과 항상성
   - keyTerms: 자극, 감각 기관, 뉴런, 신경계, 반응, 호르몬, 항상성

21. 생식과 유전
   - domain: `생명`
   - figureId: `reproduction-genetics`
   - lessons: 세포 분열, 생식과 발생, 유전 원리의 기초
   - keyTerms: 세포 분열, 염색체, 생식, 발생, 유전자, 유전, 형질

22. 재해·재난과 안전
   - domain: `과학과 사회`
   - figureId: `disaster-safety`
   - lessons: 자연재해와 사회재난, 위험 예측과 대비, 과학기술 기반 안전 대책
   - keyTerms: 재해, 재난, 위험, 예방, 대비, 대응, 복구

23. 과학과 나의 미래
   - domain: `과학과 사회`
   - figureId: `science-careers`
   - lessons: 과학 관련 진로, 과학기술 직업 변화, 내 관심사와 탐구 프로젝트
   - keyTerms: 진로, 과학기술 직업, 융합, 탐구, 포트폴리오

## 4. 데이터 구현 규칙

- 파일 구조:
  - `src/data/theory/middle1.ts`
  - `src/data/theory/middle2.ts`
  - `src/data/theory/middle3.ts`
- 각 파일은 기존 `grade3.ts`~`grade6.ts` 패턴을 따라 `Grade` 하나를 export한다.
- `grade` 값은 앱 UI와 맞추기 위해 `1`, `2`, `3`을 사용한다.
- `src/data/theory/index.ts`에서 `middle1`, `middle2`, `middle3`을 import한 뒤 `middle` 레벨을 `status: "ready"`로 바꾼다.
- `src/data/theory/types.ts`의 `ScienceDomain`에 `과학과 사회`를 추가하고 `DOMAIN_META`에도 색상과 라벨을 추가한다.
- 권장 색상:
  - `과학과 사회`: `#fb7185` 또는 `#f97316`
  - label: `통합 · 과학과 사회`
- 기존 초등 데이터와 충돌하지 않도록 figureId는 중학교 전용 이름을 쓴다. 초등과 같은 개념이어도 중학교 도식은 입자 모형, 그래프, 법칙 관계를 더 강조한다.

## 5. 중학교 자료 깊이 기준

- 초등 자료보다 문단을 길게 쓰되, 고등학교 수준의 수식 전개와 미분·벡터 해석은 넣지 않는다.
- 각 단원은 `summary` 1개, `lessons` 3개를 기본으로 한다.
- lesson 본문은 2~3문단으로 구성한다.
- 핵심 단어는 5~8개 정도로 유지한다.
- 가능하면 “관찰 → 모형 → 법칙/관계 → 생활 적용” 순서로 서술한다.
- 산업 대분류와 연결되는 단원은 마지막 문단이나 funFact에서 자연스럽게 걸어 둔다.
  - 반도체 연결: 물질의 구성, 전기와 자기, 빛과 파동, 화학 반응의 규칙성.
  - 전력 연결: 전기와 자기, 운동과 에너지, 날씨와 기후변화, 수권과 해수의 순환.

## 6. SVG 제작 가이드

중학교 그림은 초등보다 “개념 관계가 보이는 도식”이어야 한다.

- `cell-diversity`: 세포 → 조직 → 기관 → 개체 계층과 생물 분류 가지.
- `heat-transfer-middle`: 전도, 대류, 복사가 한 화면에서 비교되는 도식.
- `state-change-particle`: 고체, 액체, 기체 입자 배열과 화살표.
- `force-interaction`: 물체에 작용하는 힘 화살표와 평형 예시.
- `gas-laws`: 피스톤으로 압력-부피 관계를 보여 주는 그림.
- `material-properties`: 밀도, 용해도, 녹는점, 끓는점 비교 카드.
- `atom-periodic-table`: 원자 구조와 주기율표 일부.
- `electricity-magnetism`: 회로와 전자석을 나란히 배치.
- `chemical-reaction-laws`: 반응 전후 원자 수 보존과 질량 저울.
- `motion-energy-graph`: 위치-시간 그래프와 에너지 막대.
- `weather-climate-change`: 대기 순환, 온실 효과, 기후 데이터 선그래프.
- `ocean-circulation`: 표층 해류, 바람, 해수 온도 차.

## 7. 바로 구현할 때의 체크리스트

1. `ScienceDomain`에 `과학과 사회` 추가.
2. `middle1.ts`, `middle2.ts`, `middle3.ts` 작성.
3. `index.ts`에서 middle 레벨 `status`를 `ready`로 전환.
4. `public/figures/science`에 중학교 SVG 23개 추가.
5. `npm run build`.
6. `npm run lint`.
7. 브라우저에서 기초이론 → 과학 → 중등 탭 전환, 학년 칩, 단원 목록, 이미지 로딩 확인.

## 8. 남은 리스크

- 2022 개정 교육과정은 공식적으로 학년군 중심이므로 `중1/중2/중3` 고정 표기는 “추천 배치”임을 유지해야 한다.
- 일부 자료에서 단원명이 `기체의 특성`, `물질의 성질`처럼 다르게 보이는 경우가 있다. 앱 표기는 출판사 목차와 현장 사용성이 높은 `기체의 성질`, `물질의 특성`으로 잡는 것을 권장한다.
- `과학과 사회` 도메인을 추가하지 않으면 지속가능성, 재해·재난, 진로 단원이 기존 4개 도메인에 억지로 들어가 UI 의미가 흐려진다.
