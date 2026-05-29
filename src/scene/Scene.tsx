import { useEffect, useMemo, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CATEGORIES, type ChipFamily } from "../data/semiconductors";
import { CategoryNode } from "./CategoryNode";
import { CompanyGraph, computeCompanyPositions } from "./CompanyGraph";

export type Mode = "taxonomy" | "supply";

/** 카테고리를 패밀리별 별자리 클러스터로 3D 배치. */
function computeCategoryPositions(): Record<string, [number, number, number]> {
  const families = [...new Set(CATEGORIES.map((c) => c.family))] as ChipFamily[];
  const famCenter: Record<string, [number, number, number]> = {};
  families.forEach((f, i) => {
    const angle = (i / families.length) * Math.PI * 2;
    const R = 12;
    famCenter[f] = [Math.cos(angle) * R, Math.sin(angle * 1.6) * 3.5, Math.sin(angle) * R];
  });

  const byFam: Record<string, typeof CATEGORIES> = {};
  CATEGORIES.forEach((c) => (byFam[c.family] ||= []).push(c));

  const pos: Record<string, [number, number, number]> = {};
  Object.entries(byFam).forEach(([fam, list]) => {
    const c0 = famCenter[fam];
    const n = list.length;
    list.forEach((c, i) => {
      if (n === 1) {
        pos[c.id] = [c0[0], c0[1], c0[2]];
      } else {
        const a = (i / n) * Math.PI * 2;
        const r = 3.6;
        pos[c.id] = [c0[0] + Math.cos(a) * r, c0[1] + Math.sin(a) * r * 0.6, c0[2] + Math.sin(a * 1.7) * 1.8];
      }
    });
  });
  return pos;
}

interface Props {
  mode: Mode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function Scene({ mode, selectedId, onSelect }: Props) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const [autoRotate, setAutoRotate] = useState(true);

  const catPos = useMemo(() => computeCategoryPositions(), []);
  const compPos = useMemo(() => computeCompanyPositions(), []);

  const focusRef = useRef<{ target: THREE.Vector3; cam: THREE.Vector3 } | null>(null);

  useEffect(() => {
    if (!selectedId) {
      focusRef.current = {
        target: new THREE.Vector3(0, 0, 0),
        cam: new THREE.Vector3(0, 6, mode === "supply" ? 38 : 32),
      };
      return;
    }
    const p = mode === "taxonomy" ? catPos[selectedId] : compPos[selectedId];
    if (p) {
      const tp = new THREE.Vector3(...p);
      const dir = tp.clone().setY(0).normalize();
      focusRef.current = {
        target: tp,
        cam: tp.clone().add(new THREE.Vector3(dir.x * 6 + 2, 3.5, dir.z * 6 + 8)),
      };
      setAutoRotate(false);
    }
  }, [selectedId, mode, catPos, compPos]);

  // mode 전환 시 카메라 리셋
  useEffect(() => {
    focusRef.current = {
      target: new THREE.Vector3(0, 0, 0),
      cam: new THREE.Vector3(0, 6, mode === "supply" ? 38 : 32),
    };
    setAutoRotate(true);
  }, [mode]);

  useFrame(() => {
    if (focusRef.current && controlsRef.current) {
      controlsRef.current.target.lerp(focusRef.current.target, 0.06);
      camera.position.lerp(focusRef.current.cam, 0.06);
      controlsRef.current.update();
    }
  });

  return (
    <>
      <color attach="background" args={["#05060a"]} />
      <fog attach="fog" args={["#05060a", 34, 78]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[12, 14, 6]} intensity={0.55} />
      <Stars radius={130} depth={55} count={5000} factor={4} saturation={0} fade speed={0.6} />

      {mode === "taxonomy"
        ? CATEGORIES.map((c) => (
            <CategoryNode
              key={c.id}
              category={c}
              position={catPos[c.id]}
              selected={selectedId === c.id}
              onSelect={onSelect}
            />
          ))
        : <CompanyGraph selected={selectedId} onSelect={onSelect} />}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate && !selectedId}
        autoRotateSpeed={0.45}
        minDistance={6}
        maxDistance={64}
        onStart={() => setAutoRotate(false)}
      />

      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur radius={0.75} />
      </EffectComposer>
    </>
  );
}
