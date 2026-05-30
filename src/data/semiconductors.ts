// data/semiconductors.ts
// 반도체 카테고리 데이터 — 2026년 5월 기준, 멀티소스 웹 검증.
// 수치/내용은 이 파일에서 수정하면 3D 씬·패널이 자동 갱신됨.

export type ChipFamily =
  | "Logic"
  | "Memory"
  | "Analog"
  | "Power"
  | "Sensor"
  | "RF"
  | "Manufacturing";

export type ChipIcon = "cube" | "grid" | "sine" | "lightning" | "lens" | "wave" | "fabric" | "wafer";

export interface ChipCategory {
  id: string;
  name: string;
  family: ChipFamily;
  color: string;
  icon: ChipIcon;
  /** 한 줄 정의. */
  definition: string;
  /** 산업에서의 역할 — 왜 중요한가. */
  role: string;
  /** 핵심 기술 사양 (불릿). */
  keySpecs: string[];
  /** 대표 제품/세대 (2026 최신). */
  exampleProducts: string[];
  /** 2026년 동향 — 최신 한 문단 (패널 본문). */
  trend2026: string;
}

/** 패밀리별 대표색 — 별자리 클러스터 컬러 + 범례. */
export const FAMILY_COLORS: Record<ChipFamily, string> = {
  Logic: "#5B8DEF",
  Memory: "#A855F7",
  Analog: "#22D3EE",
  Power: "#F59E0B",
  Sensor: "#34D399",
  RF: "#F472B6",
  Manufacturing: "#E2E8F0",
};

/** 패밀리 한글 라벨 (범례·패널 표시용). */
export const FAMILY_LABEL_KO: Record<ChipFamily, string> = {
  Logic: "로직",
  Memory: "메모리",
  Analog: "아날로그",
  Power: "전력",
  Sensor: "센서",
  RF: "RF / 통신",
  Manufacturing: "제조 / 공정",
};

/** 패밀리별 한 줄 설명 (범례 보강). */
export const FAMILY_DESC_KO: Record<ChipFamily, string> = {
  Logic: "연산을 수행하는 두뇌 — CPU·GPU·NPU·FPGA",
  Memory: "데이터를 저장·공급 — DRAM·NAND·HBM",
  Analog: "실세계 신호를 다루는 칩 — PMIC·컨버터",
  Power: "전력을 변환·스위칭 — SiC·GaN·IGBT",
  Sensor: "물리량을 전기로 변환 — 이미지·MEMS",
  RF: "무선 신호 송수신 — 5G·Wi-Fi·위성",
  Manufacturing: "칩을 만드는 공정·패키징 기술",
};

