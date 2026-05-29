// data/semiconductors.ts
// 반도체 카테고리 데이터 (≈ early-2026, 예시용 근사치). 숫자/내용은 이 파일에서 수정.

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

export const CATEGORIES: ChipCategory[] = [
  {
    id: "cpu",
    name: "Logic / Microprocessors (CPU)",
    family: "Logic",
    color: "#5B8DEF",
    icon: "cube",
    definition: "General-purpose processors executing instruction sets.",
    role: "Brains of computers, phones, and servers — orchestrate all general computation.",
    keySpecs: ["Instruction set (x86 / ARM)", "Multi-core, GHz clocks", "Cache hierarchy", "Leading-edge process node"],
    exampleProducts: ["Intel Core", "AMD Ryzen", "Apple M-series", "Qualcomm Snapdragon"],
  },
  {
    id: "gpu",
    name: "GPU / AI Accelerators",
    family: "Logic",
    color: "#6366F1",
    icon: "cube",
    definition: "Massively parallel processors for graphics and matrix / tensor math.",
    role: "Engine of the AI boom — both training and inference at scale.",
    keySpecs: ["Thousands of parallel cores", "Tensor / matrix units", "Paired with HBM", "High TDP (kW-class racks)"],
    exampleProducts: ["NVIDIA H100 / H200 / B200", "AMD MI300", "Google TPU"],
  },
  {
    id: "dram",
    name: "DRAM",
    family: "Memory",
    color: "#9333EA",
    icon: "grid",
    definition: "Volatile high-speed working memory.",
    role: "System RAM; HBM stacks feed AI GPUs with working data.",
    keySpecs: ["Volatile (needs refresh)", "ns-class latency", "High bandwidth", "DDR / LPDDR generations"],
    exampleProducts: ["DDR5", "LPDDR5", "HBM3E"],
  },
  {
    id: "nand",
    name: "NAND Flash",
    family: "Memory",
    color: "#A78BFA",
    icon: "grid",
    definition: "Non-volatile storage memory.",
    role: "Persistent storage for SSDs, phones, and USB media.",
    keySpecs: ["Non-volatile", "3D-stacked layers (200+)", "High density / $ per GB", "Endurance (P/E cycles)"],
    exampleProducts: ["3D NAND", "UFS", "Enterprise SSD"],
  },
  {
    id: "hbm",
    name: "HBM (High Bandwidth Memory)",
    family: "Memory",
    color: "#C084FC",
    icon: "grid",
    definition: "3D-stacked DRAM with an ultra-wide bus, placed beside the GPU on an interposer.",
    role: "The critical bottleneck and hottest 2026 segment for AI accelerators.",
    keySpecs: ["3D-stacked DRAM dies", "TB/s-class bandwidth", "On-interposer (2.5D)", "TSV through-silicon vias"],
    exampleProducts: ["HBM3E", "HBM4"],
  },
  {
    id: "analog",
    name: "Analog / Mixed-Signal",
    family: "Analog",
    color: "#22D3EE",
    icon: "sine",
    definition: "Chips handling continuous real-world signals.",
    role: "Power management, audio, and RF front-ends — the bridge to the physical world.",
    keySpecs: ["Continuous signal domain", "High precision / low noise", "Long product lifecycles", "Mature nodes"],
    exampleProducts: ["PMIC", "Op-amps", "Data converters (ADC/DAC)"],
  },
  {
    id: "power",
    name: "Power Semiconductors",
    family: "Power",
    color: "#F59E0B",
    icon: "lightning",
    definition: "Devices switching and converting high voltage & current.",
    role: "EVs, chargers, grid, and industrial power conversion.",
    keySpecs: ["High voltage / current", "Wide-bandgap (SiC / GaN)", "Switching efficiency", "Thermal handling"],
    exampleProducts: ["Si IGBT", "SiC MOSFET", "GaN FET"],
  },
  {
    id: "mcu",
    name: "Microcontrollers (MCU)",
    family: "Logic",
    color: "#38BDF8",
    icon: "cube",
    definition: "Self-contained CPU + memory + I/O on a single chip.",
    role: "Embedded control in cars, appliances, and IoT devices.",
    keySpecs: ["Integrated CPU+RAM+flash+IO", "Low power", "Real-time control", "Mature / automotive nodes"],
    exampleProducts: ["ARM Cortex-M", "Automotive MCUs"],
  },
  {
    id: "sensor",
    name: "Sensors (CMOS Image / MEMS)",
    family: "Sensor",
    color: "#34D399",
    icon: "lens",
    definition: "Convert physical phenomena into electrical signals.",
    role: "Cameras, motion, LiDAR, and pressure sensing.",
    keySpecs: ["Photon / motion transduction", "MEMS micro-structures", "High dynamic range", "Pixel pitch (imagers)"],
    exampleProducts: ["Sony IMX sensors", "MEMS accelerometers"],
  },
  {
    id: "rf",
    name: "RF / Connectivity",
    family: "RF",
    color: "#F472B6",
    icon: "wave",
    definition: "Radio-frequency transceivers and front-end modules.",
    role: "5G, Wi-Fi, Bluetooth, and satellite connectivity.",
    keySpecs: ["GHz carrier frequencies", "Front-end modules (FEM)", "Power amplifiers / filters", "III-V + CMOS"],
    exampleProducts: ["5G modems", "RF FEMs"],
  },
  {
    id: "fpga",
    name: "FPGA",
    family: "Logic",
    color: "#818CF8",
    icon: "fabric",
    definition: "Reconfigurable logic fabric.",
    role: "Prototyping, telecom, defense, and custom acceleration.",
    keySpecs: ["Reconfigurable gates", "Parallel pipelines", "Low-latency I/O", "Hard IP blocks"],
    exampleProducts: ["AMD / Xilinx Versal", "Intel Agilex"],
  },
  {
    id: "foundry-node",
    name: "Foundry Process Nodes",
    family: "Manufacturing",
    color: "#E2E8F0",
    icon: "wafer",
    definition: "Fabrication technology generations (e.g. 3nm, 2nm) built with EUV lithography.",
    role: "Defines density and efficiency — the manufacturing frontier of the whole industry.",
    keySpecs: ["EUV lithography", "Gate-all-around (GAA) at 2nm", "Density (transistors/mm²)", "Yield & cost per wafer"],
    exampleProducts: ["TSMC N3 / N2", "Samsung SF2"],
  },
];

export const DATA_DISCLAIMER = "Figures approximate, ~early 2026, for illustration.";
