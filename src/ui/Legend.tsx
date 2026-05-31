import type { Mode } from "../scene/Scene";
import type { AtlasArea } from "../data/types";

function Row({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ width: 12, height: 12, borderRadius: 3, background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
      <span className="text-xs text-slate-300">{label}</span>
    </div>
  );
}

export function Legend({ area, mode }: { area: AtlasArea; mode: Mode }) {
  return (
    <div className="glass rounded-xl p-4" style={{ position: "absolute", left: 16, bottom: 16, zIndex: 20, maxWidth: 280 }}>
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
        {mode === "taxonomy" ? area.taxonomyLegendTitle : "공급망 관계"}
      </div>
      <div className="space-y-1.5">
        {mode === "taxonomy"
          ? area.familyOrder.map((fam) => <Row key={fam} color={area.familyColors[fam]} label={area.familyLabelKo[fam]} />)
          : area.relationshipLegend.map((r) => <Row key={r.label} color={r.color} label={r.label} />)}
      </div>
      {mode === "supply" && (
        <>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-3 mb-1.5">{area.nodeSizeNote}</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {area.groupOrder.map((g) => <Row key={g} color={area.groupColors[g]} label={area.groupLabelKo[g]} />)}
          </div>
        </>
      )}
    </div>
  );
}
