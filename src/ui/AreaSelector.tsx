import { useState } from "react";
import type { AtlasArea } from "../data/types";
import { useIsMobile } from "../hooks/useIsMobile";

/** Knowledgeverse 영역 선택기 — 반도체 / 전력 / … 수십·수백 개까지 확장 가능한 드롭다운. */
export function AreaSelector({ areas, current, onChange }: { areas: AtlasArea[]; current: AtlasArea; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div style={{ position: "absolute", top: isMobile ? 58 : 16, left: isMobile ? 10 : 16, zIndex: 30 }}>
      <button
        className="glass rounded-xl"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 13px", cursor: "pointer", border: "none" }}
      >
        <span style={{ width: 9, height: 9, borderRadius: 99, background: current.accent, boxShadow: `0 0 10px ${current.accent}`, flexShrink: 0 }} />
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.18, textAlign: "left" }}>
          <span style={{ fontSize: 9.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "#94a3b8" }}>산업 영역</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{current.name}</span>
        </span>
        <span style={{ color: "#94a3b8", fontSize: 11, marginLeft: 4 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="glass-strong rounded-xl thin-scroll" role="listbox" style={{ marginTop: 8, padding: 6, width: 248, maxHeight: "50vh", overflowY: "auto" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#64748b", padding: "4px 10px 6px" }}>
            영역 선택 · {String(areas.length).padStart(2, "0")}
          </div>
          {areas.map((a, i) => {
            const active = a.id === current.id;
            return (
              <button
                key={a.id}
                role="option"
                aria-selected={active}
                onClick={() => { onChange(a.id); setOpen(false); }}
                className="w-full text-left rounded-lg transition-colors hover:bg-white/5"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", cursor: "pointer", border: "none", background: active ? `${a.accent}22` : "transparent", borderLeft: `2px solid ${active ? a.accent : "transparent"}` }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 99, background: a.accent, flexShrink: 0, boxShadow: active ? `0 0 8px ${a.accent}` : "none" }} />
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13, fontWeight: active ? 700 : 600, color: active ? "#fff" : "#cbd5e1" }}>
                    {String(i + 1).padStart(2, "0")} · {a.name}
                  </span>
                  <span style={{ display: "block", fontSize: 10, color: "#64748b" }}>{a.shortName}</span>
                </span>
              </button>
            );
          })}
          <div style={{ fontSize: 10, color: "#475569", padding: "8px 10px 2px" }}>지식 영역은 계속 추가됩니다…</div>
        </div>
      )}
    </div>
  );
}
