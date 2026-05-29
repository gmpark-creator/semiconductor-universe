# Semiconductor Universe

An interactive **3D visualization of the semiconductor landscape** — both the taxonomy of chip types and the supply chain that builds them. Built with React + Three.js.

## What it is

Two explorable 3D views, toggled from the top-right HUD:

- **Chip Taxonomy** — every semiconductor category is a glowing node arranged in family constellations (Logic, Memory, Analog, Power, Sensor, RF, Manufacturing), each with a simple procedural icon. Hover to highlight; click to fly the camera in and open a detail panel with definition, role, key specs, and example products.
- **Supply Chain** — a directed 3D graph of companies. Sphere radius ∝ √(market cap). Animated arrows show order / production / delivery flow with moving particles along curved tubes, colored by relationship:
  - design → foundry (orange)
  - foundry → customer (cyan)
  - equipment → foundry (purple)
  - IP / EDA → designer (green)

  Click a company for valuation, what it makes, and who it serves / is served by.

Dark-space scene with starfield, soft bloom, glassmorphism HUD, hover tooltips, ambient auto-rotate (pauses on interaction), and smooth camera fly-to.

## Run

```bash
npm install
npm run dev      # → http://localhost:5173
```

Production build / preview:

```bash
npm run build
npm run preview
```

## Tech stack

Vite · React + TypeScript · Three.js via [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) + [`@react-three/drei`](https://github.com/pmndrs/drei) · `@react-three/postprocessing` (bloom) · Tailwind CSS (HUD overlay) · framer-motion (panel transitions).

No backend. No external API calls at runtime — **all data is local** in `src/data/`.

## Updating the data

Every figure lives in two plain files, easy to edit:

- **`src/data/semiconductors.ts`** — chip categories: `id, name, family, color, icon, definition, role, keySpecs[], exampleProducts[]`.
- **`src/data/companies.ts`** — company nodes (`marketCapB`, `revenueB`, `type`, `group`, `note`) and supply-chain edges (`from → to`, `relationship`, `label`).

Change the numbers/text there and the 3D scene updates automatically — node sizes, colors, arrows, and panels all derive from these files.

## Accuracy

> **Figures are approximate, ~early 2026, for illustration only.** Market caps, revenues, and market shares are rounded ballpark values for conceptual mapping — **not** financial data or a source of record.

## Project structure

```
src/
  data/semiconductors.ts   # chip category dataset + types
  data/companies.ts        # company nodes + supply-chain edges
  scene/Scene.tsx          # main R3F canvas (modes, bloom, controls, fly-to)
  scene/CategoryNode.tsx   # 3D node + procedural icon per category
  scene/CompanyGraph.tsx   # company spheres + arrow edges
  scene/SupplyArrow.tsx    # animated directional flow arrow
  ui/InfoPanel.tsx         # slide-in detail panel (framer-motion)
  ui/Legend.tsx            # per-mode color legend
  ui/ViewToggle.tsx        # Chip Taxonomy <-> Supply Chain toggle
  App.tsx                  # canvas + HUD overlay + loading
```
