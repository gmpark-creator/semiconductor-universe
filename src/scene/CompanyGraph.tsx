import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { COMPANIES, EDGES, EDGE_COLORS, type Company, type CompanyGroup } from "../data/companies";
import { SupplyArrow } from "./SupplyArrow";

export const GROUP_COLORS: Record<CompanyGroup, string> = {
  Designer: "#60A5FA",
  IDM: "#F472B6",
  Foundry: "#22D3EE",
  Equipment: "#C084FC",
  "EDA/IP": "#34D399",
};

const GROUP_CENTERS: Record<CompanyGroup, [number, number, number]> = {
  "EDA/IP": [-15, 5, -2],
  Equipment: [-15, -6, 3],
  Designer: [-2, 2, 0],
  Foundry: [6, -3, -1],
  IDM: [14, 5, 2],
};

/** 회사 노드를 그룹별 클러스터로 배치 (deterministic). */
export function computeCompanyPositions(): Record<string, [number, number, number]> {
  const byGroup: Record<string, Company[]> = {};
  for (const c of COMPANIES) (byGroup[c.group] ||= []).push(c);

  const pos: Record<string, [number, number, number]> = {};
  for (const [group, list] of Object.entries(byGroup)) {
    const center = GROUP_CENTERS[group as CompanyGroup];
    const n = list.length;
    list.forEach((c, i) => {
      if (n === 1) {
        pos[c.id] = [center[0], center[1], center[2]];
      } else {
        const angle = (i / n) * Math.PI * 2;
        const r = 3.4;
        pos[c.id] = [
          center[0] + Math.cos(angle) * r,
          center[1] + Math.sin(angle) * r * 0.7,
          center[2] + Math.sin(angle * 1.3) * 1.6,
        ];
      }
    });
  }
  return pos;
}

function radiusFor(marketCapB: number): number {
  return 0.4 + Math.sqrt(marketCapB) * 0.035; // sphere radius ∝ √marketCap
}

function CompanyNode({
  company,
  position,
  selected,
  dimmed,
  onSelect,
}: {
  company: Company;
  position: [number, number, number];
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);
  const active = hovered || selected;
  const color = GROUP_COLORS[company.group];
  const r = radiusFor(company.marketCapB);

  useFrame(() => {
    if (ref.current) {
      const t = active ? 1.15 : 1;
      ref.current.scale.lerp(new THREE.Vector3(t, t, t), 0.15);
    }
  });

  return (
    <group position={position}>
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
        <mesh>
          <sphereGeometry args={[r, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={active ? 0.95 : 0.45}
            metalness={0.4}
            roughness={0.3}
            transparent
            opacity={dimmed && !active ? 0.35 : 1}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[r * 1.25, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 0.22 : 0.09} depthWrite={false} />
        </mesh>
        <pointLight color={color} intensity={active ? 2.2 : 0.8} distance={r * 7} />
      </group>
      <Html center position={[0, r + 0.7, 0]} distanceFactor={13} zIndexRange={[20, 0]}>
        <div
          style={{
            color: "#e2e8f0",
            fontWeight: 600,
            fontSize: active ? 14 : 12,
            whiteSpace: "nowrap",
            textShadow: "0 1px 6px rgba(0,0,0,0.9)",
            opacity: dimmed && !active ? 0.4 : active ? 1 : 0.82,
            pointerEvents: "none",
            transition: "all .2s ease",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {company.name}
          <span style={{ opacity: 0.55, fontWeight: 400, marginLeft: 6 }}>≈${company.marketCapB}B</span>
        </div>
      </Html>
    </group>
  );
}

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function CompanyGraph({ selected, onSelect }: Props) {
  const positions = useMemo(() => computeCompanyPositions(), []);

  return (
    <group>
      {EDGES.map((e) => {
        const from = positions[e.from];
        const to = positions[e.to];
        if (!from || !to) return null;
        const related = selected === e.from || selected === e.to;
        return (
          <SupplyArrow
            key={e.id}
            start={from}
            end={to}
            color={EDGE_COLORS[e.relationship]}
            active={selected === null || related}
          />
        );
      })}
      {COMPANIES.map((c) => {
        const related =
          selected === null ||
          selected === c.id ||
          EDGES.some((e) => (e.from === selected && e.to === c.id) || (e.to === selected && e.from === c.id));
        return (
          <CompanyNode
            key={c.id}
            company={c}
            position={positions[c.id]}
            selected={selected === c.id}
            dimmed={!related}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}
