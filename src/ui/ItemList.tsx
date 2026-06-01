import type { Mode } from "../scene/Scene";
import type { AtlasArea } from "../data/types";

interface Props {
  area: AtlasArea;
  mode: Mode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

interface Row { id: string; name: string; color: string; sub: string }

/** 좌측 중단 목록 — 항목 클릭 시 해당 아이콘으로 이동·선택. 모드에 따라 분류/기업 목록. */
export function ItemList({ area, mode, selectedId, onSelect }: Props) {
  const rows: Row[] =
    mode === "taxonomy"
      ? area.categories.map((c) => ({
          id: c.id, name: c.name, color: area.familyColors[c.family] ?? "#94a3b8", sub: area.familyLabelKo[c.family] ?? "",
        }))
      : mode === "process"
        ? (area.process?.steps ?? []).map((s) => ({
            id: s.id, name: `${s.index}. ${s.name}`, color: s.color, sub: s.short,
          }))
        : area.companies.map((c) => {
            const s = c.shares?.[0];
            return {
              id: c.id, name: c.name, color: area.groupColors[c.group] ?? "#94a3b8",
              sub: s ? `${s.field} ${s.pct}` : area.groupLabelKo[c.group] ?? "",
            };
          });

  const listTitle =
    mode === "taxonomy" ? area.taxonomyListTitle : mode === "process" ? area.process?.listTitle ?? "공정" : area.supplyListTitle;
  const title = `${listTitle} · ${rows.length}`;

  return (
    <div
      className="glass rounded-xl thin-scroll"
      style={{ position: "absolute", left: 16, top: 88, width: 222, maxHeight: "calc(100vh - 330px)", overflowY: "auto", zIndex: 20, padding: "10px 6px" }}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400" style={{ padding: "2px 10px 8px" }}>{title}</div>
      <div className="space-y-0.5">
        {rows.map((r) => {
          const active = r.id === selectedId;
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="w-full text-left rounded-lg transition-colors hover:bg-white/5"
              style={{ padding: "6px 9px", display: "flex", alignItems: "center", gap: 9, background: active ? `${r.color}26` : undefined, borderLeft: `2px solid ${active ? r.color : "transparent"}`, cursor: "pointer" }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 99, background: r.color, flexShrink: 0, boxShadow: active ? `0 0 8px ${r.color}` : "none" }} />
              <span style={{ minWidth: 0, flex: 1 }}>
                <span className="block text-sm" style={{ color: active ? "#fff" : "#cbd5e1", fontWeight: active ? 700 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                <span className="block" style={{ fontSize: 10, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
