import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ProcessStageKind, ProcessStep } from "../data/types";

/* 공정 비주얼 공통 톤(반도체 실물 느낌). */
const M = {
  silicon: "#9fb4c8",
  metal: "#cdd5e0",
  gold: "#caa84e",
  body: "#3a4456",
  dark: "#10151f",
};

/** 웨이퍼 원판(국소 프레임: XY 평면, 법선 +Z = 카메라쪽). 디테일은 +z 로 쌓는다. */
function WaferBase({ color, glow, dieGrid = true }: { color: string; glow: number; dieGrid?: boolean }) {
  const dies = [];
  if (dieGrid) {
    for (let x = -3; x <= 3; x++)
      for (let y = -3; y <= 3; y++) {
        if (x * x + y * y > 10) continue;
        dies.push(
          <mesh key={`${x}-${y}`} position={[x * 0.21, y * 0.21, 0.035]}>
            <boxGeometry args={[0.17, 0.17, 0.02]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5 * glow} metalness={0.6} roughness={0.35} />
          </mesh>,
        );
      }
  }
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.06, 64]} />
        <meshStandardMaterial color={M.silicon} metalness={0.6} roughness={0.28} />
      </mesh>
      {/* 플랫존(노치) */}
      <mesh position={[0, -0.78, 0.0]}>
        <boxGeometry args={[0.4, 0.08, 0.07]} />
        <meshStandardMaterial color={M.dark} metalness={0.4} roughness={0.6} />
      </mesh>
      {dies}
    </group>
  );
}

