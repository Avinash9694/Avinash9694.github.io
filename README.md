# avinash9694.github.io

My portfolio, built as one continuous 3D world that you scroll through.

Live: https://avinash9694.github.io/

![The projects station: nine screenshot frames on a helix, the active one pulled up in front of the camera](docs/screenshot.png)

## What it is

A dark floating workspace island (desk, monitor, keyboard, lamp, plant, mug) with my name in extruded gold letters above it. Scrolling moves the camera along a path through five stations: Hero, About, Experience, Projects and Contact. The HTML for each section sits on top of the canvas and is the same markup screen readers and crawlers get.

- Hero: the name as `Text3D` letters over the island; the monitor runs a typed line through a `RenderTexture`.
- About: the camera glides to the monitor, which switches to my photo.
- Experience: three glowing nodes on a luminous tube, oldest first. Each node's card lists every bullet for that role.
- Projects: nine screenshot frames on a helix the camera flies through. The nearest frame eases up in front of the camera and tilts toward the cursor. Click it, or the Live button, to open the project.
- Contact: the camera pulls up to show the whole island from above.

## How it works

- `src/lib/camera-path.ts` holds the camera keyframes (scroll progress, position, look-at). Both are fed through a `CatmullRomCurve3`; `progressToT` maps scroll progress onto the curve so keyframe `i` is reached at exactly `t = i / (n - 1)`.
- `src/lib/progress-map.ts` splits progress into five equal section bands and places sub-stations for the three roles and nine projects. Nav links, the progress rail, arrow keys and the project stepper all just scroll to a station; the camera follows.
- Scrolling is Lenis, mapped to a zustand `progress` value by a single GSAP ScrollTrigger over a 600vh spacer. Nothing is pinned.
- `src/lib/device-tier.ts` picks a tier: `high` (WebGL2, fine pointer, 6+ cores) gets bloom, vignette, grain, a blurred reflector floor and DPR up to 1.75; `medium` drops post-processing, the blur and most particles; `low` (no WebGL, data saver, reduced motion, or a touch device with 4 cores or fewer) renders a static page with no canvas at all. `?tier=high|medium|low` forces one. A `PerformanceMonitor` steps `high` down to `medium` if the frame rate drops.
- The static page is also prerendered into `dist/index.html` at build time (`scripts/prerender.mjs`), so the content is there before any JavaScript runs.
- The 3D letters use a typeface JSON generated from Syne ExtraBold by `scripts/build-typeface.mjs` (`npm run typeface`).

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck, bundle, prerender into dist/
npm run preview
```

Checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run format:check`. The deploy workflow runs all four before publishing `dist/` to GitHub Pages.

## Stack

React 19, TypeScript, Vite, three.js with React Three Fiber, drei and postprocessing, GSAP ScrollTrigger, Lenis, zustand, maath, CSS Modules, Vitest.

## Fonts

Syne and Manrope (SIL Open Font License) via Google Fonts for the page; a subset of Syne ExtraBold and JetBrains Mono ship in `public/fonts/` for the 3D text.

## License

MIT
