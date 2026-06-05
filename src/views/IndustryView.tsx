import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Scene, type Mode } from "../scene/Scene";
import { InfoPanel } from "../ui/InfoPanel";
import { Legend } from "../ui/Legend";
import { ViewToggle } from "../ui/ViewToggle";
import { ItemList } from "../ui/ItemList";
import { SupplyRelations } from "../ui/SupplyRelations";
import { AreaSelector } from "../ui/AreaSelector";
import { ProcessGuide } from "../ui/ProcessGuide";
import { NuclearParadigmPanel } from "../ui/NuclearParadigmPanel";
import { BusinessModelPanel } from "../ui/BusinessModelPanel";
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
  // 2D 오버레이 모드(3D 씬 위 풀-영역 패널) — 핵에너지·사업 모델. 이때 3D용 목록/패널은 숨김.
  const overlayMode = mode === "nuclear" || mode === "businessModel";

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

      {/* 모드 안내 (선택기 아래) — 2D 오버레이 모드(핵에너지·사업 모델)는 자체 헤더가 있어 숨김 */}
      {!overlayMode && (
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
      )}

      <ViewToggle area={area} mode={mode} onChange={changeMode} />

      {/* 공정 안내 배너 — 어떤 반도체를 만드는 과정인지 명시. 단계 선택 전(개요)에만 노출. */}
      {mode === "process" && selected === null && area.process && (
        <ProcessGuide process={area.process} areaName={area.name} />
      )}

      {/* 3D 모드(분류·공급망·공정) 패널 — 2D 오버레이 모드(핵에너지·사업 모델)에서는 전부 숨김 */}
      {!overlayMode && (
        <>
          {/* 공급망 모드 + 기업 선택 시: 좌측 열을 상세 '관계 인과' 패널로 전환(목록·범례 대체).
              그 외에는 기존 목록(ItemList) + 범례(Legend) 노출. */}
          {mode === "supply" && selected ? (
            <SupplyRelations area={area} selectedId={selected} onSelect={setSelected} />
          ) : (
            <>
              <ItemList area={area} mode={mode} selectedId={selected} onSelect={setSelected} />
              <Legend area={area} mode={mode} />
            </>
          )}
          <InfoPanel area={area} mode={mode} selectedId={selected} onClose={() => setSelected(null)} />
        </>
      )}

      {/* 핵에너지 모드 — ViewToggle에서 전환(전력 전용). 분류·공급망과 동급 모드로 전력 카테고리 안에 구분. */}
      {mode === "nuclear" && area.nuclear && <NuclearParadigmPanel />}

      {/* 사업 모델 모드 — ViewToggle에서 전환(반도체 전용). 팹리스/파운드리/IDM 업체별 설계·제조. */}
      {mode === "businessModel" && area.businessModel && <BusinessModelPanel info={area.businessModel} />}

      {/* Disclaimer (bottom-right) */}
      <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 20 }} className="pointer-events-none">
        <p className="text-[11px] text-slate-500">{area.dataDisclaimer}</p>
      </div>

      {/* 접근성: 스크린리더·키보드용 대체 콘텐츠. */}
      <nav className="sr-only" aria-label={`${area.name} ${mode === "taxonomy" ? "분류" : mode === "process" ? "공정" : mode === "nuclear" ? "핵에너지" : mode === "businessModel" ? "사업 모델" : "기업"} 목록`}>
        <h2>
          {area.name} —{" "}
          {mode === "taxonomy" ? area.taxonomyListTitle : mode === "process" ? area.process?.listTitle ?? "공정" : mode === "nuclear" ? area.nuclear?.listTitle ?? "핵에너지" : mode === "businessModel" ? area.businessModel?.listTitle ?? "사업 모델" : area.supplyListTitle}{" "}
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
