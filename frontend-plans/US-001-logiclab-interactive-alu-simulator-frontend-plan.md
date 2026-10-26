# Frontend Plan: logiclab - logiclab-interactive-alu-simulator
Story: US-001 | Date: 2026-10-27 | Task: build | State: empty | Stack: html | Workflow: v2.0

## 1. Summary
Create an original LogicLab homepage and a separate, responsive `/simulator` workspace for a functional four-bit ALU. Use accessible HTML, CSS tokens, vanilla JavaScript, a shared tested simulation module, and an optional Three.js hero scene with a static fallback.

## 2. Resolved Settings and Decisions
| Setting | Value | How decided (config / detected / default) |
|---|---|---|
| FRONTEND_STACK | html | Empty project default: two routes, no API |
| STYLING | css | Empty html project default |
| LANGUAGE | javascript | Empty html project default |
| PACKAGE_MANAGER | npm | Three.js and Vite are required for the approved 3D scene and exact SPA routes |
| START_COMMAND | `npm run dev -- --host 127.0.0.1` | Vite script added for the app |
| APP_BASE_URL | `http://127.0.0.1:5173` | Vite default |
| THEME | dark | Config |
| API_MODE / API_SOURCES | mock / none | Config; all simulation runs locally |
| UNIT_TESTS | yes | Config; Node built-in test runner avoids a test dependency |
| MOTION | rich | Config and story |
| MOTION_LIBRARY | native | Native CSS/IntersectionObserver for UI motion; Three.js for approved 3D |
| THREE_D | yes | Explicit user approval in config |
| DESIGN_APPROVAL | off | Auto; configured design brief exists |
| GIT_REPO / GIT_MODE | DURANKAL/AI-Frontend-Workflow-Blueprint / push | Config now matches origin |
| BUDGET_PAGE_KB / BUDGET_MOTION_KB | 500 / 250 | Config and rich-motion default |
| VIEWPORTS | 375x667, 768x1024, 1280x720 | Config |
| A11Y_LEVEL | AA | Config |

- Requirements summary: digital-electronics students can learn from an immersive LogicLab homepage and operate a correct, inspectable, four-bit ALU without sign-in.
- Selected story: US-001, `.vscode/user-stories/test.md`; 42 acceptance criteria, all in scope for the frontend.
- Derived values: `FEATURE_NAME=logiclab-interactive-alu-simulator`; `GIT_BRANCH=frontend/US-001-logiclab-interactive-alu-simulator`; `PLAN_FILE=frontend-plans/US-001-logiclab-interactive-alu-simulator-frontend-plan.md`; `REPORT_FILE=frontend-reports/US-001-logiclab-interactive-alu-simulator-frontend-report.md`; `FRONTEND_DIR=.`; `EXT=js`; `COMPONENT_EXT=html`.
- Project discovery: no app source, package manifest, frontend framework, tokens, or application test runner exists. Root `node_modules` is ignored and only contains browser tooling; it is not app source. Node and npm are available. The existing Git origin matches the configured repository.
- Configured `design/design-brief.md` exists but describes a different task manager. The workflow says not to modify an existing brief, while story ACs and run NOTES require a distinct LogicLab engineering-laboratory identity. Per the workflow's priority order, use the story and NOTES for LogicLab-specific visual decisions; leave the existing brief untouched and record this conflict as a risk.
- Existing taste notes: none. No taste entries applied or set aside. Resources list read; no reusable component or asset chosen, so no borrowed items.
- Relevant learnings loaded: L-001 (decorative text contrast), L-002 (preserve visible link text in accessible names), L-003 (remove hover transforms under reduced motion), L-004 (keep keyboard-flow checks in visual order), L-005 (baseline comparison must measure actual pixels).
- Scope assumption: use npm/Vite solely to resolve `/simulator` to the SPA entry and bundle the local Three.js dependency; do not add a UI framework. Use Node's native `node:test` so no test-runner dependency is required.

