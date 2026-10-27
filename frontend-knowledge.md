# Frontend knowledge: logiclab
Last updated: 2026-10-27 by story US-001

## Stack
Stack: html | Styling: css | Language: javascript | Package manager: npm (Vite and Three.js) | Theme: dark
Design brief: `design/design-brief.md` is an existing task-manager brief; protected from changes. The LogicLab US-001 story and configured NOTES are the visual authority for this feature.
Tokens: `assets/css/tokens.css` | Motion: native CSS/IntersectionObserver and lazily loaded Three.js for the approved 3D hero.

## Structure
- `index.html`: the SPA document; `/` is the homepage and `/simulator` is the ALU workbench.
- `assets/css/`: design tokens, accessible base styles, and responsive layouts.
- `assets/js/logic/alu.js`: pure shared four-bit ALU calculations and validation.
- `assets/js/logic/alu.test.js`: Node built-in unit tests.
- `assets/js/home.js`, `assets/js/simulator.js`: route-specific UI behavior.
- `assets/js/motion/hero-scene.js`: optional lazy Three.js hero scene, with static fallback.
- `frontend-plans/`: story plans.
- `frontend-reports/`: visual QA, screenshots and story reports.

## Commands
- install: `npm install`
- start: `npm run dev -- --host 127.0.0.1`
- build: `npm run build`
- lint/type check: none configured
- test: `npm test` (Node built-in test runner)
- address: `http://127.0.0.1:5173`

## Conventions
- No UI framework; semantic HTML, CSS custom-property tokens, and vanilla JavaScript modules.
- ALU math and input parsing stay presentation-independent; homepage preview and simulator share the same engine.
- The four-bit sum wraps modulo 16 and exposes carry-out separately.
- Keep all simulation client-side and in memory; do not introduce accounts, APIs, persistence, or extra routes.
- The scene is optional, dynamically imported, and disabled for reduced motion, Save-Data, and viewports below 768px. Static SVG preserves content.
- No external runtime fonts, images, scripts, or API calls.

## Pages and Components
- `/`: seven-section LogicLab homepage with accessible navigation and an interactive ALU preview.
- `/simulator`: operation controls, four-bit inputs, circuit visualization, result, truth table, execution trace, and reset.

## Baseline
- No app source, package manifest, build, lint, type-check, or application test runner existed before this story.
- Node, npm, Python, and browser-test packages are available in the workspace.
