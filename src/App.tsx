import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Scene, type Mode } from "./scene/Scene";
import { InfoPanel } from "./ui/InfoPanel";
import { Legend } from "./ui/Legend";
import { ViewToggle } from "./ui/ViewToggle";
import { DATA_DISCLAIMER } from "./data/semiconductors";

export default function App() {
  const [mode, setMode] = useState<Mode>("taxonomy");
  const [selected, setSelected] = useState<string | null>(null);

  const changeMode = (m: Mode) => {
    setMode(m);
    setSelected(null);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 6, 32], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={() => setSelected(null)}
      >
        <Suspense fallback={null}>
          <Scene mode={mode} selectedId={selected} onSelect={setSelected} />
        </Suspense>
      </Canvas>

      {/* Title (top-left) */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 20 }} className="pointer-events-none">
        <h1 className="text-xl font-bold text-white tracking-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
          Semiconductor Universe
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {mode === "taxonomy" ? "Chip taxonomy — hover & click a category" : "Supply chain — hover & click a company"}
        </p>
      </div>

      <ViewToggle mode={mode} onChange={changeMode} />
      <Legend mode={mode} />
      <InfoPanel mode={mode} selectedId={selected} onClose={() => setSelected(null)} />

      {/* Disclaimer (bottom-right) */}
      <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 20 }} className="pointer-events-none">
        <p className="text-[11px] text-slate-500">{DATA_DISCLAIMER}</p>
      </div>

      <Loader
        containerStyles={{ background: "#05060a" }}
        barStyles={{ background: "linear-gradient(90deg,#6366f1,#22d3ee)" }}
        dataStyles={{ color: "#94a3b8", fontFamily: "Inter, system-ui, sans-serif", fontSize: 13 }}
        dataInterpolation={(p) => `Loading semiconductor universe… ${p.toFixed(0)}%`}
      />
    </div>
  );
}
