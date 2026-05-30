import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// 자체 호스팅 라틴 폰트 (런타임 외부 호출 0 — Google Fonts 대체).
// 한글은 시스템 폰트(맑은 고딕 / Apple SD Gothic Neo)로 폴백 → 외부 의존 없이 즉시 표시.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
