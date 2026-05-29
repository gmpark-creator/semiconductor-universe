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

const PARTICLES = 6;

/** 두 노드를 잇는 곡선 튜브 + 흐르는 입자 + 화살촉. */
export function SupplyArrow({ start, end, color, active = true, speed = 0.25 }: Props) {
  const curve = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const len = e.clone().sub(s).length();
    mid.y += len * 0.16 + 0.6; // 위로 살짝 휘게
    return new THREE.QuadraticBezierCurve3(s, mid, e);
  }, [start, end]);

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.035, 8, false), [curve]);

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
      dummy.scale.setScalar((active ? 0.08 : 0.03) * fade);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial color={color} transparent opacity={active ? 0.32 : 0.1} depthWrite={false} />
      </mesh>
      <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLES]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.95 : 0.25} depthWrite={false} toneMapped={false} />
      </instancedMesh>
      <mesh position={headPos} quaternion={headQuat}>
        <coneGeometry args={[0.11, 0.3, 12]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.9 : 0.2} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
