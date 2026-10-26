# Frontend Report: US-001 - LogicLab Interactive ALU Simulator
Date: 2026-10-27 | Task: build | Stack: html | API mode: mock | Workflow: v2.0
Plan: [US-001-logiclab-interactive-alu-simulator-frontend-plan.md](../frontend-plans/US-001-logiclab-interactive-alu-simulator-frontend-plan.md)

## 1. Summary
**Outcome:** DONE WITH NOTES — all implementation, checks, and QA gates pass; visual pixel comparison against the existing baselines was unavailable because those files belong to the previous task-manager app, so they were preserved and LogicLab's screenshots were saved as a separate baseline set.
Tasks: 8/8 | ACs covered: 42/42 | Checks: 4/4 | QA gates: 31/31 | Visual checks: verified
Design: `design/design-brief.md`, existing brief mismatches this story and was protected; concept V2, user-approved | Motion: rich (native CSS/IntersectionObserver and lazy Three.js)

## 2. Acceptance Criteria Evidence
| AC | Class | Tasks | Evidence | Status (Verified / Unverified / Not done) |
|---|---|---|---|---|
| AC-1 | In scope | T-04, T-06 | Homepage presents LogicLab, ALU heading, supporting copy, animated/fallback circuit art, and Launch Simulator. Desktop scene loads when eligible. | Verified |
| AC-2 | In scope | T-01, T-04 | Home, Simulator, and About navigation labels and the two routes are present; navigation flows and About anchor pass. | Verified |
| AC-3 | In scope | T-04 | Seven required homepage sections render in the prescribed order; full-page captures show reveal content. | Verified |
| AC-4 | In scope | T-02, T-04 | Original engineering-lab presentation uses the user-approved navy/blue palette with periwinkle signal accents; no template or borrowed layout. | Verified |
| AC-5 | In scope | T-02, T-04, T-06 | Homepage uses a scroll narrative and circuit visuals; simulator has a separate workbench layout. Responsive screenshots captured. | Verified |
| AC-6 | In scope | T-02, T-04, T-05 | Custom binary controls, operation selectors, output indicators, and circuit diagrams are implemented. | Verified |
| AC-7 | In scope | T-01, T-05 | Launch Simulator, Simulator, and Home navigation flows reach their expected routes without sign-in. | Verified |
| AC-8 | In scope | T-05 | Simulator exposes four independently controllable bits for each labeled input; bit-to-decimal synchronization flow passes. | Verified |
| AC-9 | In scope | T-03, T-05 | AND, OR, XOR, and ADD reference flows return their expected results. | Verified |
| AC-10 | In scope | T-05 | Switch and decimal input synchronization passes; invalid decimal values are rejected. | Verified |
| AC-11 | In scope | T-03, T-05 | Result output is four-bit and decimal; ADD carry-out is verified for zero and overflow cases. | Verified |
| AC-12 | In scope | T-05 | Circuit state is driven from the shared calculation and updates with simulator input/operation changes; reference and consistency flows pass. | Verified |
| AC-13 | In scope | T-05 | Reset restores both operands to zero, AND, and the matching zero result. | Verified |
| AC-14 | In scope | T-05 | Truth Table expands; ADD displays the full-adder table. | Verified |
| AC-15 | In scope | T-05 | Execution Trace arithmetic text matches current operands, result, and carry-out. | Verified |
| AC-16 | In scope | T-03, T-04 | Homepage preview supports the shared operations engine; ADD result and carry-out reference flows pass. | Verified |
| AC-17 | In scope | T-04, T-05 | Circuit component details are inspectable by keyboard and pointer and expose purpose text. | Verified |
| AC-18 | In scope | T-03, T-05 | Invalid decimal input displays the exact required message and withholds stale output. | Verified |
| AC-19 | In scope | T-03, T-05 | `1111 + 0001` returns `0000` with carry-out `1`. | Verified |
| AC-20 | In scope | T-03, T-05 | AND, OR, XOR, and ADD reference cases return `0001`, `0111`, `0110`, and `1000` respectively; unit tests also cover these operations. | Verified |
| AC-21 | In scope | T-03, T-05 | Output, trace, and signal visualization are derived from the actual shared ALU calculation, not a decorative animation. | Verified |
| AC-22 | In scope | T-02, T-04 | Required homepage sections have visible meaningful content; screenshot/reveal checks pass. | Verified |
| AC-23 | In scope | T-05 | Initial simulator state is `0000`, `0000`, AND, and output `0000`. | Verified |
| AC-24 | In scope | T-05 | Operation, input, trace, output, and reset flows remain consistent. | Verified |
| AC-25 | In scope | T-01, T-05 | Route and interaction flows complete without blank/stale panels; homepage and simulator return HTTP 200 at all configured viewports. | Verified |
| AC-26 | In scope | T-02, T-06 | Hero uses coordinated CSS and signal motion; eligible desktop Three.js scene loads without obscuring the action. | Verified |
| AC-27 | In scope | T-04, T-06 | Injected IntersectionObserver initialization failure leaves all reveal content visible. | Verified |
| AC-28 | In scope | T-04, T-05 | Binary values and signal states are shown textually as well as visually; calculation and circuit state remain linked. | Verified |
| AC-29 | In scope | T-05 | Simulator calculation responds immediately to input and operation changes; all reference flows pass. | Verified |
| AC-30 | In scope | T-02 | Motion duration and easing values are centralized in CSS tokens; spot-check found no stray color literals outside the token file. | Verified |
| AC-31 | In scope | T-02, T-06 | Reduced-motion mode keeps content visible and does not request the Three.js module. | Verified |
| AC-32 | In scope | T-02, T-05 | Keyboard flow reaches navigation and circuit controls; skip link and visible focus are verified; axe has no serious/critical issues. | Verified |
| AC-33 | In scope | T-02, T-05 | Semantic controls, labels, validation/status messages, and WCAG AA axe checks pass at the configured route/viewports. | Verified |
| AC-34 | In scope | T-05 | Binary switches expose current values/states; operation and bit values are not communicated by color alone. | Verified |
| AC-35 | In scope | T-02, T-07 | Both routes pass at 375x667, 768x1024, and 1280x720 without horizontal overflow; 320px and 200% text checks also pass. | Verified |
| AC-36 | In scope | T-02, T-05 | Mobile layout keeps inputs, circuit, output, and trace usable; mobile screenshots and overflow checks pass. | Verified |
| AC-37 | In scope | T-04, T-05 | Circuit inspection works with pointer and keyboard; visible purpose text does not depend on hover. | Verified |
| AC-38 | In scope | T-01, T-05, T-06 | Simulated WebGL unavailability retains the accessible SVG fallback and runtime alert. | Verified |
| AC-39 | In scope | T-03 | ALU parsing, calculation, formatting, and validation are isolated in a pure shared module. | Verified |
| AC-40 | In scope | T-03 | Eight Node tests pass, covering supported operations, validation, formatting, carry-out, trace, truth tables, and reset. | Verified |
| AC-41 | In scope | T-07, T-08 | Configured unit tests, production build, QA harness syntax, and Git whitespace checks pass; no lint or type-check script is configured. | Verified |
| AC-42 | In scope | T-07, T-08 | Six genuine screenshots cover both pages at all configured widths. Existing task-manager baselines were non-comparable; screenshot-only comparisons were not reported as pixel diffs, and a separate LogicLab baseline set is saved. | Verified |

