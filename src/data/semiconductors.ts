// data/semiconductors.ts
// 반도체 카테고리 데이터 (≈ 2026년 초, 예시용 근사치). 숫자/내용은 이 파일에서 수정.

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
  definition: string;
  role: string;
  keySpecs: string[];
  exampleProducts: string[];
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
  RF: "RF",
  Manufacturing: "제조",
};

export const CATEGORIES: ChipCategory[] = [
  {
    id: "cpu",
    name: "로직 / 마이크로프로세서 (CPU)",
    family: "Logic",
    color: "#5B8DEF",
    icon: "cube",
    definition: "정해진 명령어 집합을 실행하는 범용 프로세서.",
    role: "컴퓨터·스마트폰·서버의 두뇌 — 모든 범용 연산을 지휘한다.",
    keySpecs: ["명령어 집합 (x86 / ARM)", "멀티코어, GHz 클럭", "캐시 계층 구조", "최첨단 공정 노드"],
    exampleProducts: ["Intel Core", "AMD Ryzen", "Apple M 시리즈", "Qualcomm Snapdragon"],
  },
  {
    id: "gpu",
    name: "GPU / AI 가속기",
    family: "Logic",
    color: "#6366F1",
    icon: "cube",
    definition: "그래픽과 행렬·텐서 연산을 위한 대규모 병렬 프로세서.",
    role: "AI 붐의 엔진 — 대규모 학습과 추론을 모두 담당.",
    keySpecs: ["수천 개의 병렬 코어", "텐서 / 행렬 연산 유닛", "HBM과 결합", "높은 소비전력 (kW급 랙)"],
    exampleProducts: ["NVIDIA H100 / H200 / B200", "AMD MI300", "Google TPU"],
  },
  {
    id: "dram",
    name: "DRAM",
    family: "Memory",
    color: "#9333EA",
    icon: "grid",
    definition: "휘발성 고속 작업 메모리.",
    role: "시스템 RAM이자, HBM 적층으로 AI GPU에 작업 데이터를 공급.",
    keySpecs: ["휘발성 (주기적 리프레시 필요)", "ns급 지연시간", "높은 대역폭", "DDR / LPDDR 세대"],
    exampleProducts: ["DDR5", "LPDDR5", "HBM3E"],
  },
  {
    id: "nand",
    name: "NAND 플래시",
    family: "Memory",
    color: "#A78BFA",
    icon: "grid",
    definition: "비휘발성 저장 메모리.",
    role: "SSD·스마트폰·USB 매체의 영구 저장장치.",
    keySpecs: ["비휘발성", "3D 적층 (200단 이상)", "높은 집적도 / GB당 단가", "내구성 (P/E 사이클)"],
    exampleProducts: ["3D NAND", "UFS", "엔터프라이즈 SSD"],
  },
  {
    id: "hbm",
    name: "HBM (고대역폭 메모리)",
    family: "Memory",
    color: "#C084FC",
    icon: "grid",
    definition: "초광폭 버스를 가진 3D 적층 DRAM으로, 인터포저 위에서 GPU 옆에 배치된다.",
    role: "AI 가속기의 핵심 병목이자 2026년 가장 뜨거운 분야.",
    keySpecs: ["3D 적층 DRAM 다이", "TB/s급 대역폭", "인터포저 위 (2.5D)", "TSV 실리콘 관통전극"],
    exampleProducts: ["HBM3E", "HBM4"],
  },
  {
    id: "analog",
    name: "아날로그 / 혼성신호",
    family: "Analog",
    color: "#22D3EE",
    icon: "sine",
    definition: "연속적인 실세계 신호를 다루는 칩.",
    role: "전력 관리·오디오·RF 프런트엔드 — 물리 세계와의 다리.",
    keySpecs: ["연속 신호 영역", "고정밀 / 저잡음", "긴 제품 수명주기", "성숙 공정"],
    exampleProducts: ["PMIC", "OP앰프", "데이터 컨버터 (ADC/DAC)"],
  },
  {
    id: "power",
    name: "전력 반도체",
    family: "Power",
    color: "#F59E0B",
    icon: "lightning",
    definition: "고전압·대전류를 스위칭하고 변환하는 소자.",
    role: "전기차·충전기·전력망·산업용 전력 변환.",
    keySpecs: ["고전압 / 대전류", "와이드밴드갭 (SiC / GaN)", "스위칭 효율", "열 처리 능력"],
    exampleProducts: ["Si IGBT", "SiC MOSFET", "GaN FET"],
  },
  {
    id: "mcu",
    name: "마이크로컨트롤러 (MCU)",
    family: "Logic",
    color: "#38BDF8",
    icon: "cube",
    definition: "CPU + 메모리 + I/O를 한 칩에 담은 자기완결형 칩.",
    role: "자동차·가전·IoT 기기의 임베디드 제어.",
    keySpecs: ["CPU+RAM+플래시+IO 통합", "저전력", "실시간 제어", "성숙 / 차량용 공정"],
    exampleProducts: ["ARM Cortex-M", "차량용 MCU"],
  },
  {
    id: "sensor",
    name: "센서 (CMOS 이미지 / MEMS)",
    family: "Sensor",
    color: "#34D399",
    icon: "lens",
    definition: "물리 현상을 전기 신호로 변환.",
    role: "카메라·모션·라이다·압력 감지.",
    keySpecs: ["광자 / 운동 변환", "MEMS 미세구조", "높은 다이내믹 레인지", "픽셀 피치 (이미지 센서)"],
    exampleProducts: ["Sony IMX 센서", "MEMS 가속도계"],
  },
  {
    id: "rf",
    name: "RF / 통신",
    family: "RF",
    color: "#F472B6",
    icon: "wave",
    definition: "무선 주파수 트랜시버와 프런트엔드 모듈.",
    role: "5G·Wi-Fi·블루투스·위성 통신.",
    keySpecs: ["GHz 반송파 주파수", "프런트엔드 모듈 (FEM)", "전력 증폭기 / 필터", "III-V + CMOS"],
    exampleProducts: ["5G 모뎀", "RF FEM"],
  },
  {
    id: "fpga",
    name: "FPGA",
    family: "Logic",
    color: "#818CF8",
    icon: "fabric",
    definition: "재구성 가능한 로직 패브릭.",
    role: "프로토타이핑·통신·국방·맞춤형 가속.",
    keySpecs: ["재구성 가능한 게이트", "병렬 파이프라인", "저지연 I/O", "하드 IP 블록"],
    exampleProducts: ["AMD / Xilinx Versal", "Intel Agilex"],
  },
  {
    id: "foundry-node",
    name: "파운드리 공정 노드",
    family: "Manufacturing",
    color: "#E2E8F0",
    icon: "wafer",
    definition: "EUV 리소그래피로 구현되는 제조 기술 세대 (예: 3nm, 2nm).",
    role: "집적도와 효율을 결정 — 산업 전체의 제조 최전선.",
    keySpecs: ["EUV 리소그래피", "2nm의 게이트올어라운드 (GAA)", "집적도 (트랜지스터/mm²)", "수율 & 웨이퍼당 단가"],
    exampleProducts: ["TSMC N3 / N2", "Samsung SF2"],
  },
];

export const DATA_DISCLAIMER = "수치는 근사치이며 2026년 초 기준 예시용입니다.";
