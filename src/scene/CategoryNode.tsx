import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Category, IconKey } from "../data/types";

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
function ProceduralIcon({ icon, color, glow }: { icon: IconKey; color: string; glow: number }) {
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

    // ───────────────────────── 전력 ─────────────────────────
    case "atom": { // 원자력 — 핵 + 전자 궤도
      const rings = [0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2.2, (i * Math.PI) / 3, i * 0.5]}>
          <torusGeometry args={[0.6, 0.022, 12, 48]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive * 1.4} metalness={0.4} roughness={0.4} />
        </mesh>
      ));
      return (
        <group>
          <mesh>
            <sphereGeometry args={[0.3, 28, 28]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5 * glow} metalness={0.3} roughness={0.35} />
          </mesh>
          {rings}
        </group>
      );
    }

    case "smokestack": { // 화력(석탄·LNG·바이오) — 냉각탑 + 연기
      return (
        <group>
          <mesh position={[0, -0.45, 0]}>
            <boxGeometry args={[0.9, 0.12, 0.9]} />
            <meshStandardMaterial color="#3a4250" metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.46, 0.86, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive} metalness={0.25} roughness={0.55} />
          </mesh>
          {[0.55, 0.74, 0.92].map((y, i) => (
            <mesh key={i} position={[i * 0.06, y, 0]}>
              <sphereGeometry args={[0.18 + i * 0.05, 16, 16]} />
              <meshStandardMaterial color="#d5dae2" transparent opacity={0.5 - i * 0.12} roughness={1} />
            </mesh>
          ))}
        </group>
      );
    }

    case "solar": { // 태양광 패널
      const cells = [];
      for (let x = 0; x < 3; x++)
        for (let z = 0; z < 2; z++)
          cells.push(
            <mesh key={`${x}-${z}`} position={[(x - 1) * 0.28, 0.03, (z - 0.5) * 0.3]}>
              <boxGeometry args={[0.24, 0.02, 0.26]} />
              <meshStandardMaterial color="#1b2c54" emissive={color} emissiveIntensity={accentEmissive * 0.8} metalness={0.4} roughness={0.3} />
            </mesh>,
          );
      return (
        <group>
          <mesh position={[0, -0.45, 0.06]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
            <meshStandardMaterial color="#8a93a0" metalness={0.5} roughness={0.4} />
          </mesh>
          <group rotation={[-0.6, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.92, 0.04, 0.66]} />
              <meshStandardMaterial color="#0e1830" metalness={0.4} roughness={0.35} />
            </mesh>
            {cells}
          </group>
        </group>
      );
    }

    case "turbine": { // 풍력 터빈
      const blades = [0, 1, 2].map((i) => (
        <group key={i} rotation={[0, 0, (i * 2 * Math.PI) / 3]}>
          <mesh position={[0, 0.45, 0.06]}>
            <boxGeometry args={[0.08, 0.85, 0.02]} />
            <meshStandardMaterial color="#eef2f7" metalness={0.2} roughness={0.5} />
          </mesh>
        </group>
      ));
      return (
        <group>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.045, 0.07, 1.1, 16]} />
            <meshStandardMaterial color="#dfe6ee" metalness={0.3} roughness={0.45} />
          </mesh>
          <group position={[0, 0.42, 0.1]}>
            <mesh>
              <sphereGeometry args={[0.1, 20, 20]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive} metalness={0.5} roughness={0.35} />
            </mesh>
            {blades}
          </group>
        </group>
      );
    }

    case "dam": { // 수력·양수 — 댐 + 저수지
      return (
        <group>
          <mesh position={[0, 0, -0.3]}>
            <boxGeometry args={[1.1, 0.5, 0.5]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive * 0.8} metalness={0.2} roughness={0.2} transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, -0.05, 0.05]} rotation={[0.18, 0, 0]}>
            <boxGeometry args={[1.15, 0.78, 0.16]} />
            <meshStandardMaterial color="#aeb6c0" metalness={0.2} roughness={0.7} />
          </mesh>
          {[-0.35, 0, 0.35].map((x, i) => (
            <mesh key={i} position={[x, -0.1, 0.14]}>
              <boxGeometry args={[0.08, 0.6, 0.04]} />
              <meshStandardMaterial color="#7f8893" metalness={0.2} roughness={0.7} />
            </mesh>
          ))}
        </group>
      );
    }

    case "h2tank": { // 연료전지·수소 — 수소 탱크 + 스택
      return (
        <group>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.66, 24]} />
            <meshStandardMaterial color="#e6edf3" metalness={0.45} roughness={0.3} />
          </mesh>
          {[-0.33, 0.33].map((x, i) => (
            <mesh key={i} position={[x, 0.15, 0]}>
              <sphereGeometry args={[0.26, 20, 16]} />
              <meshStandardMaterial color="#e6edf3" metalness={0.45} roughness={0.3} />
            </mesh>
          ))}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.14, 24]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive * 1.2} metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <boxGeometry args={[0.8, 0.2, 0.5]} />
            <meshStandardMaterial color="#2f3a48" metalness={0.3} roughness={0.55} />
          </mesh>
        </group>
      );
    }

    case "battery": { // ESS — 배터리 셀
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.62, 0.9, 0.6]} />
            <meshStandardMaterial color="#2c3543" metalness={0.35} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
            <meshStandardMaterial color="#c7cdd6" metalness={0.6} roughness={0.35} />
          </mesh>
          {[-0.18, 0, 0.18].map((y, i) => (
            <mesh key={i} position={[0, y, 0.31]}>
              <boxGeometry args={[0.4, 0.1, 0.02]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive * 1.3} />
            </mesh>
          ))}
        </group>
      );
    }

    case "pylon": { // 송전·배전 — 송전탑
      return (
        <group>
          <mesh>
            <cylinderGeometry args={[0.05, 0.11, 1.25, 8]} />
            <meshStandardMaterial color="#aab2bd" metalness={0.5} roughness={0.45} />
          </mesh>
          {[0.55, 0.3].map((y, k) => (
            <group key={k} position={[0, y, 0]}>
              <mesh>
                <boxGeometry args={[0.95 - k * 0.2, 0.05, 0.05]} />
                <meshStandardMaterial color="#aab2bd" metalness={0.5} roughness={0.45} />
              </mesh>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * (0.45 - k * 0.1), -0.06, 0]}>
                  <sphereGeometry args={[0.04, 10, 10]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      );
    }

    case "gridhub": { // 전력시장·계통 — 네트워크 허브
      const nodes = [];
      const N = 6;
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2;
        const x = Math.cos(a) * 0.55;
        const y = Math.sin(a) * 0.55;
        nodes.push(
          <group key={i}>
            <mesh position={[x, y, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive * 1.2} metalness={0.4} roughness={0.4} />
            </mesh>
            <mesh position={[x / 2, y / 2, 0]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.55, 0.018, 0.018]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={accentEmissive * 0.7} transparent opacity={0.7} />
            </mesh>
          </group>,
        );
      }
      return (
        <group>
          <mesh>
            <icosahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5 * glow} metalness={0.5} roughness={0.3} />
          </mesh>
          {nodes}
        </group>
      );
    }

    default:
      return <ChipPackage color={color} accentEmissive={accentEmissive} spreader={false} />;
  }
}

interface Props {
  category: Category;
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
