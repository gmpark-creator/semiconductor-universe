import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AtlasArea } from "../data/types";
import type { Mode } from "../scene/Scene";

interface Props {
  area: AtlasArea;
  mode: Mode;
  selectedId: string | null;
  onClose: () => void;
}

export function InfoPanel({ area, mode, selectedId, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const category = mode === "taxonomy" ? area.categories.find((c) => c.id === selectedId) ?? null : null;
  const company = mode === "supply" ? area.companies.find((c) => c.id === selectedId) ?? null : null;
  const open = !!(category || company);

  const serves = company ? area.edges.filter((e) => e.from === company.id) : [];
  const suppliedBy = company ? area.edges.filter((e) => e.to === company.id) : [];
  const shares = company ? company.shares : [];
  const nameOf = (id: string) => area.companies.find((c) => c.id === id)?.name ?? id;
  const groupColor = company ? area.groupColors[company.group] ?? "#94a3b8" : "#94a3b8";

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key={selectedId}
          initial={{ x: "110%", opacity: 0.4 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "110%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          className="glass-strong thin-scroll"
          role="region"
          aria-label="선택 항목 상세 정보"
          aria-live="polite"
          style={{
            position: "absolute", top: 0, right: 0, height: "100%",
            width: "min(410px, 90vw)", overflowY: "auto", zIndex: 30, padding: "24px 24px 40px",
          }}
        >
          <button
            onClick={onClose}
            aria-label="패널 닫기"
            title="닫기 (Esc)"
            className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
            style={{ fontSize: 24, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}
          >
            ×
          </button>

          {category && (
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span style={{ width: 10, height: 10, borderRadius: 99, background: area.familyColors[category.family], boxShadow: `0 0 10px ${area.familyColors[category.family]}` }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: area.familyColors[category.family] }}>
                  {area.familyLabelKo[category.family]}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-4 pr-6" style={{ color: category.color }}>{category.name}</h2>
              <Section title="정의"><p className="text-slate-300 text-sm leading-relaxed">{category.definition}</p></Section>
              <Section title="역할"><p className="text-slate-300 text-sm leading-relaxed">{category.role}</p></Section>
              <Section title="핵심 사양">
                <ul className="space-y-1">
                  {category.keySpecs.map((s) => (
                    <li key={s} className="text-slate-300 text-sm flex gap-2"><span style={{ color: category.color }}>▸</span>{s}</li>
                  ))}
                </ul>
              </Section>
              <Section title={area.examplesTitle}>
                <div className="flex flex-wrap gap-2">
                  {category.examples.map((p) => (
                    <span key={p} className="text-xs px-2.5 py-1 rounded-full" style={{ background: `${category.color}22`, border: `1px solid ${category.color}55`, color: "#e2e8f0" }}>{p}</span>
                  ))}
                </div>
              </Section>
              {category.trend && (
                <Section title={area.trendTitle}><p className="text-slate-300 text-sm leading-relaxed">{category.trend}</p></Section>
              )}
            </div>
          )}

          {company && (
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span style={{ width: 10, height: 10, borderRadius: 99, background: groupColor, boxShadow: `0 0 10px ${groupColor}` }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: groupColor }}>
                  {area.groupLabelKo[company.group]} · {company.type}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-1.5 pr-6" style={{ color: groupColor }}>{company.name}</h2>
              <p className="text-xs text-slate-500 mb-4">{company.hq}</p>
              {company.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {company.stats.map((s) => <Stat key={s.label} label={s.label} value={s.value} />)}
                </div>
              )}
              <Section title="개요"><p className="text-slate-300 text-sm leading-relaxed">{company.detail}</p></Section>
              {shares.length > 0 && (
                <Section title={area.sharesTitle}>
                  <ul className="space-y-2">
                    {shares.map((s) => (
                      <li key={s.field} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-300">{s.field}</span>
                        <span className="font-semibold whitespace-nowrap" style={{ color: groupColor }}>{s.pct}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
              {serves.length > 0 && (
                <Section title="공급 / 납품 대상">
                  <ul className="space-y-1.5">
                    {serves.map((e) => (
                      <li key={e.id} className="text-slate-300 text-sm">→ <span className="text-white font-medium">{nameOf(e.to)}</span> <span className="text-slate-500">— {e.label}</span></li>
                    ))}
                  </ul>
                </Section>
              )}
              {suppliedBy.length > 0 && (
                <Section title="공급받는 곳">
                  <ul className="space-y-1.5">
                    {suppliedBy.map((e) => (
                      <li key={e.id} className="text-slate-300 text-sm">← <span className="text-white font-medium">{nameOf(e.from)}</span> <span className="text-slate-500">— {e.label}</span></li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          )}

          <p className="text-[11px] text-slate-500 mt-6 pt-4 border-t border-white/10">{area.dataDisclaimer}</p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-lg px-3 py-2">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="text-sm font-semibold text-white" style={{ lineHeight: 1.3 }}>{value}</div>
    </div>
  );
}
