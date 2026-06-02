// data/areas/display.ts
// 디스플레이 유니버스 — 대한민국 디스플레이 산업(패널·소재·장비·구동칩 + 기업·공급망).
// 워크플로 'display-area-research'(6에이전트, 웹 교차검증) 산출 + 자가 적대적 검수 교정 반영.
// 수치는 2025~2026 공개자료 기준 근사(≈). 본사 좌표는 실제 등기 본사 소재지 실좌표(도시·구 단위 근사).
import type { AtlasArea, Category, Company, SupplyEdge, CompanyBadge, HqCoord, CompanyStat, Shareholder } from "../types";

const FAMILY_ORDER = ["Panel", "FormFactor", "Material", "Frontier"];
const GROUP_ORDER = ["Panel", "Material", "Equipment", "Component", "Demand", "Regulator"];

const FAMILY_COLORS: Record<string, string> = {
  Panel: "#a855f7", FormFactor: "#8b5cf6", Material: "#c084fc", Frontier: "#22d3ee",
};
const FAMILY_LABEL_KO: Record<string, string> = {
  Panel: "패널 기술", FormFactor: "폼팩터", Material: "소재", Frontier: "차세대",
};
const FAMILY_DESC_KO: Record<string, string> = {
  Panel: "빛을 내는 패널 방식 — OLED(RGB·WOLED·QD-OLED)·LCD",
  FormFactor: "패널의 형태 — 리지드·플렉시블·폴더블",
  Material: "패널을 이루는 소재 — 발광재료·편광판·봉지·커버윈도우",
  Frontier: "차세대 디스플레이 — Micro-LED·투명·롤러블",
};

const GROUP_COLORS: Record<string, string> = {
  Panel: "#a855f7", Material: "#ec4899", Equipment: "#06b6d4",
  Component: "#f59e0b", Demand: "#22c55e", Regulator: "#e2e8f0",
};
const GROUP_LABEL_KO: Record<string, string> = {
  Panel: "패널 제조", Material: "소재", Equipment: "장비",
  Component: "구동칩(DDI)", Demand: "전방수요(세트)", Regulator: "정부·규제",
};
const GROUP_CENTERS: Record<string, [number, number, number]> = {
  Panel: [0, 6, 3], Material: [-13, 3, 8], Equipment: [12, 3, 8],
  Component: [-8, -5, -9], Demand: [0, 7, -13], Regulator: [0, -7, 5],
};

const EDGE_COLORS: Record<string, string> = {
  emitter: "#ec4899", optical: "#a855f7", equipment: "#06b6d4",
  ddi: "#f59e0b", panel: "#22c55e", regulation: "#cbd5e1",
};

