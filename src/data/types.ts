// data/types.ts
// Knowledge Atlas — 여러 지식 "영역(area)"이 공유하는 제네릭 타입.
// 반도체 유니버스·전력 유니버스 등 각 영역은 AtlasArea 하나로 표현되고,
// 3D 엔진/UI는 이 타입만 알면 영역에 무관하게 동작한다(데이터 주도).

/** 분류 노드 3D 아이콘 키 — 반도체 + 전력 공용. CategoryNode가 키별 3D 모델을 그린다. */
export type IconKey =
  // 반도체
  | "cube" | "grid" | "sine" | "lightning" | "lens" | "wave" | "fabric" | "wafer"
  // 전력
  | "atom" | "smokestack" | "solar" | "turbine" | "dam" | "h2tank" | "battery" | "pylon" | "gridhub";

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
}

export interface SupplyEdge {
  id: string;
  from: string;
  to: string;
  relationship: string; // 영역이 정의하는 관계 키
  label: string;
}

/** 엠블럼 배지 — 로고 path(있으면) 또는 워드마크 텍스트 + 브랜드색. */
export interface CompanyBadge { brand: string; wordmark?: string; logoPath?: string }
export interface HqCoord { lat: number; lon: number }

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
  nodeSizeNote: string; // 범례(예: "크기 ∝ √시가총액")
  supplyListTitle: string; // 좌측 목록 제목(예: "기업")

  // ── 패널 라벨 ──
  examplesTitle: string; // "예시 제품 (2026)" / "대표 설비·사례"
  trendTitle: string; // "2026 동향" / "현황"
  sharesTitle: string; // "세계시장 점유 (분야별·근사)" / "국내 점유·비중"

  dataAsOf: string;
  dataDisclaimer: string;
}
