// data/areas/semiconductor.ts
// 반도체 유니버스 영역 — 기존 semiconductors.ts / companies.ts 데이터를 AtlasArea로 래핑.
import {
  CATEGORIES, FAMILY_COLORS, FAMILY_LABEL_KO, FAMILY_DESC_KO, DATA_AS_OF, DATA_DISCLAIMER,
} from "../semiconductors";
import { COMPANIES, EDGES, EDGE_COLORS, GROUP_LABEL_KO, COMPANY_SHARES } from "../companies";
import { SEMICONDUCTOR_PROCESS } from "../semiconductorProcess";
import { SEMI_BUSINESS_MODEL } from "../semiconductorBusinessModel";
import type { AtlasArea, Category, Company, SupplyEdge, CompanyBadge, HqCoord } from "../types";
import {
  siNvidia, siApple, siAmd, siQualcomm, siBroadcom, siIntel, siSamsung, siArm,
  siMediatek, siStmicroelectronics, siSiemens,
} from "simple-icons";

const FAMILY_ORDER = ["Logic", "Memory", "Analog", "Power", "Sensor", "RF", "Manufacturing"];
const GROUP_ORDER = ["Designer", "IDM", "Foundry", "Equipment", "EDA/IP"];

const GROUP_COLORS: Record<string, string> = {
  Designer: "#60A5FA", IDM: "#F472B6", Foundry: "#22D3EE", Equipment: "#C084FC", "EDA/IP": "#34D399",
};
const GROUP_CENTERS: Record<string, [number, number, number]> = {
  Designer: [-9, 4, 12], Foundry: [15, -1, 1], IDM: [7, 5, -13], Equipment: [-10, -4, -11], "EDA/IP": [-15, 2, 1],
};
const COMPANY_HQ: Record<string, HqCoord> = {
  nvidia: { lat: 37.37, lon: -121.96 }, apple: { lat: 37.33, lon: -122.03 }, amd: { lat: 37.35, lon: -121.97 },
  broadcom: { lat: 37.44, lon: -122.14 }, qualcomm: { lat: 32.9, lon: -117.2 }, amat: { lat: 37.39, lon: -121.97 },
  lam: { lat: 37.55, lon: -121.99 }, kla: { lat: 37.43, lon: -121.9 }, synopsys: { lat: 37.37, lon: -122.04 },
  cadence: { lat: 37.34, lon: -121.89 }, intel: { lat: 37.39, lon: -121.96 }, "intel-foundry": { lat: 33.3, lon: -111.9 },
  micron: { lat: 43.62, lon: -116.2 }, ti: { lat: 32.78, lon: -96.8 }, adi: { lat: 42.55, lon: -71.17 },
  globalfoundries: { lat: 42.98, lon: -73.79 }, "siemens-eda": { lat: 45.31, lon: -122.77 },
  samsung: { lat: 37.26, lon: 127.03 }, skhynix: { lat: 37.27, lon: 127.44 }, "samsung-foundry": { lat: 37.16, lon: 127.1 },
  tsmc: { lat: 24.78, lon: 120.99 }, mediatek: { lat: 24.81, lon: 120.97 }, smic: { lat: 31.23, lon: 121.47 },
  tel: { lat: 35.68, lon: 139.76 }, asml: { lat: 51.42, lon: 5.4 }, infineon: { lat: 48.14, lon: 11.58 },
  stmicro: { lat: 46.2, lon: 6.14 }, arm: { lat: 52.21, lon: 0.09 },
};

const LOGO_PATHS: Record<string, string> = {
  nvidia: siNvidia.path, apple: siApple.path, amd: siAmd.path, qualcomm: siQualcomm.path,
  broadcom: siBroadcom.path, intel: siIntel.path, samsung: siSamsung.path, arm: siArm.path,
  mediatek: siMediatek.path, stmicro: siStmicroelectronics.path, "siemens-eda": siSiemens.path,
};
const WORDMARK: Record<string, string> = {
  skhynix: "SK hynix", micron: "Micron", ti: "TI", tsmc: "TSMC", "samsung-foundry": "Samsung\nFoundry",
  "intel-foundry": "Intel\nFoundry", globalfoundries: "GF", smic: "SMIC", asml: "ASML", amat: "AMAT",
  lam: "Lam", tel: "TEL", kla: "KLA", infineon: "Infineon", adi: "ADI", synopsys: "Synopsys", cadence: "cadence",
};
const BRAND_HEX: Record<string, string> = {
  nvidia: "#8CD600", apple: "#D7DBE0", amd: "#F22730", qualcomm: "#4A66F0", broadcom: "#F0203F",
  mediatek: "#FF8A33", intel: "#2186E0", samsung: "#3A5BDC", skhynix: "#FF1F44", micron: "#2A7FE0",
  ti: "#F0271C", infineon: "#1FB8C4", stmicro: "#2F9BE0", adi: "#1E78D6", tsmc: "#E11D38",
  "samsung-foundry": "#5B7BF0", "intel-foundry": "#2186E0", globalfoundries: "#7A5CF0", smic: "#E0A020",
  asml: "#2A86D6", amat: "#19A6E6", lam: "#16B8A0", tel: "#3A7BE0", kla: "#7C5CF0", arm: "#16C0CE",
  synopsys: "#F26B21", cadence: "#16B85C", "siemens-eda": "#16B8A0",
};

