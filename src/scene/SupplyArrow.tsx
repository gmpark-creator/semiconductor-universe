import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  active?: boolean;
  speed?: number;
}

const PARTICLES = 5;

/** 지구 위 두 본사를 잇는 호(arc) + 흐르는 입자 + 화살촉.
 *  중점을 지구 중심(원점)에서 바깥으로 들어올려 지표 위로 아치를 그린다. */
export function SupplyArrow({ start, end, color, active = true, speed = 0.22 }: Props) {
  const curve = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const lift = s.distanceTo(e) * 0.38 + 0.6;
    const len = mid.length();
    if (len > 0.001) mid.setLength(len + lift); // 원점(지구 중심)에서 바깥으로
    else mid.y += lift;
    return new THREE.QuadraticBezierCurve3(s, mid, e);
  }, [start, end]);

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.03, 8, false), [curve]);

  const headPos = useMemo(() => curve.getPoint(0.96), [curve]);
  const headQuat = useMemo(() => {
    const tangent = curve.getTangent(0.96).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
  }, [curve]);

  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const mesh = particlesRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < PARTICLES; i++) {
      const offset = (t * speed + i / PARTICLES) % 1;
      dummy.position.copy(curve.getPoint(offset));
      const fade = 0.6 + 0.4 * Math.sin(offset * Math.PI);
      dummy.scale.setScalar((active ? 0.07 : 0.03) * fade);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh geometry={tubeGeo} renderOrder={1}>
        <meshBasicMaterial color={color} transparent opacity={active ? 0.42 : 0.12} depthWrite={false} />
      </mesh>
      <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLES]} renderOrder={1}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.95 : 0.25} depthWrite={false} />
      </instancedMesh>
      <mesh position={headPos} quaternion={headQuat} renderOrder={1}>
        <coneGeometry args={[0.1, 0.28, 12]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.9 : 0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}
