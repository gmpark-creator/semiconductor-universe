// data/companies.ts
// 반도체 공급망 회사 노드 + 관계 엣지 — 2026년 5월 기준, 웹 검증 근사치.
// 매출·시총은 USD billion. 숫자/내용은 이 파일에서 수정.

export type CompanyGroup = "Designer" | "IDM" | "Foundry" | "Equipment" | "EDA/IP";
export type Relationship = "IP" | "EDA" | "order" | "equipment" | "delivery" | "packaging";

export interface Company {
  id: string;
  name: string;
  type: string;
  group: CompanyGroup;
  marketCapB: number; // USD billions, approx (2026.5)
  revenueB: number; // USD billions, approx (최근 회계연도)
  hq: string; // 본사 국가/도시
  note: string; // 한 줄 역할
  detail: string; // 패널 본문 (2026 최신)
}

export interface SupplyEdge {
  id: string;
  from: string;
  to: string;
  relationship: Relationship;
  label: string;
}

/** 관계별 화살표 색. */
export const EDGE_COLORS: Record<Relationship, string> = {
  order: "#F59E0B", // 설계 → 파운드리 (주황)
  delivery: "#22D3EE", // 파운드리/메모리 → 고객 (시안)
  equipment: "#A855F7", // 장비 → 팹 (보라)
  packaging: "#F472B6", // 패키징 흐름 (핑크)
  IP: "#34D399", // IP → 설계사 (초록)
  EDA: "#34D399", // EDA → 설계사 (초록)
};

/** 그룹 한글 라벨. */
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
  packaging: "어드밴스드 패키징 (CoWoS) 흐름",
  IP: "IP → 설계사 (아키텍처 라이선스)",
  EDA: "EDA → 설계사 (설계 도구)",
};

