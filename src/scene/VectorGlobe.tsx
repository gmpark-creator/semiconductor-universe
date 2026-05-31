import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import earcut from "earcut";
import { GLOBE_RADIUS, latLonToVec3 } from "./companyLayout";
import { MapLabels } from "./MapLabels";

/**
 * 벡터 지도 지구본 — 나라 폴리곤을 단색(카툰)으로 채우고 국경·행정경계·격자선을 라인으로 그린다.
 * 래스터 텍스처와 달리 벡터라 아무리 확대해도 선명. (전 지구본 — 반도체 글로벌 공급망용.
 *  대한민국 한정 공급망은 KoreaCartoonMap이 담당한다.)
 */

const R = GLOBE_RADIUS;

/** 카툰 정치지도용 파스텔 팔레트 (나라별 순환). */
const PALETTE = ["#3f7a5d", "#3d6aa0", "#7a5ea8", "#b07a45", "#4f8c8c", "#9a5e84", "#5f7e3c", "#a8884a", "#5a6fae", "#4a9a78"];

type Pt = number[]; // [lon, lat]
type Ring = Pt[];
type Poly = Ring[];

interface GeoFeature {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: unknown };
}
interface GeoJson {
  features: GeoFeature[];
}

/** Polygon/MultiPolygon → 폴리곤 배열로 정규화. */
function polysOf(geom: { type: string; coordinates: unknown }): Poly[] {
  if (geom.type === "Polygon") return [geom.coordinates as Poly];
  if (geom.type === "MultiPolygon") return geom.coordinates as Poly[];
  return [];
}

function crossesAntimeridian(ring: Ring): boolean {
  for (let i = 1; i < ring.length; i++) if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) return true;
  return false;
}

/** 삼각형을 구면에 밀착하도록 적응 분할(큰 변은 쪼갬) 후 정점·색을 push. */
function pushTri(pos: number[], col: number[], a: Pt, b: Pt, c: Pt, rgb: number[], radius: number) {
  const d = (p: Pt, q: Pt) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  if (Math.max(d(a, b), d(b, c), d(c, a)) > 5) {
    const m = (p: Pt, q: Pt): Pt => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const ab = m(a, b), bc = m(b, c), ca = m(c, a);
    pushTri(pos, col, a, ab, ca, rgb, radius);
    pushTri(pos, col, ab, b, bc, rgb, radius);
    pushTri(pos, col, ca, bc, c, rgb, radius);
    pushTri(pos, col, ab, bc, ca, rgb, radius);
    return;
  }
  for (const p of [a, b, c]) {
    const v = latLonToVec3(p[1], p[0], radius);
    pos.push(v[0], v[1], v[2]);
    col.push(rgb[0], rgb[1], rgb[2]);
  }
}

function buildLand(features: GeoFeature[]): THREE.BufferGeometry {
  const pos: number[] = [];
  const col: number[] = [];
  features.forEach((f, fi) => {
    const c = new THREE.Color(PALETTE[fi % PALETTE.length]);
    const rgb = [c.r, c.g, c.b];
    for (const poly of polysOf(f.geometry)) {
      if (poly.some(crossesAntimeridian)) continue; // 날짜변경선 가로지르는 폴리곤 스킵(아티팩트 방지)
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
        pushTri(pos, col, a, b, cc, rgb, R);
      }
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  return geo;
}

/** 폴리곤 외곽(링)을 라인 세그먼트로. 긴 변은 구면 밀착되도록 잘게 나눔. */
function buildBorders(features: GeoFeature[], radius: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const seg = (a: Pt, b: Pt) => {
    if (Math.abs(b[0] - a[0]) > 180) return;
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4));
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

function buildGraticule(radius: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const add = (la1: number, lo1: number, la2: number, lo2: number) => {
    const a = latLonToVec3(la1, lo1, radius);
    const b = latLonToVec3(la2, lo2, radius);
    pos.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  };
  for (let lat = -80; lat <= 80; lat += 20) for (let lon = -180; lon < 180; lon += 5) add(lat, lon, lat, lon + 5);
  for (let lon = -180; lon < 180; lon += 20) for (let lat = -85; lat < 85; lat += 5) add(lat, lon, lat + 5, lon);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return geo;
}

const atmVert = /* glsl */ `
  varying vec3 vN; varying vec3 vE;
  void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN=normalize(normalMatrix*normal); vE=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }
`;
const atmFrag = /* glsl */ `
  varying vec3 vN; varying vec3 vE; uniform vec3 uColor; uniform float uIntensity;
  void main(){ float rim=pow(1.0-abs(dot(vN,vE)),2.6); gl_FragColor=vec4(uColor, clamp(rim,0.0,1.0)*uIntensity); }
`;

export function VectorGlobe() {
  const B = import.meta.env.BASE_URL;
  const [data, setData] = useState<{ c: GeoJson; s: GeoJson; cities: GeoJson } | null>(null);

  useEffect(() => {
    let alive = true;
    const get = (f: string) => fetch(`${B}geo/${f}`).then((r) => r.json() as Promise<GeoJson>).catch(() => ({ features: [] }) as GeoJson);
    Promise.all([get("countries-110m.geojson"), get("states-50m.geojson"), get("cities-110m.geojson")]).then(([c, s, cities]) => {
      if (alive) setData({ c, s, cities });
    });
    return () => {
      alive = false;
    };
  }, [B]);

  const built = useMemo(() => {
    if (!data) return null;
    return {
      land: buildLand(data.c.features),
      borders: buildBorders(data.c.features, R * 1.002),
      states: buildBorders(data.s.features, R * 1.0014),
      grat: buildGraticule(R * 1.0008),
    };
  }, [data]);

  const atmUniforms = useMemo(() => ({ uColor: { value: new THREE.Color("#5aa9ff") }, uIntensity: { value: 0.9 } }), []);

  if (!built) return null;

  return (
    <group>
      {/* 바다 */}
      <mesh>
        <sphereGeometry args={[R * 0.985, 96, 96]} />
        <meshBasicMaterial color="#0b2747" />
      </mesh>
      {/* 육지 (나라별 단색) */}
      <mesh geometry={built.land}>
        <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
      </mesh>
      {/* 위경도 격자 */}
      <lineSegments geometry={built.grat}>
        <lineBasicMaterial color="#86b0d8" transparent opacity={0.13} depthWrite={false} />
      </lineSegments>
      {/* 행정경계(주/도) */}
      <lineSegments geometry={built.states}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.1} depthWrite={false} />
      </lineSegments>
      {/* 국경 */}
      <lineSegments geometry={built.borders}>
        <lineBasicMaterial color="#e8f0ff" transparent opacity={0.4} depthWrite={false} />
      </lineSegments>
      {/* 대기광 */}
      <mesh scale={1.16}>
        <sphereGeometry args={[R, 64, 64]} />
        <shaderMaterial
          vertexShader={atmVert}
          fragmentShader={atmFrag}
          uniforms={atmUniforms}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
      {/* 국가/주/도시 라벨 */}
      {data && <MapLabels countries={data.c} states={data.s} cities={data.cities} />}
    </group>
  );
}