function fmtB(b: number): string {
  if (b >= 1000) return `${(b / 1000).toFixed(b >= 10000 ? 1 : 2)}T`;
  return `${b}B`;
}
function fmtCap(b: number): string {
  if (b <= 0) return "";
  return `≈$${fmtB(b)}`;
}

const categories: Category[] = CATEGORIES.map((c) => ({
  id: c.id, name: c.name, family: c.family, color: c.color, icon: c.icon,
  definition: c.definition, role: c.role, keySpecs: c.keySpecs,
  examples: c.exampleProducts, trend: c.trend2026,
}));

const companies: Company[] = COMPANIES.map((c) => ({
  id: c.id, name: c.name, type: c.type, group: c.group, hq: c.hq, note: c.note, detail: c.detail,
  weight: c.marketCapB > 0 ? c.marketCapB : c.revenueB * 8,
  metric: c.marketCapB > 0 ? fmtCap(c.marketCapB) : undefined,
  stats: [
    { label: "시가총액", value: c.marketCapB > 0 ? `≈ $${fmtB(c.marketCapB)}` : "모회사 통합" },
    { label: "매출 (연간)", value: `≈ $${fmtB(c.revenueB)}` },
  ],
  shares: COMPANY_SHARES[c.id] ?? [],
}));

const edges: SupplyEdge[] = EDGES.map((e) => ({
  id: e.id, from: e.from, to: e.to, relationship: e.relationship, label: e.label,
}));

const badges: Record<string, CompanyBadge> = {};
for (const c of COMPANIES) {
  badges[c.id] = { brand: BRAND_HEX[c.id] ?? "#94a3b8", wordmark: WORDMARK[c.id], logoPath: LOGO_PATHS[c.id] };
}

export const semiconductorArea: AtlasArea = {
  id: "semiconductor",
  name: "반도체 유니버스",
  shortName: "반도체",
  accent: "#6366f1",

  taxonomyHint: "칩 분류 — 노드를 선택하면 자세한 정보가 열립니다",
  categories,
  familyOrder: FAMILY_ORDER,
  familyColors: FAMILY_COLORS as Record<string, string>,
  familyLabelKo: FAMILY_LABEL_KO as Record<string, string>,
  familyDesc: FAMILY_DESC_KO as Record<string, string>,
  taxonomyLegendTitle: "칩 패밀리",
  taxonomyListTitle: "칩 분류",
  backdrop: "textures/chip-bg.svg",

  supplyHint: "공급망 — 기업을 선택하면 자세한 정보가 열립니다",
  companies,
  edges,
  groupOrder: GROUP_ORDER,
  groupColors: GROUP_COLORS,
  groupLabelKo: GROUP_LABEL_KO as Record<string, string>,
  groupCenters: GROUP_CENTERS,
  edgeColors: EDGE_COLORS as Record<string, string>,
  relationshipLegend: [
    { color: EDGE_COLORS.order, label: "설계 → 파운드리 (발주)" },
    { color: EDGE_COLORS.delivery, label: "파운드리 / 메모리 → 고객" },
    { color: EDGE_COLORS.equipment, label: "장비 → 파운드리" },
    { color: EDGE_COLORS.IP, label: "IP / EDA → 설계사" },
  ],
  badges,
  hq: COMPANY_HQ,
  nodeSizeNote: "노드 = 기업 (크기 ∝ √시가총액)",
  supplyListTitle: "기업",

  process: SEMICONDUCTOR_PROCESS,
  businessModel: SEMI_BUSINESS_MODEL,

  examplesTitle: "예시 제품 (2026)",
  trendTitle: "2026 동향",
  sharesTitle: "세계시장 점유 (분야별 · 근사)",

  dataAsOf: DATA_AS_OF,
  dataDisclaimer: DATA_DISCLAIMER,
};