export const CATEGORIES: Category[] = [
  {
    id: "display-rgb-oled", name: "RGB OLED (직증착·중소형)", family: "Panel", color: "#7c3aed", icon: "panel",
    definition: "적·녹·청(RGB) 유기 발광 화소를 파인메탈마스크(FMM)로 기판에 직접 증착해, 백라이트 없이 화소가 스스로 빛을 내는 자발광 방식이다.",
    role: "스마트폰·태블릿·노트북 등 중소형 프리미엄 패널의 주류 기술. 별도 컬러필터·백라이트가 없어 명암비가 높고 픽셀 단위로 완전히 꺼져 완전한 검정을 표현한다.",
    keySpecs: [
      "자발광 — 화소가 직접 RGB 발광, 백라이트 불필요",
      "FMM 직증착 방식으로 색재현·전력효율 우수",
      "명암비 사실상 무한대(픽셀 OFF 시 완전 검정)",
      "근래 2단 적층 탠덤 구조로 IT·차량용 고휘도·장수명화",
    ],
    examples: ["스마트폰(갤럭시·아이폰 OLED)", "아이패드 프로·맥북 프로 탠덤 OLED IT 패널", "차량용 디스플레이", "스마트워치 패널"],
    trend: "2025~2026년 RGB OLED의 핵심 흐름은 발광층을 위로 2개 쌓는 '탠덤(2-stack)' 구조의 IT 확산이다. 삼성디스플레이·LG디스플레이가 아이패드 프로에 이어 맥북 등 노트북·태블릿용 탠덤 OLED 양산에 들어가며 휘도·수명·전력효율을 크게 끌어올렸다. 다만 중국 BOE 등의 중소형 OLED 추격이 거세 한국 업체는 탠덤·저전력 기술 격차로 대응 중이다.",
  },
  {
    id: "display-woled", name: "WOLED (대형 화이트 OLED)", family: "Panel", color: "#6d28d9", icon: "panel",
    definition: "화면 전면에 백색(White) OLED를 발광시키고 그 위 컬러필터로 적·녹·청을 걸러 색을 만드는 대형 OLED 방식으로, 백색 화소를 더한 WRGB 4-서브픽셀 구조를 흔히 쓴다.",
    role: "LG디스플레이가 주도하는 대형 OLED TV·모니터의 주력 기술. 백색 광원을 공통으로 깔아 대면적 양산이 유리하고, 자발광이라 LCD 대비 명암비·시야각·응답속도가 뛰어나다.",
    keySpecs: [
      "백색 OLED 자발광 + 컬러필터로 색 분리",
      "WRGB(R·G·B+백색) 4-서브픽셀로 고휘도 확보",
      "대형(TV·대형 모니터) 양산성에 강점",
      "다단 적층 탠덤으로 휘도 4,000니트급까지 향상",
    ],
    examples: ["LG OLED TV(올레드 evo)", "대형 OLED 사이니지", "27인치 4K OLED 모니터 패널", "고급 OLED TV 패널(타사 TV에도 탑재)"],
    trend: "2025~2026년 LG디스플레이는 WOLED 휘도를 4,000니트급으로 끌어올렸다. 동시에 모니터 영역에서는 기존 WRGB의 백색 서브픽셀을 빼고 진짜 RGB 스트라이프 서브픽셀을 다단 탠덤으로 구현한 신패널(예: 27인치 4K 240Hz)을 2026년 양산에 돌입, 텍스트 선명도에서 QD-OLED와 정면 경쟁한다.",
  },
  {
    id: "display-qd-oled", name: "QD-OLED (청색 OLED + 퀀텀닷)", family: "Panel", color: "#5b21b6", icon: "panel",
    definition: "청색(Blue) OLED만 광원으로 쓰고, 그 빛 일부를 퀀텀닷(양자점) 색변환층이 흡수해 적·녹으로 재발광시키는 삼성디스플레이의 대형 OLED 방식이다.",
    role: "삼성디스플레이가 주도하는 프리미엄 OLED TV·고급 모니터 기술. WOLED와 달리 백색 광원이 아니라 청색 광원+QD 색변환이라는 점이 구조적 차이의 핵심이다.",
    keySpecs: [
      "청색 OLED 광원 + 퀀텀닷 색변환(R/G 재발광)",
      "색을 컬러필터 감산이 아닌 퀀텀닷 색변환으로 만들어 광손실이 작음(QD 위 보조 컬러필터는 외광 반사·명암용 병용)",
      "4세대 'Penta Tandem' — 청색 OLED 5층(전(全)청색 스택) 적층으로 효율·수명 향상",
      "잉크젯 QD 공정으로 고해상·고주사율(360Hz) 패널화",
    ],
    examples: ["삼성 OLED TV(QD-OLED)", "고급 게이밍 모니터(QD-OLED)", "27인치 4K QD-OLED 모니터 패널", "대형 프리미엄 TV 패널"],
    trend: "2025~2026년 삼성디스플레이는 4세대 QD-OLED를 5층 적층 'Penta Tandem'으로 공식화하고, 신규 EL 소재로 효율을 30% 이상 개선해 전력 증가 없이 휘도·수명을 높였다(밝기 1,300니트급). 피코 잉크젯 QD 공정으로 화소 밀도를 높여 31.5형 4K·360Hz(세계 최초, 하반기 본격 양산)·27형 고밀도(Pico Inkjet) 등 고사양 모니터 패널을 확대 중이다.",
  },
  {
    id: "display-lcd", name: "LCD (레거시 TFT-LCD)", family: "Panel", color: "#9ca3af", icon: "panel",
    definition: "스스로 빛을 내지 못하고 뒤의 백라이트(LED) 빛을 액정(Liquid Crystal)으로 통과·차단해 밝기를 조절하고 컬러필터로 색을 만드는 비자발광 방식이다.",
    role: "수십 년간 TV·모니터·노트북의 주류였던 레거시 기술. 저가·중대형 시장에서 여전히 쓰이지만 명암·시야각·두께·응답속도에서 OLED에 밀린다.",
    keySpecs: [
      "비자발광 — 백라이트 + 액정 셔터 + 컬러필터 구조",
      "픽셀 완전 OFF 불가 → 명암비·블랙 표현 한계(국부조광으로 보완)",
      "미니LED 백라이트·IPS/VA 등으로 화질 보강",
      "대면적·저가 양산성에서 여전히 강점",
    ],
    examples: ["보급형·중급형 TV", "사무용·범용 모니터", "노트북·산업용 디스플레이", "미니LED LCD TV"],
    trend: "2025~2026년 한국 디스플레이의 LCD는 사실상 '졸업'했다. 삼성디스플레이는 이미 LCD 생산을 중단했고, LG디스플레이도 2025년 마지막 LCD TV 공장(중국 광저우)을 TCL CSOT에 매각하며 LCD TV에서 완전 철수했다. LCD 패널 주도권은 BOE·TCL CSOT 등 중국 업체로 넘어갔고, 한국은 OLED 집중 전략으로 전환했다.",
  },
  {
    id: "display-rigid-oled", name: "리지드 OLED (유리기판)", family: "FormFactor", color: "#a78bfa", icon: "panel",
    definition: "단단한 유리(glass) 기판 위에 OLED 소자를 형성한 평면·고정형 폼팩터로, 구부러지지 않는 대신 구조가 단순하고 비용·내구가 안정적이다.",
    role: "보급형 스마트폰·웨어러블·차량용 등 휘어질 필요가 없는 응용의 기본 OLED 폼. 플렉시블 대비 박막봉지·폴딩 부품이 덜 들어 원가가 낮다.",
    keySpecs: [
      "유리 기판 기반 평면 고정형",
      "구조 단순·원가/내구 안정적",
      "두께·베젤은 플렉시블보다 두꺼움",
      "중저가 스마트폰·일부 IT/차량용에 채택",
    ],
    examples: ["보급형 스마트폰 OLED", "일부 스마트워치", "차량용 계기·인포테인먼트", "산업용 OLED 모듈"],
    trend: "2025~2026년 리지드 OLED는 프리미엄 영역을 플렉시블에 내주고 중저가·특정 용도(웨어러블·차량용)로 입지가 좁혀지는 추세다. 다만 원가 경쟁력 때문에 보급형 스마트폰 OLED에서는 수요가 유지되며, 중국 업체와의 가격 경쟁 무대가 되고 있다.",
  },
  {
    id: "display-flexible-foldable-oled", name: "플렉시블·폴더블 OLED", family: "FormFactor", color: "#8b5cf6", icon: "foldable",
    definition: "유리 대신 휘어지는 플라스틱(폴리이미드) 기판 위에 OLED를 형성해 곡면·접힘·말림이 가능한 폼팩터로, 폴더블은 화면을 반복적으로 접었다 펴는 응용을 말한다.",
    role: "엣지 곡면 스마트폰, 폴더블폰, 향후 롤러블·슬라이더블 기기의 핵심. 한국(삼성디스플레이·LG디스플레이)이 기술 주도권을 가진 고부가 영역이다.",
    keySpecs: [
      "폴리이미드(PI) 휘어지는 기판 + 박막봉지(TFE)",
      "수십만 회 폴딩 내구성 요구(힌지·중성면 설계)",
      "커버윈도우로 UTG(초박막유리)/CPI 사용",
      "곡률 반경·주름(crease) 최소화가 품질 관건",
    ],
    examples: ["갤럭시 Z 폴드·플립 등 폴더블폰", "엣지 곡면 스마트폰", "폴더블 노트북·태블릿 패널", "롤러블·트라이폴드 시제품"],
    trend: "2025~2026년 폴더블은 더 얇고 가벼운 방향으로 진화하며, 트라이폴드(2회 접힘)·태블릿/노트북급 대화면 폴더블로 응용이 확장 중이다. 커버윈도우는 경도·촉감이 좋은 UTG 채택이 빠르게 늘고 있으며, 주름·내구·두께를 줄이는 소재·힌지 경쟁이 한국 주도로 치열하다.",
  },
  {
    id: "display-emitter-material", name: "OLED 발광·유기재료 (Emitter/HTL/ETL)", family: "Material", color: "#c084fc", icon: "molecule",
    definition: "OLED 화소 내부에서 빛을 내는 발광재료(emitter)와, 전하를 발광층으로 운반하는 정공수송층(HTL)·전자수송층(ETL) 등 다층 유기 박막 소재 묶음이다.",
    role: "OLED의 색·효율·수명을 좌우하는 핵심 소재. 인광/형광/TADF, 청색 효율·수명 등 소재 성능이 패널 경쟁력을 직접 결정한다.",
    keySpecs: [
      "발광재료(R·G·B emitter) + HTL/ETL/EIL 등 다층 박막",
      "인광(녹·적)·형광/TADF, 청색은 수명·효율 난제",
      "중수소(deuterium) 치환 등으로 청색 수명 개선",
      "UDC·머크·덕산·LG화학 등 글로벌·국내 소재사 공급",
    ],
    examples: ["청색 형광/인광 emitter", "녹·적색 인광 도판트/호스트", "정공수송재료(HTL)·전자수송재료(ETL)", "중수소 치환 유기재료"],
    trend: "2025~2026년 발광재료의 최대 과제는 여전히 청색의 효율·수명이며, 삼성·LG가 다단 탠덤(여러 발광층 적층)과 중수소 치환·신규 EL 소재로 이를 보완하고 있다. 청색 인광(blue PHOLED)은 2025년 양산 검증 단계에 진입했고(LGD·UDC 협업, 삼성도 모바일 적용 추진), 본격 상용 확산이 차세대 효율 개선의 분수령으로 부각된다. 소재 국산화·공급망 다변화도 진행 중이다.",
  },
  {
    id: "display-polarizer-optical-film", name: "편광판·광학필름", family: "Material", color: "#b794f4", icon: "film",
    definition: "빛의 진동 방향을 정렬·제어하는 편광판(polarizer)과, 휘도·시야각·반사를 조절하는 각종 광학필름(보상·확산·프리즘 등)의 묶음이다.",
    role: "LCD에서는 액정 동작에 편광판이 필수이고, OLED에서는 외광 반사를 줄여 명암·시인성을 높이는 원형편광판이 쓰인다. 화질·야외 시인성을 좌우한다.",
    keySpecs: [
      "편광판: 빛의 진동축 정렬(LCD 필수, OLED는 반사 저감용)",
      "OLED는 원형편광판으로 외광 반사 억제",
      "보상·확산·프리즘 등 광학필름으로 시야각·휘도 보정",
      "박형화·POL-less(편광판 제거) 구조 연구 진행",
    ],
    examples: ["LCD/OLED용 편광판", "위상차(보상)필름", "휘도향상(프리즘)필름", "원형편광판"],
    trend: "2025~2026년 OLED 박형·폴더블화에 맞춰 편광판을 빼거나 얇게 만드는 'POL-less(편광판 제거)' 구조 연구가 활발하다. 폴더블에서는 두께·굽힘 부담을 줄이는 광학설계가 중요해지고, 반사 저감·저전력을 동시에 잡는 광학필름 수요가 커지고 있다.",
  },
  {
    id: "display-tfe", name: "박막봉지 (TFE)", family: "Material", color: "#9f7aea", icon: "film",
    definition: "수분·산소에 매우 취약한 OLED 유기소자를 무기막·유기막을 번갈아 쌓아 얇게 밀봉(encapsulation)하는 기술으로, Thin Film Encapsulation의 약자다.",
    role: "플렉시블·폴더블 OLED를 가능케 한 핵심 공정 소재. 유리 봉지 대신 얇고 휘어지는 다층 봉지로 수분 침투를 막아 소자 수명을 지킨다.",
    keySpecs: [
      "무기막(배리어)+유기막(평탄·완충) 교대 적층",
      "수분침투율(WVTR) 극저(10⁻⁶ g/m²/day급) 요구",
      "얇고 유연해 플렉시블·폴더블 필수",
      "잉크젯·증착·플라즈마 공정 병용",
    ],
    examples: ["플렉시블 OLED 봉지층", "폴더블 패널 TFE", "무기 배리어막(Al₂O₃ 등)", "유기 평탄화막(모노머 경화)"],
    trend: "2025~2026년 TFE는 더 얇고 더 잘 휘어지면서도 수분 차단을 유지하는 방향으로 고도화되고 있다. 폴더블·트라이폴드 등 반복 굽힘이 심한 응용이 늘며 봉지막의 유연성·내구성·박막화 요구가 커지고, 잉크젯 유기막 공정의 정밀도가 수율 관건으로 부각된다.",
  },
  {
    id: "display-foldable-cover-window", name: "폴더블 커버윈도우 (UTG/CPI)", family: "Material", color: "#d6bcfa", icon: "film",
    definition: "폴더블·플렉시블 화면 맨 위에서 화면을 보호하면서도 접힐 수 있어야 하는 최외곽 보호층으로, 대표 소재는 초박막유리(UTG)와 무색 폴리이미드(CPI) 두 가지다.",
    role: "폴더블폰의 '접히는 표면'을 책임지는 부품. 경도(긁힘)·투명도·촉감과 폴딩 내구를 동시에 만족해야 해 소재 선택이 사용감과 직결된다.",
    keySpecs: [
      "UTG(초박막유리): 경도·투명도·촉감 우수, 깨짐엔 취약",
      "CPI(무색 폴리이미드): 잘 휘고 충격에 강하나 경도·내스크래치 약함",
      "수십 µm 두께로 가공·접합 난이도 높음",
      "최근 UTG 채택이 빠르게 확대",
    ],
    examples: ["갤럭시 Z 시리즈 UTG 커버", "CPI 커버윈도우 폴더블", "폴더블 보호필름(글라스라이크)", "태블릿급 폴더블 커버"],
    trend: "2025~2026년 커버윈도우는 촉감·경도 이점이 큰 UTG 쪽으로 무게중심이 빠르게 이동 중이며, 대화면·트라이폴드용 더 큰 UTG 가공이 과제로 떠올랐다. 동시에 UTG의 깨짐과 CPI의 약한 경도를 모두 극복하려는 신소재(유리 같은 경도+플라스틱 같은 인성) 연구가 활발하다.",
  },
  {
    id: "display-micro-led", name: "Micro-LED", family: "Frontier", color: "#22d3ee", icon: "microled",
    definition: "수~수십 µm 크기의 초소형 무기 LED 칩 자체를 화소로 쓰는 자발광 디스플레이로, OLED와 달리 유기물이 아니라 무기 반도체 LED라 휘도·수명·번인 내성이 매우 우수하다.",
    role: "초고휘도·초장수명을 노리는 차세대 자발광 기술. 초대형 TV·사이니지부터 마이크로 디스플레이(AR/스마트워치)까지 응용폭이 넓지만 아직 초고가·양산 초기 단계다.",
    keySpecs: [
      "무기 LED 칩 자발광(고휘도·고수명·낮은 번인)",
      "수백만 개 칩을 옮겨 붙이는 '대량전사(mass transfer)'가 핵심 난제",
      "풀컬러는 R·G·B 전사 결함이 곱으로 누적·리페어 비용이 커 상업 양산엔 사실상 '식스나인(≈99.9999%)'급 무결성 요구(파일럿 라인은 99.99%대 시연)",
      "미세화 시 적색 LED 효율 저하 등 난제 잔존",
    ],
    examples: ["삼성 마이크로 LED 초대형 TV(모듈러)", "상업용 대형 사이니지", "마이크로 LED 웨어러블(스마트워치)", "AR용 마이크로 디스플레이"],
    trend: "2025~2026년 Micro-LED는 R&D에서 초기 상용화로 넘어가는 변곡점에 있다. 첫 의미 있는 양산 팹 가동과 함께 일부 상용 제품(웨어러블 등)이 나왔지만, 대량전사 수율·미세화 적색 효율·표준 부재로 인한 높은 비용 탓에 여전히 초고가다. 향후 원가 하락 전망 속에 스마트워치·초대형 TV·근안(near-eye) 중심으로 확산이 예상된다.",
  },
  {
    id: "display-transparent-rollable", name: "투명·롤러블 디스플레이", family: "Frontier", color: "#2dd4bf", icon: "rollable",
    definition: "화면 뒤가 비치는 투명(transparent) 디스플레이와, 두루마리처럼 말았다 펴는 롤러블(rollable) 디스플레이를 아우르는 차세대 폼팩터로, 주로 OLED의 자발광·박형·유연 특성을 활용한다.",
    role: "공간·인테리어와 융합하는 새로운 디스플레이 경험을 여는 영역. 쇼윈도·차량·전시 공간의 투명 패널, 평소엔 말아 숨기는 롤러블 TV 등 폼팩터 혁신을 보여준다.",
    keySpecs: [
      "투명: 화소·배선 투과율 확보가 핵심(투명도 vs 휘도 트레이드오프)",
      "롤러블: 작은 곡률 반복 권취 내구(플렉시블 OLED+TFE 기반)",
      "자발광 OLED라 백라이트 없이 투명/유연 구현 용이",
      "아직 고가·니치(상업·전시·프리미엄) 중심",
    ],
    examples: ["LG 투명 OLED 사이니지", "롤러블 OLED TV(LG 시그니처 OLED R 계열)", "지하철·쇼윈도 투명 패널", "롤러블·슬라이더블 모바일 시제품"],
    trend: "2025~2026년 투명·롤러블은 여전히 프리미엄·상업용 니치지만 응용 시연이 늘고 있다. 특히 Micro-LED 상용화 흐름과 맞물려 투명 디스플레이가 차세대 핵심 응용으로 부각됐고, 한국 업체는 투명 OLED 사이니지·차량용·전시 공간용으로 시장을 다지며 폼팩터 차별화를 이어가고 있다.",
  },
];