export const COMPANIES: Company[] = [
  // ── 설계사 (팹리스) ──
  {
    id: "nvidia", name: "NVIDIA", type: "팹리스 (AI / GPU)", group: "Designer",
    marketCapB: 5100, revenueB: 130, hq: "미국 산타클라라",
    note: "AI 가속기 시장 압도적 1위.",
    detail: "FY2025 매출 약 1,305억 달러(+114%). 시총 약 5.1조 달러로 세계 최대 기업이 됐다. Blackwell(B200/B300)에 이어 2026 하반기 Rubin(HBM4)으로 세대 교체. CoWoS·HBM capa의 약 60%를 선점했다.",
  },
  {
    id: "apple", name: "Apple", type: "팹리스 (자사 SoC)", group: "Designer",
    marketCapB: 4500, revenueB: 416, hq: "미국 쿠퍼티노",
    note: "M/A 시리즈 설계, TSMC 최선단 노드 첫 고객.",
    detail: "FY2025 전사 매출 약 4,160억 달러. 2025년 10월 시총 4조 달러를 돌파(NVIDIA·MS에 이은 세 번째)해 2026년 5월 약 4.5조 달러. M5(TSMC N3P)를 출시했고 TSMC N2(2nm)의 런치 고객이며, 자체 모뎀·AP 내재화를 확대 중.",
  },
  {
    id: "amd", name: "AMD", type: "팹리스 (CPU / GPU)", group: "Designer",
    marketCapB: 820, revenueB: 34.6, hq: "미국 산타클라라",
    note: "Ryzen/EPYC + Instinct MI 가속기.",
    detail: "2025년 매출 약 346억 달러(+34%, 데이터센터 166억). Zen 5 EPYC 'Turin'(최대 192코어)과 Instinct MI350X/MI355X(CDNA 4·HBM3E 288GB)로 NVIDIA를 추격한다.",
  },
  {
    id: "broadcom", name: "Broadcom", type: "팹리스 (네트워킹 / 커스텀 AI)", group: "Designer",
    marketCapB: 2050, revenueB: 60, hq: "미국 팰로알토",
    note: "맞춤형 AI 실리콘·네트워킹 강자.",
    detail: "FY2025 매출 약 600억 달러. 하이퍼스케일러의 커스텀 AI 가속기(ASIC)와 네트워킹 칩을 설계하며 시총 약 2조 달러를 돌파, CoWoS capa의 약 15%를 차지한다.",
  },
  {
    id: "qualcomm", name: "Qualcomm", type: "팹리스 (모바일 / RF)", group: "Designer",
    marketCapB: 180, revenueB: 44.3, hq: "미국 샌디에이고",
    note: "Snapdragon SoC + 모바일 RF.",
    detail: "FY2025 매출 약 443억 달러(+13.7%). Snapdragon X2 Elite(NPU 80 TOPS)로 AI PC에 진입했고, 5G RF 프런트엔드의 핵심 공급사다.",
  },
  {
    id: "mediatek", name: "MediaTek", type: "팹리스 (모바일 SoC)", group: "Designer",
    marketCapB: 215, revenueB: 18.6, hq: "대만 신주",
    note: "Dimensity 모바일 AP — 출하량 세계 최대급.",
    detail: "2025년 매출 약 5,735억 대만달러(약 186억 달러, +14.6%). Dimensity 시리즈로 모바일 AP 출하량 세계 1~2위를 다투며, 온디바이스 AI·엣지로 영역을 넓히고 있다.",
  },
  // ── IDM (설계 + 제조) ──
  {
    id: "intel", name: "Intel", type: "IDM + 파운드리 (로직)", group: "IDM",
    marketCapB: 150, revenueB: 52.9, hq: "미국 산타클라라",
    note: "18A 공정·파운드리 재건, 미 정부 9.9% 지분.",
    detail: "2025년 매출 약 529억 달러. 18A(1.8nm·RibbonFET+PowerVia)로 'Panther Lake'를 양산하고 파운드리(IFS) 재건에 사활을 건다. 2025년 8월 미 정부가 CHIPS 보조금을 지분 약 9.9%로 전환했다.",
  },
  {
    id: "samsung", name: "Samsung", type: "IDM (메모리+파운드리+LSI)", group: "IDM",
    marketCapB: 1350, revenueB: 233, hq: "대한민국 수원",
    note: "메모리 1위급 + 파운드리 2위.",
    detail: "2025년 전사 매출 약 333.6조 원(+10.9%). DRAM·NAND 선두이자 SF2(2nm) 파운드리로 TSMC를 추격하며, HBM4(최대 11.7Gbps)로 NVIDIA·AMD 인증을 확보했다.",
  },
  {
    id: "skhynix", name: "SK hynix", type: "IDM (메모리)", group: "IDM",
    marketCapB: 1050, revenueB: 70, hq: "대한민국 이천",
    note: "HBM 1위 — NVIDIA 주력 공급사.",
    detail: "2025년 매출 약 97.15조 원(+46.8%), 영업이익 47.2조 원. HBM 점유 약 60%로 세계 최초 HBM4 양산 체제를 갖췄고, NVIDIA HBM4 물량의 약 2/3를 차지할 전망이다.",
  },
  {
    id: "micron", name: "Micron", type: "IDM (메모리)", group: "IDM",
    marketCapB: 1080, revenueB: 37.4, hq: "미국 보이시",
    note: "DRAM / NAND / HBM — 미국 유일 메모리.",
    detail: "FY2025 매출 약 374억 달러(+49%). 2026년 5월 시총 사상 첫 1조 달러를 돌파(약 1.08조). HBM에서 점유 2위(약 21%)로 올라섰고, HBM4 샘플(최대 11Gbps)을 출하하며 2026년 완판을 목표로 한다.",
  },
  {
    id: "ti", name: "Texas Instruments", type: "IDM (아날로그)", group: "IDM",
    marketCapB: 180, revenueB: 17.7, hq: "미국 댈러스",
    note: "아날로그·임베디드 세계 1위.",
    detail: "2025년 매출 약 177억 달러(+13.1%). 아날로그·PMIC 점유 1위(약 12.5%)로, 자체 300mm 팹에 대규모 투자하며 산업·자동차 시장을 공략한다.",
  },
  {
    id: "infineon", name: "Infineon", type: "IDM (전력 / 자동차)", group: "IDM",
    marketCapB: 65, revenueB: 16, hq: "독일 뮌헨",
    note: "전력반도체·차량용 세계 1위.",
    detail: "FY2025 매출 약 150억 달러대. 전력반도체(SiC/IGBT)와 차량용 MCU(AURIX)에서 선두로, 전기차·산업 전동화의 핵심 공급사다.",
  },
  {
    id: "stmicro", name: "STMicroelectronics", type: "IDM (전력 / MCU / 센서)", group: "IDM",
    marketCapB: 30, revenueB: 11.8, hq: "스위스 제네바",
    note: "MCU·SiC·MEMS 유럽 대표.",
    detail: "FY2025 매출 약 118억 달러(-11.1%). MCU·MEMS·SiC를 두루 갖춘 유럽 대표 IDM으로, 2024~2025년 자동차·산업 재고 조정을 겪었다.",
  },
  {
    id: "adi", name: "Analog Devices", type: "IDM (아날로그)", group: "IDM",
    marketCapB: 155, revenueB: 11.0, hq: "미국 윌밍턴",
    note: "고성능 아날로그·신호처리 2위.",
    detail: "FY2025 매출 약 110억 달러(+17%). 고정밀 데이터 컨버터·신호체인에서 TI에 이은 2위로, 산업·통신·자동차·AI 인프라 전원에 강점이 있다.",
  },
  // ── 순수 파운드리 ──
  {
    id: "tsmc", name: "TSMC", type: "파운드리", group: "Foundry",
    marketCapB: 2000, revenueB: 122, hq: "대만 신주",
    note: "파운드리 점유 약 70% — 첨단 제조 사실상 독점.",
    detail: "2025년 매출 약 1,224억 달러(+35.9% USD), 점유 약 70%. 2026년 2월 시총 2조 달러를 돌파했다. N2(2nm)를 2025년 4분기 양산 개시했고, NVIDIA·Apple·AMD 칩을 제조하며 CoWoS 패키징도 사실상 독점한다. 미국 투자를 총 1,650억 달러로 확대했다.",
  },
  {
    id: "samsung-foundry", name: "Samsung Foundry", type: "파운드리 (삼성 사업부)", group: "Foundry",
    marketCapB: 0, revenueB: 18, hq: "대한민국 (삼성 사업부)",
    note: "파운드리 2위 — SF2(2nm)로 추격.",
    detail: "2025년 파운드리 매출 약 150~200억 달러(추정). SF2(2nm GAA) 수율을 2026년 60%+로 끌어올리며 TSMC를 추격한다. 시총은 삼성전자에 통합.",
  },
  {
    id: "intel-foundry", name: "Intel Foundry", type: "파운드리 (인텔 사업부)", group: "Foundry",
    marketCapB: 0, revenueB: 18, hq: "미국 (인텔 사업부)",
    note: "18A로 외부 고객 유치 시도.",
    detail: "2025년 매출 약 170~200억 달러(상당 부분 내부거래). 18A를 무기로 외부 파운드리 고객 유치에 나섰고, 미 정부 지분과 CHIPS 지원을 등에 업었다.",
  },
  {
    id: "globalfoundries", name: "GlobalFoundries", type: "파운드리 (성숙 노드)", group: "Foundry",
    marketCapB: 30, revenueB: 6.8, hq: "미국 몰타(NY)",
    note: "성숙·특화 공정 5위.",
    detail: "2025년 매출 약 68억 달러(5위). 첨단노드 경쟁에서 빠져 자동차·산업·RF용 성숙·특화 공정에 집중하는 미국 기반 파운드리.",
  },
  {
    id: "smic", name: "SMIC", type: "파운드리 (중국)", group: "Foundry",
    marketCapB: 70, revenueB: 9.4, hq: "중국 상하이",
    note: "중국 최대 파운드리 — 7nm 자립.",
    detail: "2025년 매출 약 94억 달러(세계 3위). EUV 없이 DUV 멀티패터닝으로 7nm를 양산(수율 약 65%)했으나 미국 수출통제의 핵심 타깃이다. 중국 반도체 자립의 중심.",
  },
  // ── 장비 ──
  {
    id: "asml", name: "ASML", type: "장비 (노광 / EUV)", group: "Equipment",
    marketCapB: 580, revenueB: 36, hq: "네덜란드 펠트호번",
    note: "EUV 노광 100% 독점.",
    detail: "2025년 매출 약 327억 유로(사상 최고). EUV를 100% 독점하며, High-NA EUV(EXE:5200B, 대당 약 3.5억 달러)를 인텔·삼성·TSMC에 공급한다. 미·중 규제의 핵심 초크포인트.",
  },
  {
    id: "amat", name: "Applied Materials", type: "장비 (증착 / 식각)", group: "Equipment",
    marketCapB: 320, revenueB: 28.4, hq: "미국 산타클라라",
    note: "전공정 장비 세계 1위.",
    detail: "FY2025 매출 약 284억 달러. 증착·식각·이온주입 등 가장 넓은 장비 포트폴리오를 갖춘 WFE 1위로, GAA·후면전력 전환의 핵심 장비를 공급한다.",
  },
  {
    id: "lam", name: "Lam Research", type: "장비 (식각 / 증착)", group: "Equipment",
    marketCapB: 165, revenueB: 17, hq: "미국 프리몬트",
    note: "식각·증착 — 메모리(3D NAND) 강자.",
    detail: "FY2025 매출 약 160~180억 달러. 식각·증착 전문으로 3D NAND 고단 적층과 HBM·DRAM 공정에 강점이 있다.",
  },
  {
    id: "tel", name: "Tokyo Electron", type: "장비 (코터 / 식각)", group: "Equipment",
    marketCapB: 155, revenueB: 16, hq: "일본 도쿄",
    note: "코터/디벨로퍼·식각 — 일본 최대 장비.",
    detail: "FY2026(3월 종료) 매출 약 2.44조 엔(사상 최고). 코터·디벨로퍼(EUV 트랙)와 식각·세정에서 핵심 위치를 차지하는 일본 최대 반도체 장비사.",
  },
  {
    id: "kla", name: "KLA", type: "장비 (계측 / 검사)", group: "Equipment",
    marketCapB: 155, revenueB: 12.2, hq: "미국 밀피타스",
    note: "계측·검사(수율 관리) 압도적 1위.",
    detail: "FY2025 매출 약 122억 달러, 매출총이익률 약 61%. 공정 계측·결함 검사에서 사실상 독점적 위치로, 첨단노드·HBM 수율 관리의 필수 장비를 공급한다.",
  },
  // ── EDA / IP ──
  {
    id: "arm", name: "Arm", type: "IP (CPU 아키텍처)", group: "EDA/IP",
    marketCapB: 157, revenueB: 4.0, hq: "영국 케임브리지",
    note: "전 산업에 라이선스되는 CPU 아키텍처.",
    detail: "FY2025 매출 약 40억 달러(+24%). 모바일·서버(Neoverse)·자동차 등 거의 모든 SoC의 CPU 아키텍처를 라이선스하며, 자체 칩렛 플랫폼으로 영역을 넓히고 있다.",
  },
  {
    id: "synopsys", name: "Synopsys", type: "EDA + IP", group: "EDA/IP",
    marketCapB: 90, revenueB: 7.1, hq: "미국 서니베일",
    note: "EDA 1위 — Ansys 인수로 확장.",
    detail: "FY2025 매출 약 70.5억 달러(+15%). EDA 점유 약 31%로 1위이며, 2025년 약 350억 달러에 Ansys를 인수해 칩-시스템 설계·시뮬레이션으로 확장했다.",
  },
  {
    id: "cadence", name: "Cadence", type: "EDA + IP", group: "EDA/IP",
    marketCapB: 80, revenueB: 5.2, hq: "미국 산호세",
    note: "EDA 2위 — 설계 자동화.",
    detail: "2025년 매출 약 52억 달러. EDA 점유 약 30%로 Synopsys와 양강 구도를 이루며, AI 기반 설계 자동화와 시스템 분석으로 영역을 넓히고 있다.",
  },
  {
    id: "siemens-eda", name: "Siemens EDA", type: "EDA (구 Mentor)", group: "EDA/IP",
    marketCapB: 0, revenueB: 2.2, hq: "미국 윌슨빌",
    note: "EDA 3위 — 지멘스 산하.",
    detail: "2025년 EDA 매출 약 20~25억 달러(추정). 구 멘토 그래픽스로 EDA 점유 약 13%의 3위. 시총은 모회사 지멘스 AG에 통합.",
  },
];

