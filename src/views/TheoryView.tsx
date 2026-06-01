import { useMemo, useState } from "react";
import { scienceSubject } from "../data/theory";
import { DOMAIN_META, figureUrl, type ScienceDomain } from "../data/theory/types";

/**
 * 기초이론 — 학교 과학 학습 자료 뷰(2D 읽기 레이아웃).
 * 좌측: 과목 → 학교급(초/중/고) → 학년 → 단원 네비.
 * 우측: 단원 도해(SVG) + 레슨 본문 + 핵심 용어 + 흥미 사실.
 */
export function TheoryView() {
  const subject = scienceSubject;
  const [levelId, setLevelId] = useState(subject.levels[0].id);
  const [gradeIdx, setGradeIdx] = useState(0);
  const [unitId, setUnitId] = useState<string>(subject.levels[0].grades[0].units[0].id);

  const level = subject.levels.find((l) => l.id === levelId) ?? subject.levels[0];
  const ready = level.status === "ready" && level.grades.length > 0;
  const grade = ready ? level.grades[Math.min(gradeIdx, level.grades.length - 1)] : null;
  const unit = useMemo(
    () => grade?.units.find((u) => u.id === unitId) ?? grade?.units[0] ?? null,
    [grade, unitId],
  );

  const pickLevel = (id: string) => {
    const lv = subject.levels.find((l) => l.id === id);
    setLevelId(id);
    setGradeIdx(0);
    if (lv && lv.grades.length > 0) setUnitId(lv.grades[0].units[0].id);
  };
  const pickGrade = (i: number) => {
    setGradeIdx(i);
    const g = level.grades[i];
    if (g) setUnitId(g.units[0].id);
  };

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", background: "#070b16" }}>
      {/* ───── 좌측 네비 ───── */}
      <aside
        className="thin-scroll"
        style={{
          width: 286,
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(9,13,24,0.72)",
          overflowY: "auto",
          padding: "78px 16px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>🔬</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#f1f5f9" }}>{subject.name}</div>
            <div style={{ fontSize: 10.5, color: "#64748b" }}>기초이론</div>
          </div>
        </div>
        <p style={{ fontSize: 11.5, color: "#94a3b8", lineHeight: 1.55, margin: "6px 2px 16px" }}>{subject.tagline}</p>

        {/* 학교급 탭 */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {subject.levels.map((lv) => {
            const active = lv.id === levelId;
            const disabled = lv.status !== "ready";
            return (
              <button
                key={lv.id}
                onClick={() => pickLevel(lv.id)}
                title={disabled ? "준비 중" : lv.name}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  borderRadius: 9,
                  border: active ? `1px solid ${subject.accent}` : "1px solid rgba(255,255,255,0.08)",
                  background: active ? `${subject.accent}22` : "rgba(255,255,255,0.02)",
                  color: active ? "#e0f2fe" : disabled ? "#475569" : "#cbd5e1",
                  cursor: "pointer",
                  fontSize: 12.5,
                  fontWeight: active ? 700 : 500,
                  position: "relative",
                }}
              >
                {lv.shortName}
                {disabled && <span style={{ display: "block", fontSize: 8.5, color: "#475569", marginTop: 1 }}>준비중</span>}
              </button>
            );
          })}
        </div>

        {ready && grade ? (
          <>
            {/* 학년 칩 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {level.grades.map((g, i) => {
                const active = i === gradeIdx;
                return (
                  <button
                    key={g.grade}
                    onClick={() => pickGrade(i)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,
                      border: "none",
                      background: active ? subject.accent : "rgba(255,255,255,0.06)",
                      color: active ? "#04121f" : "#cbd5e1",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {g.grade}학년
                  </button>
                );
              })}
            </div>

            {/* 단원 목록 */}
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#475569", padding: "4px 4px 8px" }}>
              {grade.grade}학년 단원 · {grade.units.length}
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {grade.units.map((u, i) => {
                const active = u.id === unit?.id;
                const dm = DOMAIN_META[u.domain];
                return (
                  <button
                    key={u.id}
                    onClick={() => setUnitId(u.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      textAlign: "left",
                      padding: "9px 10px",
                      borderRadius: 9,
                      border: "none",
                      borderLeft: `3px solid ${active ? dm.color : "transparent"}`,
                      background: active ? "rgba(255,255,255,0.07)" : "transparent",
                      color: active ? "#fff" : "#cbd5e1",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: dm.color, flexShrink: 0 }} />
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 13, fontWeight: active ? 700 : 500 }}>
                        {String(i + 1).padStart(2, "0")}. {u.title}
                      </span>
                      <span style={{ display: "block", fontSize: 10, color: "#64748b" }}>{dm.label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </>
        ) : (
          <div style={{ padding: "20px 6px", color: "#64748b", fontSize: 12.5, lineHeight: 1.7 }}>
            {level.name} 과학 콘텐츠는 <b style={{ color: "#94a3b8" }}>준비 중</b>입니다.<br />
            먼저 <b style={{ color: subject.accent }}>초등학교</b>부터 채워 나가고 있어요.
          </div>
        )}
      </aside>

      {/* ───── 우측 읽기 패널 ───── */}
      <main className="thin-scroll" style={{ flex: 1, overflowY: "auto", padding: "84px 0 64px" }}>
        {unit ? (
          <article style={{ maxWidth: 760, margin: "0 auto", padding: "0 40px" }}>
            {/* 브레드크럼 */}
            <div style={{ fontSize: 11.5, color: "#64748b", marginBottom: 14, letterSpacing: "0.02em" }}>
              기초이론 <span style={{ opacity: 0.5 }}>›</span> {subject.name} <span style={{ opacity: 0.5 }}>›</span> {level.name}{" "}
              <span style={{ opacity: 0.5 }}>›</span> {grade?.grade}학년
            </div>

            {/* 단원 제목 + 영역 배지 */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "#f8fafc", margin: 0, letterSpacing: "-0.01em" }}>{unit.title}</h1>
              <DomainBadge domain={unit.domain} />
            </div>
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 22px" }}>{unit.summary}</p>

            {/* 도해 */}
            <figure style={{ margin: "0 0 30px" }}>
              <img
                src={figureUrl(unit.figureId)}
                alt={`${unit.title} 도해`}
                loading="lazy"
                style={{ width: "100%", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", display: "block", background: "#0f1729" }}
                onError={(e) => { (e.currentTarget.style.display = "none"); }}
              />
              <figcaption style={{ fontSize: 11.5, color: "#64748b", textAlign: "center", marginTop: 8 }}>
                그림. {unit.title}
              </figcaption>
            </figure>

            {/* 레슨들 */}
            {unit.lessons.map((lesson, li) => {
              const dm = DOMAIN_META[unit.domain];
              return (
                <section key={lesson.id} style={{ marginBottom: 34 }}>
                  <h2 style={{ fontSize: 19, fontWeight: 700, color: "#e2e8f0", margin: "0 0 12px", display: "flex", alignItems: "baseline", gap: 9 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: dm.color }}>{li + 1}</span>
                    {lesson.title}
                  </h2>
                  {lesson.body.map((p, pi) => (
                    <p key={pi} style={{ fontSize: 15.5, lineHeight: 1.92, color: "#cbd5e1", margin: "0 0 13px" }}>{p}</p>
                  ))}

                  {lesson.keyTerms.length > 0 && (
                    <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: dm.color, marginBottom: 9, fontWeight: 700 }}>핵심 용어</div>
                      <dl style={{ margin: 0, display: "grid", gap: 7 }}>
                        {lesson.keyTerms.map((kt) => (
                          <div key={kt.term} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                            <dt style={{ flexShrink: 0, minWidth: 96, fontSize: 13.5, fontWeight: 700, color: "#f1f5f9" }}>{kt.term}</dt>
                            <dd style={{ margin: 0, fontSize: 13.5, color: "#94a3b8", lineHeight: 1.6 }}>{kt.desc}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {lesson.funFact && (
                    <div style={{ marginTop: 12, padding: "12px 15px", borderRadius: 12, background: `${dm.color}14`, borderLeft: `3px solid ${dm.color}`, display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 17, flexShrink: 0 }}>💡</span>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#e2e8f0" }}>{lesson.funFact}</p>
                    </div>
                  )}
                </section>
              );
            })}

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, color: "#475569", fontSize: 11.5 }}>
              놀리지 아틀라스 · 기초이론 · {subject.name} · {level.name} {grade?.grade}학년
            </div>
          </article>
        ) : (
          <div style={{ maxWidth: 620, margin: "40px auto", padding: "0 40px", textAlign: "center", color: "#64748b" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📘</div>
            <h2 style={{ color: "#cbd5e1", fontWeight: 700 }}>{level.name} 과학 — 준비 중</h2>
            <p style={{ lineHeight: 1.7 }}>지금은 초등학교 과학부터 채워 나가고 있어요. 좌측에서 <b>초등</b>을 선택하면 학습을 시작할 수 있습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function DomainBadge({ domain }: { domain: ScienceDomain }) {
  const dm = DOMAIN_META[domain];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 11px",
        borderRadius: 999,
        background: `${dm.color}1f`,
        border: `1px solid ${dm.color}55`,
        color: dm.color,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      <span>{dm.emoji}</span>
      {dm.label}
    </span>
  );
}
