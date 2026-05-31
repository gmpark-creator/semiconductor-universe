// scene/companyLayout.ts
// 공급망 노드 배치 — 영역에 무관한 순수 기하 함수. 회사 목록·본사좌표·그룹중심을
// 인자로 받아 좌표를 계산한다(데이터는 각 AtlasArea가 제공).
import type { Company, HqCoord } from "../data/types";

/** 지구본 반경 — 벡터 globe·핀·카메라 공용 단일 상수. */
export const GLOBE_RADIUS = 5;
/** 핀 배지가 지표면에 살짝 떠 있도록 한 반경. */
export const PIN_RADIUS = GLOBE_RADIUS + 0.12;

/** 회사 노드를 그룹별 클러스터로 배치 (deterministic) — 기본 "떠 있는 아이콘" 뷰. */
export function computeCompanyPositions(
  companies: Company[],
  groupCenters: Record<string, [number, number, number]>,
): Record<string, [number, number, number]> {
  const byGroup: Record<string, Company[]> = {};
  for (const c of companies) (byGroup[c.group] ||= []).push(c);

  const pos: Record<string, [number, number, number]> = {};
  for (const [group, list] of Object.entries(byGroup)) {
    const center = groupCenters[group] ?? [0, 0, 0];
    const n = list.length;
    const r = n <= 1 ? 0 : 2.4 + n * 0.55;
    list.forEach((c, i) => {
      if (n === 1) {
        pos[c.id] = [center[0], center[1], center[2]];
      } else {
        const angle = (i / n) * Math.PI * 2;
        pos[c.id] = [
          center[0] + Math.cos(angle) * r,
          center[1] + Math.sin(angle) * r * 0.7,
          center[2] + Math.sin(angle * 1.3) * 2.0,
        ];
      }
    });
  }
  return pos;
}

/** 위경도 → 지구 구면 위 3D 좌표 (표준 equirectangular, 자오선 중앙). */
const LON_OFFSET = 0;
export function latLonToVec3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180 + LON_OFFSET) * Math.PI) / 180;
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

/** 회사별 본사 지구 좌표.
 *  같은 도시(본사가 몰린 곳)의 회사들은 도시 중심 주위 작은 링으로 결정적으로 펼쳐
 *  서로 겹치지(가리지) 않게 정렬한다. */
export function computeCompanyGeoPositions(
  companies: Company[],
  hqMap: Record<string, HqCoord>,
): Record<string, [number, number, number]> {
  const groups: Record<string, string[]> = {};
  for (const c of companies) {
    const hq = hqMap[c.id];
    if (!hq) continue;
    const key = `${Math.round(hq.lat)},${Math.round(hq.lon)}`;
    (groups[key] ||= []).push(c.id);
  }

  const pos: Record<string, [number, number, number]> = {};
  for (const ids of Object.values(groups)) {
    const n = ids.length;
    ids.forEach((id, i) => {
      const hq = hqMap[id];
      if (n === 1) {
        pos[id] = latLonToVec3(hq.lat, hq.lon, PIN_RADIUS);
      } else {
        const ringDeg = 0.8 + n * 0.3;
        const ang = (i / n) * Math.PI * 2;
        const dLat = Math.sin(ang) * ringDeg;
        const dLon = (Math.cos(ang) * ringDeg) / Math.max(0.3, Math.cos((hq.lat * Math.PI) / 180));
        pos[id] = latLonToVec3(hq.lat + dLat, hq.lon + dLon, PIN_RADIUS);
      }
    });
  }
  return pos;
}

/** 회사의 정확한 본사 좌표(오프셋 없음) — 선택 시 실제 주소에 핀하고 카메라를 그 도시로. */
export function companyHqVec3(id: string, hqMap: Record<string, HqCoord>): [number, number, number] | null {
  const hq = hqMap[id];
  return hq ? latLonToVec3(hq.lat, hq.lon, PIN_RADIUS) : null;
}
