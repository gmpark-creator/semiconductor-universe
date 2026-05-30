import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ChipCategory, ChipIcon } from "../data/semiconductors";

/* 공통 재질 색 — 반도체 실물 톤. */
const MAT = {
  body: "#3a4456", // 패키지 몰드(슬레이트 — 어두운 배경에서도 보이게)
  metal: "#cdd5e0", // 히트스프레더/금속
  gold: "#caa84e", // 핀/리드
  pcb: "#14392b", // 기판(녹색)
  glass: "#bcd6ff", // 렌즈 글래스
  silicon: "#9fb4c8", // 웨이퍼
};

/** IC 패키지(로직) — 기판 + 히트스프레더 + 4면 골드 핀 + 액센트 표식. (모듈 스코프) */
function ChipPackage({ color, accentEmissive, spreader = true }: { color: string; accentEmissive: number; spreader?: boolean }) {
  const pins = [];
  const N = 6;
  for (let i = 0; i < N; i++) {
    const t = (i - (N - 1) / 2) * 0.16;
    pins.push(
      <mesh key={`l${i}`} position={[-0.62, 0, t]}>
        <boxGeometry args={[0.16, 0.05, 0.08]} />
        <meshStandardMaterial color={MAT.gold} metalness={0.5} roughness={0.42} />
      </mesh>,
      <mesh key={`r${i}`} position={[0.62, 0, t]}>
        <boxGeometry args={[0.16, 0.05, 0.08]} />
        <meshStandardMaterial color={MAT.gold} metalness={0.5} roughness={0.42} />
      </mesh>,
      <mesh key={`f${i}`} position={[t, 0, 0.62]}>
        <boxGeometry args={[0.08, 0.05, 0.16]} />
        <meshStandardMaterial color={MAT.gold} metalness={0.5} roughness={0.42} />
      </mesh>,
      <mesh key={`b${i}`} position={[t, 0, -0.62]}>
        <boxGeometry args={[0.08, 0.05, 0.16]} />
        <meshStandardMaterial color={MAT.gold} metalness={0.5} roughness={0.42} />
      </mesh>,
    );
  }
  return (
    <group>
      {/* 기판 — 옅은 카테고리색 emissive 로 어디서나 식별·가시 */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[1.08, 0.16, 1.08]} />
        <meshStandardMaterial color={MAT.body} emissive={color} emissiveIntensity={0.06} metalness={0.3} roughness={0.55} />
      </mesh>
      {spreader && (
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.74, 0.12, 0.74]} />
          <meshStandardMaterial color={MAT.metal} metalness={0.55} roughness={0.4} />
        </mesh>
      )}
      {/* 액센트(브랜드 색) 표식 */}
      <mesh position={[0, 0.19, -0.26]}>
        <boxGeometry args={[0.34, 0.02, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive} metalness={0.4} roughness={0.4} />
      </mesh>
      {pins}
    </group>
  );
}