## 3. Design and Motion
- Design brief: `design/design-brief.md`, existing/user-directed but mismatched (task-manager). No concept chosen. Do not change the brief; the more specific LogicLab story and run NOTES control this feature's design.
- Visual direction: an original engineering instrument, not a generic dashboard: near-black graphite canvas, precise grid and hairline rules, compact technical labels, restrained electric-cyan signals, muted violet for alternate paths, and high-contrast warm-neutral type. The homepage tells a scroll-led story; the simulator is a separate, calm workbench. Use system fonts and original inline SVG/canvas graphics.
- Taste notes: no file or entries read; none applied or set aside.
- MOTION: rich, config/story. MOTION_LIBRARY: native; no animation package. THREE_D: yes, approved explicitly by user. The Three.js fundamentals, geometry, animation, materials, and lighting skills are available and loaded. BUDGET_PAGE_KB=500; BUDGET_MOTION_KB=250.

| Effect | Element | Trigger | Technique or library | Duration and easing tokens | Reduced-motion behaviour | Mobile fallback | Est. KB |
|---|---|---|---|---|---|---|---|
| Circuit hero reveal and signal flow | Homepage hero | First paint and computed preview state | Lazy Three.js module, CSS opacity/transform | `--duration-slow`, `--ease-out` | Static diagram and no loop | Inline SVG; do not initialize WebGL below 768px | Three.js bundle within 250 KB compressed budget (verify) |
| Section entrances | Homepage sections | IntersectionObserver | Native CSS opacity/transform | `--duration-base`, `--ease-out` | Content visible without JS; no transform | Shorter reveal; all content remains visible | 0 |
| Circuit path updates | Simulator SVG | Input/operation change | SVG classes and native CSS | `--duration-fast`, `--ease-out` | Immediate final state | Same accessible SVG | 0 |
| Control feedback | Switches, buttons, operation selector | Pointer/keyboard | Native CSS opacity/transform | `--duration-fast`, `--ease-out` | No hover transform; visible focus remains | No hover-only affordance | 0 |

## 4. Design Tokens
Create `assets/css/tokens.css` as the sole source for palette, type, spacing, radii, borders, layers, shadows, motion durations, and easing. Initial visual values:
| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#111522` | Page background |
| `--color-panel` | `#1E263B` | Opaque work surfaces |
| `--color-panel-raised` | `#303D59` | Selected/raised controls |
| `--color-text` | `#DCE3EF` | Primary text |
| `--color-muted` | `#98A9C4` | Secondary text and signal-high |
| `--color-signal` | `#ADB8E7` | User-selected periwinkle signal and primary action |
| `--color-violet` | `#98A9C4` | Muted alternate operation path |
| `--color-border` | `#536684` | Dividers and controls |
| `--color-zero` | `#98A9C4` | Logic-zero, paired with visible `0` |
| `--duration-fast/base/slow` | `140ms / 240ms / 520ms` | Consistent motion |
| `--ease-out` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Reveal and feedback |
- Contrast verification: selected palette keeps the six user-provided navy/blue colors and adds the requested `#ADB8E7` periwinkle accent. Final WCAG ratios to be calculated before implementation review.

## 5. Pages and Routes
| Route or file | Purpose | AC |
|---|---|---|
| `/` (`index.html`) | Immersive, seven-section scrolling homepage with shared navigation and working ALU preview | 1-6, 7, 16-17, 22, 26-28, 30-37 |
| `/simulator` (same SPA entry) | Dedicated four-bit ALU workbench with inputs, operation, circuit, output, truth table, and trace | 7-15, 18-25, 29, 31-42 |
| `assets/js/logic/alu.js` | Pure, shared calculation and validation logic | 9-11, 15-16, 18-21, 23-24, 39-40 |

