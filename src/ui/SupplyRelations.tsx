import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AtlasArea, Company, SupplyEdge } from "../data/types";
import { assignPartnerColors } from "../scene/companyLayout";

interface Props {
  area: AtlasArea;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/**
 * 좌하단 공급망 관계 패널 (공급망 모드에서 기업 선택 시).
 *
 * 박사 지시: "왼쪽 아래 관계란을 더 디테일하게 — 더 자세한 인과관계를 설명하고,
 * 부족하면 + 버튼으로 상세 설명을 펼치게."
 *  - 선택 기업을 기준으로 '공급받음(←)' / '공급·납품(→)' 두 방향으로 관계를 나눠 보여준다.
 *  - 각 관계마다 색칩(화살표와 동일한 업체별 고유색·assignPartnerColors 공유) + 상대 기업명 +
 *    관계 라벨 + 한 줄 인과(cause). "+" 버튼을 누르면 상세 인과(detail)가 펼쳐진다.
 *  - 데이터에 detail이 없으면 회사 정보(note)로 설명을 자동 구성한다.
 */
export function SupplyRelations({ area, selectedId, onSelect }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const company = selectedId ? area.companies.find((c) => c.id === selectedId) ?? null : null;
  const partnerColors = useMemo(() => assignPartnerColors(selectedId, area.edges), [selectedId, area]);

  const incoming = useMemo(
    () => (selectedId ? area.edges.filter((e) => e.to === selectedId) : []),
    [selectedId, area],
  );
  const outgoing = useMemo(
    () => (selectedId ? area.edges.filter((e) => e.from === selectedId) : []),
    [selectedId, area],
  );

  if (!company) return null;
  const groupColor = area.groupColors[company.group] ?? "#94a3b8";
  const coOf = (id: string): Company | undefined => area.companies.find((c) => c.id === id);
  const nameOf = (id: string) => coOf(id)?.name ?? id;

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // detail이 없으면 회사 정보로 인과 설명을 구성(박사: "구성해서라도 추가 설명을 넣어라").
  const composeDetail = (edge: SupplyEdge): string => {
    if (edge.detail) return edge.detail;
    const fromCo = coOf(edge.from);
    const toCo = coOf(edge.to);
    const fromN = fromCo?.name ?? edge.from;
    const toN = toCo?.name ?? edge.to;
    const parts = [`${fromN}이(가) ${toN}에 대해 '${edge.label}' 관계입니다.`];
    if (fromCo?.note) parts.push(`${fromN}은(는) ${fromCo.note}.`);
    if (toCo?.note) parts.push(`${toN}은(는) ${toCo.note}.`);
    parts.push("이 때문에 두 주체 사이에 위와 같은 공급·거래 관계가 형성됩니다.");
    return parts.join(" ");
  };

  const total = incoming.length + outgoing.length;

  return (
    <AnimatePresence>
      <motion.aside
        key={company.id}
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 240 }}
        className="glass-strong thin-scroll"
        role="region"
        aria-label="공급망 관계"
        style={{
          position: "absolute", left: 16, top: 88, bottom: 16,
          width: "min(338px, 86vw)", overflowY: "auto", zIndex: 25, padding: "14px 14px 18px",
          borderRadius: 14,
        }}
      >
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">공급망 관계 · 인과</div>
        <div className="flex items-center gap-2 mb-1">
          <span style={{ width: 9, height: 9, borderRadius: 99, background: groupColor, boxShadow: `0 0 9px ${groupColor}`, flexShrink: 0 }} />
          <h3 className="text-base font-bold" style={{ color: groupColor, lineHeight: 1.2 }}>{company.name}</h3>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          {area.groupLabelKo[company.group] ?? company.group} · 연결 관계 {total}건
        </p>

        {total === 0 && (
          <p className="text-xs text-slate-400">표시할 공급망 관계가 없습니다.</p>
        )}

        {incoming.length > 0 && (
          <RelGroup title={`← 공급받음 · ${incoming.length}`} accent="#7dd3fc">
            {incoming.map((e) => (
              <RelRow
                key={e.id}
                color={partnerColors[e.from] ?? area.edgeColors[e.relationship] ?? "#94a3b8"}
                partnerName={nameOf(e.from)}
                dir="from"
                relLabel={e.label}
                cause={e.cause ?? e.label}
                detail={composeDetail(e)}
                open={expanded.has(e.id)}
                onToggle={() => toggle(e.id)}
                onGoPartner={() => onSelect(e.from)}
              />
            ))}
          </RelGroup>
        )}

        {outgoing.length > 0 && (
          <RelGroup title={`→ 공급·납품 · ${outgoing.length}`} accent="#fcd34d">
            {outgoing.map((e) => (
              <RelRow
                key={e.id}
                color={partnerColors[e.to] ?? area.edgeColors[e.relationship] ?? "#94a3b8"}
                partnerName={nameOf(e.to)}
                dir="to"
                relLabel={e.label}
                cause={e.cause ?? e.label}
                detail={composeDetail(e)}
                open={expanded.has(e.id)}
                onToggle={() => toggle(e.id)}
                onGoPartner={() => onSelect(e.to)}
              />
            ))}
          </RelGroup>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}

function RelGroup({ title, accent, children }: { title: string; accent: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: accent }}>{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

interface RowProps {
  color: string;
  partnerName: string;
  dir: "from" | "to";
  relLabel: string;
  cause: string;
  detail: string;
  open: boolean;
  onToggle: () => void;
  onGoPartner: () => void;
}

function RelRow({ color, partnerName, dir, relLabel, cause, detail, open, onToggle, onGoPartner }: RowProps) {
  // dir==="from": 상대가 나에게 공급(상대 →). dir==="to": 내가 상대에게 공급(→ 상대).
  const arrow = dir === "from" ? `${partnerName} →` : `→ ${partnerName}`;
  return (
    <div
      className="rounded-lg"
      style={{ background: "rgba(255,255,255,0.035)", border: `1px solid ${color}40`, borderLeft: `3px solid ${color}`, padding: "7px 9px" }}
    >
      <div className="flex items-start gap-2">
        <span style={{ width: 9, height: 9, borderRadius: 3, background: color, boxShadow: `0 0 7px ${color}`, flexShrink: 0, marginTop: 3 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <button
            onClick={onGoPartner}
            title="이 기업으로 이동"
            className="text-left hover:underline"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#f1f5f9", fontWeight: 700, fontSize: 12.5, lineHeight: 1.25 }}
          >
            {arrow}
          </button>
          <div className="text-[10.5px] mt-0.5" style={{ color }}>{relLabel}</div>
        </div>
        <button
          onClick={onToggle}
          aria-label={open ? "인과 설명 접기" : "인과 설명 펼치기"}
          aria-expanded={open}
          title={open ? "접기" : "자세한 인과관계 보기"}
          style={{
            flexShrink: 0, width: 20, height: 20, borderRadius: 6, lineHeight: "18px", textAlign: "center",
            background: open ? color : "rgba(255,255,255,0.08)", color: open ? "#05060a" : "#cbd5e1",
            border: `1px solid ${color}66`, cursor: "pointer", fontSize: 14, fontWeight: 800, padding: 0,
          }}
        >
          {open ? "−" : "+"}
        </button>
      </div>

      <p className="text-[11px] mt-1.5" style={{ color: "#cbd5e1", lineHeight: 1.45 }}>{cause}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="text-[11px] overflow-hidden"
            style={{ color: "#94a3b8", lineHeight: 1.5, marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {detail}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
