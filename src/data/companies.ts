// data/companies.ts
// 반도체 공급망 회사 노드 + 관계 엣지 (≈ 2026년 초, 예시용 근사치). 숫자는 이 파일에서 수정.

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
  order: "#F59E0B", // 설계 → 파운드리 (주황)
  delivery: "#22D3EE", // 파운드리 → 고객 (시안)
  equipment: "#A855F7", // 장비 → 파운드리 (보라)
  IP: "#34D399", // IP / EDA → 설계사 (초록)
  EDA: "#34D399", // EDA → 설계사 (초록)
};

/** 그룹 한글 라벨 (범례·패널 표시용). */
export const GROUP_LABEL_KO: Record<CompanyGroup, string> = {
  Designer: "설계 (팹리스)",
  IDM: "IDM (종합반도체)",
  Foundry: "파운드리",
  Equipment: "장비",
  "EDA/IP": "EDA / IP",
};

export const RELATIONSHIP_DESC: Record<Relationship, string> = {
  order: "설계 → 파운드리 (제조 발주)",
  delivery: "파운드리 / 메모리 → 고객 (납품)",
  equipment: "장비 → 파운드리 (장비 공급)",
  IP: "IP → 설계사 (아키텍처 라이선스)",
  EDA: "EDA → 설계사 (설계 도구)",
};

export const COMPANIES: Company[] = [
  // ── 설계사 (팹리스 / IDM 설계) ──
  { id: "nvidia", name: "NVIDIA", type: "설계 (AI / GPU)", group: "Designer", marketCapB: 3000, revenueB: 130, note: "AI 가속기 시장 압도적 1위." },
  { id: "apple", name: "Apple", type: "설계 (SoC)", group: "Designer", marketCapB: 3500, revenueB: 400, note: "M / A 시리즈 설계; TSMC 최대 고객." },
  { id: "amd", name: "AMD", type: "설계 (CPU / GPU)", group: "Designer", marketCapB: 250, revenueB: 26, note: "Ryzen/EPYC CPU와 MI 시리즈 가속기." },
  { id: "qualcomm", name: "Qualcomm", type: "설계 (모바일 / RF)", group: "Designer", marketCapB: 180, revenueB: 39, note: "Snapdragon SoC와 모바일 RF." },
  { id: "broadcom", name: "Broadcom", type: "설계 (네트워킹 / 커스텀)", group: "Designer", marketCapB: 1000, revenueB: 60, note: "네트워킹과 맞춤형 AI 실리콘." },

  // ── IDM (설계 + 제조) ──
  { id: "intel", name: "Intel", type: "IDM (로직)", group: "IDM", marketCapB: 100, revenueB: 53, note: "파운드리 사업 구축 중." },
  { id: "samsung", name: "Samsung", type: "IDM (메모리 + 파운드리)", group: "IDM", marketCapB: 350, revenueB: 200, note: "메모리 1·2위, 파운드리 2위." },
  { id: "skhynix", name: "SK hynix", type: "IDM (메모리)", group: "IDM", marketCapB: 120, revenueB: 50, note: "HBM 선두, NVIDIA에 공급." },
  { id: "micron", name: "Micron", type: "IDM (메모리)", group: "IDM", marketCapB: 110, revenueB: 30, note: "DRAM / NAND / HBM." },
  { id: "ti", name: "Texas Instruments", type: "IDM (아날로그)", group: "IDM", marketCapB: 170, revenueB: 16, note: "아날로그 강자." },

  // ── 순수 파운드리 ──
  { id: "tsmc", name: "TSMC", type: "파운드리", group: "Foundry", marketCapB: 900, revenueB: 90, note: "파운드리 점유율 60%+; NVIDIA / Apple / AMD 칩 제조." },

  // ── 장비 & EUV ──
  { id: "asml", name: "ASML", type: "장비 (리소그래피)", group: "Equipment", marketCapB: 350, revenueB: 30, note: "유일한 EUV 리소그래피 공급사." },
  { id: "amat", name: "Applied Materials", type: "장비", group: "Equipment", marketCapB: 150, revenueB: 27, note: "증착 / 식각 장비." },

  // ── EDA / IP ──
  { id: "arm", name: "ARM", type: "IP", group: "EDA/IP", marketCapB: 150, revenueB: 4, note: "전 산업에 라이선스되는 CPU 아키텍처." },
  { id: "synopsys", name: "Synopsys", type: "EDA", group: "EDA/IP", marketCapB: 90, revenueB: 6, note: "칩 설계 자동화 도구." },
  { id: "cadence", name: "Cadence", type: "EDA", group: "EDA/IP", marketCapB: 80, revenueB: 4.5, note: "칩 설계 자동화 도구." },
];

const edge = (from: string, to: string, relationship: Relationship, label: string): SupplyEdge => ({
  id: `${from}-${to}-${relationship}`,
  from,
  to,
  relationship,
  label,
});

export const EDGES: SupplyEdge[] = [
  // ARM → 설계사 (IP)
  edge("arm", "nvidia", "IP", "CPU 아키텍처 라이선스"),
  edge("arm", "apple", "IP", "CPU 아키텍처 라이선스"),
  edge("arm", "qualcomm", "IP", "CPU 아키텍처 라이선스"),
  // EDA → 설계사
  edge("synopsys", "nvidia", "EDA", "설계 도구"),
  edge("synopsys", "amd", "EDA", "설계 도구"),
  edge("synopsys", "apple", "EDA", "설계 도구"),
  edge("cadence", "nvidia", "EDA", "설계 도구"),
  edge("cadence", "amd", "EDA", "설계 도구"),
  edge("cadence", "apple", "EDA", "설계 도구"),
  // 설계사 → TSMC (발주)
  edge("nvidia", "tsmc", "order", "GPU 제조 발주"),
  edge("apple", "tsmc", "order", "SoC 제조 발주 (선단 노드)"),
  edge("amd", "tsmc", "order", "CPU/GPU 제조 발주"),
  // 장비 → 팹
  edge("asml", "tsmc", "equipment", "EUV 장비 공급"),
  edge("asml", "samsung", "equipment", "EUV 장비 공급"),
  edge("asml", "intel", "equipment", "EUV 장비 공급"),
  edge("amat", "tsmc", "equipment", "증착/식각 장비"),
  edge("amat", "samsung", "equipment", "증착/식각 장비"),
  edge("amat", "intel", "equipment", "증착/식각 장비"),
  // 메모리 → NVIDIA (HBM/DRAM 납품)
  edge("skhynix", "nvidia", "delivery", "HBM3E 공급"),
  edge("samsung", "nvidia", "delivery", "HBM / DRAM 공급"),
  edge("micron", "nvidia", "delivery", "HBM 공급"),
  // TSMC → 고객 (납품)
  edge("tsmc", "nvidia", "delivery", "완성 웨이퍼 / 칩 납품"),
  edge("tsmc", "apple", "delivery", "완성 웨이퍼 / 칩 납품"),
  edge("tsmc", "amd", "delivery", "완성 웨이퍼 / 칩 납품"),
];