## 6. Components
- Shared header/navigation: product mark and exact Home, Simulator, About links; route-aware active state; new; AC-2, 7, 32, 35.
- Homepage story sections: Hero, Understanding the ALU, Operations in Action, Inside the Circuit, Experience the Simulation, About the Project, Footer, in required order; new; AC-1, 3-6, 22, 26-28, 30-37.
- Interactive operation preview: 4-bit switches, operation selector, binary/decimal readout; same pure engine as the full simulator; new; AC-16, 39-40.
- Three.js hero scene: lightweight original 3D board/chip and computed signal path, dynamically imported only when eligible; static SVG fallback; new; AC-1, 5, 26-28, 31, 38.
- Simulator input bank: four labeled binary toggle buttons per operand, synchronized decimal number input, field validation; new; AC-8, 10, 13, 18, 23-24, 32-34, 36, 40.
- Operation selector and output: AND/OR/XOR/ADD, four-bit result, decimal result, ADD carry-out; new; AC-9, 11, 19-21, 23-24.
- Data-driven circuit SVG: gate/full-adder path, bit-level signal labels and states derived from the shared computation; keyboard-inspectable components; new; AC-12, 17, 21, 24, 28, 37.
- Truth Table and Execution Trace: native disclosure and current-operation/current-input explanation; new; AC-14-15, 24.
- Reset and status: restores zero operands and AND; validation/runtime messages and output announcements; new; AC-13, 18, 24-25, 33, 38.

## 7. Screens and States
- `/`: compact responsive header, composed hero and circuit visualization, seven meaningful sections, inline working preview, About anchor, and footer. There is no data-loading state; unsupported WebGL, failed dynamic import, reduced motion, and mobile use the static SVG without hiding content. Tab order follows the document; About scrolls within the page.
- `/simulator`: responsive input banks, operation selector, live circuit and output, then trace and expandable truth table. Starts at A=`0000`, B=`0000`, operation=`AND`, output=`0000`; invalid text retains the user's entry, sets `aria-invalid`, and displays the story's exact error; recover to valid input or Reset. No network/loading state.
- Exact required labels: `LogicLab`, `Launch Simulator`, `Home`, `Simulator`, `About`, `Input A`, `Input B`, `Operation`, `Output`, `AND`, `OR`, `XOR`, `ADD`, `Reset`, `Truth Table`, `Execution Trace`. Validation text: `Enter a valid 4-bit binary number or a decimal integer from 0 to 15.`
- Keyboard: skip link first; semantic links/buttons/inputs; native disclosure for the table; labeled switches expose pressed/on state and current bit; component inspections are focusable and operable by keyboard; visible 2px focus ring. Announce errors via alert and successful result/operation changes via status. Route changes update title and focus the page h1.
- At 375px stack inputs, visualization, output, trace; use SVG fallback. At 768px use compact two-column workbench and responsive hero fallback. At 1280px use wide editorial homepage and two-column simulator. No content depends on hover; avoid horizontal page overflow.

## 8. Data and API
No API sources and no network calls. Operands and operations are in-memory local state only.

Simulation contract: `parseBinary`, `parseDecimal`, `format4`, and `calculate(a, b, operation)` accept unsigned integers 0-15 or strict four-bit binary strings, and one supported operation. AND/OR/XOR return a four-bit value and decimal result; ADD returns low four bits plus independent carry-out. Invalid inputs throw a typed validation error and never produce a success-shaped result. Homepage preview and simulator call the exact same functions.

