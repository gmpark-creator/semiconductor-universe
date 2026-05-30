import { useMemo } from "react";
import * as THREE from "three";
import { PIN_RADIUS } from "./companyLayout";

interface Props {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

/**
 * 두 본사를 잇는 공급망 화살표 — 지표에 밀착하는 대권(great-circle) 곡선 + 도착지 화살촉.
 * 큰 포물선 대신 지구 표면을 따라 흐르는 항로 같은 선으로 그려 방향이 또렷하고 세련되게.
 */
export function SupplyArrow({ start, end, color }: Props) {
  const { tubeGeo, headPos, headQuat } = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const na = a.clone().normalize();
    const nb = b.clone().normalize();
    let ang = na.angleTo(nb);
    if (!Number.isFinite(ang)) ang = 0;
    const lift = Math.min(0.95, 0.06 + ang * 0.26); // 호 최고 높이(작게 → 지표 밀착)
    const N = 56;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      let dir: THREE.Vector3;
      if (ang < 1e-4) {
        dir = na.clone();
      } else {
        const s1 = Math.sin((1 - t) * ang) / Math.sin(ang);
        const s2 = Math.sin(t * ang) / Math.sin(ang);
        dir = na.clone().multiplyScalar(s1).add(nb.clone().multiplyScalar(s2)).normalize();
      }
      pts.push(dir.multiplyScalar(PIN_RADIUS + lift * Math.sin(t * Math.PI)));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.TubeGeometry(curve, 64, 0.013, 8, false);
    const hp = curve.getPoint(0.985);
    const tan = curve.getTangent(0.985).normalize();
    const hq = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
    return { tubeGeo: tube, headPos: hp, headQuat: hq };
  }, [start, end]);

  return (
    <group>
      <mesh geometry={tubeGeo} renderOrder={1}>
        <meshBasicMaterial color={color} transparent opacity={0.62} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* 도착지 화살촉 — 방향 표시 */}
      <mesh position={headPos} quaternion={headQuat} renderOrder={2}>
        <coneGeometry args={[0.05, 0.15, 18]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
