// data/types.ts
// Knowledgeverse(놀리지버스) — 여러 지식 "영역(area)"이 공유하는 제네릭 타입.
// 반도체 유니버스·전력 유니버스 등 각 영역은 AtlasArea 하나로 표현되고,
// 3D 엔진/UI는 이 타입만 알면 영역에 무관하게 동작한다(데이터 주도).

/** 분류 노드 3D 아이콘 키 — 반도체 + 전력 공용. CategoryNode가 키별 3D 모델을 그린다. */
export type IconKey =
  // 반도체
  | "cube" | "grid" | "sine" | "lightning" | "lens" | "wave" | "fabric" | "wafer"
  // 전력
  | "atom" | "smokestack" | "solar" | "turbine" | "dam" | "h2tank" | "battery" | "pylon" | "gridhub"
  // 2차전지
  | "cellStack" | "cellCyl" | "cellPrismatic" | "cellPouch" | "powder" | "beaker" | "film" | "coil" | "roller" | "solidBlock" | "recycle"
  // 디스플레이
  | "panel" | "foldable" | "molecule" | "microled" | "rollable"
  // 철강·제련
  | "furnace" | "arcFurnace" | "sheet" | "plate" | "rebar" | "wireRod" | "bar" | "ingot";

/** 분류(taxonomy) 노드 — 칩 종류 / 발전원·계통 종류 등. */
export interface Category {
  id: string;
  name: string;
  family: string; // 영역이 정의하는 패밀리 키
  color: string;
  icon: IconKey;
  definition: string;
  role: string;
  keySpecs: string[];
  examples: string[]; // 대표 제품 / 대표 설비·사례
  trend: string; // 현황·동향 한 문단
}

export interface CompanyStat { label: string; value: string }
export interface Share { field: string; pct: string }
/** 주주 현황 — 주주명 + 지분율. */
export interface Shareholder { name: string; pct: string }

/** 공급망 노드 — 기업/기관. */
export interface Company {
  id: string;
  name: string;
  type: string;
  group: string; // 영역이 정의하는 그룹 키
  hq: string; // 위치 표기(텍스트)
  note: string;
  detail: string;
  weight: number; // 엠블럼 배지 크기 가중치(√ 스케일)
  metric?: string; // 엠블럼 라벨 접미(예: "≈$5.1T", "≈24GW")
  stats: CompanyStat[]; // InfoPanel 상단 통계 셀(0~2)
  shares: Share[]; // 점유/비중

  // ── 상세 지표(선택) — InfoPanel 우측 패널 확장용 ──
  listing?: string; // 상장 시장·종목코드 (예: "KOSPI 015760") · 비상장이면 "비상장"
  marketCap?: string; // 시가총액 근사 (상장사) — 예: "≈14.2조 원"
  shareholders?: Shareholder[]; // 주요 주주 및 지분율
  financials?: CompanyStat[]; // 세부 재무·운영 지표(매출·영업이익·부채비율·배당 등)
}

export interface SupplyEdge {
  id: string;
  from: string;
  to: string;
  relationship: string; // 영역이 정의하는 관계 키
  label: string; // 짧은 관계 라벨(예: "LNG 연료 공급")
  cause?: string; // 한 문장 인과 — 이 관계(from→to)가 왜 존재하는가. 좌하단 관계 패널 상시 노출.
  detail?: string; // 상세 인과 설명(2~3문장) — 관계 패널의 "+" 확장 시 노출. 없으면 패널이 회사 정보로 자동 구성.
}

/** 공정(process) 모드 — 순차 파이프라인 단계의 3D 비주얼 종류(반도체 8대 공정). */
export type ProcessStageKind =
  | "wafer" | "oxide" | "photo" | "etch" | "deposition" | "wiring" | "test" | "package";

