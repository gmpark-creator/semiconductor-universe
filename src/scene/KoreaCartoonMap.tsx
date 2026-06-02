import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { useSpring, animated, config } from "@react-spring/three";
import * as THREE from "three";
import earcut from "earcut";
import type { MapFocus } from "../data/types";
import { GLOBE_RADIUS, latLonToVec3 } from "./companyLayout";

/**
 * 카툰 대한민국 지도 — 세계지도(지구본·바다) 없이 한반도만.
 *
 * 미사용 기술 **react-spring(@react-spring/three)** 을 메인으로: 17개 광역시도가 자기 중심에서
 * 아래→위로 통통 튀어 오르며(스프링·스태거) 지도가 조립되듯 등장한다.
 *
 * 구글어스식 LOD(카메라 거리별 상세화):
 *   멀리 = 시도(컬러)  →  줌인 = 시군구(시·군·구) 경계 페이드인까지. (읍면동 LOD는 미사용)
 * 기업을 클릭하면(Scene) 카메라가 본사 도시까지 깊게 날아들어가 어느 시·군·구에 있는지 보인다.
 * 좌표는 latLonToVec3(반경 GLOBE_RADIUS)로 — 기업 본사 핀과 같은 좌표계라 정합.
 */

const R = GLOBE_RADIUS;
const FONT = import.meta.env.BASE_URL + "fonts/inter-600.woff";

/** 시도별 카툰 파스텔 팔레트(인덱스 순환). */
const PALETTE = [
  "#79c7d6", "#f4a3b0", "#9ad79c", "#f6c46a", "#b6a4e6", "#f29b7c", "#7fd0bd", "#ef9ec9",
  "#94bdee", "#cdd96a", "#f0b063", "#83cabf", "#dd9aa0", "#a7d2a0", "#c2a3e0", "#f3bf9a", "#9bd2e2",
];

type Pt = number[]; // [lon, lat]
interface GeoFeature {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: unknown };
}
interface GeoJson { features: GeoFeature[] }

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function polysOf(geom: { type: string; coordinates: unknown }): Pt[][][] {
  if (geom.type === "Polygon") return [geom.coordinates as Pt[][]];
  if (geom.type === "MultiPolygon") return geom.coordinates as Pt[][][];
  return [];
}

/** 가장 큰 외곽 링의 평균으로 중심(lon,lat) 추정. */
function centroidLonLat(geom: { type: string; coordinates: unknown }): [number, number] {
  let best: Pt[] | null = null;
  for (const poly of polysOf(geom)) {
    const ring = poly[0];
    if (ring && (!best || ring.length > best.length)) best = ring;
  }
  if (!best) return [127.8, 36];
  let lon = 0, lat = 0;
  for (const p of best) { lon += p[0]; lat += p[1]; }
  return [lon / best.length, lat / best.length];
}

/** 긴 변은 구면에 밀착하도록 분할하며, 중심(centroid) 기준 상대좌표로 정점 push. */
function pushTriRel(pos: number[], a: Pt, b: Pt, c: Pt, center: THREE.Vector3) {
  const d = (p: Pt, q: Pt) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  if (Math.max(d(a, b), d(b, c), d(c, a)) > 1) {
    const m = (p: Pt, q: Pt): Pt => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const ab = m(a, b), bc = m(b, c), ca = m(c, a);
    pushTriRel(pos, a, ab, ca, center);
    pushTriRel(pos, ab, b, bc, center);
    pushTriRel(pos, ca, bc, c, center);
    pushTriRel(pos, ab, bc, ca, center);
    return;
  }
  for (const p of [a, b, c]) {
    const v = latLonToVec3(p[1], p[0], R);
    pos.push(v[0] - center.x, v[1] - center.y, v[2] - center.z);
  }
}

