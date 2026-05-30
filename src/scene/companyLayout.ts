import { COMPANIES, type Company, type CompanyGroup } from "../data/companies";
import { EARTH_RADIUS } from "./Earth";

/** 그룹별 액센트 색 (범례·패널·노드 공용). */
export const GROUP_COLORS: Record<CompanyGroup, string> = {
  Designer: "#60A5FA",
  IDM: "#F472B6",
  Foundry: "#22D3EE",
  Equipment: "#C084FC",
  "EDA/IP": "#34D399",
};

/** 기본(미선택) 공급망 뷰 — 회사 아이콘이 떠 있는 궤도 클러스터 중심. */
const GROUP_CENTERS: Record<CompanyGroup, [number, number, number]> = {
  Designer: [-9, 4, 12],
  Foundry: [15, -1, 1],
  IDM: [7, 5, -13],
  Equipment: [-10, -4, -11],
  "EDA/IP": [-15, 2, 1],
};

/** 회사 노드를 그룹별 클러스터로 배치 (deterministic) — 기본 "떠 있는 아이콘" 뷰. */
export function computeCompanyPositions(): Record<string, [number, number, number]> {
  const byGroup: Record<string, Company[]> = {};
  for (const c of COMPANIES) (byGroup[c.group] ||= []).push(c);

  const pos: Record<string, [number, number, number]> = {};
  for (const [group, list] of Object.entries(byGroup)) {
    const center = GROUP_CENTERS[group as CompanyGroup];
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

/* ============================================================
   본사 위치 (위도·경도) — 회사를 클릭하면 지구 위 본사 좌표로 핀.
   companies.ts 의 hq 필드(국가/도시)를 좌표로 매핑한 값.
   ============================================================ */
export const COMPANY_HQ: Record<string, { lat: number; lon: number }> = {
  // 미국 — 실리콘밸리/캘리포니아
  nvidia: { lat: 37.37, lon: -121.96 }, // 산타클라라
  apple: { lat: 37.33, lon: -122.03 }, // 쿠퍼티노
  amd: { lat: 37.35, lon: -121.97 }, // 산타클라라
  broadcom: { lat: 37.44, lon: -122.14 }, // 팰로알토
  qualcomm: { lat: 32.9, lon: -117.2 }, // 샌디에이고
  amat: { lat: 37.39, lon: -121.97 }, // 산타클라라
  lam: { lat: 37.55, lon: -121.99 }, // 프리몬트
  kla: { lat: 37.43, lon: -121.9 }, // 밀피타스
  synopsys: { lat: 37.37, lon: -122.04 }, // 서니베일
  cadence: { lat: 37.34, lon: -121.89 }, // 산호세
  intel: { lat: 37.39, lon: -121.96 }, // 산타클라라
  "intel-foundry": { lat: 33.3, lon: -111.9 }, // 애리조나 챈들러 팹
  // 미국 — 기타
  micron: { lat: 43.62, lon: -116.2 }, // 아이다호 보이시
  ti: { lat: 32.78, lon: -96.8 }, // 텍사스 댈러스
  adi: { lat: 42.55, lon: -71.17 }, // 매사추세츠 윌밍턴
  globalfoundries: { lat: 42.98, lon: -73.79 }, // 뉴욕 몰타
  "siemens-eda": { lat: 45.31, lon: -122.77 }, // 오리건 윌슨빌
  // 대한민국
  samsung: { lat: 37.26, lon: 127.03 }, // 수원
  skhynix: { lat: 37.27, lon: 127.44 }, // 이천
  "samsung-foundry": { lat: 37.16, lon: 127.1 }, // 화성/평택
  // 대만
  tsmc: { lat: 24.78, lon: 120.99 }, // 신주
  mediatek: { lat: 24.81, lon: 120.97 }, // 신주
  // 중국 / 일본
  smic: { lat: 31.23, lon: 121.47 }, // 상하이
  tel: { lat: 35.68, lon: 139.76 }, // 도쿄
  // 유럽
  asml: { lat: 51.42, lon: 5.4 }, // 네덜란드 펠트호번
  infineon: { lat: 48.14, lon: 11.58 }, // 독일 뮌헨
  stmicro: { lat: 46.2, lon: 6.14 }, // 스위스 제네바
  arm: { lat: 52.21, lon: 0.09 }, // 영국 케임브리지
};

/** 위경도 → 지구 구면 위 3D 좌표.
 *  three SphereGeometry(phiStart 0) + 표준 equirectangular(자오선 중앙) 텍스처 기준 정렬.
 *  텍스처 미세 정렬이 필요하면 LON_OFFSET 으로 보정. */
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

/** 핀 배지가 지표면에 살짝 떠 있도록 한 반경. */
export const PIN_RADIUS = EARTH_RADIUS + 0.35;

/** 회사별 본사 지구 좌표.
 *  같은 도시(실리콘밸리처럼 본사가 몰린 곳)의 회사들은 도시 중심 주위 작은 링으로
 *  결정적으로 펼쳐 서로 겹치지(가리지) 않게 정렬한다. */
export function computeCompanyGeoPositions(): Record<string, [number, number, number]> {
  // 1° 격자로 도시별 그룹화.
  const groups: Record<string, string[]> = {};
  for (const c of COMPANIES) {
    const hq = COMPANY_HQ[c.id];
    if (!hq) continue;
    const key = `${Math.round(hq.lat)},${Math.round(hq.lon)}`;
    (groups[key] ||= []).push(c.id);
  }

  const pos: Record<string, [number, number, number]> = {};
  for (const ids of Object.values(groups)) {
    const n = ids.length;
    ids.forEach((id, i) => {
      const hq = COMPANY_HQ[id];
      if (n === 1) {
        pos[id] = latLonToVec3(hq.lat, hq.lon, PIN_RADIUS);
      } else {
        // 같은 도시 회사를 실제 주소 근처에 작게 모아두되 겹치지 않게(도시 줌에서 분리). 링 반경(도).
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

/** 회사의 정확한 본사 좌표(지터·링 오프셋 없음) — 선택 시 실제 주소에 핀하고 카메라를 그 도시로. */
export function companyHqVec3(id: string): [number, number, number] | null {
  const hq = COMPANY_HQ[id];
  return hq ? latLonToVec3(hq.lat, hq.lon, PIN_RADIUS) : null;
}
