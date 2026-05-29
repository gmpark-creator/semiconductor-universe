import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import type { ChipCategory, ChipIcon } from "../data/semiconductors";

/** 카테고리별 간단 프로시저럴 아이콘. */
function ProceduralIcon({ icon, color }: { icon: ChipIcon; color: string }) {
  const Mat = ({ e = 0.6, o = 1 }: { e?: number; o?: number }) => (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={e}
      metalness={0.3}
      roughness={0.35}
      transparent={o < 1}
      opacity={o}
    />
  );

  switch (icon) {
    case "cube": // logic: layered cube
      return (
        <group>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, (i - 1) * 0.46, 0]}>
              <boxGeometry args={[1.05 - i * 0.16, 0.32, 1.05 - i * 0.16]} />
              <Mat />
            </mesh>
          ))}
        </group>
      );
    case "grid": // memory: stacked grid
      return (
        <group>
          {Array.from({ length: 3 }).map((_, y) =>
            Array.from({ length: 3 }).map((_, x) => (
              <mesh key={`${x}-${y}`} position={[(x - 1) * 0.42, (y - 1) * 0.42, 0]}>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <Mat />
              </mesh>
            )),
          )}
        </group>
      );
    case "sine": { // analog: sine wave
      const pts = Array.from({ length: 40 }, (_, i) => {
        const t = (i / 39) * Math.PI * 3 - Math.PI * 1.5;
        return new THREE.Vector3(t * 0.26, Math.sin(t) * 0.5, 0);
      });
      const curve = new THREE.CatmullRomCurve3(pts);
      return (
        <mesh>
          <tubeGeometry args={[curve, 64, 0.09, 8, false]} />
          <Mat />
        </mesh>
      );
    }
    case "lightning": { // power: bolt
      const shape = new THREE.Shape();
      shape.moveTo(0.08, 0.72);
      shape.lineTo(-0.36, 0.04);
      shape.lineTo(-0.02, 0.04);
      shape.lineTo(-0.12, -0.72);
      shape.lineTo(0.4, -0.02);
      shape.lineTo(0.04, -0.02);
      shape.lineTo(0.08, 0.72);
      return (
        <mesh>
          <extrudeGeometry args={[shape, { depth: 0.16, bevelEnabled: false }]} />
          <Mat e={0.85} />
        </mesh>
      );
    }
    case "lens": // sensor: lens
      return (
        <group>
          <mesh>
            <torusGeometry args={[0.55, 0.12, 16, 48]} />
            <Mat />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.34, 24, 24]} />
            <Mat e={0.5} o={0.55} />
          </mesh>
        </group>
      );
    case "wave": // RF: concentric arcs
      return (
        <group rotation={[Math.PI / 2, 0, 0]}>
          {[0.3, 0.55, 0.8].map((r, i) => (
            <mesh key={i}>
              <torusGeometry args={[r, 0.05, 12, 48, Math.PI]} />
              <Mat />
            </mesh>
          ))}
        </group>
      );
    case "fabric": // FPGA: woven lattice
      return (
        <group>
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={`h${i}`} position={[0, (i - 1.5) * 0.34, 0]}>
              <boxGeometry args={[1.4, 0.06, 0.06]} />
              <Mat />
            </mesh>
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={`v${i}`} position={[(i - 1.5) * 0.34, 0, 0]}>
              <boxGeometry args={[0.06, 1.4, 0.06]} />
              <Mat />
            </mesh>
          ))}
        </group>
      );
    case "wafer": // manufacturing: wafer disc
      return (
        <group rotation={[Math.PI / 2.6, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.72, 0.72, 0.1, 48]} />
            <Mat e={0.32} />
          </mesh>
          <mesh position={[0.52, 0.06, 0]}>
            <boxGeometry args={[0.16, 0.12, 0.16]} />
            <Mat e={0.7} />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh>
          <icosahedronGeometry args={[0.7, 0]} />
          <Mat />
        </mesh>
      );
  }
}

interface Props {
  category: ChipCategory;
  position: [number, number, number];
  selected: boolean;
  onSelect: (id: string) => void;
}

export function CategoryNode({ category, position, selected, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const active = hovered || selected;

  useFrame((state) => {
    const target = active ? 1.3 : 1;
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    }
    if (haloRef.current) {
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5;
      const m = haloRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = (active ? 0.3 : 0.13) + pulse * 0.05;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <group
          ref={groupRef}
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
          <ProceduralIcon icon={category.icon} color={category.color} />
          <mesh ref={haloRef}>
            <sphereGeometry args={[1.2, 24, 24]} />
            <meshBasicMaterial color={category.color} transparent opacity={0.13} depthWrite={false} />
          </mesh>
          <pointLight color={category.color} intensity={active ? 2.4 : 1.1} distance={4.5} />
        </group>

        <Html center position={[0, 1.75, 0]} distanceFactor={11} zIndexRange={[20, 0]}>
          <div
            style={{
              color: "#e2e8f0",
              fontSize: active ? 14 : 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
              textShadow: "0 1px 6px rgba(0,0,0,0.9)",
              opacity: active ? 1 : 0.82,
              transition: "all .2s ease",
              pointerEvents: "none",
              fontFamily: "Inter, 'Noto Sans KR', system-ui, sans-serif",
            }}
          >
            {category.name}
          </div>
        </Html>
      </Float>
    </group>
  );
}
