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

/** 기업별 브랜드 액센트색 (테두리·글로우). 어두운 배경에서 빛나도록 살짝 밝게 보정한 브랜드 색조. */
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
  ctx.fillStyle = "rgba(9,13,21,0.85)";
  ctx.fill();

  // 브랜드색 테두리 + 글로우
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = brand;
  ctx.shadowColor = brand;
  ctx.shadowBlur = 22;
  roundRectPath(ctx, 20, 20, CANVAS - 40, CANVAS - 40, 40);
  ctx.stroke();
  ctx.restore();

  const path = LOGO_PATHS[id];
  if (path) {
    // 공식 로고 (흰색 글리프)
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
    // 워드마크 텍스트 (흰색, 폭에 맞춰 자동 축소, 줄바꿈 지원)
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

/** 뒤에 깔리는 방사형 글로우 텍스처. */
function makeGlowTexture(brand: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS;
  canvas.height = CANVAS;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(CANVAS / 2, CANVAS / 2, 0, CANVAS / 2, CANVAS / 2, CANVAS / 2);
  const c = new THREE.Color(brand);
  const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
  g.addColorStop(0, `rgba(${rgb},0.85)`);
  g.addColorStop(0.4, `rgba(${rgb},0.35)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS, CANVAS);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
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
  position: [number, number, number];
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string) => void;
}

export function CompanyEmblem({ company, position, selected, dimmed, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);
  const active = hovered || selected;
  const brand = BRAND_HEX[company.id] ?? "#94a3b8";

  const emblemTex = useMemo(() => makeEmblemTexture(company.id, brand), [company.id, brand]);
  const glowTex = useMemo(() => makeGlowTexture(brand), [brand]);
  useEffect(() => () => {
    emblemTex.dispose();
    glowTex.dispose();
  }, [emblemTex, glowTex]);

  const size = sizeFor(company);
  const fade = dimmed && !active ? 0.25 : 1;

  useFrame(() => {
    if (ref.current) {
      const t = active ? 1.18 : 1;
      ref.current.scale.lerp(new THREE.Vector3(t, t, t), 0.15);
    }
  });

  return (
    <group position={position}>
      <Billboard>
        <group
          ref={ref}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(company.id);
          }}
        >
          {/* 방사형 글로우 */}
          <mesh position={[0, 0, -0.02]} scale={[size * 1.75, size * 1.75, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={glowTex}
              transparent
              opacity={(active ? 0.95 : 0.5) * fade}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          {/* 앰블럼 배지 */}
          <mesh scale={[size, size, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={emblemTex} transparent opacity={fade} depthWrite={false} />
          </mesh>
        </group>
      </Billboard>

      <Html center position={[0, size * 0.62 + 0.4, 0]} distanceFactor={13} zIndexRange={[20, 0]}>
        <div
          style={{
            color: "#e2e8f0",
            fontWeight: 600,
            fontSize: active ? 14 : 12,
            whiteSpace: "nowrap",
            textShadow: "0 1px 6px rgba(0,0,0,0.9)",
            opacity: dimmed && !active ? 0.4 : active ? 1 : 0.85,
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
    </group>
  );
}