## 3. Checks
| Check | Command | Result |
|---|---|---|
| Unit tests | `npm test` | Pass: 8 tests, 0 failures. |
| Production build | `npm run build` | Pass: Vite production build completed. Vite reports the lazy hero chunk above 500 KB uncompressed; its gzip output is 130.87 KB, within the 250 KB motion budget. |
| QA harness syntax | `node --check frontend-reports/qa/qa.mjs` | Pass. |
| Patch whitespace | `git diff --check` | Pass. |
| Lint / type-check | Not configured | Not applicable. |

## 4. Visual QA
| Gate | First run | Final | Notes |
|---|---|---|---|
| G1 Renders and console | Fail on 4 page checks | Pass | Final application console errors/warnings and failed requests: 0. Chromium emitted GPU-driver ReadPixels diagnostics at 768px; the QA harness records these separately from application issues. |
| G2 Horizontal scroll | Fail at 320px on `/` | Pass | No overflow at 320px or configured widths; 200% text sizing passes on both routes. |
| G3 axe-core | Fail on simulator accessible names | Pass | No critical or serious violations on final route/viewport checks. |
| G4 Lighthouse | Pass | Pass | Mobile medians across three runs: homepage 100 performance / 100 accessibility; simulator 99 / 100. Median CLS 0.000064644; median TBT 0 ms homepage / 114 ms simulator. |
| G5 Page weight | Pass | Pass | Largest measured initial transfer: 141.21 KB; lazy Three.js chunk: 130.87 KB gzip. |
| G6 Visual baseline | Not comparable | Pass | Prior root baselines belong to the task-manager story and have different dimensions; simulator baselines did not exist. Preserved prior files and saved six new LogicLab baselines in a story-specific folder. Pixel difference: n/a, not 0%. |
| G7 Reduced motion | Pass | Pass | All content remains visible; Three.js chunk is not requested. |
| G8 Motion fallback | Fail on first run | Pass | Save-Data/mobile uses the static hero; heavy module is not requested. |
| G9 AC flows | Pass | Pass | All 20 functional flows passed, including operation references, synchronization, invalid input, carry-out, reset, component inspection, and navigation. |
| G10 States | Not applicable | Pass | Simulator is in-memory only; there are no API or asynchronous loading/empty/error states. |
| G11 Keyboard | Pass | Pass | Skip link, visible focus, navigation, and keyboard component inspection pass; no trap was observed. |
| G12 Text size | Fail on first run | Pass | 200% root text size passes on both routes at all three configured widths. |

