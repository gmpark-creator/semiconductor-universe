import { useMemo } from "react";
import { COMPANIES, EDGES, EDGE_COLORS, type Company, type CompanyGroup } from "../data/companies";
import { SupplyArrow } from "./SupplyArrow";
import { CompanyEmblem } from "./CompanyEmblem";

export const GROUP_COLORS: Record<CompanyGroup, string> = {
  Designer: "#60A5FA",
  IDM: "#F472B6",
  Foundry: "#22D3EE",
  Equipment: "#C084FC",
  "EDA/IP": "#34D399",
};

/** 지구(반경 5)를 둘러싼 궤도 위 그룹 클러스터 중심 (모두 원점에서 반경 ≈ 13). */
const GROUP_CENTERS: Record<CompanyGroup, [number, number, number]> = {
  Designer: [0, 3, 13],
  Foundry: [12.5, -2, 4],
  IDM: [8, 4, -10.5],
  Equipment: [-8.5, -3, -10],
  "EDA/IP": [-12.5, 3, 4],
};

/** 회사 노드를 그룹별 클러스터로 배치 (deterministic). */
export function computeCompanyPositions(): Record<string, [number, number, number]> {
  const byGroup: Record<string, Company[]> = {};
  for (const c of COMPANIES) (byGroup[c.group] ||= []).push(c);

  const pos: Record<string, [number, number, number]> = {};
  for (const [group, list] of Object.entries(byGroup)) {
    const center = GROUP_CENTERS[group as CompanyGroup];
    const n = list.length;
    list.forEach((c, i) => {
      if (n === 1) {
        pos[c.id] = [center[0], center[1], center[2]];
      } else {
        const angle = (i / n) * Math.PI * 2;
        const r = 3.4;
        pos[c.id] = [
          center[0] + Math.cos(angle) * r,
          center[1] + Math.sin(angle) * r * 0.7,
          center[2] + Math.sin(angle * 1.3) * 1.6,
        ];
      }
    });
  }
  return pos;
}

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function CompanyGraph({ selected, onSelect }: Props) {
  const positions = useMemo(() => computeCompanyPositions(), []);

  return (
    <group>
      {EDGES.map((e) => {
        const from = positions[e.from];
        const to = positions[e.to];
        if (!from || !to) return null;
        const related = selected === e.from || selected === e.to;
        return (
          <SupplyArrow
            key={e.id}
            start={from}
            end={to}
            color={EDGE_COLORS[e.relationship]}
            active={selected === null || related}
          />
        );
      })}
      {COMPANIES.map((c) => {
        const related =
          selected === null ||
          selected === c.id ||
          EDGES.some((e) => (e.from === selected && e.to === c.id) || (e.to === selected && e.from === c.id));
        return (
          <CompanyEmblem
            key={c.id}
            company={c}
            position={positions[c.id]}
            selected={selected === c.id}
            dimmed={!related}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}
