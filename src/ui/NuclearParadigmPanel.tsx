import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Atom,
  Calculator,
  Cpu,
  Factory,
  Radiation,
  Scale,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  calculateNuclearFuel,
  getNuclearSummary,
  nuclearRoutes,
  postNuclearCalculate,
  type CalculatedFuelWeight,
  type NuclearCalculateResponse,
  type NuclearSummaryResponse,
} from "../api/power/nuclear";

const ENERGY_COLORS: Record<CalculatedFuelWeight["id"], string> = {
  coal: "#a16207",
  uranium: "#38bdf8",
  fusion: "#c084fc",
};

const MAX_TARGET_GW = 20;

/** 전력 유니버스 「핵에너지」 모드 뷰 — 분류·공급망과 나란히 ViewToggle로 전환되는 전력 전용 모드. */
export function NuclearParadigmPanel() {
  const [targetGw, setTargetGw] = useState(1);
  const summary = useMemo(() => {
    const result = getNuclearSummary();
    return result.ok ? result.data : null;
  }, []);
  const calculation = useMemo(() => {
    const result = postNuclearCalculate({ targetGw });
    if (result.ok) return result.data;
    const fallback = calculateNuclearFuel({ targetGw: 1 });
    return fallback.ok ? fallback.data : null;
  }, [targetGw]);

  if (!summary || !calculation) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="region"
      aria-label="핵에너지 패러다임 비교 대시보드"
      className="absolute inset-0 z-[15] overflow-y-auto bg-space-900/92 px-3 pb-6 pt-[78px] backdrop-blur-xl sm:px-5 lg:px-7"
    >
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-4">
        <header className="glass-strong rounded-xl px-4 py-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-amber-200">전력 유니버스 · 핵에너지 모드</span>
            <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2 py-1 text-sky-200">Mock API Contract</span>
            <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-2 py-1 text-violet-200">Log Scale Visualization</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">핵에너지 패러다임: 핵분열 vs 핵융합</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
            전력 유니버스의 한 모드입니다 — 우측 상단 전환 버튼에서 분류·공급망과 나란히 「핵에너지」를 선택해 들어옵니다.
            실제 서버가 없는 Vite 앱 구조를 유지하면서 `/api/power/nuclear/*` 계약은 타입 안전한 컨트롤러 함수로 분리했습니다.
          </p>
        </header>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-4">
            <NuclearParadigmGrid summary={summary} />
            <FuelEfficiencyChart calculation={calculation} />
          </main>
          <aside className="space-y-4">
            <InteractiveCalculator targetGw={targetGw} onChange={setTargetGw} calculation={calculation} />
            <RouteContractCard />
          </aside>
        </div>
      </div>
    </motion.section>
  );
}

