import type { Mode } from "../scene/Scene";
import { FAMILY_COLORS } from "../data/semiconductors";
import { EDGE_COLORS } from "../data/companies";
import { GROUP_COLORS } from "../scene/CompanyGraph";

const RELATIONSHIP_LEGEND: { color: string; label: string }[] = [
  { color: EDGE_COLORS.order, label: "design → foundry (order)" },
  { color: EDGE_COLORS.delivery, label: "foundry / memory → customer" },
  { color: EDGE_COLORS.equipment, label: "equipment → foundry" },
  { color: EDGE_COLORS.IP, label: "IP / EDA → designer" },
];

function Row({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ width: 12, height: 12, borderRadius: 3, background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
      <span className="text-xs text-slate-300">{label}</span>
    </div>
  );
}

export function Legend({ mode }: { mode: Mode }) {
  return (
    <div className="glass rounded-xl p-4" style={{ position: "absolute", left: 16, bottom: 16, zIndex: 20, maxWidth: 280 }}>
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
        {mode === "taxonomy" ? "Chip families" : "Supply relationships"}
      </div>
      <div className="space-y-1.5">
        {mode === "taxonomy"
          ? Object.entries(FAMILY_COLORS).map(([fam, color]) => <Row key={fam} color={color} label={fam} />)
          : RELATIONSHIP_LEGEND.map((r) => <Row key={r.label} color={r.color} label={r.label} />)}
      </div>
      {mode === "supply" && (
        <>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-3 mb-1.5">Node = company (size ∝ √ market cap)</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {Object.entries(GROUP_COLORS).map(([g, color]) => (
              <Row key={g} color={color} label={g} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
