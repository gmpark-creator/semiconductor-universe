import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Scene, type Mode } from "../scene/Scene";
import { InfoPanel } from "../ui/InfoPanel";
import { Legend } from "../ui/Legend";
import { ViewToggle } from "../ui/ViewToggle";
import { ItemList } from "../ui/ItemList";
import { AreaSelector } from "../ui/AreaSelector";
import { AREAS, DEFAULT_AREA_ID, getArea } from "../data/areas";

/** prefers-reduced-motion 구독 훅. */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/** 산업 대분류 — 3D 지식 영역(반도체·전력 …) 시각화. */
export function IndustryView() {
  const [areaId, setAreaId] = useState<string>(DEFAULT_AREA_ID);
  const [mode, setMode] = useState<Mode>("taxonomy");
  const [selected, setSelected] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const area = getArea(areaId);

  const changeMode = (m: Mode) => {
    setMode(m);
    setSelected(null);
  };
  const changeArea = (id: string) => {
    setAreaId(id);
    setMode("taxonomy");
    setSelected(null);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Canvas
        camera={{ position: [6, 8, 36], fov: 50, near: 0.01, far: 1000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={() => setSelected(null)}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <Scene area={area} mode={mode} selectedId={selected} onSelect={setSelected} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>

      {/* 영역 선택기 (좌상단, 대분류 네비 아래) */}
      <AreaSelector areas={AREAS} current={area} onChange={changeArea} />

      {/* 모드 안내 (선택기 아래) */}
      <div style={{ position: "absolute", top: 122, left: 18, zIndex: 20, pointerEvents: "none" }}>
        <p className="text-[11px] text-slate-400" style={{ margin: 0 }}>
          {mode === "taxonomy" ? area.taxonomyHint : mode === "process" ? area.process?.hint ?? "" : area.supplyHint}
        </p>
        <p className="text-[10px] text-slate-500" style={{ margin: "2px 0 0", letterSpacing: "0.04em" }}>
          {area.dataAsOf} ·{" "}
          {mode === "taxonomy"
            ? `${area.categories.length}개 분류`
            : mode === "process"
              ? `${area.process?.steps.length ?? 0}개 공정`
              : `${area.companies.length}개 기업·기관`}
        </p>
      </div>

      <ViewToggle area={area} mode={mode} onChange={changeMode} />
      <ItemList area={area} mode={mode} selectedId={selected} onSelect={setSelected} />
      <Legend area={area} mode={mode} />
      <InfoPanel area={area} mode={mode} selectedId={selected} onClose={() => setSelected(null)} />

      {/* Disclaimer (bottom-right) */}
      <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 20 }} className="pointer-events-none">
        <p className="text-[11px] text-slate-500">{area.dataDisclaimer}</p>
      </div>

      {/* 접근성: 스크린리더·키보드용 대체 콘텐츠. */}
      <nav className="sr-only" aria-label={`${area.name} ${mode === "taxonomy" ? "분류" : mode === "process" ? "공정" : "기업"} 목록`}>
        <h2>
          {area.name} —{" "}
          {mode === "taxonomy" ? area.taxonomyListTitle : mode === "process" ? area.process?.listTitle ?? "공정" : area.supplyListTitle}{" "}
          (키보드 탐색)
        </h2>
        <ul>
          {mode === "taxonomy" &&
            area.categories.map((c) => (
              <li key={c.id}>
                <button onClick={() => setSelected(c.id)}>{c.name} — {area.familyLabelKo[c.family]}. {c.definition}</button>
              </li>
            ))}
          {mode === "process" &&
            (area.process?.steps ?? []).map((s) => (
              <li key={s.id}>
                <button onClick={() => setSelected(s.id)}>{s.index}. {s.name} — {s.why}</button>
              </li>
            ))}
          {mode === "supply" &&
            area.companies.map((c) => (
              <li key={c.id}>
                <button onClick={() => setSelected(c.id)}>{c.name} — {area.groupLabelKo[c.group]}, {c.type}. {c.note}</button>
              </li>
            ))}
        </ul>
      </nav>

      <Loader
        containerStyles={{ background: "#05060a" }}
        barStyles={{ background: "linear-gradient(90deg,#6366f1,#22d3ee)" }}
        dataStyles={{ color: "#94a3b8", fontFamily: "Inter, 'Noto Sans KR', system-ui, sans-serif", fontSize: 13 }}
        dataInterpolation={(p) => `불러오는 중… ${p.toFixed(0)}%`}
      />
    </div>
  );
}