/** 카테고리별 실사풍 3D 아이콘. (PBR 재질 + 디테일 지오메트리, +y 가 위) */
function ProceduralIcon({ icon, color, glow }: { icon: ChipIcon; color: string; glow: number }) {
  const accentEmissive = 0.12 * glow;

  switch (icon) {
    case "cube": // CPU/GPU/MCU — IC 패키지
      return <ChipPackage color={color} accentEmissive={accentEmissive} />;

    case "fabric": { // FPGA — 다이 위 셀 격자
      const cells = [];
      for (let x = 0; x < 4; x++)
        for (let z = 0; z < 4; z++)
          cells.push(
            <mesh key={`${x}-${z}`} position={[(x - 1.5) * 0.18, 0.16, (z - 1.5) * 0.18]}>
              <boxGeometry args={[0.13, 0.05, 0.13]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive} metalness={0.5} roughness={0.4} />
            </mesh>,
          );
      return (
        <group>
          <mesh position={[0, -0.02, 0]}>
            <boxGeometry args={[1.0, 0.16, 1.0]} />
            <meshStandardMaterial color={MAT.body} metalness={0.35} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <boxGeometry args={[0.82, 0.06, 0.82]} />
            <meshStandardMaterial color="#1a2330" metalness={0.5} roughness={0.45} />
          </mesh>
          {cells}
        </group>
      );
    }

    case "grid": { // 메모리 — DIMM 모듈(기판 + 칩 열 + 골드 엣지)
      const chips = [];
      for (let i = 0; i < 5; i++)
        chips.push(
          <mesh key={i} position={[(i - 2) * 0.3, 0.06, 0.07]}>
            <boxGeometry args={[0.24, 0.34, 0.06]} />
            <meshStandardMaterial color={MAT.body} metalness={0.3} roughness={0.5} />
          </mesh>,
        );
      const teeth = [];
      for (let i = 0; i < 14; i++)
        teeth.push(
          <mesh key={i} position={[(i - 6.5) * 0.105, -0.42, 0.04]}>
            <boxGeometry args={[0.07, 0.12, 0.04]} />
            <meshStandardMaterial color={MAT.gold} metalness={0.5} roughness={0.42} />
          </mesh>,
        );
      return (
        <group rotation={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.6, 0.78, 0.08]} />
            <meshStandardMaterial color={MAT.pcb} metalness={0.2} roughness={0.7} />
          </mesh>
          {chips}
          {teeth}
        </group>
      );
    }

    case "sine": { // 아날로그/PMIC — SOIC 소형 패키지 + 갈윙 리드
      const legs = [];
      for (let i = 0; i < 4; i++) {
        const t = (i - 1.5) * 0.18;
        legs.push(
          <mesh key={`l${i}`} position={[-0.42, -0.06, t]}>
            <boxGeometry args={[0.14, 0.04, 0.07]} />
            <meshStandardMaterial color={MAT.metal} metalness={0.5} roughness={0.42} />
          </mesh>,
          <mesh key={`r${i}`} position={[0.42, -0.06, t]}>
            <boxGeometry args={[0.14, 0.04, 0.07]} />
            <meshStandardMaterial color={MAT.metal} metalness={0.5} roughness={0.42} />
          </mesh>,
        );
      }
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.72, 0.26, 0.86]} />
            <meshStandardMaterial color={MAT.body} metalness={0.3} roughness={0.5} />
          </mesh>
          {/* pin-1 액센트 점 */}
          <mesh position={[-0.26, 0.14, 0.34]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive} />
          </mesh>
          {legs}
        </group>
      );
    }

    case "lightning": { // 전력 — TO-247 류(몰드 + 금속 탭 + 3 리드)
      const leads = [];
      for (let i = 0; i < 3; i++)
        leads.push(
          <mesh key={i} position={[(i - 1) * 0.22, -0.62, 0]}>
            <boxGeometry args={[0.08, 0.4, 0.06]} />
            <meshStandardMaterial color={MAT.gold} metalness={0.5} roughness={0.42} />
          </mesh>,
        );
      return (
        <group>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.72, 0.78, 0.2]} />
            <meshStandardMaterial color={MAT.body} metalness={0.3} roughness={0.55} />
          </mesh>
          {/* 금속 방열 탭 */}
          <mesh position={[0, 0.34, -0.02]}>
            <boxGeometry args={[0.72, 0.22, 0.12]} />
            <meshStandardMaterial color={MAT.metal} metalness={0.6} roughness={0.4} />
          </mesh>
          {/* 마운팅 홀 */}
          <mesh position={[0, 0.34, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.2, 20]} />
            <meshStandardMaterial color="#05070b" metalness={0.4} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.02, 0.11]}>
            <boxGeometry args={[0.3, 0.08, 0.02]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive} />
          </mesh>
          {leads}
        </group>
      );
    }

    case "lens": // 센서 — 카메라 모듈(베이스 + 경통 + 글래스 돔)
      return (
        <group>
          <mesh position={[0, -0.18, 0]}>
            <boxGeometry args={[0.92, 0.18, 0.92]} />
            <meshStandardMaterial color={MAT.body} metalness={0.35} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.4, 0.46, 0.34, 36]} />
            <meshStandardMaterial color="#1c2330" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.04, 36]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive} metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.3, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={MAT.glass} metalness={0.1} roughness={0.06} transparent opacity={0.65} />
          </mesh>
        </group>
      );

    case "wave": { // RF — 모듈 기판 + 실드 캔 + 미앤더 안테나
      const meander = [];
      for (let i = 0; i < 4; i++)
        meander.push(
          <mesh key={i} position={[0.28, 0.07, (i - 1.5) * 0.16]}>
            <boxGeometry args={[0.36, 0.03, 0.05]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive} metalness={0.6} roughness={0.4} />
          </mesh>,
        );
      return (
        <group rotation={[Math.PI / 2.4, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.0, 0.08, 0.78]} />
            <meshStandardMaterial color={MAT.pcb} metalness={0.2} roughness={0.7} />
          </mesh>
          <mesh position={[-0.22, 0.16, 0]}>
            <boxGeometry args={[0.46, 0.26, 0.5]} />
            <meshStandardMaterial color={MAT.metal} metalness={0.6} roughness={0.4} />
          </mesh>
          {meander}
        </group>
      );
    }

    case "wafer": { // 제조 — 실리콘 웨이퍼(다이 격자 + 플랫존)
      const dies = [];
      for (let x = -3; x <= 3; x++)
        for (let z = -3; z <= 3; z++) {
          if (x * x + z * z > 10) continue; // 원형 클리핑
          dies.push(
            <mesh key={`${x}-${z}`} position={[x * 0.21, 0.035, z * 0.21]}>
              <boxGeometry args={[0.17, 0.02, 0.17]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive * 0.7} metalness={0.6} roughness={0.35} />
            </mesh>,
          );
        }
      return (
        <group rotation={[Math.PI / 2.5, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.82, 0.82, 0.05, 64]} />
            <meshStandardMaterial color={MAT.silicon} metalness={0.55} roughness={0.32} />
          </mesh>
          {/* 플랫존(노치) */}
          <mesh position={[0, 0.0, -0.78]}>
            <boxGeometry args={[0.4, 0.06, 0.08]} />
            <meshStandardMaterial color="#05070b" metalness={0.4} roughness={0.6} />
          </mesh>
          {dies}
        </group>
      );
    }

    default:
      return <ChipPackage color={color} accentEmissive={accentEmissive} spreader={false} />;
  }
}

