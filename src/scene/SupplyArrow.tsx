import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

/** 두 본사를 잇는 정적 아치 + 화살촉. (움직이는 입자 없음 — 깔끔·직관적) */
export function SupplyArrow({ start, end, color }: Props) {
  const { tubeGeo, headPos, headQuat } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const lift = s.distanceTo(e) * 0.34 + 0.5;
    const len = mid.length();
    if (len > 0.001) mid.setLength(len + lift);
    else mid.y += lift;
    const curve = new THREE.QuadraticBezierCurve3(s, mid, e);
    const tube = new THREE.TubeGeometry(curve, 44, 0.016, 8, false);
    const hp = curve.getPoint(0.92);
    const tangent = curve.getTangent(0.92).normalize();
    const hq = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    return { tubeGeo: tube, headPos: hp, headQuat: hq };
  }, [start, end]);

  return (
    <group>
      <mesh geometry={tubeGeo} renderOrder={1}>
        <meshBasicMaterial color={color} transparent opacity={0.55} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={headPos} quaternion={headQuat} renderOrder={2}>
        <coneGeometry args={[0.06, 0.17, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.92} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
