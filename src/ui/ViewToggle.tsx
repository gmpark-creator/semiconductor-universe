import { motion } from "framer-motion";
import type { Mode } from "../scene/Scene";

const OPTIONS: { id: Mode; label: string }[] = [
  { id: "taxonomy", label: "칩 분류" },
  { id: "supply", label: "공급망" },
];

export function ViewToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="glass rounded-full p-1 flex gap-1" style={{ position: "absolute", top: 16, right: 16, zIndex: 25 }}>
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors"
          style={{ color: mode === o.id ? "#05060a" : "#cbd5e1" }}
        >
          {mode === o.id && (
            <motion.span
              layoutId="toggle-pill"
              className="absolute inset-0 rounded-full"
              style={{ background: "#e2e8f0" }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
            />
          )}
          <span className="relative z-10">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