/** 단계별 고유 3D 비주얼. (웨이퍼 표면 법선 +z 방향으로 공정 디테일을 쌓음) */
function StageVisual({ stage, color, glow }: { stage: ProcessStageKind; color: string; glow: number }) {
  const e = 0.9 * glow;

  switch (stage) {
    case "wafer":
      return <WaferBase color={color} glow={glow} />;

    case "oxide": {
      // 웨이퍼 + 투명 산화막 + 떠오르는 산소 분위기
      const bubbles = [0.22, 0.4, 0.6].map((z, i) => (
        <mesh key={i} position={[(i - 1) * 0.18, 0.12 * i, z]}>
          <sphereGeometry args={[0.12 + i * 0.04, 16, 16]} />
          <meshStandardMaterial color="#dbeafc" transparent opacity={0.45 - i * 0.1} roughness={1} />
        </mesh>
      ));
      return (
        <group>
          <WaferBase color={color} glow={glow * 0.6} />
          <mesh position={[0, 0, 0.06]}>
            <circleGeometry args={[0.72, 48]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={e} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          {bubbles}
        </group>
      );
    }

    case "photo": {
      // 웨이퍼 + 포토마스크 프레임 + 위에서 내려오는 노광 빛
      return (
        <group>
          <WaferBase color={color} glow={glow * 0.5} />
          {/* 노광 빛(원뿔) */}
          <mesh position={[0, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.62, 1.0, 32, 1, true]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={e * 0.9} transparent opacity={0.16} side={THREE.DoubleSide} />
          </mesh>
          {/* 포토마스크(레티클) 프레임 */}
          <group position={[0, 0, 0.42]}>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1.06, 0.07, 0.05]} />
              <meshStandardMaterial color={M.metal} metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
              <boxGeometry args={[1.06, 0.07, 0.05]} />
              <meshStandardMaterial color={M.metal} metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.5, 0, 0]}>
              <boxGeometry args={[0.07, 1.06, 0.05]} />
              <meshStandardMaterial color={M.metal} metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[-0.5, 0, 0]}>
              <boxGeometry args={[0.07, 1.06, 0.05]} />
              <meshStandardMaterial color={M.metal} metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
          {/* 노광된 패턴 라인 */}
          {[-0.3, 0, 0.3].map((y, i) => (
            <mesh key={`p${i}`} position={[0, y, 0.05]}>
              <boxGeometry args={[0.9, 0.05, 0.02]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={e} />
            </mesh>
          ))}
        </group>
      );
    }

    case "etch": {
      // 웨이퍼에 깎여나간 트렌치(홈) + 플라즈마 글로우
      const trenches = [-0.36, -0.12, 0.12, 0.36].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.02]}>
          <boxGeometry args={[0.12, 1.0, 0.06]} />
          <meshStandardMaterial color={M.dark} metalness={0.3} roughness={0.7} />
        </mesh>
      ));
      const plasma = [[-0.2, 0.3], [0.25, -0.2]].map(([x, y], i) => (
        <mesh key={`g${i}`} position={[x, y, 0.28]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={e * 1.6} transparent opacity={0.8} />
        </mesh>
      ));
      return (
        <group>
          <WaferBase color={color} glow={glow * 0.5} dieGrid={false} />
          {trenches}
          {plasma}
        </group>
      );
    }

    case "deposition": {
      // 원자층 적층 — 점점 작아지는 박막 디스크를 웨이퍼 법선(+z)으로 스택
      const layers = [0.08, 0.16, 0.24, 0.32].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.7 - i * 0.13, 0.7 - i * 0.13, 0.03, 48]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? color : M.metal}
            emissive={color}
            emissiveIntensity={e * (0.4 + i * 0.18)}
            metalness={0.5}
            roughness={0.35}
          />
        </mesh>
      ));
      return (
        <group>
          <WaferBase color={color} glow={glow * 0.45} dieGrid={false} />
          {layers}
        </group>
      );
    }

    case "wiring": {
      // 금속 배선 격자 + 비아
      const lines = [];
      for (let i = -2; i <= 2; i++) {
        lines.push(
          <mesh key={`h${i}`} position={[0, i * 0.28, 0.06]}>
            <boxGeometry args={[1.2, 0.05, 0.04]} />
            <meshStandardMaterial color={M.gold} emissive={color} emissiveIntensity={e * 0.7} metalness={0.7} roughness={0.3} />
          </mesh>,
          <mesh key={`v${i}`} position={[i * 0.28, 0, 0.06]}>
            <boxGeometry args={[0.05, 1.2, 0.04]} />
            <meshStandardMaterial color={M.gold} emissive={color} emissiveIntensity={e * 0.7} metalness={0.7} roughness={0.3} />
          </mesh>,
        );
      }
      const vias = [];
      for (let x = -1; x <= 1; x++)
        for (let y = -1; y <= 1; y++)
          vias.push(
            <mesh key={`via${x}-${y}`} position={[x * 0.28, y * 0.28, 0.1]}>
              <cylinderGeometry args={[0.04, 0.04, 0.1, 10]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={e * 1.4} />
            </mesh>,
          );
      return (
        <group>
          <WaferBase color={color} glow={glow * 0.4} dieGrid={false} />
          {lines}
          {vias}
        </group>
      );
    }

    case "test": {
      // 프로브 카드 — 웨이퍼 법선(+z)으로 내려오는 검사 니들 + 접촉 글로우
      const needles = [-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color={M.metal} metalness={0.7} roughness={0.3} />
        </mesh>
      ));
      return (
        <group>
          <WaferBase color={color} glow={glow * 0.8} />
          {/* 프로브 플레이트 */}
          <mesh position={[0, 0, 0.82]}>
            <boxGeometry args={[1.1, 0.5, 0.08]} />
            <meshStandardMaterial color={M.body} metalness={0.4} roughness={0.5} />
          </mesh>
          {needles}
          {/* 접촉 글로우 */}
          {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
            <mesh key={`c${i}`} position={[x, 0, 0.1]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={e * 1.8} />
            </mesh>
          ))}
        </group>
      );
    }

    case "package": {
      // 완성된 IC 패키지 — 기판 + 히트스프레더 + 골드 핀
      const pins = [];
      const N = 6;
      for (let i = 0; i < N; i++) {
        const t = (i - (N - 1) / 2) * 0.18;
        pins.push(
          <mesh key={`l${i}`} position={[-0.72, t, 0]}>
            <boxGeometry args={[0.18, 0.08, 0.16]} />
            <meshStandardMaterial color={M.gold} metalness={0.6} roughness={0.4} />
          </mesh>,
          <mesh key={`r${i}`} position={[0.72, t, 0]}>
            <boxGeometry args={[0.18, 0.08, 0.16]} />
            <meshStandardMaterial color={M.gold} metalness={0.6} roughness={0.4} />
          </mesh>,
        );
      }
      return (
        <group>
          {/* 기판 */}
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[1.3, 1.3, 0.18]} />
            <meshStandardMaterial color={M.body} emissive={color} emissiveIntensity={0.12 * glow} metalness={0.35} roughness={0.5} />
          </mesh>
          {/* 히트스프레더 */}
          <mesh position={[0, 0, 0.1]}>
            <boxGeometry args={[0.92, 0.92, 0.12]} />
            <meshStandardMaterial color={M.metal} metalness={0.7} roughness={0.32} />
          </mesh>
          {/* 액센트 표식 */}
          <mesh position={[0, 0.34, 0.18]}>
            <boxGeometry args={[0.4, 0.07, 0.02]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={e} />
          </mesh>
          {pins}
        </group>
      );
    }

    default:
      return <WaferBase color={color} glow={glow} />;
  }
}

