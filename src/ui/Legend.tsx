import type { Mode } from "../scene/Scene";
import { FAMILY_COLORS, FAMILY_LABEL_KO } from "../data/semiconductors";
import { EDGE_COLORS, GROUP_LABEL_KO } from "../data/companies";
import { GROUP_COLORS } from "../scene/companyLayout";

const RELATIONSHIP_LEGEND: { color: string; label: string }[] = [
  { color: EDGE_COLORS.order, label: "설계 → 파운드리 (발주)" },
  { color: EDGE_COLORS.delivery, label: "파운드리 / 메모리 → 고객" },
  { color: EDGE_COLORS.equipment, label: "장비 → 파운드리" },
  { color: EDGE_COLORS.IP, label: "IP / EDA → 설계사" },
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
        {mode === "taxonomy" ? "칩 패밀리" : "공급망 관계"}
      </div>
      <div className="space-y-1.5">
        {mode === "taxonomy"
          ? (Object.keys(FAMILY_COLORS) as (keyof typeof FAMILY_COLORS)[]).map((fam) => (
              <Row key={fam} color={FAMILY_COLORS[fam]} label={FAMILY_LABEL_KO[fam]} />
            ))
          : RELATIONSHIP_LEGEND.map((r) => <Row key={r.label} color={r.color} label={r.label} />)}
      </div>
      {mode === "supply" && (
        <>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-3 mb-1.5">
            노드 = 기업 (크기 ∝ √시가총액)
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {(Object.keys(GROUP_COLORS) as (keyof typeof GROUP_COLORS)[]).map((g) => (
              <Row key={g} color={GROUP_COLORS[g]} label={GROUP_LABEL_KO[g]} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