| Page | Viewport | Theme | Result | Screenshot | Baseline difference |
|---|---:|---|---|---|---|
| `/` | 375x667 | dark | Pass | [index_375.png](screenshots/index_375.png) | n/a; old baseline dimensions differ |
| `/` | 768x1024 | dark | Pass | [index_768.png](screenshots/index_768.png) | n/a; old baseline dimensions differ |
| `/` | 1280x720 | dark | Pass | [index_1280.png](screenshots/index_1280.png) | n/a; old baseline dimensions differ |
| `/simulator` | 375x667 | dark | Pass | [simulator_375.png](screenshots/simulator_375.png) | n/a; no prior baseline |
| `/simulator` | 768x1024 | dark | Pass | [simulator_768.png](screenshots/simulator_768.png) | n/a; no prior baseline |
| `/simulator` | 1280x720 | dark | Pass | [simulator_1280.png](screenshots/simulator_1280.png) | n/a; no prior baseline |

Rounds used: 2 of 2. Unresolved QA defects: none. Screenshot masks: none. Baseline updated: yes, six LogicLab images saved to `baseline/US-001-logiclab-interactive-alu-simulator/`; earlier task-manager baseline images were not overwritten.

First-run evidence: 11/19 QA gates passed; all 20 functional flows passed. The first-run results did not preserve a reliable per-AC first-pass classification, so the AC first-pass metric is `n/a` rather than inferred from aggregate gate counts.

## 5. Metrics
| Metric | Value |
|---|---|
| Workflow | v2.0 |
| AC first-pass | n/a (first-run evidence is not mapped per AC) |
| AC total | 42 |
| Fix loops | 2 (no Check retries; two QA rounds) |
| QA rounds | 2 |
| Lighthouse performance / accessibility | 99 / 100 (lowest median across pages) |
| Largest initial transfer | 141.21 KB |
| Production bundle | 148.16 KB gzip total; largest chunk 522.75 KB raw / 130.87 KB gzip |
| Visual difference | n/a (no valid prior baseline comparison) |
| Elapsed minutes / tokens | n/a (Step 1 timestamp / token counter unavailable in this continuation) |

## 6. Changes
| File | Created / Changed | Task |
|---|---|---|
| `README.md`, `index.html` | Created | T-01, T-04, T-05 |
| `package.json`, `package-lock.json` | Created | T-01, T-06 |
| `assets/favicon.svg` | Created | T-01 |
| `assets/css/tokens.css`, `assets/css/styles.css` | Created | T-02 |
| `assets/js/app.js`, `assets/js/controls.js`, `assets/js/home.js`, `assets/js/simulator.js` | Created | T-01, T-04, T-05 |
| `assets/js/logic/alu.js`, `assets/js/logic/alu.test.js` | Created | T-03 |
| `assets/js/motion/hero-scene.js` | Created | T-06 |
| `frontend-plans/US-001-logiclab-interactive-alu-simulator-frontend-plan.md` | Created | T-01–T-08 |
| `frontend-reports/previews/US-001-logiclab-interactive-alu-simulator/preview-notes.md` and four preview images | Created | T-04 |
| `frontend-reports/qa/package.json`, `frontend-reports/qa/qa.mjs` | Created | T-07 |
| `frontend-reports/screenshots/` | Six final captures | T-07 |
| `frontend-reports/baseline/US-001-logiclab-interactive-alu-simulator/` | Six story-scoped baselines | T-07 |
| `frontend-reports/US-001-logiclab-interactive-alu-simulator-frontend-report.md` | Created | T-08 |
| `learnings/common-failures.md`, `learnings/metrics.csv`, `design/taste-notes.md` | Updated/created | T-08 |

`frontend-knowledge.md` already contains the LogicLab stack/routes/conventions in the existing worktree. It also has pre-existing user edits, so it was left untouched and excluded from this task's commit. `.vscode/user-stories/test.md` and `frontend-config.md` contain pre-existing user changes and were not modified or staged.

## 7. What Changed and Why
Omitted (`EXPLAIN=no`).

