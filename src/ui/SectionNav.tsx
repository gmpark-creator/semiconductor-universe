import { useIsMobile } from "../hooks/useIsMobile";
import { BRAND } from "../brand";

/** Knowledgeverse(놀리지버스) 대분류(섹션) 스위처 — 산업 / 기초이론. 화면 최상단 중앙. */
export type Section = "industry" | "theory";

const SECTIONS: { id: Section; label: string; sub: string; emoji: string }[] = [
  { id: "industry", label: "산업", sub: "반도체 · 전력", emoji: "🏭" },
  { id: "theory", label: "기초이론", sub: "과학 · 초중고·심화·SF", emoji: "📚" },
];

export function SectionNav({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ position: "absolute", top: isMobile ? 10 : 16, left: "50%", transform: "translateX(-50%)", zIndex: 40, maxWidth: "94vw" }}>
      <div className="glass-strong rounded-2xl" style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 6, padding: isMobile ? "5px 6px" : "7px 8px" }}>
        {!isMobile && (
          <>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, padding: "0 10px 0 6px" }}>
              <span style={{ fontSize: 8.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b" }}>{BRAND.kicker}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#f1f5f9", letterSpacing: "0.02em" }}>{BRAND.main}</span>
            </div>
            <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.1)" }} />
          </>
        )}
        {SECTIONS.map((s) => {
          const active = s.id === section;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              aria-pressed={active}
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 6 : 9,
                padding: isMobile ? "7px 12px" : "8px 15px",
                borderRadius: isMobile ? 11 : 13,
                border: "none",
                cursor: "pointer",
                background: active ? "linear-gradient(135deg, rgba(99,102,241,0.32), rgba(34,211,238,0.22))" : "transparent",
                boxShadow: active ? "inset 0 0 0 1px rgba(125,211,252,0.4)" : "none",
                transition: "background 0.18s",
              }}
            >
              <span style={{ fontSize: isMobile ? 15 : 17 }}>{s.emoji}</span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15, textAlign: "left" }}>
                <span style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: active ? "#fff" : "#cbd5e1" }}>{s.label}</span>
                {!isMobile && <span style={{ fontSize: 9.5, color: active ? "#bae6fd" : "#64748b" }}>{s.sub}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
