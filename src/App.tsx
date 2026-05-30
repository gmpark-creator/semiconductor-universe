import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Scene, type Mode } from "./scene/Scene";
import { InfoPanel } from "./ui/InfoPanel";
import { Legend } from "./ui/Legend";
import { ViewToggle } from "./ui/ViewToggle";
import { CATEGORIES, DATA_DISCLAIMER, DATA_AS_OF, FAMILY_LABEL_KO } from "./data/semiconductors";
import { COMPANIES, GROUP_LABEL_KO } from "./data/companies";

/** prefers-reduced-motion 구독 훅. */
function useReducedMotion(): boolean {
  // 초기값을 lazy initializer로 동기 확정 → effect 안에서 setState 하지 않음.
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

export default function App() {
  const [mode, setMode] = useState<Mode>("taxonomy");
  const [selected, setSelected] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const changeMode = (m: Mode) => {
    setMode(m);
    setSelected(null);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Canvas
        camera={{ position: [6, 8, 36], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={() => setSelected(null)}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <Scene mode={mode} selectedId={selected} onSelect={setSelected} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>

      {/* Title (top-left) */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 20 }} className="pointer-events-none">
        <h1 className="text-xl font-bold text-white tracking-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
          반도체 유니버스
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {mode === "taxonomy"
            ? "칩 분류 — 노드를 선택하면 자세한 정보가 열립니다"
            : "공급망 — 기업을 선택하면 자세한 정보가 열립니다"}
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5" style={{ letterSpacing: "0.04em" }}>
          {DATA_AS_OF} · {mode === "taxonomy" ? `${CATEGORIES.length}개 분류` : `${COMPANIES.length}개 기업`}
        </p>
      </div>

      <ViewToggle mode={mode} onChange={changeMode} />
      <Legend mode={mode} />
      <InfoPanel mode={mode} selectedId={selected} onClose={() => setSelected(null)} />

      {/* Disclaimer (bottom-right) */}
      <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 20 }} className="pointer-events-none">
        <p className="text-[11px] text-slate-500">{DATA_DISCLAIMER}</p>
      </div>

      {/* 접근성: 스크린리더·키보드용 대체 콘텐츠. 시각적으로 숨기되 DOM·포커스에는 존재. */}
      <nav className="sr-only" aria-label={mode === "taxonomy" ? "칩 분류 목록" : "반도체 기업 목록"}>
        <h2>{mode === "taxonomy" ? "칩 분류" : "반도체 공급망 기업"} (키보드 탐색)</h2>
        <ul>
          {mode === "taxonomy"
            ? CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button onClick={() => setSelected(c.id)}>
                    {c.name} — {FAMILY_LABEL_KO[c.family]}. {c.definition}
                  </button>
                </li>
              ))
            : COMPANIES.map((c) => (
                <li key={c.id}>
                  <button onClick={() => setSelected(c.id)}>
                    {c.name} — {GROUP_LABEL_KO[c.group]}, {c.type}. {c.note}
                  </button>
                </li>
              ))}
        </ul>
      </nav>

      <Loader
        containerStyles={{ background: "#05060a" }}
        barStyles={{ background: "linear-gradient(90deg,#6366f1,#22d3ee)" }}
        dataStyles={{ color: "#94a3b8", fontFamily: "Inter, 'Noto Sans KR', system-ui, sans-serif", fontSize: 13 }}
        dataInterpolation={(p) => `반도체 유니버스 불러오는 중… ${p.toFixed(0)}%`}
      />
    </div>
  );
}
