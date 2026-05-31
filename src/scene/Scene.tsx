import { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { AtlasArea, Category } from "../data/types";
import { CategoryNode } from "./CategoryNode";
import { CompanyGraph } from "./CompanyGraph";
import { computeCompanyGeoPositions, companyHqVec3 } from "./companyLayout";
import { VectorGlobe } from "./VectorGlobe";
import { TaxonomyBackdrop } from "./TaxonomyBackdrop";

export type Mode = "taxonomy" | "supply";

/** 분류 — 패밀리별 행으로 가지런히 정렬한 정면 그리드(카툰 배경 앞). */
function computeCategoryGrid(area: AtlasArea): Record<string, [number, number, number]> {
  const byFam: Record<string, Category[]> = {};
  area.categories.forEach((c) => (byFam[c.family] ||= []).push(c));
  const rowGap = 3.9;
  const colGap = 4.5;
  const rows = area.familyOrder.length;
  const pos: Record<string, [number, number, number]> = {};
  area.familyOrder.forEach((fam, ri) => {
    const list = byFam[fam] || [];
    const n = list.length;
    const y = ((rows - 1) / 2 - ri) * rowGap;
    list.forEach((c, ci) => {
      const x = (ci - (n - 1) / 2) * colGap;
      pos[c.id] = [x, y, 0];
    });
  });
  return pos;
}

interface Props {
  area: AtlasArea;
  mode: Mode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  reducedMotion?: boolean;
}

export function Scene({ area, mode, selectedId, onSelect, reducedMotion = false }: Props) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const catPos = useMemo(() => computeCategoryGrid(area), [area]);
  const geoPos = useMemo(() => computeCompanyGeoPositions(area.companies, area.hq), [area]);

  const focusRef = useRef<{ target: THREE.Vector3; cam: THREE.Vector3 } | null>(null);
  const settlingRef = useRef(false);

  const defaultView = useMemo(() => {
    if (mode === "supply") {
      return { target: new THREE.Vector3(0, 0, 0), cam: new THREE.Vector3(0, 4, 30) };
    }
    return { target: new THREE.Vector3(0, 0, 0), cam: new THREE.Vector3(0, 0, 30) };
  }, [mode]);

  useEffect(() => {
    if (!selectedId) {
      focusRef.current = { target: defaultView.target.clone(), cam: defaultView.cam.clone() };
      settlingRef.current = true;
      return;
    }
    if (mode === "supply") {
      const exact = companyHqVec3(selectedId, area.hq);
      const p = exact ?? geoPos[selectedId];
      if (p) {
        const tp = new THREE.Vector3(...p);
        const normal = tp.clone().normalize();
        const cam = tp.clone().addScaledVector(normal, 2.2).add(new THREE.Vector3(0, 0.3, 0));
        focusRef.current = { target: tp, cam };
        settlingRef.current = true;
      }
    } else {
      const p = catPos[selectedId];
      if (p) {
        const tp = new THREE.Vector3(...p);
        focusRef.current = { target: tp, cam: new THREE.Vector3(tp.x * 0.6, tp.y + 0.8, 11) };
        settlingRef.current = true;
      }
    }
  }, [selectedId, mode, catPos, geoPos, defaultView, area]);

  useEffect(() => {
    focusRef.current = { target: defaultView.target.clone(), cam: defaultView.cam.clone() };
    settlingRef.current = true;
  }, [mode, defaultView, area]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (settlingRef.current && focusRef.current) {
      const k = reducedMotion ? 1 : 1 - Math.exp(-6 * delta);
      controls.target.lerp(focusRef.current.target, k);
      camera.position.lerp(focusRef.current.cam, k);
      const done =
        camera.position.distanceTo(focusRef.current.cam) < 0.05 &&
        controls.target.distanceTo(focusRef.current.target) < 0.05;
      if (done || reducedMotion) {
        camera.position.copy(focusRef.current.cam);
        controls.target.copy(focusRef.current.target);
        settlingRef.current = false;
      }
    }
    controls.update();
  });

  return (
    <>
      <color attach="background" args={["#05070e"]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[8, 10, 12]} intensity={2.5} color="#fff6e8" />
      <directionalLight position={[-10, -2, 6]} intensity={0.5} color="#9bb8ff" />
      <directionalLight position={[0, 5, -14]} intensity={0.65} color="#bcd0ff" />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} position={[0, 4, 6]} scale={[12, 12, 1]} color="#ffffff" />
        <Lightformer intensity={1.2} position={[-7, 1, 3]} scale={[7, 7, 1]} color="#a8c0ff" />
        <Lightformer intensity={1.0} position={[7, -2, -4]} scale={[7, 7, 1]} color="#ffd9a8" />
        <Lightformer intensity={0.8} position={[0, -6, 2]} scale={[12, 4, 1]} color="#8090c0" />
      </Environment>

      {/* 배경: 공급망=지구 / 분류=카툰 배경 */}
      {mode === "supply" ? <VectorGlobe /> : <TaxonomyBackdrop backdrop={area.backdrop} />}

      {mode === "taxonomy" ? (
        area.categories.map((c) => (
          <CategoryNode
            key={c.id}
            category={c}
            position={catPos[c.id]}
            selected={selectedId === c.id}
            dimmed={selectedId !== null && selectedId !== c.id}
            reducedMotion={reducedMotion}
            onSelect={onSelect}
          />
        ))
      ) : (
        <CompanyGraph area={area} selected={selectedId} onSelect={onSelect} />
      )}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        screenSpacePanning
        panSpeed={0.9}
        enableZoom
        zoomSpeed={1.15}
        minDistance={0.02}
        maxDistance={90}
        mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
        onStart={() => {
          settlingRef.current = false;
        }}
      />
    </>
  );
}