// 본사 좌표 (실제 등기 본사 소재지 실좌표 — 도시·구 단위 근사). C() 호출 시 채워짐.
const DISPLAY_HQ: Record<string, HqCoord> = {};

// 회사: [id, name, type, group, hqLoc, lat, lon, weight, stat라벨, stat값, note, detail, shares]
const C = (
  id: string, name: string, type: string, group: string, hqLoc: string,
  lat: number, lon: number, weight: number, statLabel: string, statValue: string,
  note: string, detail: string, shares: { field: string; pct: string }[],
): Company => {
  DISPLAY_HQ[id] = { lat, lon };
  return {
    id, name, type, group, hq: hqLoc, note, detail, weight,
    stats: [{ label: statLabel, value: statValue }, { label: "본사", value: hqLoc }],
    shares,
  };
};

export const COMPANIES: Company[] = [
  // ── 패널 제조 2사 ──
  C("sdc", "삼성디스플레이", "OLED 패널 제조 · 중소형 OLED 세계 1위", "Panel", "충남 아산 탕정", 36.7900, 127.1000, 2300,
    "2025 매출(추정)", "≈29.8조 원",
    "삼성전자 자회사 · 중소형 OLED 1위 · QD-OLED 주도",
    "삼성전자가 지분 대부분을 보유한 비상장 자회사로, 본사·주력 생산거점은 충남 아산 탕정 디스플레이시티(아산캠퍼스)다. 스마트폰용 중소형 OLED 세계 1위(점유율 약 50% 안팎)이며, 대형은 QD-OLED로 자발광 모니터 패널 시장을 사실상 주도(2025년 약 75% 추정)한다. 2025년 디스플레이 사업 매출 약 29.8조 원·영업이익 약 4.1조 원으로 4조 원대 이익에 복귀했고, 2026년에는 애플 첫 폴더블 아이폰용 OLED 공급 등 폴더블·IT용 OLED 확대를 노린다.",
    [{ field: "중소형(스마트폰) OLED 세계 점유", pct: "≈50%(1위)" }, { field: "자발광 모니터(QD-OLED)", pct: "≈75%(2025 추정)" }, { field: "IT용 OLED", pct: "60%+" }]),
  C("lgd", "LG디스플레이", "OLED 패널 제조 · 대형 WOLED 독점적", "Panel", "서울 영등포 여의도", 37.5256, 126.9275, 1900,
    "2025 매출", "≈25.81조 원",
    "대형 WOLED 독점적 · LCD 철수→OLED 전환, 4년 만 흑전",
    "유가증권시장 상장사(034220)로 등기 본사는 서울 여의도 LG트윈타워, 주력 패널 공장은 경기 파주와 경북 구미에 있다. 대형 TV용 화이트 OLED(WOLED)를 사실상 독점 공급(TV OLED 점유 약 52%)하고, 애플 등을 겨냥한 중소형 OLED를 확대 중이다. 범용 LCD는 광저우 공장 매각 등으로 철수하며 OLED 매출비중이 2025년 61%로 역대 최고를 기록했다. 2022~2024년 3년 연속 대규모 적자 끝에 2025년 매출 25.81조 원·영업이익 5,170억 원으로 4년 만에 연간 흑자전환했다. 중국 BOE 등의 추격이 변수다.",
    [{ field: "대형 TV OLED 점유", pct: "≈52%" }, { field: "OLED 매출 비중(2025)", pct: "61%(역대 최고)" }, { field: "제품별(IT/모바일·기타/TV/차량)", pct: "37/36/19/8%" }]),
  // ── 소재 ──
  C("duksan", "덕산네오룩스", "OLED 발광·유기재료 소재 · 국내 대표", "Material", "충남 천안 입장", 36.9156, 127.2436, 460,
    "시가총액(2026.2 근사)", "≈1.0~1.1조 원",
    "OLED 유기재료 국내 대표주, 블랙PDL 등 소재 다각화",
    "충남 천안 입장에 본사·공장을 둔 덕산그룹 계열 OLED 유기재료 전문기업이다. 정공수송층(HTL), Red Prime 등 OLED 발광·공통층 소재를 자체 개발·양산하며 삼성디스플레이(SDC)를 주 고객으로 한다. 폴더블·아이폰 OLED 확대 수혜가 기대되며, 블랙PDL(블랙 화소정의막) 등 신규 소재 채택이 2025~2026 성장 동력으로 거론된다.",
    [{ field: "OLED 발광/정공수송 소재", pct: "국내 대표·주력" }, { field: "블랙PDL·신규 소재", pct: "확대" }]),
  C("solus", "솔루스첨단소재", "OLED 발광/공통층 소재 (+동박 겸업)", "Material", "전북 익산 함열", 36.0500, 126.9620, 420,
    "2025 OLED 사업부 매출", "≈1,262억 원",
    "두산서 인적분할·스카이레이크 보유. OLED 소재 + 동박(AI/PCB) 양대 축",
    "전북 익산을 거점으로 한 첨단소재 기업으로 2019년 두산 전자BG에서 인적분할(옛 두산솔루스)되어 출범했고 현재 사모펀드 스카이레이크가 경영권 지분을 보유한다. OLED 사업부는 유기발광·공통층 재료와 QD(퀀텀닷) 소재를 공급하며, 별도로 동박(AI/PCB용·전지박) 사업을 겸하는데, 2025년 전사 매출 약 6,164억 원의 구성은 동박 ≈3,065억 > 전지박 ≈1,837억 > OLED ≈1,262억 순이다(전지박은 축소). OLED 사업부는 2026년 약 1,390억 원 목표를 제시했다. (전사 매출과 사업부 매출 혼동 주의)",
    [{ field: "OLED 유기재료·QD 소재", pct: "디스플레이 주력" }, { field: "동박(AI/PCB·전지박)", pct: "전사 최대 세그먼트(전지박 축소)" }]),
  C("dongwoo", "동우화인켐", "편광판·포토레지스트·컬러필터 소재", "Material", "전북 익산 신흥동", 35.9300, 126.9890, 700,
    "2024 매출", "≈1.96조 원",
    "日 스미토모화학 100% 자회사, 편광판·디스플레이/반도체 케미컬 대형 소재사",
    "전북 익산에 본사를 둔 일본 스미토모화학의 100% 자회사로, 1991년 설립 후 LCD/OLED용 편광판, 디스플레이·반도체용 포토레지스트, 고순도 기능성 케미컬, 컬러필터·터치센서 소재를 생산한다. 익산 본사를 중심으로(평택공장 편광판 라인은 2024말 축소) 삼성디스플레이·삼성전자·SK하이닉스 등에 납품한다. 2024년 매출은 약 1.96조 원 규모로 본 영역 소재사 중 최대급이며, 익산 산단에 수천억 원대 추가 투자로 OLED용 편광필름·반도체 소재 증설을 추진 중이다.",
    [{ field: "편광판(LCD·OLED)", pct: "국내 상위·주력" }, { field: "포토레지스트·기능성 케미컬", pct: "주력" }, { field: "컬러필터·터치센서 소재", pct: "보유" }]),
  C("kolon", "코오롱인더스트리", "투명PI(CPI) 폴더블 커버필름 등 필름/전자재료", "Material", "서울 강서 마곡", 37.5612, 126.8326, 520,
    "디스플레이 주력", "CPI 폴더블 커버필름",
    "산업소재·화학·필름/전자재료·패션 4대 부문. CPI 폴더블 커버윈도우 소재",
    "서울 강서구 마곡 코오롱 One&Only타워에 본사를 둔 코오롱그룹 핵심 화학·소재 기업으로 산업소재·화학·필름/전자재료·패션 4대 부문을 영위한다. 디스플레이 영역에서는 투명 폴리이미드 필름(CPI)을 양산해 폴더블·롤러블 디스플레이의 커버 윈도우/보호필름 소재로 공급한다. 회사 전체 매출은 수조 원 규모(타이어코드·아라미드 등 산업소재 비중 큼)로 CPI는 전사 대비 작은 비중이나 폴더블 시장 확대에 따른 성장 옵션으로 주목된다.",
    [{ field: "산업소재(타이어코드·아라미드)", pct: "전사 핵심" }, { field: "투명PI(CPI) 폴더블 커버", pct: "디스플레이 주력" }]),
  C("dowinsys", "도우인시스", "폴더블 UTG(초박막강화유리) 소재", "Material", "충북 청주 옥산", 36.6818, 127.3554, 360,
    "지위", "폴더블 UTG · SDC 독점 공급",
    "세계 최초 폴더블 UTG 양산, 뉴파워프라즈마 인수(SDC 핵심고객)",
    "충북 청주 흥덕구 옥산면에 본사·공장을 둔 초박막강화유리(UTG) 전문기업으로, 세계 최초로 폴더블 스마트폰용 30~100μm 두께 UTG를 양산했다. 옛 삼성디스플레이 자회사였으나 2024년 코스닥 상장사 뉴파워프라즈마가 인수했고(SDC는 잔여지분·핵심고객), 삼성전자 폴더블폰용 UTG를 사실상 독점 공급한다. 청주 옥산공장과 베트남 송콩2 공장을 운영하며, 2025년 7월 코스닥에 상장했다. 애플 폴더블 진입 기대감으로 주목받는다.",
    [{ field: "폴더블 UTG(초박막강화유리)", pct: "세계 최초 양산·SDC 독점" }]),
  C("inox", "이녹스첨단소재", "OLED 봉지·점착·FPCB 소재", "Material", "충남 아산 둔포", 36.9350, 127.0500, 420,
    "2025 연결 매출", "≈4,396억 원",
    "WOLED 봉지재 높은 점유, OLED 봉지·점착+FPCB·반도체 소재",
    "충남 아산 둔포에 본사를 둔 전기·전자·정보용 부품소재 기업으로, OLED 봉지(인캡슐레이션)·점착 소재, FPCB(연성회로기판)용 소재, 반도체 패키지 소재를 생산한다. 특히 WOLED(화이트 OLED) TV용 봉지재에서 높은 점유율을 유지하며 LG디스플레이(LGD)·삼성디스플레이 등을 고객으로 한다. 2025년 연결 매출 약 4,396억 원·영업이익 약 819억 원 수준이며, 2026년 메모리용 차세대 DAF(다이접착필름) 양산 등 반도체 소재 확장을 추진한다.",
    [{ field: "OLED 봉지·점착 소재", pct: "WOLED 봉지 상위·주력" }, { field: "FPCB 소재", pct: "주력" }, { field: "반도체 패키지 소재(DAF 등)", pct: "확대" }]),
  // ── 장비 ──
  C("apsystem", "AP시스템", "OLED 레이저결정화(ELA)·봉지 장비 · 세계 1위", "Equipment", "경기 화성 동탄", 37.1814, 127.0995, 420,
    "ELA 장비 세계 점유", "≈90% 이상",
    "삼성디스플레이 OLED 라인의 ELA·봉지·LLO 장비 사실상 독점 공급",
    "경기 화성 동탄에 본사를 둔 OLED·반도체 공정장비 기업으로, 2017년 APS홀딩스에서 인적분할로 설립됐다. 주력은 저온폴리실리콘(LTPS) 백플레인용 ELA(엑시머 레이저 어닐링) 결정화 장비로 세계 점유율 약 90% 이상이며, 삼성디스플레이가 주 고객이다. 봉지(Encapsulation)·LLO(레이저 박리)·반도체 RTP 장비도 보유한다. 2025년은 패널사 투자 공백으로 매출·이익이 감소했고, 삼성디스플레이 8.6세대 IT용 OLED 투자를 차기 모멘텀으로 본다.",
    [{ field: "ELA 레이저결정화 장비(세계)", pct: "≈90%+" }, { field: "OLED 봉지·LLO 장비", pct: "주력 공급사" }]),
  C("hims", "힘스", "OLED 마스크 인장기·검사 장비 · 국내 독점급", "Equipment", "인천 남동구", 37.4072, 126.7220, 230,
    "지위", "OLED FMM 마스크 장비 독점급",
    "FMM 마스크 인장·용접·검사 장비 세계 최초 개발, SDC 독점급 공급",
    "인천 남동공단에 본사를 둔 OLED 마스크 공정장비 전문기업으로 1999년 설립, 2017년 코스닥 상장했다. 모바일용 분할 메탈마스크(FMM) 인장기·용접기·검사·리페어 장비를 세계 최초로 개발했고, 삼성디스플레이에 사실상 독점적으로 공급한다. 매출이 SDC의 OLED 마스크 설비 투자 사이클에 크게 좌우돼 변동성이 크며, 2025년은 매출이 약 21% 감소하고 영업·순이익이 적자 전환했다. 8.6세대 IT OLED 신규 투자가 회복 변수다.",
    [{ field: "OLED FMM 마스크 인장기(국내)", pct: "독점급" }, { field: "마스크 검사·리페어 장비", pct: "주력 공급" }]),
  C("yas", "야스", "OLED 증착 증발원·증착기 · 8세대 양산 유일급", "Equipment", "경기 파주 탄현", 37.7836, 126.7180, 300,
    "지위", "8세대 증착원(소스) 세계 유일급 · LGD 증착 핵심 공급",
    "LG디스플레이 OLED 증착원 핵심 공급사, BOE에도 증발원 공급",
    "LG디스플레이 본거지인 경기 파주에 본사를 둔 OLED 증착장비 기업으로, 증착의 핵심 부품인 증발원(evaporation source)과 증착기(evaporator)를 함께 공급한다. 8세대 이상 OLED 증착기와 증착원을 모두 양산한 세계 유일급 업체로, LGD의 대형 WOLED·중소형 OLED 라인에 증착원을 공급하고 중국 BOE의 8.6세대 라인에도 증발원을 납품한다. 매출이 LGD 투자에 크게 좌우되며 2025년은 소폭 감소했으나 8.6세대 OLED 사이클을 모멘텀으로 본다.",
    [{ field: "8세대급 OLED 증착원(세계)", pct: "양산 유일급" }, { field: "OLED 증착기", pct: "주력 공급" }]),
  C("sunic", "선익시스템", "OLED 증착기 국산화 · 양산용 증착기", "Equipment", "경기 수원 권선", 37.2540, 126.9700, 360,
    "2025 매출", "≈5,157억 원 (전년比 +357%)",
    "양산용 OLED 증착기 국산화, BOE 8.6세대 대형 수주로 급성장",
    "경기 수원 권선구 고색동(수원산단)에 본사를 둔 OLED 증착장비 기업으로 1990년 설립, 최대주주는 검사장비사 동아엘텍(약 47.5%)이다. 일본 캐논토키가 사실상 독점하던 양산용 OLED 증착기(evaporator)를 국산화한 첫 사례로 평가되며, 중국 BOE의 8.6세대 IT OLED 라인에 대형 증착기를 잇따라 수주했다. 이 수주로 2025년 연결 매출이 약 5,157억 원으로 전년 대비 약 357% 급증하고 영업이익도 크게 늘었다.",
    [{ field: "양산용 OLED 증착기(국산화)", pct: "국내 유일급" }, { field: "소·중형 OLED 증착기(세계)", pct: "상위 점유" }]),
  // ── 구동칩(DDI) ──
  C("lxsemicon", "LX세미콘", "디스플레이 구동칩(DDI) 팹리스 · 국내 1위", "Component", "대전 유성구", 36.4250, 127.3920, 700,
    "2025 매출(연결, 근사)", "≈1.6~1.8조 원",
    "국내 1위 DDI 팹리스, LGD 주력 공급에서 SDC까지 고객 확대",
    "대전 대덕테크노밸리에 본사를 둔 국내 최대 디스플레이 구동칩(DDI) 팹리스로, 옛 실리콘웍스이며 2021년 LG그룹에서 분리돼 LX그룹으로 편입됐다. 최대주주는 LX홀딩스(약 33%)다. DDI는 디스플레이 화소를 구동하는 핵심 반도체로, 주력 고객은 LG디스플레이이며 TV·모바일·전장용을 공급하고, 2026년 삼성디스플레이에 IT OLED용 DDI를 공급하며 고객을 다변화했다. 2025년 연결 매출 약 1.7~1.8조 원 수준으로 추정되며 신사업(전력반도체 등)을 추진한다. (전사 매출, 그룹과 혼동 금지)",
    [{ field: "국내 DDI 팹리스", pct: "1위" }, { field: "LGD DDI 공급", pct: "주력(매출 60%+ 의존)" }]),
  // ── 전방수요(세트) ──
  C("samsungelec", "삼성전자", "디스플레이 전방수요(세트) · SDC 모회사", "Demand", "경기 수원 영통", 37.2569, 127.0535, 2000,
    "글로벌 TV(매출 기준)", "≈29% · 20년 연속 1위",
    "갤럭시·TV 세트로 디스플레이 패널 최대 전방수요이자 SDC 모회사",
    "본사는 수원 영통구 삼성디지털시티. 스마트폰(갤럭시)·TV·모니터 세트 사업이 디스플레이 패널의 최대 전방수요를 형성하며, 비상장 패널 제조사 삼성디스플레이(SDC)를 약 85% 보유한 모회사다(나머지는 삼성SDI 보유, 100% 자회사화 진행). 2025년 글로벌 TV 매출 기준 ≈29%로 20년 연속 1위, 스마트폰 출하도 세계 1위(≈20%)를 유지해 SDC의 OLED 물량을 떠받친다. 단, 전사는 반도체(DS) 비중이 가장 커 전사 실적을 디스플레이로 등치하면 안 된다.",
    [{ field: "글로벌 TV(매출)", pct: "≈29%(1위)" }, { field: "글로벌 스마트폰(출하)", pct: "≈20%(1위)" }, { field: "삼성디스플레이 지분", pct: "≈85% 보유" }]),
  C("lgelec", "LG전자", "디스플레이 전방수요(세트) · OLED TV 1위", "Demand", "서울 영등포 여의도", 37.5266, 126.9290, 1200,
    "글로벌 OLED TV", "≈49.7% · 13년 연속 1위",
    "OLED TV·모니터 세트로 대형 OLED 패널 소화하는 LGD 핵심 수요",
    "본사는 서울 여의도 LG트윈타워(서관). OLED TV·모니터 등 프리미엄 세트 사업이 LG디스플레이(LGD)의 대형 White-OLED 패널을 흡수하는 주요 전방수요다. 2025년 글로벌 OLED TV 시장에서 ≈49.7% 점유로 13년 연속 세계 1위를 지키며 LGD 대형 패널 물량의 안정적 출구 역할을 한다. 다만 LG전자와 LGD는 별도 상장사로 지배구조가 분리돼 있고(LGD는 LG전자 자회사가 아님), 전사 매출은 생활가전·전장 비중이 커 디스플레이 수요는 사업 일부 맥락이다.",
    [{ field: "글로벌 OLED TV", pct: "≈49.7%(1위)" }, { field: "북미 OLED TV", pct: "≈50.1%" }, { field: "유럽 OLED TV", pct: "≈50.5%" }]),
  // ── 정부·규제 ──
  C("motie", "산업통상자원부", "정부 부처 · 디스플레이 국가전략기술·소부장 정책", "Regulator", "세종", 36.5040, 127.2613, 600,
    "역할", "디스플레이 산업정책 주무부처",
    "OLED·차세대 디스플레이 국가전략기술 지정·세제·소부장 총괄",
    "본부는 세종 정부세종청사. 디스플레이(OLED·QD·마이크로LED 패널과 소부장)를 국가전략기술 및 국가첨단전략기술로 지정해 시설투자 세액공제(대·중견 15%·중소 25%)와 소부장 국산화·R&D·특화단지·인력 정책을 총괄한다. 2025~2026년 'K-디스플레이 특별법'과 국내 소부장 사용 추가공제 등 직접지원 강화가 추진 중이다. (2025 정부조직개편으로 에너지 기능은 이관됐으나 산업 기능은 존속)",
    [{ field: "디스플레이 국가전략기술", pct: "OLED·QD·마이크로LED 지정" }, { field: "시설투자 세액공제(대·중견/중소)", pct: "≈15% / ≈25%" }]),
];