/** 흐름 방향 화살표(이전 단계 → 다음 단계). */
function FlowArrow({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const { mid, quat, segLen } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const unit = b.clone().sub(a).normalize();
    const nodeR = 1.75;
    const start = a.clone().addScaledVector(unit, nodeR);
    const end = b.clone().addScaledVector(unit, -nodeR);
    const len = Math.max(0.2, end.clone().sub(start).length());
    const m = start.clone().addScaledVector(unit, len / 2);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), unit);
    return { mid: [m.x, m.y, m.z] as [number, number, number], quat: q, segLen: len };
  }, [from, to]);

  const headLen = 0.5;
  const shaft = Math.max(0.1, segLen - headLen);
  return (
    <group position={mid} quaternion={quat}>
      <mesh position={[0, -headLen / 2, 0]}>
        <cylinderGeometry args={[0.045, 0.045, shaft, 12]} />
        <meshStandardMaterial color="#8190a8" emissive="#6c7da0" emissiveIntensity={0.3} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, segLen / 2 - headLen / 2, 0]}>
        <coneGeometry args={[0.15, headLen, 16]} />
        <meshStandardMaterial color="#b6c2d8" emissive="#8aa0c8" emissiveIntensity={0.45} metalness={0.4} roughness={0.45} />
      </mesh>
    </group>
  );
}

/** 공정 단계 노드 — 호버/선택 시 확대·강조, 클릭 시 선택. */
function StepNode({
  step,
  position,
  selected,
  dimmed,
  onSelect,
}: {
  step: ProcessStep;
  position: [number, number, number];
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const active = hovered || selected;
  const glow = active ? 1.5 : dimmed ? 0.4 : 1;

  useFrame(() => {
    const target = active ? 1.4 : dimmed ? 0.95 : 1.1;
    groupRef.current?.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
  });

  return (
    <group position={position}>
      <group
        ref={groupRef}
        rotation={[-0.34, 0.42, 0]}
        onPointerOver={(ev) => {
          ev.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(ev) => {
          ev.stopPropagation();
          onSelect(step.id);
        }}
      >
        <StageVisual stage={step.stage} color={step.color} glow={glow} />
      </group>

      {/* 순번 배지 */}
      <Html center position={[-1.0, 1.0, 0]} distanceFactor={11} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 14,
            color: "#05060a",
            background: step.color,
            boxShadow: `0 0 12px ${step.color}aa`,
            opacity: dimmed && !active ? 0.4 : 1,
            fontFamily: "Inter, 'Noto Sans KR', system-ui, sans-serif",
          }}
        >
          {step.index}
        </div>
      </Html>

      {/* 이름 라벨 */}
      <Html center position={[0, -1.5, 0]} distanceFactor={11} zIndexRange={[20, 0]} occlude={false} style={{ pointerEvents: "none" }}>
        <div
          style={{
            color: "#f1f5f9",
            fontSize: active ? 13 : 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            padding: "3px 9px",
            borderRadius: 8,
            background: active ? "rgba(2,6,12,0.85)" : "rgba(2,6,12,0.55)",
            border: `1px solid ${step.color}${active ? "cc" : "33"}`,
            opacity: dimmed && !active ? 0.32 : 1,
            transition: "all .2s ease",
            fontFamily: "Inter, 'Noto Sans KR', system-ui, sans-serif",
          }}
        >
          {step.name}
        </div>
      </Html>
    </group>
  );
}

interface Props {
  steps: ProcessStep[];
  positions: Record<string, [number, number, number]>;
  selected: string | null;
  onSelect: (id: string) => void;
}

/** 반도체 8대 공정 — 뱀형(serpentine) 흐름의 3D 파이프라인. */
export function ProcessFlow({ steps, positions, selected, onSelect }: Props) {
  const arrows = useMemo(() => {
    const out: { key: string; from: [number, number, number]; to: [number, number, number] }[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const a = positions[steps[i].id];
      const b = positions[steps[i + 1].id];
      if (a && b) out.push({ key: `${steps[i].id}->${steps[i + 1].id}`, from: a, to: b });
    }
    return out;
  }, [steps, positions]);

  return (
    <group>
      {arrows.map((a) => (
        <FlowArrow key={a.key} from={a.from} to={a.to} />
      ))}
      {steps.map((s) => (
        <StepNode
          key={s.id}
          step={s}
          position={positions[s.id] ?? [0, 0, 0]}
          selected={selected === s.id}
          dimmed={selected !== null && selected !== s.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
