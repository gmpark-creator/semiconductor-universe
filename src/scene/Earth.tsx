import { useMemo } from "react";
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
  // 런타임 로드 텍스처 — vite base(상대경로)를 따르도록 BASE_URL 접두.
  // (서브패스 배포·iframe 임베드에서 절대경로 "/textures/..."가 깨지는 문제 방지)
  const B = import.meta.env.BASE_URL;
  // 색 공간/anisotropy는 onLoad 콜백에서 설정한다.
  // (useTexture 반환 텍스처를 렌더 중 직접 변형하면 react-hooks/immutability 위반 → 콜백 인자로 처리)
  // 8K day/night (solarsystemscope, CC-BY 4.0) — 확대 시 디테일.
  const [day, normal, clouds, lights] = useTexture(
    [
      `${B}textures/earth_day_8k.jpg`,
      `${B}textures/earth_normal_2048.jpg`,
      `${B}textures/earth_clouds_2k.jpg`,
      `${B}textures/earth_night_8k.jpg`,
    ],
    (loaded) => {
      const [d, n, c, l] = Array.isArray(loaded) ? loaded : [loaded];
      d.colorSpace = THREE.SRGBColorSpace; // 색상 맵 = sRGB
      c.colorSpace = THREE.SRGBColorSpace;
      l.colorSpace = THREE.SRGBColorSpace;
      n.colorSpace = THREE.NoColorSpace; // 노멀 = linear
      for (const t of [d, n, c, l]) t.anisotropy = 16; // 비스듬한 확대에서도 선명
    },
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#5aa9ff") },
      uIntensity: { value: 1.15 },
    }),
    [],
  );

  // 자전·기울기 없음(정적) — 본사 위경도 핀이 대륙 텍스처와 정확히 정합되도록.
  return (
    <group>
      {/* 지구 본체 */}
      <group>
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

      {/* 구름 */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.012, 64, 64]} />
        <meshStandardMaterial
          map={clouds}
          transparent
          opacity={0.18}
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
