import { motion } from "framer-motion";
import { Cpu, Factory } from "lucide-react";
import type { BusinessModelInfo, BusinessModelGroup } from "../data/types";

/** 그룹별 액센트색 — 팹리스(amber) / 파운드리(sky) / IDM(violet). */
const GROUP_ACCENT: Record<string, string> = { fabless: "#f59e0b", foundry: "#38bdf8", idm: "#c084fc" };

/** 반도체 「사업 모델」 모드 뷰 — 분류·공급망·공정과 나란히 ViewToggle로 전환되는 반도체 전용 모드.
 *  팹리스/파운드리/IDM으로 묶어 업체별 설계·제조 역할을 보여 준다. */
export function BusinessModelPanel({ info }: { info: BusinessModelInfo }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="region"
      aria-label="반도체 사업 모델: 팹리스·파운드리·IDM 설계·제조 비교"
      className="absolute inset-0 z-[15] overflow-y-auto bg-space-900/92 px-3 pb-6 pt-[78px] backdrop-blur-xl sm:px-5 lg:px-7"
    >
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-4">
        <header className="glass-strong rounded-xl px-4 py-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-amber-200">팹리스</span>
            <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-2 py-1 text-sky-200">파운드리</span>
            <span className="rounded-full border border-violet-300/30 bg-violet-300/10 px-2 py-1 text-violet-200">IDM</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">사업 모델: 설계와 제조를 누가 하는가</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">{info.intro}</p>

          {/* 설계 vs 제조 요약 매트릭스 */}
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {info.groups.map((g) => (
              <div key={g.id} className="rounded-lg border bg-white/[0.04] p-3" style={{ borderColor: `${GROUP_ACCENT[g.id] ?? "#94a3b8"}44` }}>
                <div className="text-sm font-black" style={{ color: GROUP_ACCENT[g.id] ?? "#cbd5e1" }}>{g.label}</div>
                <div className="mt-1.5 flex flex-col gap-1 text-[11px]">
                  <span className="rounded bg-emerald-300/10 px-1.5 py-0.5 text-emerald-200">{g.designMark}</span>
                  <span className="rounded bg-sky-300/10 px-1.5 py-0.5 text-sky-200">{g.manufMark}</span>
                </div>
              </div>
            ))}
          </div>
        </header>

        {info.groups.map((g) => (
          <GroupSection key={g.id} group={g} />
        ))}
      </div>
    </motion.section>
  );
}

function GroupSection({ group }: { group: BusinessModelGroup }) {
  const accent = GROUP_ACCENT[group.id] ?? "#94a3b8";
  return (
    <section className="glass-strong rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-black text-white">
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: accent }} />
            {group.label}
            <span className="ml-2 align-middle text-[11px] font-bold text-slate-500">{group.companies.length}개사</span>
          </h3>
          <p className="mt-1 max-w-3xl text-[13px] leading-6 text-slate-300">{group.modelSummary}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-1 text-[11px]">
          <span className="rounded-md border border-emerald-300/25 bg-emerald-300/10 px-2 py-1 font-semibold text-emerald-200">{group.designMark}</span>
          <span className="rounded-md border border-sky-300/25 bg-sky-300/10 px-2 py-1 font-semibold text-sky-200">{group.manufMark}</span>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {group.companies.map((c) => (
          <article key={c.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-black text-white">{c.name}</span>
              <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: `${accent}22`, color: accent }}>{c.oneLiner}</span>
            </div>
            <dl className="mt-2 space-y-2 text-[12px] leading-5">
              <div className="rounded-md border border-emerald-300/15 bg-emerald-300/[0.06] p-2">
                <dt className="flex items-center gap-1 font-bold text-emerald-200"><Cpu size={12} aria-hidden="true" /> 설계</dt>
                <dd className="mt-0.5 text-slate-200">{c.design}</dd>
              </div>
              <div className="rounded-md border border-sky-300/15 bg-sky-300/[0.06] p-2">
                <dt className="flex items-center gap-1 font-bold text-sky-200"><Factory size={12} aria-hidden="true" /> 제조</dt>
                <dd className="mt-0.5 text-slate-200">{c.manufacturing}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[11px] leading-4 text-slate-400">{c.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