const edge = (from: string, to: string, relationship: Relationship, label: string): SupplyEdge => ({
  id: `${from}-${to}-${relationship}`,
  from,
  to,
  relationship,
  label,
});

export const EDGES: SupplyEdge[] = [
  // ── IP → 설계사 ──
  edge("arm", "nvidia", "IP", "Arm 아키텍처(Grace/Vera)"),
  edge("arm", "apple", "IP", "Arm 아키텍처 라이선스"),
  edge("arm", "qualcomm", "IP", "Arm 아키텍처 라이선스"),
  edge("arm", "mediatek", "IP", "Arm 아키텍처 라이선스"),
  // ── EDA → 설계사·IDM ──
  edge("synopsys", "nvidia", "EDA", "설계 자동화 도구"),
  edge("synopsys", "amd", "EDA", "설계 자동화 도구"),
  edge("synopsys", "apple", "EDA", "설계 자동화 도구"),
  edge("cadence", "nvidia", "EDA", "설계 자동화 도구"),
  edge("cadence", "broadcom", "EDA", "설계 자동화 도구"),
  edge("cadence", "qualcomm", "EDA", "설계 자동화 도구"),
  edge("siemens-eda", "intel", "EDA", "설계·검증 도구"),
  // ── 설계사 → 파운드리 (발주) ──
  edge("nvidia", "tsmc", "order", "GPU 제조 발주(Blackwell/Rubin)"),
  edge("apple", "tsmc", "order", "SoC 발주(N2 첫 고객)"),
  edge("amd", "tsmc", "order", "CPU/GPU 발주(MI350 N3)"),
  edge("broadcom", "tsmc", "order", "커스텀 AI ASIC 발주"),
  edge("mediatek", "tsmc", "order", "모바일 AP 발주"),
  edge("qualcomm", "samsung-foundry", "order", "일부 SoC 발주"),
  // ── 장비 → 팹 (EUV·전공정) ──
  edge("asml", "tsmc", "equipment", "EUV·High-NA 노광"),
  edge("asml", "samsung", "equipment", "EUV 노광장비"),
  edge("asml", "intel", "equipment", "High-NA EUV(14A)"),
  edge("amat", "tsmc", "equipment", "증착/식각 장비"),
  edge("lam", "skhynix", "equipment", "3D NAND 식각/증착"),
  edge("lam", "micron", "equipment", "메모리 공정 장비"),
  edge("tel", "samsung", "equipment", "코터/식각 장비"),
  edge("kla", "tsmc", "equipment", "계측·결함 검사"),
  // ── 메모리(HBM) → AI 가속기 설계사 (납품) ──
  edge("skhynix", "nvidia", "delivery", "HBM4 / HBM3E 공급(~2/3)"),
  edge("samsung", "nvidia", "delivery", "HBM / DRAM 공급"),
  edge("micron", "nvidia", "delivery", "HBM3E 공급"),
  edge("skhynix", "amd", "delivery", "HBM 공급(MI350)"),
  // ── 어드밴스드 패키징 (CoWoS) ──
  edge("tsmc", "nvidia", "packaging", "CoWoS 패키징(~60%)"),
  edge("tsmc", "broadcom", "packaging", "CoWoS 패키징"),
  edge("tsmc", "amd", "packaging", "CoWoS 패키징"),
  // ── 파운드리 → 고객 (웨이퍼 납품) ──
  edge("tsmc", "nvidia", "delivery", "완성 웨이퍼/칩 납품"),
  edge("tsmc", "apple", "delivery", "완성 웨이퍼/칩 납품"),
];
