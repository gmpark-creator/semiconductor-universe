// data/companies.ts
// 반도체 공급망 회사 노드 + 관계 엣지 (≈ early-2026, 예시용 근사치). 숫자는 이 파일에서 수정.

export type CompanyGroup = "Designer" | "IDM" | "Foundry" | "Equipment" | "EDA/IP";
export type Relationship = "IP" | "EDA" | "order" | "equipment" | "delivery";

export interface Company {
  id: string;
  name: string;
  type: string;
  group: CompanyGroup;
  marketCapB: number; // USD billions, approx
  revenueB: number; // USD billions, approx
  note: string;
}

export interface SupplyEdge {
  id: string;
  from: string;
  to: string;
  relationship: Relationship;
  label: string;
}

/** 관계별 화살표 색 (명세). */
export const EDGE_COLORS: Record<Relationship, string> = {
  order: "#F59E0B", // design → foundry (orange)
  delivery: "#22D3EE", // foundry → customer (cyan)
  equipment: "#A855F7", // equipment → foundry (purple)
  IP: "#34D399", // IP / EDA → designer (green)
  EDA: "#34D399", // EDA → designer (green)
};

export const RELATIONSHIP_DESC: Record<Relationship, string> = {
  order: "Design → Foundry (fabrication order)",
  delivery: "Foundry / Memory → Customer (delivery)",
  equipment: "Equipment → Foundry (tools)",
  IP: "IP → Designer (architecture license)",
  EDA: "EDA → Designer (design tools)",
};

export const COMPANIES: Company[] = [
  // ── Designers (fabless / IDM design) ──
  { id: "nvidia", name: "NVIDIA", type: "Designer (AI / GPU)", group: "Designer", marketCapB: 3000, revenueB: 130, note: "Dominant AI accelerators." },
  { id: "apple", name: "Apple", type: "Designer (SoC)", group: "Designer", marketCapB: 3500, revenueB: 400, note: "M / A-series; largest TSMC customer." },
  { id: "amd", name: "AMD", type: "Designer (CPU / GPU)", group: "Designer", marketCapB: 250, revenueB: 26, note: "CPUs (Ryzen/EPYC) and MI-series accelerators." },
  { id: "qualcomm", name: "Qualcomm", type: "Designer (mobile / RF)", group: "Designer", marketCapB: 180, revenueB: 39, note: "Snapdragon SoCs and mobile RF." },
  { id: "broadcom", name: "Broadcom", type: "Designer (networking / custom)", group: "Designer", marketCapB: 1000, revenueB: 60, note: "Networking and custom AI silicon." },

  // ── IDM (design + manufacture) ──
  { id: "intel", name: "Intel", type: "IDM (logic)", group: "IDM", marketCapB: 100, revenueB: 53, note: "Building a foundry business." },
  { id: "samsung", name: "Samsung", type: "IDM (memory + foundry)", group: "IDM", marketCapB: 350, revenueB: 200, note: "#1/#2 memory, #2 foundry." },
  { id: "skhynix", name: "SK hynix", type: "IDM (memory)", group: "IDM", marketCapB: 120, revenueB: 50, note: "HBM leader supplying NVIDIA." },
  { id: "micron", name: "Micron", type: "IDM (memory)", group: "IDM", marketCapB: 110, revenueB: 30, note: "DRAM / NAND / HBM." },
  { id: "ti", name: "Texas Instruments", type: "IDM (analog)", group: "IDM", marketCapB: 170, revenueB: 16, note: "Analog leader." },

  // ── Pure-play Foundry ──
  { id: "tsmc", name: "TSMC", type: "Foundry", group: "Foundry", marketCapB: 900, revenueB: 90, note: "≈60%+ foundry share; makes chips for NVIDIA / Apple / AMD." },

  // ── Equipment & EUV ──
  { id: "asml", name: "ASML", type: "Equipment (litho)", group: "Equipment", marketCapB: 350, revenueB: 30, note: "Sole EUV lithography supplier." },
  { id: "amat", name: "Applied Materials", type: "Equipment", group: "Equipment", marketCapB: 150, revenueB: 27, note: "Deposition / etch tools." },

  // ── EDA / IP ──
  { id: "arm", name: "ARM", type: "IP", group: "EDA/IP", marketCapB: 150, revenueB: 4, note: "CPU architecture licensed industry-wide." },
  { id: "synopsys", name: "Synopsys", type: "EDA", group: "EDA/IP", marketCapB: 90, revenueB: 6, note: "Chip design automation tools." },
  { id: "cadence", name: "Cadence", type: "EDA", group: "EDA/IP", marketCapB: 80, revenueB: 4.5, note: "Chip design automation tools." },
];

const edge = (from: string, to: string, relationship: Relationship, label: string): SupplyEdge => ({
  id: `${from}-${to}-${relationship}`,
  from,
  to,
  relationship,
  label,
});

export const EDGES: SupplyEdge[] = [
  // ARM → designers (IP)
  edge("arm", "nvidia", "IP", "licenses CPU architecture"),
  edge("arm", "apple", "IP", "licenses CPU architecture"),
  edge("arm", "qualcomm", "IP", "licenses CPU architecture"),
  // EDA → designers
  edge("synopsys", "nvidia", "EDA", "design tools"),
  edge("synopsys", "amd", "EDA", "design tools"),
  edge("synopsys", "apple", "EDA", "design tools"),
  edge("cadence", "nvidia", "EDA", "design tools"),
  edge("cadence", "amd", "EDA", "design tools"),
  edge("cadence", "apple", "EDA", "design tools"),
  // designers → TSMC (order)
  edge("nvidia", "tsmc", "order", "orders GPU fabrication"),
  edge("apple", "tsmc", "order", "orders SoC fabrication (lead node)"),
  edge("amd", "tsmc", "order", "orders CPU/GPU fabrication"),
  // equipment → fabs
  edge("asml", "tsmc", "equipment", "supplies EUV machines"),
  edge("asml", "samsung", "equipment", "supplies EUV machines"),
  edge("asml", "intel", "equipment", "supplies EUV machines"),
  edge("amat", "tsmc", "equipment", "deposition/etch tools"),
  edge("amat", "samsung", "equipment", "deposition/etch tools"),
  edge("amat", "intel", "equipment", "deposition/etch tools"),
  // memory → NVIDIA (HBM/DRAM delivery)
  edge("skhynix", "nvidia", "delivery", "supplies HBM3E"),
  edge("samsung", "nvidia", "delivery", "supplies HBM / DRAM"),
  edge("micron", "nvidia", "delivery", "supplies HBM"),
  // TSMC → customers (delivery)
  edge("tsmc", "nvidia", "delivery", "delivers finished wafers / chips"),
  edge("tsmc", "apple", "delivery", "delivers finished wafers / chips"),
  edge("tsmc", "amd", "delivery", "delivers finished wafers / chips"),
];