## 9. Tasks
| ID | Task | AC | Files |
|---|---|---|---|
| T-01 | Establish Vite app, routes, semantics, shared navigation | 1-7, 22, 25, 32, 35, 38 | `package.json`, lock file, `index.html`, `assets/js/app.js` |
| T-02 | Define tokens, responsive styles, accessible states and reduced motion | 4-6, 22, 26-37 | `assets/css/tokens.css`, `assets/css/styles.css` |
| T-03 | Implement and unit-test pure ALU engine | 9-11, 15-16, 18-21, 39-40 | `assets/js/logic/alu.js`, `assets/js/logic/alu.test.js` |
| T-04 | Build homepage narrative, shared preview, interactive component explainers | 1-6, 7, 16-17, 22, 26-28, 30-37 | `index.html`, `assets/js/app.js`, `assets/js/home.js` |
| T-05 | Build simulator controls, synchronized inputs, circuit, output, truth table and trace | 8-15, 18-25, 29, 32-38 | `index.html`, `assets/js/simulator.js`, `assets/js/logic/alu.js` |
| T-06 | Add eligible lazy Three.js hero and static/mobile/reduced-motion fallback | 1, 5, 26-31, 38 | `assets/js/motion/hero-scene.js`, `assets/js/app.js`, package manifest/lock |
| T-07 | Run unit, build, and accessibility/responsive/functional visual QA | 32-42 | app files, `frontend-reports/qa/`, `frontend-reports/screenshots/` |
| T-08 | Review, record real metrics and report; commit and push configured branch | all in-scope ACs | `frontend-reports/US-001-logiclab-interactive-alu-simulator-frontend-report.md`, `frontend-knowledge.md`, `learnings/metrics.csv`, branch |

## 10. Traceability
| AC | Tasks |
|---|---|
| 1-7 | T-01, T-04, T-06 |
| 8-15 | T-05 |
| 16-17 | T-04, T-05 |
| 18-21 | T-03, T-05 |
| 22 | T-02, T-04 |
| 23-25 | T-05 |
| 26-31 | T-02, T-04, T-06 |
| 32-34 | T-02, T-05 |
| 35-37 | T-02, T-04, T-05 |
| 38 | T-01, T-05, T-06 |
| 39-40 | T-03 |
| 41-42 | T-07, T-08 |

## 11. Needs Backend, Assumptions and Risks
- Needs backend: none.
- Assumptions: homepage editorial copy can be authored to explain the story's required concepts; use inline original vector artwork; npm/Vite is justified by exact client-side routing and local Three.js bundling; test pure logic with Node's built-in runner.
- Risk: the pre-existing configured brief is for a task manager and is workflow-protected. This plan records the conflict and applies the higher-priority LogicLab story/NOTES without editing the brief.
- Risk: WebGL may be unavailable or unsuitable. Feature-detect, catch initialization errors explicitly, retain an accessible static SVG, and never make ALU state/results depend on the 3D scene.
- Risk: keep Three.js lazy and desktop-only; measure actual compressed transfer size, page weight, and Lighthouse results.

## 12. Borrowed Items
No items borrowed; the resources list is available but no suitable implementation or licensed asset is needed.

| Item | Source URL | Type | License (as read) | Status | License page read this run (yes / not needed) | Attribution | Adaptation to tokens and accessibility | Extra packages |
|---|---|---|---|---|---|---|---|---|

## 13. Preview Variants
| Variant | What differs from the earlier variants | Screenshots | Answer |
|---|---|---|---|
| V1 | First LogicLab original engineering-lab concept; no previous variant | `frontend-reports/previews/US-001-logiclab-interactive-alu-simulator/preview-v1-1280.png`, `frontend-reports/previews/US-001-logiclab-interactive-alu-simulator/preview-v1-390.png` | another; user feedback saved in `frontend-reports/previews/US-001-logiclab-interactive-alu-simulator/preview-notes.md` |
| V2 | User-requested blue palette `#111522`, `#1E263b`, `#303D59`, `#536684`, `#98A9C4`, `#DCE3EF`, with user-selected periwinkle signal `#ADB8E7`; serif display type, oval hero illustration, open operation rows, and circular binary controls instead of bordered cards | `frontend-reports/previews/US-001-logiclab-interactive-alu-simulator/preview-v2-1280.png`, `frontend-reports/previews/US-001-logiclab-interactive-alu-simulator/preview-v2-390.png` | V2 |