export const CATEGORIES: ChipCategory[] = [
  // ───────────────────────── 로직 ─────────────────────────
  {
    id: "cpu",
    name: "CPU (중앙처리장치)",
    family: "Logic",
    color: "#5B8DEF",
    icon: "cube",
    definition: "정해진 명령어 집합(ISA)을 순차·병렬로 실행하는 범용 프로세서.",
    role: "PC·스마트폰·서버의 두뇌 — 운영체제와 범용 연산을 지휘한다.",
    keySpecs: [
      "명령어 집합: x86(Intel·AMD) / Arm(Apple·Qualcomm·Arm)",
      "멀티코어 + 칩렛(타일) 구조, 수 GHz 클럭",
      "L1~L3 캐시 계층, 통합 NPU 탑재 확산",
      "최첨단 노드(2nm GAA) + 후면전력(BSPDN)",
    ],
    exampleProducts: [
      "Intel Core Ultra 300 'Panther Lake' (18A)",
      "AMD Ryzen 9000 / EPYC 'Turin' (Zen 5)",
      "Apple M5 (TSMC N3P)",
      "Qualcomm Snapdragon X2 Elite",
    ],
    trend2026:
      "x86는 Intel이 18A(1.8nm·RibbonFET GAA+PowerVia)로 'Panther Lake'를 CES 2026에 내놓고, AMD는 Zen 5로 EPYC Turin 최대 192코어(Zen 5c)까지 확장했다. Arm 진영은 Apple M5(N3P)와 Snapdragon X2 Elite(18코어·NPU 80 TOPS)로 AI PC를, 모바일은 Snapdragon 8 Elite Gen 5(2025년 9월 발표)로 온디바이스 추론을 끌고 간다. 서버에서는 NVIDIA Grace/Vera, AWS Graviton4, Google Axion 등 커스텀 Arm Neoverse가 급부상했다.",
  },
  {
    id: "gpu",
    name: "GPU / AI 가속기",
    family: "Logic",
    color: "#6366F1",
    icon: "cube",
    definition: "수천 개 코어로 행렬·텐서 연산을 대규모 병렬 처리하는 프로세서.",
    role: "AI 붐의 엔진 — 대규모 모델 학습과 추론을 모두 담당하는 데이터센터의 심장.",
    keySpecs: [
      "수만 개 병렬 코어 + 텐서/행렬 유닛",
      "HBM3E/HBM4와 결합(패키지당 192~288GB)",
      "FP8/FP4 저정밀 연산, 칩렛·듀얼다이",
      "랙당 kW급 소비전력(B300 약 1,400W)",
    ],
    exampleProducts: [
      "NVIDIA Blackwell B200 / B300(GB300 NVL72)",
      "NVIDIA Vera Rubin(2026 하반기, HBM4)",
      "AMD Instinct MI350X / MI355X(CDNA 4)",
      "Google TPU v7 'Ironwood' · AWS Trainium3",
    ],
    trend2026:
      "NVIDIA Blackwell Ultra(B300)는 HBM3E 288GB·약 1,400W로, GB300 NVL72 한 랙이 FP4 약 1.1 ExaFLOPS를 낸다. 2026 하반기 차세대 'Rubin'(HBM4 288GB)으로 세대 교체가 예정됐다. AMD는 MI355X(N3·HBM3E 288GB·8TB/s)로 추격하고, 구글 TPU v7 Ironwood(팟 9,216칩=FP8 약 42 ExaFLOPS)·AWS Trainium3 등 하이퍼스케일러 자체 칩이 시장을 다변화했다.",
  },
  {
    id: "mcu",
    name: "MCU (마이크로컨트롤러)",
    family: "Logic",
    color: "#38BDF8",
    icon: "cube",
    definition: "CPU 코어 + 메모리 + I/O를 한 칩에 담은 자기완결형 제어 칩.",
    role: "자동차·가전·산업·IoT 기기의 임베디드 실시간 제어를 담당.",
    keySpecs: [
      "CPU + 플래시/SRAM + 주변장치 단일 통합",
      "저전력·실시간·고신뢰(ASIL-D 차량 안전)",
      "차량용 선단화: ≤16nm FinFET + 내장 MRAM",
      "존(Zonal) 아키텍처·SDV(소프트웨어 정의 차량)",
    ],
    exampleProducts: [
      "Infineon AURIX TC4x",
      "Renesas RH850 / NXP S32K5(16nm·MRAM·NPU)",
      "ST Stellar · Arm Cortex-M/R",
    ],
    trend2026:
      "차량 한 대에 MCU 수십~수백 개가 들어가며, SDV·전동화로 고성능 존 컨트롤러 수요가 급증했다. NXP S32K5는 16nm FinFET에 MRAM과 NPU를 통합했고, 인피니언·르네사스·ST가 28→16nm로 선단화하며 기능안전(ASIL-D)과 실시간성을 강화하고 있다.",
  },
  {
    id: "fpga",
    name: "FPGA (재구성 로직)",
    family: "Logic",
    color: "#818CF8",
    icon: "fabric",
    definition: "현장에서 회로를 재프로그래밍할 수 있는 게이트 패브릭.",
    role: "프로토타이핑·통신·국방·맞춤 가속 — ASIC 없이 하드웨어를 바꾼다.",
    keySpecs: [
      "재구성 가능한 LUT/게이트 + 하드 IP 블록",
      "병렬 파이프라인·저지연 I/O",
      "AI Engine 타일 내장(엣지 추론)",
      "PCIe Gen6 · CXL 3.1 · 옵션 HBM",
    ],
    exampleProducts: [
      "AMD Versal Gen 2(최대 144 AI Engine 타일)",
      "Altera(Intel 분사) Agilex 3/5/7/9",
    ],
    trend2026:
      "AMD Versal Gen 2는 AI Engine-ML V2 타일을 최대 144개 얹어 엣지 추론의 와트당 TOPS를 최대 3배 높였고, PCIe Gen6·CXL 3.1을 지원한다. Intel은 2025년 FPGA 사업을 'Altera'로 분사해 Agilex 라인(3/5/7/9)에 집중하고 있다.",
  },
  // ───────────────────────── 메모리 ─────────────────────────
  {
    id: "dram",
    name: "DRAM",
    family: "Memory",
    color: "#9333EA",
    icon: "grid",
    definition: "주기적 리프레시가 필요한 휘발성 고속 작업 메모리.",
    role: "시스템 RAM이자 HBM·서버 메모리의 모태 — AI·서버 수요로 슈퍼사이클.",
    keySpecs: [
      "휘발성, ns급 지연, 높은 대역폭",
      "DDR5 최대 8,800MT/s(서버 MRDIMM)",
      "LPDDR5X 핀당 ~10.7Gbps · GDDR7 핀당 32Gbps",
      "1b/1c nm 공정, DDR6·LPDDR6 준비",
    ],
    exampleProducts: ["DDR5 / 서버 MRDIMM", "LPDDR5X(모바일·AI PC)", "GDDR7(RTX 50)"],
    trend2026:
      "HBM에 메모리 capa가 쏠리면서 2025년 말~2026년 범용 DDR5까지 타이트해진 '메모리 슈퍼사이클'이 본격화됐다. DDR5는 JEDEC 기준 8,800MT/s까지 올라갔고(MRDIMM은 멀티플렉싱으로 17,600MT/s), 온디바이스 AI 확산으로 LPDDR5X·LPDDR6 수요가 커지고 있다.",
  },
  {
    id: "nand",
    name: "NAND 플래시",
    family: "Memory",
    color: "#A78BFA",
    icon: "grid",
    definition: "전원이 꺼져도 유지되는 비휘발성 저장 메모리.",
    role: "SSD·스마트폰·데이터센터의 영구 저장 — 적층 경쟁이 집적도를 견인.",
    keySpecs: [
      "비휘발성, 셀당 비트수(SLC~QLC/PLC)",
      "3D 적층 300단+(양산), 430단 로드맵",
      "GB당 단가·내구성(P/E 사이클) 균형",
      "데이터센터 QLC e-SSD 122TB급",
    ],
    exampleProducts: [
      "SK hynix 321단 1Tb TLC",
      "Samsung V9 286단(V10 ~430단 목표)",
      "Micron G9 276단 · Kioxia BiCS8",
    ],
    trend2026:
      "적층 경쟁이 300단을 넘었다. SK하이닉스가 321단(1Tb TLC, 2024년 11월 세계 최초 양산)으로 앞서고, 삼성 V9(약 290단)·마이크론 G9(276단)이 뒤를 잇는다. 삼성은 약 430단(V10)을 목표(일정 지연 중)로 하며, AI 데이터센터용 QLC 기반 122TB급 대용량 e-SSD가 등장했다.",
  },
  {
    id: "hbm",
    name: "HBM (고대역폭 메모리)",
    family: "Memory",
    color: "#C084FC",
    icon: "grid",
    definition: "DRAM 다이를 TSV로 수직 적층해 GPU 옆 인터포저에 붙이는 초광폭 메모리.",
    role: "2026년 반도체에서 가장 뜨거운 분야이자 AI 가속기의 핵심 병목.",
    keySpecs: [
      "TSV 3D 적층(8~16단), 1024/2048-bit I/O",
      "HBM3E 스택당 ~1.2TB/s, HBM4 ~2.0~2.8TB/s",
      "2.5D 인터포저(CoWoS) 위 GPU와 결합",
      "HBM4 인터페이스 2048비트(HBM3E의 2배)",
    ],
    exampleProducts: ["HBM3E 8단 24GB / 12단 36GB", "HBM4 12·16단 48GB(2026 양산)"],
    trend2026:
      "HBM4(2048-bit I/O, 스택당 약 2TB/s)가 2026년 양산에 진입했다. SK하이닉스가 2025년 9월 세계 최초 HBM4 양산 체제를 갖추고 NVIDIA 물량의 약 2/3를 차지할 전망이며, 삼성(최대 11.7Gbps)·마이크론이 추격한다. HBM 수요는 연 80~100% 성장하나 공급은 50~60%만 늘어, 2026년 물량이 사실상 완판됐다.",
  },
  // ───────────────────────── 아날로그 ─────────────────────────
  {
    id: "analog",
    name: "아날로그 / 혼성신호",
    family: "Analog",
    color: "#22D3EE",
    icon: "sine",
    definition: "연속적인 실세계 신호를 증폭·변환하는 칩(디지털과의 다리).",
    role: "데이터 컨버터·증폭기 — 모든 전자기기의 신호 처리 기반.",
    keySpecs: [
      "연속 신호 영역, 고정밀·저잡음",
      "ADC/DAC(아날로그↔디지털 변환)",
      "긴 제품 수명주기, 성숙 공정(다품종)",
      "산업·자동차·통신 인프라 폭넓은 채택",
    ],
    exampleProducts: ["데이터 컨버터(ADC/DAC)", "정밀 OP앰프", "인터페이스/신호체인 IC"],
    trend2026:
      "아날로그는 무어의 법칙과 무관한 '롱테일' 시장으로, TI·ADI가 양강이다. 2024~2025년 산업·자동차 재고 조정을 거쳐 2026년 회복 국면에 들어섰고, AI 서버의 전원·신호 체인 수요가 새 성장 동력으로 떠올랐다.",
  },
  {
    id: "pmic",
    name: "PMIC (전력관리 IC)",
    family: "Analog",
    color: "#2DD4BF",
    icon: "sine",
    definition: "시스템의 여러 전압 레일을 생성·분배·관리하는 아날로그 칩.",
    role: "스마트폰부터 AI 서버까지, 모든 전자기기의 전력 효율을 좌우.",
    keySpecs: [
      "다중 전압 레일 변환·시퀀싱",
      "고효율 DC-DC, 저전력 대기관리",
      "AI 서버 48V 직접변환·수직전원(VPD)",
      "상위 5사(TI·ADI·인피니언·NXP·ST) 약 55%",
    ],
    exampleProducts: ["스마트폰 PMIC", "서버/AI 가속기 전원 모듈", "차량용 PMIC"],
    trend2026:
      "PMIC 시장은 2026년 약 447억 달러(CAGR 약 7.3%)로 추정된다. AI 서버가 48V 직접변환과 GPU 바로 아래 전원을 두는 수직전원(Vertical Power Delivery)을 도입하면서, 고전류·고밀도 전력관리가 새로운 격전지가 됐다. TI가 점유 약 12.5%로 1위다.",
  },
  // ───────────────────────── 전력 ─────────────────────────
  {
    id: "power-sic",
    name: "전력반도체 — SiC",
    family: "Power",
    color: "#F59E0B",
    icon: "lightning",
    definition: "탄화규소(SiC) 기반 와이드밴드갭 소자로 고전압·고온에 강한 전력 칩.",
    role: "전기차 800V 인버터·급속충전·전력망 — 효율과 주행거리를 끌어올린다.",
    keySpecs: [
      "와이드밴드갭(WBG), 고전압·고온·고효율",
      "800V EV 인버터·OBC·DC-DC",
      "웨이퍼 6인치→8인치(200mm) 전환",
      "IGBT 대비 약 2~4% 에너지 절감",
    ],
    exampleProducts: ["SiC MOSFET / 모듈", "800V EV 트랙션 인버터"],
    trend2026:
      "SiC는 WBG 전력시장의 약 54%를 차지하며 800V EV의 핵심이다. 다만 2024~2025년 EV 성장 둔화·재고 조정으로 가격 압박을 받았고, 미국 선두 울프스피드가 2025년 챕터11에 들어갔다. 6→8인치 기판 전환으로 원가 경쟁이 격화됐으나, 전동화 추세로 중장기 성장세는 유지된다.",
  },
  {
    id: "power-gan",
    name: "전력반도체 — GaN",
    family: "Power",
    color: "#FBBF24",
    icon: "lightning",
    definition: "질화갈륨(GaN) 기반 고속 스위칭 전력 소자.",
    role: "충전기·데이터센터 전원·48V 서버 — 작고 빠르고 효율적인 전력 변환.",
    keySpecs: [
      "600V급 GaN HEMT(e-mode) 주류",
      "초고속 스위칭(소형·고밀도)",
      "GaN-on-Si 200mm 웨이퍼 확대",
      "충전기·PSU·48V 서버·OBC 응용",
    ],
    exampleProducts: ["GaN 고속충전기", "데이터센터 PSU", "48V 서버 전원"],
    trend2026:
      "GaN은 600V급 고속 스위칭으로 충전기·데이터센터 전원에서 빠르게 침투 중이다. GaN-on-Si 200mm 전환으로 원가가 내려가며, AI 데이터센터의 고밀도 전원과 48V 아키텍처가 새 수요처로 부상했다.",
  },
  // ───────────────────────── 센서 ─────────────────────────
  {
    id: "cis",
    name: "CMOS 이미지센서 (CIS)",
    family: "Sensor",
    color: "#34D399",
    icon: "lens",
    definition: "빛(광자)을 전기 신호로 바꿔 디지털 이미지를 만드는 센서.",
    role: "스마트폰·자동차·산업 카메라의 '눈' — 화소·감도 경쟁.",
    keySpecs: [
      "광자→전하 변환, 높은 다이내믹 레인지",
      "스택형·2층 트랜지스터 픽셀 구조",
      "초소형 픽셀 피치(0.6~0.7µm)",
      "200MP급 초고화소 + 저조도 성능",
    ],
    exampleProducts: ["Sony LYT-901 200MP", "Samsung ISOCELL HP 200MP", "차량용 CIS"],
    trend2026:
      "소니가 1위, 삼성이 2위다. 스택형·2층 트랜지스터 픽셀로 같은 면적에서 감도와 다이내믹 레인지를 끌어올렸고, 소니 첫 200MP 센서 LYT-901(1/1.12형, 2025년 11월)과 삼성 ISOCELL HP(업계 최초 200MP)가 경쟁한다. 자율주행·ADAS용 차량 카메라가 빠르게 성장하는 응용처다.",
  },
  {
    id: "mems",
    name: "MEMS 센서",
    family: "Sensor",
    color: "#10B981",
    icon: "lens",
    definition: "미세 기계구조를 실리콘에 새겨 물리량을 측정하는 센서.",
    role: "모션·소리·압력 감지 — 스마트폰·자동차·AR/VR의 감각기관.",
    keySpecs: [
      "MEMS 미세 기계구조 + 회로 통합",
      "가속도계·자이로·마이크·압력·IMU",
      "초소형·저전력·고신뢰",
      "모바일·자동차·산업 IoT·AR/VR",
    ],
    exampleProducts: ["IMU(관성측정)", "MEMS 마이크", "압력·자이로 센서"],
    trend2026:
      "Bosch·ST·TDK(InvenSense)가 선두다. AR/VR 헤드셋과 로보틱스·휴머노이드의 등장으로 고정밀 IMU 수요가 늘고, 자동차의 전동화·자율화가 압력·관성 센서 채택을 확대하고 있다.",
  },
  // ───────────────────────── RF ─────────────────────────
  {
    id: "rf",
    name: "RF / 통신 (5G·위성)",
    family: "RF",
    color: "#F472B6",
    icon: "wave",
    definition: "무선 주파수 신호를 송수신하는 트랜시버와 프런트엔드 모듈(RFFE).",
    role: "5G·Wi-Fi·블루투스·위성 직접통신 — 모든 무선 연결의 관문.",
    keySpecs: [
      "RFFE = 전력증폭기(PA)·스위치·필터·LNA",
      "GHz 반송파, III-V(GaAs/GaN) + CMOS",
      "5G NR-NTN·위성 직접통신(D2C)",
      "Wi-Fi 7 · mmWave",
    ],
    exampleProducts: ["5G RF 프런트엔드 모듈", "Wi-Fi 7 트랜시버", "위성 D2C 모뎀"],
    trend2026:
      "퀄컴·브로드컴·Qorvo·Skyworks·무라타가 주요 업체다. 5G가 위성과 단말을 직접 잇는 NTN(비지상망)·Direct-to-Cell로 확장되며, 위성 NTN 시장은 2025년 약 5.6억→2030년 약 27.9억 달러(CAGR 약 38%)로 전망된다. Wi-Fi 7도 본격 확산 중이다.",
  },
  // ───────────────────────── 제조 / 공정 ─────────────────────────
  {
    id: "foundry-node",
    name: "파운드리 공정노드",
    family: "Manufacturing",
    color: "#E2E8F0",
    icon: "wafer",
    definition: "EUV 리소그래피로 구현하는 제조 기술 세대(예: 3nm, 2nm, 1.8nm).",
    role: "집적도·효율을 결정 — 산업 전체의 제조 최전선이자 진입장벽.",
    keySpecs: [
      "EUV 리소그래피(+High-NA EUV 0.55)",
      "2nm급 GAA(나노시트/MBCFET) 전환",
      "후면전력공급(BSPDN/PowerVia)",
      "수율·웨이퍼당 단가가 경쟁력 결정",
    ],
    exampleProducts: [
      "TSMC N2(2nm GAA, 2025 Q4 양산) · A16(1.6nm)",
      "Samsung SF2 · Intel 18A / 14A",
    ],
    trend2026:
      "TSMC가 N2(2nm·GAA 나노시트)를 2025년 12월 양산 개시했고(초기 수율 ~70%), 애플이 첫 고객·NVIDIA Rubin이 뒤를 잇는다. 2026년 무려 5개 2nm 팹이 동시 램프업한다. 인텔은 18A(RibbonFET+PowerVia)로 'Panther Lake'를, 삼성은 SF2로 추격한다. A16/14A에는 후면전력과 High-NA EUV가 도입된다.",
  },
  {
    id: "advanced-packaging",
    name: "어드밴스드 패키징 (CoWoS)",
    family: "Manufacturing",
    color: "#CBD5E1",
    icon: "wafer",
    definition: "여러 다이(로직+HBM)를 한 패키지에 통합하는 2.5D/3D 후공정 기술.",
    role: "2026년 AI 칩 출하의 결정적 병목 — 첨단노드만큼 중요해진 후공정.",
    keySpecs: [
      "CoWoS-S/-L(인터포저 위 칩-온-웨이퍼)",
      "인터포저 면적 레티클 한계(~858mm²)의 3배+",
      "하이브리드 본딩(범프 피치 ~1µm)",
      "TSMC capa 월 ~75k→2026 ~120k+ wpm",
    ],
    exampleProducts: ["TSMC CoWoS-L", "Intel EMIB/Foveros", "칩렛 + UCIe 3.0"],
    trend2026:
      "CoWoS capa는 2024년 말 월 약 35k에서 2025년 말 약 75~80k, 2026년 말 약 120~130k 웨이퍼로 확대된다. NVIDIA가 2026년 capa의 약 60%를 선점했다. 레티클 한계를 넘는 대형 인터포저(CoWoS-L)와 하이브리드 본딩, 그리고 칩렛 표준 UCIe 3.0(레인당 64GT/s)이 AI 하드웨어의 새 축으로 자리잡았다.",
  },
  {
    id: "euv-litho",
    name: "EUV 리소그래피",
    family: "Manufacturing",
    color: "#94A3B8",
    icon: "wafer",
    definition: "13.5nm 극자외선으로 초미세 회로를 새기는 노광 기술.",
    role: "7nm 이하 첨단 칩의 필수 관문 — ASML이 사실상 독점.",
    keySpecs: [
      "파장 13.5nm EUV, 개구수(NA) 0.33",
      "High-NA EUV(NA 0.55, EXE:5200B)",
      "장비 대당 약 1.5억(EUV)~3.5억 달러(High-NA)",
      "ASML이 EUV 100% 독점 공급",
    ],
    exampleProducts: ["ASML Twinscan NXE(0.33NA)", "ASML EXE:5000/5200(High-NA 0.55)"],
    trend2026:
      "ASML이 EUV를 100% 독점한다. 개구수를 0.55로 높인 High-NA EUV(EXE:5200B, 대당 약 3.5억 달러, 생산성 +60%)가 등장해, 인텔이 2025년 업계 최초로 배치해 14A에 활용한다. 삼성·TSMC도 평가용 장비를 들였으나, TSMC는 A14에서 High-NA를 건너뛰는 신중론을 택했다.",
  },
];

export const DATA_DISCLAIMER = "수치는 2026년 5월 기준 웹 검증 근사치 — 개념 이해용이며 투자 정보가 아닙니다.";

/** 상단 배지/푸터에 쓸 데이터 기준 시점. */
export const DATA_AS_OF = "2026년 5월 기준";
