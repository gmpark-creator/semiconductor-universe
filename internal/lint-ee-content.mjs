// internal/lint-ee-content.mjs
// 전기·전자 공학(EE) 콘텐츠 규율 게이트. 스코프 = src/data/theory/ee-*.ts 만(기존 과학 콘텐츠 미검사).
// 검사: body 정확히 3문단 / 각 문단 110~180자 / keyTerms 3~4 / funFact 존재 / 존댓말 금지 / LaTeX 금지.
// 출력: lesson id별 위반 목록. 위반(FAIL) 있으면 exit 1.
//   실행: node internal/lint-ee-content.mjs   (repo 루트에서)
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = ["ee-basic.ts", "ee-inter.ts", "ee-adv.ts"].map((f) => join(root, "src/data/theory", f));

// ee-*.ts는 `export const X: Grade = { ...순수 데이터... };` 형태. 객체 리터럴만 뽑아 eval.
function loadGrade(path) {
  const src = readFileSync(path, "utf8");
  const eq = src.indexOf("=");
  const lastSemi = src.lastIndexOf("}");
  const literal = src.slice(eq + 1, lastSemi + 1).trim();
  return eval("(" + literal + ")");
}

const CHAR_MIN = 110, CHAR_MAX = 180;
const HONORIFIC = /(습니다|입니다|해요|이에요|이예요|예요|세요|하세요|어요|아요)([ .!?」"'’)\]]|$)/;
const LATEX = /(\$|\\frac|\\begin|\\left|\\right|\\[a-zA-Z]{2,}|\^\{|_\{)/;

let fails = 0, warns = 0, lessonCount = 0, unitCount = 0;
const report = [];

for (const path of files) {
  if (!existsSync(path)) { report.push(`(skip) 없음: ${path.split(/[\\/]/).pop()}`); continue; }
  let grade;
  try { grade = loadGrade(path); } catch (e) { report.push(`(ERR) 파싱 실패 ${path}: ${e.message}`); fails++; continue; }
  const units = grade.units ?? [];
  for (const u of units) {
    unitCount++;
    if (u.domain !== "전기·전자 공학") { report.push(`[${u.id}] FAIL domain: "${u.domain}" (기대 "전기·전자 공학")`); fails++; }
    if (!u.strand) { report.push(`[${u.id}] FAIL strand 없음`); fails++; }
    if (!u.summary) { report.push(`[${u.id}] FAIL summary 없음`); fails++; }
    if (!u.figureId) { report.push(`[${u.id}] FAIL figureId 없음`); fails++; }
    for (const [li, lesson] of (u.lessons ?? []).entries()) {
      lessonCount++;
      const id = lesson.id ?? `${u.id}-?${li}`;
      const body = lesson.body ?? [];
      if (!Array.isArray(body) || body.length !== 3) { report.push(`[${id}] FAIL body 문단수=${body.length} (기대 3)`); fails++; }
      body.forEach((p, pi) => {
        const n = [...String(p)].length;
        if (n < CHAR_MIN || n > CHAR_MAX) { report.push(`[${id}] WARN 문단${pi + 1} ${n}자 (권장 ${CHAR_MIN}~${CHAR_MAX})`); warns++; }
        if (HONORIFIC.test(p)) { report.push(`[${id}] FAIL 문단${pi + 1} 존댓말 감지: …${String(p).slice(-24)}`); fails++; }
        if (LATEX.test(p)) { report.push(`[${id}] FAIL 문단${pi + 1} LaTeX 감지`); fails++; }
      });
      const kt = lesson.keyTerms ?? [];
      if (kt.length < 3 || kt.length > 4) { report.push(`[${id}] FAIL keyTerms ${kt.length}개 (기대 3~4)`); fails++; }
      kt.forEach((t) => { if (LATEX.test(t.desc ?? "")) { report.push(`[${id}] FAIL keyTerm "${t.term}" desc LaTeX`); fails++; } });
      if (!lesson.funFact || !String(lesson.funFact).trim()) { report.push(`[${id}] FAIL funFact 없음`); fails++; }
      else if (HONORIFIC.test(lesson.funFact)) { report.push(`[${id}] FAIL funFact 존댓말`); fails++; }
      else if (LATEX.test(lesson.funFact)) { report.push(`[${id}] FAIL funFact LaTeX`); fails++; }
    }
  }
}

console.log(report.length ? report.join("\n") : "(위반·경고 없음)");
console.log(`\n── EE lint: 단원 ${unitCount} · 레슨 ${lessonCount} · FAIL ${fails} · WARN ${warns} ──`);
process.exit(fails > 0 ? 1 : 0);