## 8. Dependencies Added
| Package | Version | Licence | Size | Why |
|---|---|---|---|---|
| `three` | 0.186.1 | MIT | 130.87 KB gzip chunk | Approved optional 3D circuit hero; lazy loaded with static fallback. |
| `vite` | 7.3.7 | MIT | Build tool; not in runtime transfer | SPA routing and production bundling. |
| `@axe-core/playwright` | 4.14.0 | MPL-2.0 | QA-only | Accessibility gate in isolated toolbox. |
| `chrome-launcher` | 1.2.2 | Apache-2.0 | QA-only | Runs Lighthouse against production preview. |
| `lighthouse` | 13.5.0 | Apache-2.0 | QA-only | Performance/accessibility measurements. |
| `pixelmatch` | 6.0.0 | ISC | QA-only | Screenshot comparison support. |
| `playwright` | 1.64.1 | Apache-2.0 | QA-only | Browser flows, screenshots, and viewport checks. |
| `pngjs` | 7.0.0 | MIT | QA-only | Screenshot image decoding for comparisons. |

## 9. Motion
| Effect | Technique or library | Reduced-motion behaviour | Mobile fallback | Weight KB |
|---|---|---|---|---|
| Hero circuit scene | Lazy Three.js module and native CSS | Static visual; scene is not requested | Inline SVG; no 3D below 768px or with Save-Data | 130.87 gzip |
| Section entrances | IntersectionObserver and CSS transforms/opacity | Content visible without motion | Same content; reduced effects | 0 |
| Circuit signal updates | SVG state and CSS transitions | Immediate final state | Same accessible SVG | 0 |
| Control feedback | Native CSS transitions | No non-essential motion | Keyboard focus remains visible | 0 |

## 10. Expected API
None. All ALU operations run locally in the browser.

## 11. Needs Backend and Not Done
No backend work is required. No requested asset remains missing. Visual pixel comparison to an existing LogicLab baseline was not possible on this first run; the prior task-manager images were preserved and a separate LogicLab baseline set was created.

## 12. Defect Fixes
| ID | Severity | Root cause or problem | Fix | Location |
|---|---|---|---|---|
| QA-01 | Medium | Narrow viewport and 200% text scaling exposed horizontal overflow. | Adjusted responsive sizing/layout; rechecked at 320px and 200% text. | `assets/css/styles.css` |
| QA-02 | Medium | Simulator circuit controls did not include visible gate/result context in their accessible names. | Included visible gate/result text in accessible names; axe final checks pass. | `index.html`, `assets/js/simulator.js` |
| QA-03 | Low | Save-Data fallback did not expose the expected static hero in the first gate run. | Corrected fallback selection while continuing to skip Three.js on constrained/mobile mode. | `assets/js/app.js`, `assets/js/home.js` |
| QA-04 | Low | Reveal fallback and hidden-tab lifecycle needed explicit robustness checks. | Keep content visible if observer setup fails; pause and resume the hero loop with page visibility. | `assets/js/home.js`, `assets/js/motion/hero-scene.js` |

## 13. Learnings and Proposals
Learning entries added: L-006, L-007, L-008 (candidate, count 1 each). No promotions or proposals. Applied learnings: preserve visible link text in accessible names; keep reduced-motion/static fallbacks; test keyboard flow and actual screenshot pixels. Evaluator not due: fewer than five metrics rows have accumulated.

## 14. Assumptions, Risks and Recommendations
- The configured design brief is an existing task-manager brief. Per workflow priority, the LogicLab story, NOTES, and the user's approved V2 palette govern this work; the protected brief was not changed.
- The previous root baselines belong to another story and have different dimensions. They were preserved; LogicLab baselines are isolated in a story-specific subfolder.
- Vite reports the optional Three.js chunk exceeds its 500 KB uncompressed warning threshold. Its gzip size is within the configured 250 KB motion budget and it is lazy-loaded.
- Chromium produced GPU-driver ReadPixels warnings at 768px during WebGL screenshots; the final QA harness records these as browser diagnostics, not application console failures.

## 15. How to Run
1. `npm ci`
2. `npm run dev -- --host 127.0.0.1`
3. Open `http://127.0.0.1:5173/` or `http://127.0.0.1:5173/simulator`.
4. Run tests with `npm test`; create a production build with `npm run build`.
No mock/live API switch is needed.

## 16. Setup You Must Do
Not applicable; `API_MODE=mock`, with no API configuration.

## 17. Third-Party Components
| Item | Source URL | License | Status | Attribution used (and where) | Files | Adapted to tokens and accessibility |
|---|---|---|---|---|---|---|
| Borrowed site components/assets | none | none | none borrowed | Not applicable | None | Original implementation; no borrowed UI/assets. |

The configured external site was inspiration-only; no site assets, components, or layout were reused. No third-party runtime font or image host is requested.

## 18. Preview and Taste Notes
Preview: variants shown 2 of 3 | variant kept V2 | screenshots `previews/US-001-logiclab-interactive-alu-simulator/preview-v2-1280.png`, `preview-v2-390.png` | status verified.
Variety concept: none (no prior like entries).
Taste notes: entries used 0, set aside 0; added: navy/blue palette with periwinkle signal accent; preference for softer editorial forms over square-heavy card layouts.
