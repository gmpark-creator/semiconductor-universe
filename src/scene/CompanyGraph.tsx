import { useMemo } from "react";
import type { AtlasArea } from "../data/types";
import { SupplyArrow } from "./SupplyArrow";
import { CompanyEmblem } from "./CompanyEmblem";
import { computeCompanyPositions, computeCompanyGeoPositions, companyHqVec3, assignPartnerColors } from "./companyLayout";

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

  // 업체별 고유색 — 좌하단 관계 패널(SupplyRelations)과 동일 함수를 써서 색이 일치한다.
  const partnerColors = useMemo(() => assignPartnerColors(selected, area.edges), [selected, area]);

  return (
    <group>
      {activeEdges.map((e) => {
        const posOf = (id: string) => (id === selected ? companyHqVec3(id, area.hq) ?? geoPos[id] : geoPos[id]);
        const from = posOf(e.from);
        const to = posOf(e.to);
        if (!from || !to) return null;
        const outgoing = e.from === selected; // 선택기업이 공급자(→partner) 인지 수요자(partner→) 인지
        const partnerId = outgoing ? e.to : e.from;
        const partner = area.companies.find((c) => c.id === partnerId)?.name ?? partnerId;
        // 방향 표기: 나→상대(공급)는 "→ 상대", 상대→나(공급받음)는 "상대 →". 화살촉은 항상 to(도착)를 가리킨다.
        const dirLabel = outgoing ? `→ ${partner}` : `${partner} →`;
        // 라벨은 상대 기업 핀 쪽(곡선 끝/시작)에 둬 화살표마다 서로 다른 위치에 흩어지게.
        const labelT = outgoing ? 0.7 : 0.3;
        const color = partnerColors[partnerId] ?? area.edgeColors[e.relationship] ?? "#94a3b8";
        return (
          <SupplyArrow key={e.id} start={from} end={to} color={color} label={dirLabel} labelT={labelT} />
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
