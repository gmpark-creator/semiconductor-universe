import { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { AtlasArea, Category } from "../data/types";
import { CategoryNode } from "./CategoryNode";
import { CompanyGraph } from "./CompanyGraph";
import { computeCompanyGeoPositions, companyHqVec3, latLonToVec3, PIN_RADIUS } from "./companyLayout";
import { VectorGlobe } from "./VectorGlobe";
import { KoreaCartoonMap } from "./KoreaCartoonMap";
import { TaxonomyBackdrop } from "./TaxonomyBackdrop";
import { ProcessFlow } from "./ProcessFlow";

export type Mode = "taxonomy" | "supply" | "process";

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

/** 공정 — 8단계를 뱀형(serpentine) 흐름으로 배치(상단 L→R, 하단 R→L). */
function computeProcessLayout(area: AtlasArea): Record<string, [number, number, number]> {
  const pos: Record<string, [number, number, number]> = {};
  const steps = area.process?.steps ?? [];
  const colGap = 5.2;
  const rowGap = 4.6;
  const perRow = 4;
  steps.forEach((s, i) => {
    const row = Math.floor(i / perRow); // 0 = 상단, 1 = 하단 …
    const col = i % perRow;
    const visualCol = row % 2 === 0 ? col : perRow - 1 - col; // 뱀형: 짝수행 L→R, 홀수행 R→L
    const x = (visualCol - (perRow - 1) / 2) * colGap;
    const y = (0.5 - row) * rowGap; // row0 → +rowGap/2, row1 → -rowGap/2
    pos[s.id] = [x, y, 0];
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
  const procPos = useMemo(() => computeProcessLayout(area), [area]);
  const geoPos = useMemo(
    () => computeCompanyGeoPositions(area.companies, area.hq, area.mapFocus ? 0.3 : 1),
    [area],
  );

  const focusRef = useRef<{ target: THREE.Vector3; cam: THREE.Vector3 } | null>(null);
  const settlingRef = useRef(false);

  // 한정 지도(예: 대한민국)일 때, 대상 국가가 화면을 채우도록 카메라 거리를 산정.
  const focusFraming = useMemo(() => {
    const f = area.mapFocus;
    if (!f) return null;
    const sp = new THREE.Vector3(...latLonToVec3(f.center[0], f.center[1], PIN_RADIUS));
    const normal = sp.clone().normalize();
    const fov = (camera instanceof THREE.PerspectiveCamera ? camera.fov : 50) * (Math.PI / 180);
    const arc = PIN_RADIUS * f.spanDeg * (Math.PI / 180);
    // 대상국이 화면 높이의 ≈82%를 채우도록(크게) 카메라 거리 산정.
    const camHeight = Math.max(0.45, arc / 0.82 / (2 * Math.tan(fov / 2)));
    const cam = sp.clone().addScaledVector(normal, camHeight);
    return { target: sp, cam, normal, camHeight };
  }, [area, camera]);

  // 선택 시 본사로 다가갈 거리 — 한정 지도는 도시·행정구가 보이도록 깊게(구글어스식 줌인), 전 지구본은 기존값.
  const selectZoom = area.mapFocus ? 0.05 : 2.2;
  const supplyMaxDist = area.mapFocus ? 3.5 : 90;

  const defaultView = useMemo(() => {
    if (mode === "supply") {
      if (focusFraming) return { target: focusFraming.target.clone(), cam: focusFraming.cam.clone() };
      return { target: new THREE.Vector3(0, 0, 0), cam: new THREE.Vector3(0, 4, 30) };
    }
    if (mode === "process") {
      // 8단계 2행 뱀형 흐름이 한눈에 들어오도록 약간 멀리서 정면.
      return { target: new THREE.Vector3(0, 0, 0), cam: new THREE.Vector3(0, 0, 36) };
    }
    return { target: new THREE.Vector3(0, 0, 0), cam: new THREE.Vector3(0, 0, 30) };
  }, [mode, focusFraming]);

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
        const sel = new THREE.Vector3(...p);
        if (area.mapFocus) {
          // 한정 지도(대한민국): 선택 기업 + 연결된 상대 기업들이 한 화면에 들어오도록 프레이밍.
          // → 박사 지시 "다른 업체들과의 화살표가 어디로 오가는지 보이게". (도시 딥줌은 휠로 수동 가능)
          const partnerIds = new Set<string>();
          for (const ed of area.edges) {
            if (ed.from === selectedId) partnerIds.add(ed.to);
            else if (ed.to === selectedId) partnerIds.add(ed.from);
          }
          const pts: THREE.Vector3[] = [sel];
          partnerIds.forEach((id) => {
            const pp = companyHqVec3(id, area.hq) ?? geoPos[id];
            if (pp) pts.push(new THREE.Vector3(...pp));
          });
          const centroid = new THREE.Vector3();
          pts.forEach((v) => centroid.add(v));
          centroid.multiplyScalar(1 / pts.length);
          const normal = centroid.clone().normalize();
          const center = normal.clone().multiplyScalar(PIN_RADIUS); // 구면 투영
          let maxR = 0.18;
          pts.forEach((v) => { maxR = Math.max(maxR, v.distanceTo(center)); });
          const fov = (camera instanceof THREE.PerspectiveCamera ? camera.fov : 50) * (Math.PI / 180);
          const wholeCountry = focusFraming ? focusFraming.camHeight : 0.72;
          // 연결 클러스터 지름이 화면의 ≈62%를 채우도록. 가까운 클러스터는 더 줌인, 전국 분산은 전국뷰까지.
          const camHeight = THREE.MathUtils.clamp(maxR / 0.62 / Math.tan(fov / 2), 0.5, wholeCountry * 1.12);
          const cam = center.clone().addScaledVector(normal, camHeight).add(new THREE.Vector3(0, camHeight * 0.14, 0));
          focusRef.current = { target: center, cam };
          settlingRef.current = true;
        } else {
          // 전 지구본(반도체): 기존 본사 지역 줌.
          const normal = sel.clone().normalize();
          const cam = sel.clone().addScaledVector(normal, selectZoom).add(new THREE.Vector3(0, selectZoom * 0.16, 0));
          focusRef.current = { target: sel, cam };
          settlingRef.current = true;
        }
      }
    } else {
      const p = mode === "process" ? procPos[selectedId] : catPos[selectedId];
      if (p) {
        const tp = new THREE.Vector3(...p);
        focusRef.current = { target: tp, cam: new THREE.Vector3(tp.x * 0.6, tp.y + 0.8, 11) };
        settlingRef.current = true;
      }
    }
  }, [selectedId, mode, catPos, procPos, geoPos, defaultView, area, selectZoom, camera, focusFraming]);

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

      {/* 배경: 공급망 — 전력=카툰 대한민국 지도(react-spring) / 그 외=벡터 지구본 · 분류=카툰 배경 */}
      {mode === "supply"
        ? area.mapFocus
          ? <KoreaCartoonMap focus={area.mapFocus} />
          : <VectorGlobe />
        : <TaxonomyBackdrop backdrop={area.backdrop} />}

      {mode === "taxonomy" &&
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
        ))}

      {mode === "supply" && <CompanyGraph area={area} selected={selectedId} onSelect={onSelect} />}

      {mode === "process" && area.process && (
        <ProcessFlow steps={area.process.steps} positions={procPos} selected={selectedId} onSelect={onSelect} />
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
        zoomSpeed={1.5}
        minDistance={0.004}
        maxDistance={mode === "supply" ? supplyMaxDist : 90}
        mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
        onStart={() => {
          settlingRef.current = false;
        }}
      />
    </>
  );
}
