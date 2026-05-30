import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  siNvidia,
  siApple,
  siAmd,
  siQualcomm,
  siBroadcom,
  siIntel,
  siSamsung,
  siArm,
  siMediatek,
  siStmicroelectronics,
  siSiemens,
} from "simple-icons";
import type { Company } from "../data/companies";

/** simple-icons 공식 로고 경로 (24x24 viewBox 의 path d). */
const LOGO_PATHS: Record<string, string> = {
  nvidia: siNvidia.path,
  apple: siApple.path,
  amd: siAmd.path,
  qualcomm: siQualcomm.path,
  broadcom: siBroadcom.path,
  intel: siIntel.path,
  samsung: siSamsung.path,
  arm: siArm.path,
  mediatek: siMediatek.path,
  stmicro: siStmicroelectronics.path,
  "siemens-eda": siSiemens.path,
};

/** 로고가 없는 회사 — 워드마크 텍스트로. */
const WORDMARK: Record<string, string> = {
  skhynix: "SK hynix",
  micron: "Micron",
  ti: "TI",
  tsmc: "TSMC",
  "samsung-foundry": "Samsung\nFoundry",
  "intel-foundry": "Intel\nFoundry",
  globalfoundries: "GF",
  smic: "SMIC",
  asml: "ASML",
  amat: "AMAT",
  lam: "Lam",
  tel: "TEL",
  kla: "KLA",
  infineon: "Infineon",
  adi: "ADI",
  synopsys: "Synopsys",
  cadence: "cadence",
};

/** 기업별 브랜드 액센트색 (테두리). 어두운 배경에서 읽히도록 살짝 밝게 보정. */
const BRAND_HEX: Record<string, string> = {
  nvidia: "#8CD600",
  apple: "#D7DBE0",
  amd: "#F22730",
  qualcomm: "#4A66F0",
  broadcom: "#F0203F",
  mediatek: "#FF8A33",
  intel: "#2186E0",
  samsung: "#3A5BDC",
  skhynix: "#FF1F44",
  micron: "#2A7FE0",
  ti: "#F0271C",
  infineon: "#1FB8C4",
  stmicro: "#2F9BE0",
  adi: "#1E78D6",
  tsmc: "#E11D38",
  "samsung-foundry": "#5B7BF0",
  "intel-foundry": "#2186E0",
  globalfoundries: "#7A5CF0",
  smic: "#E0A020",
  asml: "#2A86D6",
  amat: "#19A6E6",
  lam: "#16B8A0",
  tel: "#3A7BE0",
  kla: "#7C5CF0",
  arm: "#16C0CE",
  synopsys: "#F26B21",
  cadence: "#16B85C",
  "siemens-eda": "#16B8A0",
};

