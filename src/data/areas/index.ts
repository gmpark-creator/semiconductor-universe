// data/areas/index.ts
// Knowledge Atlas 영역 레지스트리. 새 지식 영역을 추가하면 여기 배열에만 등록하면 된다
// (반도체 → 전력 → … 수십·수백 개까지 확장 가능).
import type { AtlasArea } from "../types";
import { semiconductorArea } from "./semiconductor";
import { powerArea } from "./power";

export const AREAS: AtlasArea[] = [semiconductorArea, powerArea];

export const DEFAULT_AREA_ID = semiconductorArea.id;

export function getArea(id: string): AtlasArea {
  return AREAS.find((a) => a.id === id) ?? AREAS[0];
}
