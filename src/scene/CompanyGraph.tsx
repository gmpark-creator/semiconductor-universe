import { useMemo } from "react";
import { COMPANIES, EDGES, EDGE_COLORS } from "../data/companies";
import { SupplyArrow } from "./SupplyArrow";
import { CompanyEmblem } from "./CompanyEmblem";
import { computeCompanyPositions, computeCompanyGeoPositions, companyHqVec3 } from "./companyLayout";

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function CompanyGraph({ selected, onSelect }: Props) {
  const floatPos = useMemo(() => computeCompanyPositions(), []);
  const geoPos = useMemo(() => computeCompanyGeoPositions(), []);

  // 선택된 회사 + 직접 연결된 회사 집합(엣지 기준).
  const related = useMemo(() => {
    const set = new Set<string>();
    if (selected) {
      set.add(selected);
      for (const e of EDGES) {
        if (e.from === selected) set.add(e.to);
        if (e.to === selected) set.add(e.from);
      }
    }
    return set;
  }, [selected]);

  // 선택 시: 선택 회사에 연결된 엣지만 지구 위 호로 표시.
  const activeEdges = useMemo(
    () => (selected ? EDGES.filter((e) => e.from === selected || e.to === selected) : []),
    [selected],
  );

  return (
    <group>
      {activeEdges.map((e) => {
        const posOf = (id: string) => (id === selected ? companyHqVec3(id) ?? geoPos[id] : geoPos[id]);
        const from = posOf(e.from);
        const to = posOf(e.to);
        if (!from || !to) return null;
        const partnerId = e.from === selected ? e.to : e.from;
        const partner = COMPANIES.find((c) => c.id === partnerId)?.name ?? partnerId;
        const labelT = e.from === selected ? 0.24 : 0.76;
        return (
          <SupplyArrow key={e.id} start={from} end={to} color={EDGE_COLORS[e.relationship]} label={partner} labelT={labelT} />
        );
      })}

      {COMPANIES.map((c) => {
        const isRelated = related.has(c.id);
        return (
          <CompanyEmblem
            key={c.id}
            company={c}
            floatPos={floatPos[c.id]}
            geoPos={c.id === selected ? companyHqVec3(c.id) ?? geoPos[c.id] : geoPos[c.id]}
            pinned={selected != null && isRelated}
            selected={selected === c.id}
            visible={selected == null || isRelated}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}
