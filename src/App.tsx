import { useState } from "react";
import { IndustryView } from "./views/IndustryView";
import { TheoryView } from "./views/TheoryView";
import { SectionNav, type Section } from "./ui/SectionNav";

/**
 * Knowledgeverse(놀리지버스) — 대분류 2층 구조의 최상위 셸.
 *  · 산업    → 3D 지식 영역(반도체·전력 …)
 *  · 기초이론 → 학교 과학 학습 자료(초/중/고)
 */
export default function App() {
  const [section, setSection] = useState<Section>("industry");

  return (
    <div className="relative w-full h-full overflow-hidden">
      {section === "industry" ? <IndustryView /> : <TheoryView />}
      <SectionNav section={section} onChange={setSection} />
    </div>
  );
}
