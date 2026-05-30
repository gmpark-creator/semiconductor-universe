import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/** 칩 분류 모드 배경 — 자체 생성한 반도체 회로 카툰 이미지(public/textures/chip-bg.svg)를
 *  큰 안쪽 구면에 입혀 3D 카툰 환경을 만든다. 지구는 쓰지 않는다. */
export function TaxonomyBackdrop() {
  const B = import.meta.env.BASE_URL;
  const tex = useTexture(`${B}textures/chip-bg.svg`, (loaded) => {
    const t = Array.isArray(loaded) ? loaded[0] : loaded;
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.repeat.set(2, 1);
    t.anisotropy = 4;
  });

  return (
    <mesh renderOrder={-10}>
      <sphereGeometry args={[90, 48, 32]} />
      {/* 안쪽에서 보이도록 BackSide. 조명 무관 카툰 톤 → meshBasicMaterial. */}
      <meshBasicMaterial map={tex} side={THREE.BackSide} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}