const CANVAS = 256;

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** 글래스 배지 + 로고/워드마크를 그린 CanvasTexture. */
function makeEmblemTexture(id: string, brand: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS;
  canvas.height = CANVAS;
  const ctx = canvas.getContext("2d")!;

  // 배경 글래스 패널
  roundRectPath(ctx, 20, 20, CANVAS - 40, CANVAS - 40, 40);
  ctx.fillStyle = "rgba(9,13,21,0.9)";
  ctx.fill();

  // 브랜드색 테두리 (그림자/글로우 없이 — 깔끔)
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = brand;
  roundRectPath(ctx, 20, 20, CANVAS - 40, CANVAS - 40, 40);
  ctx.stroke();
  ctx.restore();

  const path = LOGO_PATHS[id];
  if (path) {
    const box = 132;
    const off = (CANVAS - box) / 2;
    const scale = box / 24;
    ctx.save();
    ctx.translate(off, off);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.fill(new Path2D(path));
    ctx.restore();
  } else {
    const lines = (WORDMARK[id] ?? id.toUpperCase()).split("\n");
    const maxW = CANVAS - 70;
    let size = 60;
    const widest = () => Math.max(...lines.map((l) => ctx.measureText(l).width));
    ctx.font = `700 ${size}px sans-serif`;
    while (widest() > maxW && size > 14) {
      size -= 2;
      ctx.font = `700 ${size}px sans-serif`;
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    const lineH = size * 1.12;
    const startY = CANVAS / 2 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((l, i) => ctx.fillText(l, CANVAS / 2, startY + i * lineH));
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** 빌보드 평면 크기 ∝ √시가총액. (모회사 통합=0 인 곳은 매출로 크기 산정) */
function sizeFor(c: { marketCapB: number; revenueB: number }): number {
  const basis = c.marketCapB > 0 ? c.marketCapB : c.revenueB * 8;
  return 1.0 + Math.sqrt(basis) * 0.02;
}

/** $B → 조(T) 가독 표기. */
function fmtCap(b: number): string {
  if (b <= 0) return "";
  if (b >= 1000) return `≈$${(b / 1000).toFixed(b >= 10000 ? 1 : 2)}T`;
  return `≈$${b}B`;
}

interface Props {
  company: Company;
  /** 기본(미선택) 떠 있는 위치. */
  floatPos: [number, number, number];
  /** 지구 위 본사 위치 (없을 수도). */
  geoPos?: [number, number, number];
  /** true → 지구 본사 위치로 핀(선택 또는 연계 회사). */
  pinned: boolean;
  selected: boolean;
  /** false → 페이드아웃(선택과 무관한 회사). */
  visible: boolean;
  onSelect: (id: string) => void;
}

export function CompanyEmblem({ company, floatPos, geoPos, pinned, selected, visible, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const active = hovered || selected;
  const brand = BRAND_HEX[company.id] ?? "#94a3b8";

  const emblemTex = useMemo(() => makeEmblemTexture(company.id, brand), [company.id, brand]);
  useEffect(() => () => emblemTex.dispose(), [emblemTex]);

  const baseSize = sizeFor(company);
  const target = useMemo<[number, number, number]>(
    () => (pinned && geoPos ? geoPos : floatPos),
    [pinned, geoPos, floatPos],
  );
  const labelY = pinned ? 0.95 : baseSize * 0.62 + 0.45;

  useFrame(() => {
    const g = groupRef.current;
    if (g) g.position.lerp(new THREE.Vector3(target[0], target[1], target[2]), 0.08);
    if (innerRef.current) {
      // 핀(지구 위)일 땐 작게, 떠 있을 땐 시총 비례. 선택/호버 시 살짝 확대.
      const s = (pinned ? (selected ? 0.85 : 0.62) : baseSize) * (active ? 1.12 : 1);
      innerRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.14);
    }
    if (matRef.current) {
      const o = visible ? (active ? 1 : 0.92) : 0;
      matRef.current.opacity += (o - matRef.current.opacity) * 0.14;
      matRef.current.visible = matRef.current.opacity > 0.02;
    }
  });

  return (
    <group ref={groupRef} position={floatPos}>
      <Billboard>
        <group
          ref={innerRef}
          onPointerOver={(e) => {
            if (!visible) return;
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            if (!visible) return;
            e.stopPropagation();
            onSelect(company.id);
          }}
        >
          <mesh renderOrder={2}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial ref={matRef} map={emblemTex} transparent opacity={0.92} depthWrite={false} />
          </mesh>
        </group>
      </Billboard>

      {visible && (
        <Html center position={[0, labelY, 0]} distanceFactor={13} zIndexRange={[20, 0]}>
          <div
            style={{
              color: "#e2e8f0",
              fontWeight: 600,
              fontSize: active ? 14 : 12,
              whiteSpace: "nowrap",
              textShadow: "0 1px 6px rgba(0,0,0,0.9)",
              opacity: active ? 1 : 0.85,
              pointerEvents: "none",
              transition: "all .2s ease",
              fontFamily: "Inter, 'Noto Sans KR', system-ui, sans-serif",
            }}
          >
            {company.name}
            {company.marketCapB > 0 && (
              <span style={{ opacity: 0.55, fontWeight: 400, marginLeft: 6 }}>{fmtCap(company.marketCapB)}</span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