// ── 상세 지표(상장·시가총액·주요 주주·세부 재무) ──
// 워크플로 'display-area-research' 산출 + 웹 교차검증 + 자가검수. 수치는 2025~2026 근사(≈). 투자정보 아님.
interface CompanyDetail { listing: string; marketCap: string; shareholders: Shareholder[]; financials: CompanyStat[] }
const sh = (name: string, pct: string): Shareholder => ({ name, pct });
const fin = (label: string, value: string): CompanyStat => ({ label, value });

const DETAILS: Record<string, CompanyDetail> = {
  sdc: {
    listing: "비상장 (삼성전자 자회사)",
    marketCap: "비상장 (별도 시총 없음 · 삼성전자 디스플레이 사업)",
    shareholders: [sh("삼성전자", "≈85%"), sh("삼성SDI", "≈15% (삼성전자로 매각 추진)")],
    financials: [
      fin("2025 매출(SDC 사업, 추정)", "≈29.8조 원"),
      fin("2025 영업이익(추정)", "≈4.1조 원"),
      fin("전년 대비", "매출 ≈+2% · 영업이익 ≈+11%"),
    ],
  },
  lgd: {
    listing: "KOSPI 034220",
    marketCap: "≈7.9조 원 (2026.6 기준 근사)",
    shareholders: [sh("LG전자", "≈37.9% (최대주주)"), sh("국민연금공단", "≈5.0%"), sh("기타(자기주식·기관·소액)", "≈57%")],
    financials: [
      fin("2025 매출", "≈25.81조 원"),
      fin("2025 영업이익", "≈5,170억 원 (4년 만 흑자전환)"),
      fin("2025 EBITDA", "≈4.87조 원 (이익률 19%)"),
    ],
  },
  duksan: {
    listing: "KOSDAQ 213420",
    marketCap: "≈1.0~1.1조 원 (2026.2 근사)",
    shareholders: [sh("덕산하이메탈", "≈36.7%"), sh("기타 특수관계인·소액주주", "≈63.3%")],
    financials: [
      fin("주력 소재", "HTL·R/G 프라임·블랙PDL"),
      fin("주 고객", "삼성디스플레이(SDC)"),
      fin("성장 동력", "폴더블·아이폰 OLED·블랙PDL"),
    ],
  },
  solus: {
    listing: "KOSDAQ 336370",
    marketCap: "시점별 변동(미확정)",
    shareholders: [sh("스카이레이크(SPC 경유)", "≈40.9% (경영권)"), sh("기타·소액주주", "나머지")],
    financials: [
      fin("2025 전사 매출", "≈6,164억 원 (사상 최대)"),
      fin("2025 OLED 사업부 매출", "≈1,262억 원"),
      fin("2026 OLED 목표(회사)", "≈1,390억 원"),
    ],
  },
  dongwoo: {
    listing: "비상장 (스미토모화학 자회사)",
    marketCap: "해당 없음 (비상장)",
    shareholders: [sh("스미토모화학(일본)", "100%")],
    financials: [
      fin("2024 매출", "≈1조 9,585억 원"),
      fin("익산 추가투자(2024 발표)", "≈3,300억 원+"),
      fin("주 고객", "삼성디스플레이·삼성전자·SK하이닉스"),
    ],
  },
  kolon: {
    listing: "KOSPI 120110",
    marketCap: "시점별 변동(미확정)",
    shareholders: [sh("(주)코오롱", "≈29.4%"), sh("특수관계인 포함 합산", "≈34.9%")],
    financials: [
      fin("디스플레이 주력", "CPI(투명PI) 폴더블 커버필름"),
      fin("전사 사업", "산업소재·화학·필름/전자재료·패션"),
      fin("본사", "서울 마곡 One&Only타워"),
    ],
  },
  dowinsys: {
    listing: "KOSDAQ (2025.7 상장)",
    marketCap: "상장 후 시총(시점별 변동)",
    shareholders: [sh("뉴파워프라즈마", "≈47.9% (최대주주, 2026.4)"), sh("삼성디스플레이", "≈10% (전 최대주주·핵심고객)"), sh("기타·소액", "나머지")],
    financials: [
      fin("주력 제품", "폴더블 UTG(30~100μm)"),
      fin("주 고객", "삼성디스플레이(독점 공급)"),
      fin("생산 거점", "청주 옥산 + 베트남 송콩2"),
    ],
  },
  inox: {
    listing: "KOSDAQ 272290",
    marketCap: "시점별 변동(미확정)",
    shareholders: [sh("이녹스(지주격)·창업주 측", "최대주주"), sh("외국인·기관·소액주주", "잔여")],
    financials: [
      fin("2025 연결 매출", "≈4,396억 원"),
      fin("2025 연결 영업이익", "≈819억 원"),
      fin("2026 신규", "메모리용 차세대 DAF 양산 추진"),
    ],
  },
  apsystem: {
    listing: "KOSDAQ 265520",
    marketCap: "≈2,700~3,000억 원 (2025~26, 변동)",
    shareholders: [sh("APS홀딩스 외 특수관계인", "≈25%"), sh("기타 유통주식", "≈75%")],
    financials: [
      fin("2025 매출(연결, 근사)", "≈4천억 원대 (전년比 약 -11%)"),
      fin("2025 영업이익", "전년比 약 -29%"),
      fin("주 고객", "삼성디스플레이(SDC)"),
    ],
  },
  hims: {
    listing: "KOSDAQ 238490",
    marketCap: "≈1,500~2,500억 원 (변동성 큼)",
    shareholders: [sh("김주환(창업자) 외 특수관계인", "≈30%대"), sh("기타 유통주식", "≈70%")],
    financials: [
      fin("2025 매출(별도, 근사)", "전년比 약 -21%"),
      fin("2025 손익", "영업·순이익 적자 전환"),
      fin("주 고객", "삼성디스플레이(SDC)"),
    ],
  },
  yas: {
    listing: "KOSDAQ 255440",
    marketCap: "≈3,000~5,000억 원 (변동)",
    shareholders: [sh("정광호(창업자) 외 특수관계인", "≈30%대(근사)"), sh("기타 유통주식", "나머지")],
    financials: [
      fin("2025 매출(연결, 근사)", "3분기 누적 전년比 약 -1.8%"),
      fin("주 고객", "LG디스플레이(LGD), BOE"),
      fin("기술 지위", "8세대 증착기·증착원 동시 양산 세계 유일급"),
    ],
  },
  sunic: {
    listing: "KOSDAQ 171090",
    marketCap: "≈8,000억~1조 원 (2025~26 급등, 변동)",
    shareholders: [sh("동아엘텍 (모기업)", "≈47.5%"), sh("기타 유통주식", "나머지")],
    financials: [
      fin("2025 매출(연결, 근사)", "≈5,157억 원 (전년比 약 +357%)"),
      fin("2025 영업이익(근사)", "≈1,115억 원 (대폭 증가)"),
      fin("주 고객", "BOE(8.6세대), 국내외 패널사"),
    ],
  },
  lxsemicon: {
    listing: "KOSPI 108320",
    marketCap: "≈1조 원 안팎 (2025~26, 변동)",
    shareholders: [sh("LX홀딩스", "≈33%"), sh("기타 유통주식(외국인·기관·개인)", "나머지")],
    financials: [
      fin("2025 매출(연결, 근사)", "≈1.6~1.8조 원"),
      fin("주 고객", "LG디스플레이(주력), 삼성디스플레이(신규)"),
      fin("신사업", "전력반도체 등"),
    ],
  },
  samsungelec: {
    listing: "KOSPI 005930",
    marketCap: "≈2,000조 원 안팎 (보통주+우선주, 국내 시총 1위, 변동)",
    shareholders: [sh("삼성생명보험", "≈19.8%"), sh("국민연금공단", "≈7.8%"), sh("삼성물산", "≈5.0%")],
    financials: [
      fin("2024 연결매출", "≈300조 원"),
      fin("사업 비중", "반도체(DS) 최대 · 디스플레이는 자회사 SDC"),
      fin("디스플레이 수요 맥락", "갤럭시·TV 세트 = SDC 최대 고객"),
    ],
  },
  lgelec: {
    listing: "KOSPI 066570",
    marketCap: "≈60조 원대 (코스피 상위, 변동)",
    shareholders: [sh("(주)LG", "≈33.7%"), sh("국민연금공단", "≈6%대"), sh("기타 기관·외국인·소액", "≈60%대")],
    financials: [
      fin("2024 연결매출", "≈87.7조 원 (역대 최대)"),
      fin("2024 영업이익", "≈3.4조 원"),
      fin("디스플레이 수요 맥락", "OLED TV 세트 = LGD 대형 패널 주요 수요"),
    ],
  },
  motie: {
    listing: "정부기관 (비상장)",
    marketCap: "해당 없음 (정부조직)",
    shareholders: [sh("대한민국 정부", "국가기관")],
    financials: [
      fin("정책 도구", "국가전략기술 지정·세액공제·소부장·R&D·특화단지"),
      fin("2025~26 동향", "K-디스플레이 특별법·국내 소부장 추가공제 추진"),
      fin("조직 변화", "2025 개편으로 에너지 기능 이관(산업 기능 존속)"),
    ],
  },
};

