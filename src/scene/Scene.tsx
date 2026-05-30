import { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CATEGORIES, type ChipFamily } from "../data/semiconductors";
import { CategoryNode } from "./CategoryNode";
import { CompanyGraph } from "./CompanyGraph";
import { computeCompanyPositions } from "./companyLayout";
import { Earth } from "./Earth";

export type Mode = "taxonomy" | "supply";

/** 카테고리를 패밀리별 별자리 클러스터로 지구 주위에 배치.
 *  패밀리별 노드 수에 비례해 클러스터 반경을 키워 과밀(Logic 4개)에서도 겹치지 않게 한다. */
function computeCategoryPositions(): Record<string, [number, number, number]> {
  const families = [...new Set(CATEGORIES.map((c) => c.family))] as ChipFamily[];
  const famCenter: Record<string, [number, number, number]> = {};
  // 첫 패밀리를 카메라 시선축(+z 정면)에서 비켜 시작하도록 위상 오프셋(occlusion 방지).
  const phase = Math.PI * 0.5;
  families.forEach((f, i) => {
    const angle = phase + (i / families.length) * Math.PI * 2;
    const R = 13;
    famCenter[f] = [Math.cos(angle) * R, Math.sin(angle * 1.6) * 3.5, Math.sin(angle) * R];
  });

  const byFam: Record<string, typeof CATEGORIES> = {};
  CATEGORIES.forEach((c) => (byFam[c.family] ||= []).push(c));

  const pos: Record<string, [number, number, number]> = {};
  Object.entries(byFam).forEach(([fam, list]) => {
    const c0 = famCenter[fam];
    const n = list.length;
    // 노드가 많은 패밀리일수록 서브-궤도 반경을 키워 라벨/노드 겹침 방지.
    const r = n <= 1 ? 0 : 2.6 + n * 0.5;
    list.forEach((c, i) => {
      if (n === 1) {
        pos[c.id] = [c0[0], c0[1], c0[2]];
      } else {
        const a = (i / n) * Math.PI * 2;
        pos[c.id] = [c0[0] + Math.cos(a) * r, c0[1] + Math.sin(a) * r * 0.62, c0[2] + Math.sin(a * 1.7) * 2.0];
      }
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

  const catPos = useMemo(() => computeCategoryPositions(), []);
  const compPos = useMemo(() => computeCompanyPositions(), []);

  // 카메라 트랜지션 목표. settling=true 동안만 lerp하고, 도착하면 해제해
  // OrbitControls의 autoRotate가 다시 카메라를 돌릴 수 있게 한다(핵심 버그 수정).
  const focusRef = useRef<{ target: THREE.Vector3; cam: THREE.Vector3 } | null>(null);
  const settlingRef = useRef(false);

  const defaultView = useMemo(
    () => ({
      // 시선축을 살짝 측면·상방으로 틀어 정면 클러스터가 지구를 가리지 않게.
      target: new THREE.Vector3(0, 0, 0),
      cam: new THREE.Vector3(6, 8, mode === "supply" ? 42 : 36),
    }),
    [mode],
  );

  // 선택 변경 → 포커스 타깃 설정
  useEffect(() => {
    if (!selectedId) {
      focusRef.current = { target: defaultView.target.clone(), cam: defaultView.cam.clone() };
      settlingRef.current = true;
      return;
    }
    const p = mode === "taxonomy" ? catPos[selectedId] : compPos[selectedId];
    if (p) {
      const tp = new THREE.Vector3(...p);
      const dir = tp.clone().setY(0).normalize();
      focusRef.current = {
        target: tp,
        cam: tp.clone().add(new THREE.Vector3(dir.x * 7 + 2, 3.5, dir.z * 7 + 9)),
      };
      settlingRef.current = true;
    }
  }, [selectedId, mode, catPos, compPos, defaultView]);

  // mode 전환 시 카메라 리셋
  useEffect(() => {
    focusRef.current = { target: defaultView.target.clone(), cam: defaultView.cam.clone() };
    settlingRef.current = true;
  }, [mode, defaultView]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    // settling 중에만 카메라를 목표로 감쇠 이동. 도착하면 멈춰 autoRotate에 제어를 넘긴다.
    if (settlingRef.current && focusRef.current) {
      // 프레임레이트 독립 감쇠 계수.
      const k = reducedMotion ? 1 : 1 - Math.exp(-7 * delta);
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

  // 미선택 + 트랜지션 종료 시에만 자동회전(둘 다일 때만 OrbitControls가 카메라를 돈다).
  const autoRotate = !reducedMotion && !selectedId;

  return (
    <>
      <color attach="background" args={["#04060c"]} />
      <ambientLight intensity={0.5} />
      {/* 태양광 (지구 명암 경계) */}
      <directionalLight position={[14, 8, 10]} intensity={1.8} color="#fff4e2" />
      {/* 차가운 보조광 */}
      <directionalLight position={[-12, -4, -8]} intensity={0.35} color="#88aaff" />

      {/* 지구 배경 */}
      <Earth />

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
        autoRotate={autoRotate}
        autoRotateSpeed={0.4}
        minDistance={8}
        maxDistance={80}
        // 사용자가 직접 조작하면 트랜지션 중단(카메라 다툼 방지).
        onStart={() => {
          settlingRef.current = false;
        }}
      />

      {/* Bloom: 임계값을 올려 로고·텍스트 번짐을 막고 발광 노드만 은은하게. */}
      <EffectComposer>
        <Bloom intensity={0.55} luminanceThreshold={0.7} luminanceSmoothing={0.25} mipmapBlur radius={0.7} />
      </EffectComposer>
    </>
  );
}
