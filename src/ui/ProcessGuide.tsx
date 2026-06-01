import { useIsMobile } from "../hooks/useIsMobile";
import type { ProcessFlowData } from "../data/types";

/**
 * 공정 모드 안내 배너 — "이 공정이 어떤 반도체를 만드는 과정인지" 한눈에 알려준다.
 * 단계를 선택하면 InfoPanel(상세)이 열리므로, 이 배너는 선택 전(개요 상태)에만 노출한다.
 *  · 데스크탑: 상단 중앙(섹션 네비 아래)
 *  · 모바일: 하단 중앙(상단 좌측 레일과 겹치지 않도록)
 */
export function ProcessGuide({ process, areaName }: { process: ProcessFlowData; areaName: string }) {
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 22,
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
        ...(isMobile ? { bottom: 52, width: "92vw" } : { top: 72, width: "min(600px, 58vw)" }),
      }}
    >
      <div
        className="glass-strong rounded-2xl"
        style={{
          padding: isMobile ? "10px 14px" : "13px 20px",
          textAlign: "center",
          borderTop: "1px solid rgba(125,211,252,0.28)",
          boxShadow: "0 8px 30px rgba(2,6,12,0.45)",
        }}
      >
        <div
          style={{
            fontSize: isMobile ? 8.5 : 9.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#7dd3fc",
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          {areaName} · 공정 안내
        </div>
        <div style={{ fontSize: isMobile ? 14 : 16.5, fontWeight: 800, color: "#f1f5f9", marginBottom: 5, lineHeight: 1.3 }}>
          {process.subject}
        </div>
        <p style={{ margin: 0, fontSize: isMobile ? 11 : 12.5, lineHeight: 1.65, color: "#cbd5e1" }}>{process.intro}</p>
      </div>
    </div>
  );
}
