import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/** 지구 반경 — 노드 궤도(반경 ≈ 12~14)보다 충분히 안쪽. */
export const EARTH_RADIUS = 5;

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vEye;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vEye = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vEye;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float rim = pow(1.0 - abs(dot(vNormal, vEye)), 2.6);
    gl_FragColor = vec4(uColor, clamp(rim, 0.0, 1.0) * uIntensity);
  }
`;

export function Earth() {
  const spinRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  const [day, normal, clouds, lights] = useTexture([
    "/textures/earth_atmos_2048.jpg",
    "/textures/earth_normal_2048.jpg",
    "/textures/earth_clouds_1024.png",
    "/textures/earth_lights_2048.png",
  ]);

  // 색 공간 설정 (색상 맵 = sRGB, 노멀 = linear).
  day.colorSpace = THREE.SRGBColorSpace;
  lights.colorSpace = THREE.SRGBColorSpace;
  clouds.colorSpace = THREE.SRGBColorSpace;
  normal.colorSpace = THREE.NoColorSpace;
  [day, normal, clouds, lights].forEach((t) => (t.anisotropy = 8));

  const atmosphereUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#5aa9ff") },
      uIntensity: { value: 1.15 },
    }),
    [],
  );

  useFrame((_, dt) => {
    if (spinRef.current) spinRef.current.rotation.y += dt * 0.018;
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.024;
  });

  return (
    <group rotation={[0, 0, 0.41]}>
      {/* 지구 본체 (자전) */}
      <group ref={spinRef}>
        <mesh>
          <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
          <meshStandardMaterial
            map={day}
            normalMap={normal}
            normalScale={new THREE.Vector2(0.85, 0.85)}
            emissiveMap={lights}
            emissive={new THREE.Color("#ffca73")}
            emissiveIntensity={0.55}
            metalness={0.08}
            roughness={0.88}
          />
        </mesh>
      </group>

      {/* 구름 (약간 더 빠른 자전) */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[EARTH_RADIUS * 1.012, 64, 64]} />
        <meshStandardMaterial
          map={clouds}
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* 대기 글로우 (프레넬, 가산 블렌딩) */}
      <mesh scale={1.16}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={atmosphereUniforms}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
