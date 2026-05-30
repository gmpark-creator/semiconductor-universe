import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { GLOBE_RADIUS, latLonToVec3 } from "./companyLayout";

/** 지도 라벨 — 멀리선 국가명, 가까이 가면 주/도 + 도시명. (영문 표기) */

const R = GLOBE_RADIUS;
const OUTLINE = "#05070e";

type Pt = number[];
interface GeoFeature {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: unknown };
}
interface GeoJson {
  features: GeoFeature[];
}

function polysOf(geom: { type: string; coordinates: unknown }): Pt[][][] {
  if (geom.type === "Polygon") return [geom.coordinates as Pt[][]];
  if (geom.type === "MultiPolygon") return geom.coordinates as Pt[][][];
  return [];
}

/** 가장 큰 링(점 개수 기준) 평균으로 라벨 위치 추정. */
function centroid(geom: { type: string; coordinates: unknown }): [number, number] | null {
  let best: Pt[] | null = null;
  for (const poly of polysOf(geom)) {
    const ring = poly[0];
    if (ring && (!best || ring.length > best.length)) best = ring;
  }
  if (!best) return null;
  let lon = 0, lat = 0;
  for (const p of best) {
    lon += p[0];
    lat += p[1];
  }
  return [lon / best.length, lat / best.length];
}

interface Label {
  pos: [number, number, number];
  text: string;
  city?: boolean;
}

const _v = new THREE.Vector3();
const _c = new THREE.Vector3();

export function MapLabels({ countries, states, cities }: { countries: GeoJson; states: GeoJson; cities: GeoJson }) {
  const groupRef = useRef<THREE.Group>(null);
  const detailRef = useRef(false);
  const [detail, setDetail] = useState(false);

  const countryLabels = useMemo<Label[]>(() => {
    const out: Label[] = [];
    for (const f of countries.features) {
      const c = centroid(f.geometry);
      const name = (f.properties.NAME as string) || (f.properties.ADMIN as string);
      if (c && name) out.push({ pos: latLonToVec3(c[1], c[0], R * 1.012), text: name });
    }
    return out;
  }, [countries]);

  const stateLabels = useMemo<Label[]>(() => {
    const out: Label[] = [];
    for (const f of states.features) {
      const c = centroid(f.geometry);
      const name = (f.properties.name as string) || (f.properties.gn_name as string);
      if (c && name) out.push({ pos: latLonToVec3(c[1], c[0], R * 1.006), text: name });
    }
    return out;
  }, [states]);

  const cityLabels = useMemo<Label[]>(() => {
    const out: Label[] = [];
    for (const f of cities.features) {
      const rank = (f.properties.scalerank as number) ?? 10;
      if (rank > 6) continue; // 주요 도시만
      const g = f.geometry as { type: string; coordinates: Pt };
      if (g.type !== "Point") continue;
      const name = f.properties.name as string;
      if (name) out.push({ pos: latLonToVec3(g.coordinates[1], g.coordinates[0], R * 1.006), text: name, city: true });
    }
    return out;
  }, [cities]);

  useFrame(({ camera }) => {
    const g = groupRef.current;
    if (g) {
      _c.copy(camera.position).normalize();
      const minDot = detailRef.current ? 0.8 : 0.06;
      for (const child of g.children) {
        child.quaternion.copy(camera.quaternion);
        _v.copy(child.position).normalize();
        child.visible = _v.dot(_c) > minDot;
      }
    }
    const dist = camera.position.length();
    if (!detailRef.current && dist < 7.5) {
      detailRef.current = true;
      setDetail(true);
    } else if (detailRef.current && dist > 9) {
      detailRef.current = false;
      setDetail(false);
    }
  });

  return (
    <group ref={groupRef}>
      {!detail &&
        countryLabels.map((l, i) => (
          <Text
            key={`c${i}`}
            position={l.pos}
            fontSize={0.5}
            color="#eaf1ff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor={OUTLINE}
          >
            {l.text}
          </Text>
        ))}
      {detail &&
        stateLabels.map((l, i) => (
          <Text
            key={`s${i}`}
            position={l.pos}
            fontSize={0.06}
            color="#cfe0ff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.008}
            outlineColor={OUTLINE}
          >
            {l.text}
          </Text>
        ))}
      {detail &&
        cityLabels.map((l, i) => (
          <group key={`t${i}`} position={l.pos}>
            <mesh>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#ffd27f" toneMapped={false} />
            </mesh>
            <Text
              position={[0, 0.05, 0]}
              fontSize={0.05}
              color="#ffe9c2"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.007}
              outlineColor={OUTLINE}
            >
              {l.text}
            </Text>
          </group>
        ))}
    </group>
  );
}
