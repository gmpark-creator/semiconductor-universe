import { COMPANIES, type Company, type CompanyGroup } from "../data/companies";

/** 그룹별 액센트 색 (범례·패널·노드 공용). */
export const GROUP_COLORS: Record<CompanyGroup, string> = {
  Designer: "#60A5FA",
  IDM: "#F472B6",
  Foundry: "#22D3EE",
  Equipment: "#C084FC",
  "EDA/IP": "#34D399",
};

/** 지구(반경 5)를 둘러싼 궤도 위 그룹 클러스터 중심.
 *  기업이 27개로 늘어 그룹을 더 멀리·넓게 분산하고, 정면 시선축(+z)을 비워 occlusion을 막는다. */
const GROUP_CENTERS: Record<CompanyGroup, [number, number, number]> = {
  Designer: [-9, 4, 12], // 좌상-앞 (정면 정중앙을 피함)
  Foundry: [15, -1, 1], // 우측
  IDM: [7, 5, -13], // 우상-뒤 (8개로 가장 많음 → 멀리)
  Equipment: [-10, -4, -11], // 좌하-뒤
  "EDA/IP": [-15, 2, 1], // 좌측
};

/** 회사 노드를 그룹별 클러스터로 배치 (deterministic).
 *  노드 수에 비례해 반경을 키워(많은 IDM=8개도) 배지가 겹치지 않게 한다. */
export function computeCompanyPositions(): Record<string, [number, number, number]> {
  const byGroup: Record<string, Company[]> = {};
  for (const c of COMPANIES) (byGroup[c.group] ||= []).push(c);

  const pos: Record<string, [number, number, number]> = {};
  for (const [group, list] of Object.entries(byGroup)) {
    const center = GROUP_CENTERS[group as CompanyGroup];
    const n = list.length;
    const r = n <= 1 ? 0 : 2.4 + n * 0.55; // 적응형 반경
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
