import { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CATEGORIES, type ChipCategory, type ChipFamily } from "../data/semiconductors";
import { CategoryNode } from "./CategoryNode";
import { CompanyGraph } from "./CompanyGraph";
import { computeCompanyGeoPositions } from "./companyLayout";
import { Earth } from "./Earth";
import { TaxonomyBackdrop } from "./TaxonomyBackdrop";

export type Mode = "taxonomy" | "supply";

const FAMILY_ORDER: ChipFamily[] = ["Logic", "Memory", "Analog", "Power", "Sensor", "RF", "Manufacturing"];

/** 칩 분류 — 패밀리별 행으로 가지런히 정렬한 정면 그리드(카툰 배경 앞). */
function computeCategoryGrid(): Record<string, [number, number, number]> {
  const byFam: Record<string, ChipCategory[]> = {};
  CATEGORIES.forEach((c) => (byFam[c.family] ||= []).push(c));
  const rowGap = 3.9;
  const colGap = 4.5;
  const rows = FAMILY_ORDER.length;
  const pos: Record<string, [number, number, number]> = {};
  FAMILY_ORDER.forEach((fam, ri) => {
    const list = byFam[fam] || [];
    const n = list.length;
    const y = ((rows - 1) / 2 - ri) * rowGap; // 위(Logic) → 아래(Manufacturing)
    list.forEach((c, ci) => {
      const x = (ci - (n - 1) / 2) * colGap;
      pos[c.id] = [x, y, 0];
    });
  });
  return pos;
}

interface Props {
  mode: Mode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  reducedMotion?: boolean;
}

export function Scene({ mode, selectedId, onSelect, reducedMotion = false }: Props) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const catPos = useMemo(() => computeCategoryGrid(), []);
  const geoPos = useMemo(() => computeCompanyGeoPositions(), []);

  // 카메라 트랜지션 목표. settling=true 동안만 lerp하고, 도착하면 해제해
  // 사용자가 휠/드래그로 자유롭게 조작하도록 한다(고정 방지).
  const focusRef = useRef<{ target: THREE.Vector3; cam: THREE.Vector3 } | null>(null);
  const settlingRef = useRef(false);

  const defaultView = useMemo(() => {
    if (mode === "supply") {
      return { target: new THREE.Vector3(0, 0, 0), cam: new THREE.Vector3(0, 4, 30) };
    }
    return { target: new THREE.Vector3(0, 0, 0), cam: new THREE.Vector3(0, 0, 30) };
  }, [mode]);

  // 선택 변경 → 포커스 타깃 설정
  useEffect(() => {
    if (!selectedId) {
      focusRef.current = { target: defaultView.target.clone(), cam: defaultView.cam.clone() };
      settlingRef.current = true;
      return;
    }
    if (mode === "supply") {
      const p = geoPos[selectedId];
      if (p) {
        const tp = new THREE.Vector3(...p);
        const normal = tp.clone().normalize();
        // 지구 본사 위치를 우주에서 바라보는 시점.
        const cam = tp.clone().addScaledVector(normal, 7).add(new THREE.Vector3(0, 1.6, 0));
        focusRef.current = { target: tp, cam };
        settlingRef.current = true;
      }
    } else {
      const p = catPos[selectedId];
      if (p) {
        const tp = new THREE.Vector3(...p);
        // 그리드는 z=0 평면 → 정면(+z)에서 노드로 다가간다.
        focusRef.current = { target: tp, cam: new THREE.Vector3(tp.x * 0.6, tp.y + 0.8, 11) };
        settlingRef.current = true;
      }
    }
  }, [selectedId, mode, catPos, geoPos, defaultView]);

  // mode 전환 시 카메라 리셋
  useEffect(() => {
    focusRef.current = { target: defaultView.target.clone(), cam: defaultView.cam.clone() };
    settlingRef.current = true;
  }, [mode, defaultView]);

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
      {/* 키/필/림 3점 조명 — PBR 칩 모델·지구가 입체로 읽히도록 */}
      <directionalLight position={[8, 10, 12]} intensity={2.5} color="#fff6e8" />
      <directionalLight position={[-10, -2, 6]} intensity={0.5} color="#9bb8ff" />
      <directionalLight position={[0, 5, -14]} intensity={0.65} color="#bcd0ff" />

      {/* 스튜디오 환경광(IBL) — 외부 파일 없이 금속(히트스프레더·핀·웨이퍼)이 반사돼 입체로 보이게 */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} position={[0, 4, 6]} scale={[12, 12, 1]} color="#ffffff" />
        <Lightformer intensity={1.2} position={[-7, 1, 3]} scale={[7, 7, 1]} color="#a8c0ff" />
        <Lightformer intensity={1.0} position={[7, -2, -4]} scale={[7, 7, 1]} color="#ffd9a8" />
        <Lightformer intensity={0.8} position={[0, -6, 2]} scale={[12, 4, 1]} color="#8090c0" />
      </Environment>

      {/* 배경: 공급망=지구 / 칩분류=카툰 회로 배경 */}
      {mode === "supply" ? <Earth /> : <TaxonomyBackdrop />}

      {mode === "taxonomy" ? (
        CATEGORIES.map((c) => (
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
        <CompanyGraph selected={selectedId} onSelect={onSelect} />
      )}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        enableZoom
        zoomSpeed={1.15}
        minDistance={3}
        maxDistance={90}
        // 사용자가 드래그/휠로 조작하면 즉시 트랜지션 중단 → 휠 줌이 항상 작동(고정 방지).
        onStart={() => {
          settlingRef.current = false;
        }}
      />
    </>
  );
}