function buildFill(geom: { type: string; coordinates: unknown }, center: THREE.Vector3): THREE.BufferGeometry {
  const pos: number[] = [];
  for (const poly of polysOf(geom)) {
    const flat: number[] = [];
    const holes: number[] = [];
    poly.forEach((ring, ri) => {
      if (ri > 0) holes.push(flat.length / 2);
      for (const pt of ring) flat.push(pt[0], pt[1]);
    });
    const tri = earcut(flat, holes, 2);
    for (let i = 0; i < tri.length; i += 3) {
      const a: Pt = [flat[tri[i] * 2], flat[tri[i] * 2 + 1]];
      const b: Pt = [flat[tri[i + 1] * 2], flat[tri[i + 1] * 2 + 1]];
      const cc: Pt = [flat[tri[i + 2] * 2], flat[tri[i + 2] * 2 + 1]];
      pushTriRel(pos, a, b, cc, center);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return geo;
}

/** 시도 외곽·내경계 라인(중심 기준 상대좌표). */
function buildOutline(geom: { type: string; coordinates: unknown }, center: THREE.Vector3): THREE.BufferGeometry {
  const pos: number[] = [];
  const seg = (a: Pt, b: Pt) => {
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.8));
    let prev = latLonToVec3(a[1], a[0], R * 1.0012);
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      const cur = latLonToVec3(a[1] + (b[1] - a[1]) * t, a[0] + (b[0] - a[0]) * t, R * 1.0012);
      pos.push(prev[0] - center.x, prev[1] - center.y, prev[2] - center.z, cur[0] - center.x, cur[1] - center.y, cur[2] - center.z);
      prev = cur;
    }
  };
  for (const poly of polysOf(geom)) for (const ring of poly) for (let i = 1; i < ring.length; i++) seg(ring[i - 1], ring[i]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return geo;
}

/** 여러 피처의 경계선을 하나의 절대좌표 라인 지오메트리로 병합(단일 draw call) — 시군구 LOD용. */
function buildMergedBorders(features: GeoFeature[], radius: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const seg = (a: Pt, b: Pt) => {
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.5));
    let prev = latLonToVec3(a[1], a[0], radius);
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      const cur = latLonToVec3(a[1] + (b[1] - a[1]) * t, a[0] + (b[0] - a[0]) * t, radius);
      pos.push(prev[0], prev[1], prev[2], cur[0], cur[1], cur[2]);
      prev = cur;
    }
  };
  for (const f of features) for (const poly of polysOf(f.geometry)) for (const ring of poly) for (let i = 1; i < ring.length; i++) seg(ring[i - 1], ring[i]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return geo;
}

interface ProvinceData {
  fill: THREE.BufferGeometry;
  outline: THREE.BufferGeometry;
  center: [number, number, number];
  normal: [number, number, number];
  color: string;
}

/** 한 시도 — react-spring으로 자기 중심에서 솟아오르며 통통 등장(스태거 delay). */
function Province({ p, index }: { p: ProvinceData; index: number }) {
  const spring = useSpring({
    from: { s: 0.12, lift: -0.45, op: 0 },
    to: { s: 1, lift: 0, op: 1 },
    delay: 120 + index * 55,
    config: config.wobbly,
  });
  const [nx, ny, nz] = p.normal;
  const [cx, cy, cz] = p.center;
  const posAnim = spring.lift.to((l) => [cx + nx * l, cy + ny * l, cz + nz * l] as [number, number, number]);

  return (
    <animated.group position={posAnim} scale={spring.s}>
      <mesh geometry={p.fill} renderOrder={0}>
        <animated.meshBasicMaterial color={p.color} side={THREE.DoubleSide} transparent opacity={spring.op} />
      </mesh>
      <lineSegments geometry={p.outline} renderOrder={1}>
        <animated.lineBasicMaterial color="#0c241a" transparent opacity={spring.op.to((o) => o * 0.85)} depthWrite={false} />
      </lineSegments>
    </animated.group>
  );
}

interface LabelData { pos: [number, number, number]; nrm: [number, number, number]; name: string }