for (const c of COMPANIES) {
  const d = DETAILS[c.id];
  if (!d) continue;
  c.listing = d.listing;
  c.marketCap = d.marketCap;
  c.shareholders = d.shareholders;
  c.financials = d.financials;
}

const e = (from: string, to: string, relationship: string, label: string): SupplyEdge => ({
  id: `${from}-${to}-${relationship}`, from, to, relationship, label,
});

export const EDGES: SupplyEdge[] = [
  // 발광재료 → 패널
  e("duksan", "sdc", "emitter", "OLED 발광재료 공급(HTL·R/G 프라임·블랙PDL)"),
  e("solus", "sdc", "emitter", "중소형 OLED용 발광재료(HBL 등) 공급"),
  e("solus", "lgd", "emitter", "대형 OLED(WOLED)용 발광재료(HTL 등) 공급"),
  // 광학·소재 → 패널
  e("dongwoo", "sdc", "optical", "편광판·컬러필터 등 광학소재 공급(스미토모 자회사)"),
  e("dowinsys", "sdc", "optical", "폴더블 커버 UTG 공급(갤럭시 Z 독점, SDC 인수 자회사)"),  e("inox", "sdc", "optical", "플렉시블 OLED 백플레이트 필름 등 점착소재 공급"),
  e("inox", "lgd", "optical", "WOLED용 봉지·점착 소재 공급"),
  // 장비 → 패널
  e("apsystem", "sdc", "equipment", "ELA(레이저결정화·세계1위)·봉지 장비 공급(SDC 전용)"),
  e("yas", "lgd", "equipment", "OLED 증착 증발원·증착기 공급(8세대급)"),
  e("sunic", "lgd", "equipment", "OLED 증착기 공급(국산화)"),
  e("hims", "sdc", "equipment", "OLED FMM 마스크 인장·검사 장비 공급(독점급)"),
  // 구동칩 → 패널
  e("lxsemicon", "lgd", "ddi", "디스플레이 구동칩(DDI) 공급(LGD 주력)"),
  e("lxsemicon", "sdc", "ddi", "IT OLED용 DDI 공급(2026 신규)"),
  // 패널 → 세트
  e("sdc", "samsungelec", "panel", "스마트폰·IT·TV용 OLED 패널 납품(갤럭시·QD-OLED)"),
  e("lgd", "lgelec", "panel", "대형 WOLED TV 패널 등 납품(LG OLED TV)"),
  e("lgd", "samsungelec", "panel", "삼성 OLED TV용 WOLED 패널 공급"),
  // 규제
  e("motie", "sdc", "regulation", "디스플레이 국가전략기술 세제·소부장 등 산업정책"),
  e("motie", "lgd", "regulation", "디스플레이 국가전략기술·R&D·세제 지원"),
];

