import { motion } from "framer-motion";
import type { Mode } from "../scene/Scene";
import type { AtlasArea } from "../data/types";

export function ViewToggle({ area, mode, onChange }: { area: AtlasArea; mode: Mode; onChange: (m: Mode) => void }) {
  const options: { id: Mode; label: string }[] = [
    { id: "taxonomy", label: area.taxonomyListTitle },
    { id: "supply", label: "공급망" },
    ...(area.process ? [{ id: "process" as Mode, label: "공정 과정" }] : []),
  ];
  return (
    <div className="glass rounded-full p-1 flex gap-1" style={{ position: "absolute", top: 16, right: 16, zIndex: 25 }}>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors"
          style={{ color: mode === o.id ? "#05060a" : "#cbd5e1" }}
        >
          {mode === o.id && (
            <motion.span layoutId="toggle-pill" className="absolute inset-0 rounded-full" style={{ background: "#e2e8f0" }} transition={{ type: "spring", damping: 24, stiffness: 300 }} />
          )}
          <span className="relative z-10">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