export function KoreaCartoonMap({ focus }: { focus: MapFocus }) {
  const B = import.meta.env.BASE_URL;
  const [prov, setProv] = useState<GeoJson | null>(null);
  const [muni, setMuni] = useState<GeoJson | null>(null);

  const muniMat = useRef<THREE.LineBasicMaterial>(null);
  const muniLabelGroup = useRef<THREE.Group>(null);
  const cityGroup = useRef<THREE.Group>(null);

  // 시도·시군구(행정구)만 로드. 읍면동(행정동)은 표시하지 않음(구 단위까지).
  useEffect(() => {
    let alive = true;
    const get = (f: string) => fetch(`${B}geo/${f}`).then((r) => r.json() as Promise<GeoJson>).catch(() => ({ features: [] }) as GeoJson);
    get("kr-provinces.geojson").then((g) => { if (alive) setProv(g); });
    get("kr-municipalities.geojson").then((g) => { if (alive) setMuni(g); });
    return () => { alive = false; };
  }, [B]);

  const provinces = useMemo<ProvinceData[]>(() => {
    if (!prov) return [];
    return prov.features.map((f, i) => {
      const [lon, lat] = centroidLonLat(f.geometry);
      const cv = new THREE.Vector3(...latLonToVec3(lat, lon, R));
      const nrm = cv.clone().normalize();
      return {
        fill: buildFill(f.geometry, cv),
        outline: buildOutline(f.geometry, cv),
        center: [cv.x, cv.y, cv.z],
        normal: [nrm.x, nrm.y, nrm.z],
        color: PALETTE[i % PALETTE.length],
      };
    });
  }, [prov]);

  const muniGeo = useMemo(() => (muni ? buildMergedBorders(muni.features, R * 1.0016) : null), [muni]);

  const muniLabels = useMemo<LabelData[]>(() => {
    if (!muni) return [];
    return muni.features.map((f) => {
      const [lon, lat] = centroidLonLat(f.geometry);
      const v = latLonToVec3(lat, lon, R * 1.003);
      const n = new THREE.Vector3(...v).normalize();
      return { pos: v, nrm: [n.x, n.y, n.z], name: (f.properties.name_eng as string) || "" };
    });
  }, [muni]);

  const _cdir = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const r = camera.position.length();
    // LOD 페이드: 멀면 0, 가까우면 1 — 시군구(행정구)까지만.
    const mO = clamp01((5.72 - r) / (5.72 - 5.46));
    if (muniMat.current) muniMat.current.opacity = mO * 0.6;

    _cdir.copy(camera.position).normalize();
    // 시군구 라벨: 줌인했고(LOD) 화면 중앙 근처(좁은 콘)인 것만 표시.
    const g = muniLabelGroup.current;
    if (g) {
      const show = mO > 0.65;
      const ch = g.children;
      for (let i = 0; i < ch.length; i++) {
        const child = ch[i];
        child.quaternion.copy(camera.quaternion);
        const n = muniLabels[i]?.nrm;
        const dot = n ? n[0] * _cdir.x + n[1] * _cdir.y + n[2] * _cdir.z : -1;
        const vis = show && dot > 0.99986; // 화면 중앙 ~1° 콘만 → 과밀 방지
        child.visible = vis;
        // 줌과 무관하게 화면상 일정 크기(구글어스 라벨처럼) — 거리에 비례 스케일.
        if (vis) child.scale.setScalar(camera.position.distanceTo(child.position) * 1.5);
      }
    }
    // 주요 도시 라벨: 개요(멀 때)만 — 줌인하면 시군구 라벨에 양보.
    if (cityGroup.current) cityGroup.current.visible = mO < 0.35;
  });

  if (!provinces.length) return null;

  return (
    <group>
      {provinces.map((p, i) => (
        <Province key={i} p={p} index={i} />
      ))}

      {/* 시군구(행정구) 경계 — 줌인 시 페이드인 (구 단위까지) */}
      {muniGeo && (
        <lineSegments geometry={muniGeo} renderOrder={2}>
          <lineBasicMaterial ref={muniMat} color="#143226" transparent opacity={0} depthWrite={false} />
        </lineSegments>
      )}

      {/* 시군구 영문 라벨(근접·LOD 컬링) */}
      <group ref={muniLabelGroup}>
        {muniLabels.map((l, i) => (
          <Text
            key={i}
            position={l.pos}
            font={FONT}
            fontSize={0.0075}
            letterSpacing={-0.01}
            color="#10301f"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.0009}
            outlineColor="#eafff2"
            visible={false}
          >
            {l.name}
          </Text>
        ))}
      </group>

      {/* 주요 도시 참조 라벨(소형, 개요 전용) */}
      <group ref={cityGroup}>
        {focus.cities.map((c) => {
          const v = latLonToVec3(c.lat, c.lon, R * 1.004);
          return (
            <group key={c.name} position={v}>
              <mesh>
                <sphereGeometry args={[0.006, 8, 8]} />
                <meshBasicMaterial color="#1a2e22" toneMapped={false} />
              </mesh>
              <Billboard>
                <Text
                  position={[0, 0.02, 0]}
                  font={FONT}
                  fontSize={0.019}
                  letterSpacing={-0.01}
                  color="#15321f"
                  fillOpacity={0.8}
                  anchorX="center"
                  anchorY="bottom"
                  outlineWidth={0.0014}
                  outlineColor="#eafff2"
                >
                  {c.name}
                </Text>
              </Billboard>
            </group>
          );
        })}
      </group>
    </group>
  );
}
