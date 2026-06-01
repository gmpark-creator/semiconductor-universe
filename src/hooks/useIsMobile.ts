import { useEffect, useState } from "react";

/** 화면 너비가 max(기본 768px) 이하면 true. 모바일 레이아웃 전환용. */
export function useIsMobile(maxWidth = 768): boolean {
  const query = `(max-width: ${maxWidth}px)`;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, [query]);
  return isMobile;
}