// 배지: 워드마크 + 브랜드색
const BADGE: Record<string, { brand: string; wordmark: string }> = {
  sdc: { brand: "#1428a0", wordmark: "삼성\n디스플" },
  lgd: { brand: "#a50034", wordmark: "LG\nDisplay" },
  duksan: { brand: "#1f8f4e", wordmark: "덕산\n네오룩스" },
  solus: { brand: "#c026d3", wordmark: "솔루스\n첨단" },
  dongwoo: { brand: "#0a64b0", wordmark: "동우\n화인켐" },
  kolon: { brand: "#00857c", wordmark: "코오롱\nINDU" },
  dowinsys: { brand: "#5a6cc4", wordmark: "도우\n인시스" },
  inox: { brand: "#e6731f", wordmark: "이녹스" },
  apsystem: { brand: "#2f6fb0", wordmark: "AP\n시스템" },
  hims: { brand: "#1f9ed1", wordmark: "힘스" },
  yas: { brand: "#7c5cf0", wordmark: "YAS" },
  sunic: { brand: "#00a3e0", wordmark: "선익\n시스템" },
  lxsemicon: { brand: "#9b1c2e", wordmark: "LX\n세미콘" },
  samsungelec: { brand: "#1428a0", wordmark: "삼성\n전자" },
  lgelec: { brand: "#a50034", wordmark: "LG\n전자" },
  motie: { brand: "#9fb4d4", wordmark: "산업\n통상부" },
};

