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
} from "simple-icons";
import type { Company } from "../data/companies";

/** simple-icons 공식 로고 경로 (24x24 viewBox 의 path d). 8개사. */
const LOGO_PATHS: Record<string, string> = {
  nvidia: siNvidia.path,
  apple: siApple.path,
  amd: siAmd.path,
  qualcomm: siQualcomm.path,
  broadcom: siBroadcom.path,
  intel: siIntel.path,
  samsung: siSamsung.path,
  arm: siArm.path,
};

/** 로고가 없는 8개사 — 워드마크 텍스트로. */
const WORDMARK: Record<string, string> = {
  skhynix: "SK hynix",
  micron: "Micron",
  ti: "TI",
  tsmc: "TSMC",
  asml: "ASML",
  amat: "AMAT",
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
  intel: "#2186E0",
  samsung: "#3A5BDC",
  skhynix: "#FF1F44",
  micron: "#2A7FE0",
  ti: "#F0271C",
  tsmc: "#E11D38",
  asml: "#2A86D6",
  amat: "#19A6E6",
  arm: "#16C0CE",
  synopsys: "#F26B21",
  cadence: "#16B85C",
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
    // 워드마크 텍스트 (흰색, 폭에 맞춰 자동 축소)
    const text = WORDMARK[id] ?? id.toUpperCase();
    const maxW = CANVAS - 80;
    let size = 62;
    ctx.font = `700 ${size}px sans-serif`;
    while (ctx.measureText(text).width > maxW && size > 14) {
      size -= 2;
      ctx.font = `700 ${size}px sans-serif`;
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, CANVAS / 2, CANVAS / 2);
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

/** 빌보드 평면 크기 ∝ √시가총액. */
function sizeFor(marketCapB: number): number {
  return 0.95 + Math.sqrt(marketCapB) * 0.022;
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

  const size = sizeFor(company.marketCapB);
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
            <meshBasicMaterial map={emblemTex} transparent opacity={fade} depthWrite={false} toneMapped={false} />
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
          <span style={{ opacity: 0.55, fontWeight: 400, marginLeft: 6 }}>≈${company.marketCapB}B</span>
        </div>
      </Html>
    </group>
  );
}
