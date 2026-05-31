import { useMemo } from "react";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { PIN_RADIUS } from "./companyLayout";

const FONT = import.meta.env.BASE_URL + "fonts/inter-600.woff";

interface Props {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  /** 연계 기업명(이 화살표가 누구와의 관계인지). */
  label?: string;
  /** 라벨 위치(곡선상 0~1, 선택 회사 쪽). */
  labelT?: number;
}

/**
 * 두 본사를 잇는 공급망 화살표 — 지표에 밀착하는 대권(great-circle) 곡선 + 도착지 화살촉.
 * 큰 포물선 대신 지구 표면을 따라 흐르는 항로 같은 선으로 그려 방향이 또렷하고 세련되게.
 */
export function SupplyArrow({ start, end, color, label, labelT = 0.22 }: Props) {
  const { tubeGeo, headPos, headQuat, headRad, headLen, curve, fontSize } = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const na = a.clone().normalize();
    const nb = b.clone().normalize();
    let ang = na.angleTo(nb);
    if (!Number.isFinite(ang)) ang = 0;
    const arcLen = ang * PIN_RADIUS; // 대권 호의 실제 표면 길이 — 모든 크기를 여기에 비례시킨다.
    // 짧은 호(한국 내 도시 간)는 화살촉·선·라벨이 작게, 긴 호(대륙 간)는 적당히 크게.
    const headLen = THREE.MathUtils.clamp(arcLen * 0.2, 0.028, 0.3);
    const headRad = headLen * 0.42;
    const tubeRad = THREE.MathUtils.clamp(arcLen * 0.02, 0.006, 0.045);
    const fontSize = THREE.MathUtils.clamp(arcLen * 0.16, 0.04, 0.1);
    const lift = Math.min(0.9, 0.035 + arcLen * 0.16); // 호 최고 높이(짧으면 지표 밀착)
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
    const tube = new THREE.TubeGeometry(curve, 64, tubeRad, 8, false);
    // 화살촉 '끝'이 도착지 핀에 닿도록 머리 중심을 머리 길이의 절반만큼 안쪽에 둔다.
    const headT = THREE.MathUtils.clamp(1 - headLen / (2 * Math.max(arcLen, 1e-3)), 0.5, 0.99);
    const hp = curve.getPoint(headT);
    const tan = curve.getTangent(headT).normalize();
    const hq = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
    return { tubeGeo: tube, headPos: hp, headQuat: hq, headRad, headLen, curve, fontSize };
  }, [start, end]);

  const labelPos = label ? curve.getPoint(labelT) : null;

  return (
    <group>
      <mesh geometry={tubeGeo} renderOrder={1}>
        <meshBasicMaterial color={color} transparent opacity={0.62} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* 도착지 화살촉 — 방향 표시(호 길이에 비례) */}
      <mesh position={headPos} quaternion={headQuat} renderOrder={2}>
        <coneGeometry args={[headRad, headLen, 18]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* 연계 기업명 라벨 (어느 기업과의 관계인지) */}
      {label && labelPos && (
        <Billboard position={labelPos}>
          <Text
            font={FONT}
            fontSize={fontSize}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={fontSize * 0.16}
            outlineColor="#04060c"
          >
            {label}
          </Text>
        </Billboard>
      )}
    </group>
  );
}
