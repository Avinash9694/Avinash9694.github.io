# avinash9694.github.io

My personal homepage: who I am, a few things I've built, where I've worked and how to reach me.

**Live:** [avinash9694.github.io](https://avinash9694.github.io/)

![The homepage in light mode](docs/screenshot.png)

## Stack

- [Astro](https://astro.build) 7, static output. Every word on the page is plain HTML.
- Plain CSS: one token file (`src/styles/global.css`) plus scoped styles per component. Light by default, dark when the system asks for it.
- React only inside the graph island, with [React Three Fiber](https://r3f.docs.pmnd.rs), drei and three.js.
- Vitest for the layout and data logic. ESLint and Prettier, zero warnings.
- Deployed to GitHub Pages by `.github/workflows/deploy.yml`, which runs lint, format check, typecheck, tests and the build first.

## How the graph works

The hero shows my projects and the technology each one uses as a small 3D graph.

1. `src/data/graph.ts` is the one list of projects. The Projects section and the graph both read it, so a project's tech list is literally the graph's edges.
2. `src/lib/layout.ts` runs a seeded force-directed layout (springs on edges, every pair pushing apart, a weak pull to the centre) **at build time**. The browser never runs a simulation; it receives fixed positions.
3. `src/lib/projection.ts` projects those positions through the scene's starting camera into an inline SVG. That drawing is what everyone sees first, and it stays as the permanent view with reduced motion, no WebGL, data saver on, or a low-end touch device (`src/lib/render-3d.ts`).
4. Otherwise `src/components/graph/` loads with `client:visible`, then lazily imports the three.js scene. It renders the same layout from the same camera, fades in over the drawing, and turns slowly. Hovering a node lights up its neighbours; clicking a project scrolls to its entry. Drag rotates it horizontally; the mouse wheel and vertical swipes still scroll the page. Rendering pauses when the graph is off screen or the tab is hidden.

The canvas is `aria-hidden`; the Projects list is the accessible version of the same information.

## Running it

Node 22.23 or later.

```sh
npm install
npm run dev          # http://localhost:4321
npm test             # layout, projection and data tests
npm run lint
npm run typecheck    # astro check + tsc
npm run build        # static site in dist/
```

## License

MIT, see [LICENSE](LICENSE).