function NuclearParadigmGrid({ summary }: { summary: NuclearSummaryResponse }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DashboardCard
        title="핵분열 원전"
        eyebrow="Commercial Operational"
        icon={<Radiation size={18} aria-hidden="true" />}
        accent="#38bdf8"
      >
        <div className="grid gap-2">
          <MetricRow label="운영상태" value="상업 운전" />
          <MetricRow label="노심 온도" value={`${summary.fission.coreTemperatureCelsius.toLocaleString("ko-KR")} °C`} />
          <MetricRow label="연료" value={summary.fission.fuelType} />
          <MetricRow label="1GW 연간 연료" value={`${summary.fission.annualFuelPer1GWTons.toLocaleString("ko-KR")} 톤`} />
          <MetricRow label="폐기물" value="고준위 방사성 폐기물" />
          <MetricRow label="공급 지속성" value={`약 ${summary.fission.globalSupplyYears.toLocaleString("ko-KR")}년`} />
        </div>
        <p className="mt-4 rounded-lg border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-xs leading-5 text-sky-100">
          핵분열은 이미 상업 전력망에 연결된 고출력 기저 발전원입니다. 핵심 리스크는 장수명 방사성 폐기물과 안전 규제입니다.
        </p>
      </DashboardCard>

      <DashboardCard
        title="핵융합 발전"
        eyebrow="Engineering Prototype Test"
        icon={<Sparkles size={18} aria-hidden="true" />}
        accent="#c084fc"
        glow
      >
        <div className="mb-3 flex flex-wrap gap-2">
          <NeonBadge label="Core Temp: >100M °C" />
          <NeonBadge label="Energy Gain: Q > 1" />
        </div>
        <div className="grid gap-2">
          <MetricRow label="개발상태" value="공학 실증·프로토타입 시험" />
          <MetricRow label="노심 온도" value={`${summary.fusion.coreTemperatureCelsius.toLocaleString("ko-KR")} °C`} />
          <MetricRow label="연료" value="중수소 + 삼중수소" />
          <MetricRow label="1GW 연간 연료" value={`${summary.fusion.annualFuelPer1GWKg.toLocaleString("ko-KR")} kg`} />
          <MetricRow label="폐기물" value="비독성 헬륨 가스 중심" />
          <MetricRow label="공급 지속성" value={`약 ${summary.fusion.globalSupplyYears.toLocaleString("ko-KR")}년`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.fusion.keyTechStack.map((stack) => (
            <span key={stack} className="rounded-md border border-violet-300/30 bg-violet-300/10 px-2 py-1 text-[11px] font-semibold text-violet-100">
              {stack}
            </span>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

function FuelEfficiencyChart({ calculation }: { calculation: NuclearCalculateResponse }) {
  const values = calculation.calculatedWeights;
  const maxLog = Math.max(...values.map((item) => Math.log10(item.amountTons)));
  const minLog = Math.min(...values.map((item) => Math.log10(item.amountTons)));
  const span = Math.max(1, maxLog - minLog);
  const ticks = [0.1, 1, 10, 100, 1_000, 10_000, 100_000, 1_000_000, 10_000_000];

  return (
    <DashboardCard
      title="연료 효율 로그 스케일 차트"
      eyebrow={`${calculation.targetGw.toLocaleString("ko-KR")}GW 기준`}
      icon={<Scale size={18} aria-hidden="true" />}
      accent="#f59e0b"
    >
      <p className="mb-4 text-sm leading-6 text-slate-300">
        선형 막대 차트에서는 핵융합 연료가 사실상 보이지 않으므로, Y축을 로그 스케일로 정규화했습니다.
        막대 높이는 질량의 실제 차이를 왜곡하지 않고 비교 가능하게 압축한 값입니다.
      </p>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_210px]">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <svg viewBox="0 0 720 330" role="img" aria-label="석탄, 우라늄, 핵융합 연료 사용량 로그 스케일 막대 차트" className="h-auto w-full">
            <line x1="72" x2="690" y1="282" y2="282" stroke="rgba(226,232,240,0.25)" />
            <line x1="72" x2="72" y1="32" y2="282" stroke="rgba(226,232,240,0.25)" />
            {ticks.map((tick) => {
              const y = 282 - ((Math.log10(tick) - Math.log10(0.1)) / (Math.log10(10_000_000) - Math.log10(0.1))) * 250;
              if (y < 32 || y > 282) return null;
              return (
                <g key={tick}>
                  <line x1="72" x2="690" y1={y} y2={y} stroke="rgba(148,163,184,0.12)" />
                  <text x="62" y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="11">
                    {formatCompact(tick)}t
                  </text>
                </g>
              );
            })}
            {values.map((item, index) => {
              const x = 135 + index * 190;
              const normalized = (Math.log10(item.amountTons) - minLog) / span;
              const height = 58 + normalized * 178;
              const y = 282 - height;
              const color = ENERGY_COLORS[item.id];
              return (
                <g key={item.id}>
                  <rect x={x} y={y} width="86" height={height} rx="10" fill={color} opacity="0.9" />
                  <rect x={x} y={y} width="86" height={height} rx="10" fill="url(#barShine)" opacity="0.32" />
                  <text x={x + 43} y={y - 12} textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">
                    {item.amountTons < 1 ? `${item.amount.toLocaleString("ko-KR")}kg` : `${formatCompact(item.amountTons)}t`}
                  </text>
                  <text x={x + 43} y="306" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="700">
                    {item.label}
                  </text>
                </g>
              );
            })}
            <defs>
              <linearGradient id="barShine" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="grid content-start gap-2">
          {values.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-white">{item.label}</span>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: ENERGY_COLORS[item.id], boxShadow: `0 0 12px ${ENERGY_COLORS[item.id]}` }} />
              </div>
              <div className="mt-2 text-lg font-black text-white">
                <AnimatedNumber value={item.amount} formatter={(v) => formatMass(v, item.unit)} />
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-400">석탄 대비 질량 비율 {formatRatio(item.relativeToCoal)}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}

function InteractiveCalculator({
  targetGw,
  onChange,
  calculation,
}: {
  targetGw: number;
  onChange: (value: number) => void;
  calculation: NuclearCalculateResponse;
}) {
  const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (!Number.isFinite(next)) return;
    onChange(Math.min(MAX_TARGET_GW, Math.max(0.1, next)));
  };

  return (
    <DashboardCard title="출력 목표 계산기" eyebrow="POST /api/power/nuclear/calculate" icon={<Calculator size={18} aria-hidden="true" />} accent="#34d399">
      <label htmlFor="nuclear-target-gw" className="flex items-center gap-2 text-sm font-bold text-slate-100">
        <SlidersHorizontal size={16} aria-hidden="true" />
        목표 발전 출력(GW)
      </label>
      <div className="mt-3 grid gap-3">
        <input
          id="nuclear-target-gw"
          type="range"
          min="0.1"
          max={MAX_TARGET_GW}
          step="0.1"
          value={targetGw}
          onChange={updateValue}
          aria-label="목표 발전 출력 슬라이더"
          className="w-full accent-emerald-300"
        />
        <input
          type="number"
          min="0.1"
          max={MAX_TARGET_GW}
          step="0.1"
          value={targetGw}
          onChange={updateValue}
          aria-label="목표 발전 출력 숫자 입력"
          className="w-full rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-right text-lg font-black text-white outline-none transition focus:border-emerald-300/70"
        />
      </div>
      <div className="mt-4 space-y-2">
        {calculation.calculatedWeights.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              {item.id === "coal" ? <Factory size={14} aria-hidden="true" /> : item.id === "uranium" ? <Atom size={14} aria-hidden="true" /> : <Zap size={14} aria-hidden="true" />}
              {item.label}
            </span>
            <span className="text-sm font-black text-white">
              <AnimatedNumber value={item.amount} formatter={(v) => formatMass(v, item.unit)} />
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

function RouteContractCard() {
  return (
    <DashboardCard title="라우터 계약" eyebrow="Backend extension shim" icon={<Cpu size={18} aria-hidden="true" />} accent="#60a5fa">
      <div className="space-y-2">
        {nuclearRoutes.map((route) => (
          <div key={`${route.method}-${route.path}`} className="rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded px-2 py-0.5 text-[11px] font-black ${route.method === "GET" ? "bg-sky-300/15 text-sky-200" : "bg-emerald-300/15 text-emerald-200"}`}>
                {route.method}
              </span>
              <code className="break-all text-xs text-slate-200">{route.path}</code>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">
        이 앱에는 실제 서버가 없으므로 라우트는 타입 안전한 컨트롤러 함수로 제공됩니다. 서버가 추가되면 같은 핸들러를 기존 라우터에 연결하면 됩니다.
      </p>
    </DashboardCard>
  );
}

function DashboardCard({
  title,
  eyebrow,
  icon,
  accent,
  glow = false,
  children,
}: {
  title: string;
  eyebrow: string;
  icon: ReactNode;
  accent: string;
  glow?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className="glass-strong rounded-xl p-4"
      style={{ boxShadow: glow ? `0 0 32px ${accent}24` : undefined, borderColor: glow ? `${accent}55` : undefined }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>{eyebrow}</div>
          <h3 className="text-lg font-black text-white">{title}</h3>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5" style={{ color: accent }}>
          {icon}
        </div>
      </div>
      {children}
    </section>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[118px_1fr] gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-100">{value}</span>
    </div>
  );
}

function NeonBadge({ label }: { label: string }) {
  return (
    <span className="animate-pulse rounded-full border border-fuchsia-300/50 bg-fuchsia-300/10 px-2.5 py-1 text-xs font-black text-fuchsia-100 shadow-[0_0_18px_rgba(192,132,252,0.28)]">
      {label}
    </span>
  );
}

function AnimatedNumber({ value, formatter }: { value: number; formatter: (value: number) => string }) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const start = previous.current;
    const delta = value - start;
    const startedAt = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 420);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + delta * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        previous.current = value;
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{formatter(display)}</>;
}

function formatMass(value: number, unit: "tons" | "kg") {
  const rounded = value >= 1_000 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded.toLocaleString("ko-KR")}${unit === "tons" ? "톤" : "kg"}`;
}

function formatCompact(value: number) {
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000).toLocaleString("ko-KR")}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000).toLocaleString("ko-KR")}K`;
  if (value >= 1) return value.toLocaleString("ko-KR");
  return value.toFixed(2);
}

function formatRatio(value: number) {
  if (value === 1) return "1.0";
  if (value < 0.000001) return value.toExponential(2);
  return value.toLocaleString("ko-KR", { maximumFractionDigits: 8 });
}
