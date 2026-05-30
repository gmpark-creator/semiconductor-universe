import type { Mode } from "../scene/Scene";
import { CATEGORIES, FAMILY_COLORS, FAMILY_LABEL_KO } from "../data/semiconductors";
import { COMPANIES, GROUP_LABEL_KO, COMPANY_SHARES } from "../data/companies";
import { GROUP_COLORS } from "../scene/companyLayout";

interface Props {
  mode: Mode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

interface Row {
  id: string;
  name: string;
  color: string;
  sub: string;
}

/** 좌측 중단 목록 — 항목 클릭 시 해당 아이콘으로 이동·선택. 모드에 따라 분류/기업 목록. */
export function ItemList({ mode, selectedId, onSelect }: Props) {
  const rows: Row[] =
    mode === "taxonomy"
      ? CATEGORIES.map((c) => ({
          id: c.id,
          name: c.name,
          color: FAMILY_COLORS[c.family],
          sub: FAMILY_LABEL_KO[c.family],
        }))
      : COMPANIES.map((c) => {
          const s = COMPANY_SHARES[c.id]?.[0];
          return {
            id: c.id,
            name: c.name,
            color: GROUP_COLORS[c.group],
            sub: s ? `${s.field} ${s.pct}` : GROUP_LABEL_KO[c.group],
          };
        });

  return (
    <div
      className="glass rounded-xl thin-scroll"
      style={{
        position: "absolute",
        left: 16,
        top: 88,
        width: 222,
        maxHeight: "calc(100vh - 330px)",
        overflowY: "auto",
        zIndex: 20,
        padding: "10px 6px",
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400" style={{ padding: "2px 10px 8px" }}>
        {mode === "taxonomy" ? `칩 분류 · ${rows.length}` : `기업 · ${rows.length}`}
      </div>
      <div className="space-y-0.5">
        {rows.map((r) => {
          const active = r.id === selectedId;
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="w-full text-left rounded-lg transition-colors hover:bg-white/5"
              style={{
                padding: "6px 9px",
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: active ? `${r.color}26` : undefined,
                borderLeft: `2px solid ${active ? r.color : "transparent"}`,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 99,
                  background: r.color,
                  flexShrink: 0,
                  boxShadow: active ? `0 0 8px ${r.color}` : "none",
                }}
              />
              <span style={{ minWidth: 0, flex: 1 }}>
                <span
                  className="block text-sm"
                  style={{
                    color: active ? "#fff" : "#cbd5e1",
                    fontWeight: active ? 700 : 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {r.name}
                </span>
                <span
                  className="block"
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {r.sub}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
