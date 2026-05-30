import { useMemo } from "react";
import { COMPANIES, EDGES, EDGE_COLORS } from "../data/companies";
import { SupplyArrow } from "./SupplyArrow";
import { CompanyEmblem } from "./CompanyEmblem";
import { computeCompanyPositions } from "./companyLayout";

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