/** 공정 단계 하나 — 이미지(반도체 8대 공정)의 '왜 중요한가 / 특징 / 국내·해외 기업'을 데이터화. */
export interface ProcessStep {
  id: string;
  index: number; // 1..N 순번(흐름)
  name: string; // "웨이퍼 제조"
  short: string; // 노드/목록용 짧은 라벨
  color: string; // 단계 액센트색(스펙트럼)
  stage: ProcessStageKind; // 3D 비주얼 키
  why: string; // 왜 중요한가
  features: string[]; // 특징(불릿)
  domestic: string[]; // 국내 기업
  foreign: string[]; // 해외 기업
}

/** 공정 흐름 — 영역이 선택적으로 가질 수 있는 세 번째 모드(반도체만 보유). */
export interface ProcessFlowData {
  hint: string; // 상단 안내문
  subject: string; // 공정 안내 배너 제목 — "어떤 반도체를 만드는 과정인가" (예: "모든 실리콘 기반 반도체의 공통 제조 과정")
  intro: string; // 공정 안내 배너 본문 — 대상 반도체 범위·전체 흐름을 한두 문장으로 설명
  listTitle: string; // 좌측 목록 제목 ("8대 공정")
  legendTitle: string; // 범례 제목
  steps: ProcessStep[];
}

/** 엠블럼 배지 — 로고 path(있으면) 또는 워드마크 텍스트 + 브랜드색. */
export interface CompanyBadge { brand: string; wordmark?: string; logoPath?: string }
export interface HqCoord { lat: number; lon: number }

/** 공급망 지도를 특정 국가로 한정·확대할 때의 설정(예: 전력=대한민국).
 *  없으면 전 지구본(반도체=글로벌). */
export interface MapFocus {
  iso3: string; // 강조할 국가 ADM0_A3 (예: "KOR")
  center: [number, number]; // 기본 카메라가 바라볼 중심 [lat, lon]
  spanDeg: number; // 대략적인 위경도 폭 — 카메라 거리·라벨 스케일 산정용
  cities: { name: string; lat: number; lon: number }[]; // 소형 참조 도시 라벨
}

/** 하나의 지식 영역(반도체 유니버스 / 전력 유니버스 / …). */
export interface AtlasArea {
  id: string;
  name: string; // "반도체 유니버스"
  shortName: string; // "반도체"
  accent: string; // 대표 액센트색

  // ── 분류(taxonomy) 모드 ──
  taxonomyHint: string; // 상단 안내문
  categories: Category[];
  familyOrder: string[];
  familyColors: Record<string, string>;
  familyLabelKo: Record<string, string>;
  familyDesc: Record<string, string>;
  taxonomyLegendTitle: string; // 범례 제목(예: "칩 패밀리")
  taxonomyListTitle: string; // 좌측 목록 제목(예: "칩 분류")
  backdrop: string; // 배경 텍스처 경로(BASE_URL 기준 상대)

  // ── 공급망(supply) 모드 ──
  supplyHint: string;
  companies: Company[];
  edges: SupplyEdge[];
  groupOrder: string[];
  groupColors: Record<string, string>;
  groupLabelKo: Record<string, string>;
  groupCenters: Record<string, [number, number, number]>;
  edgeColors: Record<string, string>;
  relationshipLegend: { color: string; label: string }[];
  badges: Record<string, CompanyBadge>;
  hq: Record<string, HqCoord>;
  mapFocus?: MapFocus; // 지정 시 공급망 지도를 해당 국가로 한정·확대(전력=KOR). 없으면 전 지구본.
  nodeSizeNote: string; // 범례(예: "크기 ∝ √시가총액")
  supplyListTitle: string; // 좌측 목록 제목(예: "기업")

  // ── 공정(process) 모드 — 선택(반도체 8대 공정). 없으면 ViewToggle에 미노출 ──
  process?: ProcessFlowData;

  // ── 패널 라벨 ──
  examplesTitle: string; // "예시 제품 (2026)" / "대표 설비·사례"
  trendTitle: string; // "2026 동향" / "현황"
  sharesTitle: string; // "세계시장 점유 (분야별·근사)" / "국내 점유·비중"

  dataAsOf: string;
  dataDisclaimer: string;
}