const badges: Record<string, CompanyBadge> = {};
for (const c of COMPANIES) {
  const b = BADGE[c.id];
  badges[c.id] = { brand: b?.brand ?? "#94a3b8", wordmark: b?.wordmark ?? c.name };
}

export const displayArea: AtlasArea = {
  id: "display",
  name: "디스플레이 유니버스",
  shortName: "디스플레이",
  accent: "#d946ef",

  taxonomyHint: "디스플레이 분류 — 노드를 선택하면 자세한 정보가 열립니다",
  categories: CATEGORIES,
  familyOrder: FAMILY_ORDER,
  familyColors: FAMILY_COLORS,
  familyLabelKo: FAMILY_LABEL_KO,
  familyDesc: FAMILY_DESC_KO,
  taxonomyLegendTitle: "디스플레이 분류",
  taxonomyListTitle: "디스플레이 분류",
  backdrop: "textures/display-bg.svg",

  supplyHint: "K-디스플레이 공급망 — 기업을 선택하면 자세한 정보가 열립니다",
  companies: COMPANIES,
  edges: EDGES,
  groupOrder: GROUP_ORDER,
  groupColors: GROUP_COLORS,
  groupLabelKo: GROUP_LABEL_KO,
  groupCenters: GROUP_CENTERS,
  edgeColors: EDGE_COLORS,
  relationshipLegend: [
    { color: EDGE_COLORS.emitter, label: "발광재료 공급" },
    { color: EDGE_COLORS.optical, label: "편광·광학·봉지·커버 소재 공급" },
    { color: EDGE_COLORS.equipment, label: "장비 공급" },
    { color: EDGE_COLORS.ddi, label: "구동칩(DDI) 공급" },
    { color: EDGE_COLORS.panel, label: "패널 → 세트 납품" },
    { color: EDGE_COLORS.regulation, label: "정책·규제" },
  ],
  badges,
  hq: DISPLAY_HQ,
  mapFocus: {
    iso3: "KOR",
    center: [36.6, 127.2],
    spanDeg: 6.5,
    cities: [
      { name: "Seoul", lat: 37.57, lon: 126.98 },
      { name: "Asan", lat: 36.79, lon: 127.08 },
      { name: "Cheonan", lat: 36.81, lon: 127.15 },
      { name: "Paju", lat: 37.76, lon: 126.78 },
      { name: "Suwon", lat: 37.26, lon: 127.03 },
      { name: "Daejeon", lat: 36.35, lon: 127.38 },
      { name: "Iksan", lat: 35.95, lon: 126.96 },
      { name: "Cheongju", lat: 36.64, lon: 127.49 },
      { name: "Hwaseong", lat: 37.18, lon: 127.07 },
      { name: "Incheon", lat: 37.41, lon: 126.72 },
      { name: "Sejong", lat: 36.50, lon: 127.26 },
    ],
  },
  nodeSizeNote: "노드 = 기업 (크기 ∝ √사업규모·중심성, 시총과 직접 비례 아님)",
  supplyListTitle: "기업",

  examplesTitle: "대표 제품·사례",
  trendTitle: "현황 (2025~2026)",
  sharesTitle: "점유·지위 (근사)",

  dataAsOf: "2025~2026년 기준",
  dataDisclaimer: "수치는 2025~2026년 기준 근사치 — 개념 이해용이며 투자 정보가 아닙니다.",
};
