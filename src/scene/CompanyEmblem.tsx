import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Company, CompanyBadge } from "../data/types";

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

/** 글래스 배지 + 로고(있으면) / 워드마크를 그린 CanvasTexture. */
function makeEmblemTexture(badge: CompanyBadge): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS;
  canvas.height = CANVAS;
  const ctx = canvas.getContext("2d")!;
  const brand = badge?.brand ?? "#94a3b8";

  roundRectPath(ctx, 20, 20, CANVAS - 40, CANVAS - 40, 40);
  ctx.fillStyle = "rgba(9,13,21,0.9)";
  ctx.fill();

  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = brand;
  roundRectPath(ctx, 20, 20, CANVAS - 40, CANVAS - 40, 40);
  ctx.stroke();
  ctx.restore();

  if (badge?.logoPath) {
    const box = 132;
    const off = (CANVAS - box) / 2;
    const scale = box / 24;
    ctx.save();
    ctx.translate(off, off);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.fill(new Path2D(badge.logoPath));
    ctx.restore();
  } else {
    const lines = (badge?.wordmark ?? "?").split("\n");
    const maxW = CANVAS - 64;
    let size = 60;
    const widest = () => Math.max(...lines.map((l) => ctx.measureText(l).width));
    ctx.font = `700 ${size}px 'Inter','Noto Sans KR',sans-serif`;
    while (widest() > maxW && size > 13) {
      size -= 2;
      ctx.font = `700 ${size}px 'Inter','Noto Sans KR',sans-serif`;
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    const lineH = size * 1.14;
    const startY = CANVAS / 2 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((l, i) => ctx.fillText(l, CANVAS / 2, startY + i * lineH));
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** 빌보드 평면 크기 ∝ √weight. */
function sizeFor(weight: number): number {
  return 1.0 + Math.sqrt(Math.max(0, weight)) * 0.02;
}

interface Props {
  company: Company;
  badge: CompanyBadge;
  floatPos: [number, number, number];
  geoPos?: [number, number, number];
  pinned: boolean;
  selected: boolean;
  visible: boolean;
  onSelect: (id: string) => void;
}

export function CompanyEmblem({ company, badge, floatPos, geoPos, pinned, selected, visible, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const { camera } = useThree();
  const active = hovered || selected;

  const emblemTex = useMemo(() => makeEmblemTexture(badge), [badge]);
  useEffect(() => () => emblemTex.dispose(), [emblemTex]);

  const baseSize = sizeFor(company.weight);
  const target = useMemo<[number, number, number]>(
    () => (pinned && geoPos ? geoPos : floatPos),
    [pinned, geoPos, floatPos],
  );
  const labelY = pinned ? 0.26 : baseSize * 0.62 + 0.45;

  useFrame(() => {
    const g = groupRef.current;
    if (g) g.position.lerp(new THREE.Vector3(target[0], target[1], target[2]), 0.08);
    if (innerRef.current && g) {
      const s = pinned
        ? (selected ? 0.055 : 0.04) * camera.position.distanceTo(g.position) * (active ? 1.15 : 1)
        : baseSize * (active ? 1.18 : 1);
      innerRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.2);
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
        <Html center position={[0, labelY, 0]} distanceFactor={pinned ? undefined : 13} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              color: "#e2e8f0",
              fontWeight: 600,
              fontSize: pinned ? 11 : active ? 14 : 12,
              whiteSpace: "nowrap",
              textShadow: "0 1px 6px rgba(0,0,0,0.9)",
              opacity: active ? 1 : 0.85,
              pointerEvents: "none",
              transition: "all .2s ease",
              fontFamily: "Inter, 'Noto Sans KR', system-ui, sans-serif",
            }}
          >
            {company.name}
            {company.metric && (
              <span style={{ opacity: 0.55, fontWeight: 400, marginLeft: 6 }}>{company.metric}</span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