interface Props {
  category: ChipCategory;
  position: [number, number, number];
  selected: boolean;
  dimmed?: boolean;
  reducedMotion?: boolean;
  onSelect: (id: string) => void;
}

export function CategoryNode({ category, position, selected, dimmed = false, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const active = hovered || selected;
  const glow = active ? 1.6 : dimmed ? 0.4 : 1;

  useFrame(() => {
    const target = active ? 1.5 : dimmed ? 1.0 : 1.15;
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    }
  });

  return (
    <group position={position}>
      {/* 3/4 시점 틸트로 입체감 — 부유·회전 없음(가지런) */}
      <group
        ref={groupRef}
        rotation={[-0.42, 0.5, 0]}
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
          onSelect(category.id);
        }}
      >
        <ProceduralIcon icon={category.icon} color={category.color} glow={glow} />
      </group>

      <Html
        center
        position={[0, 1.45, 0]}
        distanceFactor={11}
        zIndexRange={[20, 0]}
        occlude={false}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            color: "#f1f5f9",
            fontSize: active ? 13 : 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            padding: "3px 9px",
            borderRadius: 8,
            background: active ? "rgba(2,6,12,0.85)" : "rgba(2,6,12,0.55)",
            border: `1px solid ${category.color}${active ? "cc" : "33"}`,
            opacity: dimmed && !active ? 0.32 : 1,
            transition: "all .2s ease",
            pointerEvents: "none",
            fontFamily: "Inter, 'Noto Sans KR', system-ui, sans-serif",
          }}
        >
          {category.name}
        </div>
      </Html>
    </group>
  );
}
