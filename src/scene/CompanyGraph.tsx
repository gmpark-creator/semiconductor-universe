import { useMemo } from "react";
import type { AtlasArea } from "../data/types";
import { SupplyArrow } from "./SupplyArrow";
import { CompanyEmblem } from "./CompanyEmblem";
import { computeCompanyPositions, computeCompanyGeoPositions, companyHqVec3 } from "./companyLayout";

interface Props {
  area: AtlasArea;
  selected: string | null;
  onSelect: (id: string) => void;
}

export function CompanyGraph({ area, selected, onSelect }: Props) {
  // 한정 지도(전력=대한민국): 선택과 무관하게 모든 기업을 지도 위 본사 위치에 표기.
  const geoDefault = !!area.mapFocus;
  const floatPos = useMemo(() => computeCompanyPositions(area.companies, area.groupCenters), [area]);
  const geoPos = useMemo(
    () => computeCompanyGeoPositions(area.companies, area.hq, geoDefault ? 0.3 : 1),
    [area, geoDefault],
  );

  const related = useMemo(() => {
    const set = new Set<string>();
    if (selected) {
      set.add(selected);
      for (const e of area.edges) {
        if (e.from === selected) set.add(e.to);
        if (e.to === selected) set.add(e.from);
      }
    }
    return set;
  }, [selected, area]);

  const activeEdges = useMemo(
    () => (selected ? area.edges.filter((e) => e.from === selected || e.to === selected) : []),
    [selected, area],
  );

  return (
    <group>
      {activeEdges.map((e) => {
        const posOf = (id: string) => (id === selected ? companyHqVec3(id, area.hq) ?? geoPos[id] : geoPos[id]);
        const from = posOf(e.from);
        const to = posOf(e.to);
        if (!from || !to) return null;
        const partnerId = e.from === selected ? e.to : e.from;
        const partner = area.companies.find((c) => c.id === partnerId)?.name ?? partnerId;
        const labelT = e.from === selected ? 0.24 : 0.76;
        // 한정 지도에선 모든 본사 핀에 이미 기업명이 표기되므로 화살표 라벨은 생략(중복·과밀 방지).
        return (
          <SupplyArrow key={e.id} start={from} end={to} color={area.edgeColors[e.relationship] ?? "#94a3b8"} label={geoDefault ? undefined : partner} labelT={labelT} />
        );
      })}

      {area.companies.map((c) => {
        const isRelated = related.has(c.id);
        return (
          <CompanyEmblem
            key={c.id}
            company={c}
            badge={area.badges[c.id]}
            floatPos={floatPos[c.id]}
            geoPos={c.id === selected ? companyHqVec3(c.id, area.hq) ?? geoPos[c.id] : geoPos[c.id]}
            alwaysGeo={geoDefault}
            pinned={selected != null && isRelated}
            faded={geoDefault && selected != null && !isRelated}
            selected={selected === c.id}
            visible={geoDefault || selected == null || isRelated}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}
