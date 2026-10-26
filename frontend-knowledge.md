# Frontend knowledge: immersive-task-manager
Last updated: 2026-10-21 by story US-001

## Stack
Stack: html | Styling: css | Language: javascript | Package manager: none | Theme: dark
Design brief: design/design-brief.md, user-directed Doing Club visual system | Tokens: assets/css/tokens.css | Motion library: native CSS / Web Animations API

## Structure
- index.html: semantic task dashboard.
- assets/css/: CSS design tokens, base styles, and responsive plum-and-citrus dashboard styles.
- assets/js/: in-memory task state, validation, and lazily loaded task motion.
- design/: approved project design brief.
- frontend-plans/: concepts and implementation plan.
- frontend-reports/: report, QA toolbox, screenshots, and accepted baselines.

## Commands
- install: none | start: python -m http.server 8080 --bind 127.0.0.1 | build: none | preview: python -m http.server 8080 --bind 127.0.0.1 | lint: none | test: skipped (plain HTML, package manager none)
- address: http://localhost:8080

## Conventions
- Use semantic HTML, CSS tokens, and vanilla JavaScript; keep task data in memory.
- Flat deep-plum canvas, citrus accents, bold sans-serif display type, and no glassmorphism, blur, or gradients.
- Use native opacity and transform motion; load the motion module only at widths of 768px and above and when reduced motion and Save-Data are off.
- Use `?mock=slow`, `?mock=empty`, and `?mock=error` for local loading, empty, and error QA states.
- Tasks do not persist across reloads; no backend or external runtime asset is used.

## Pages and Components
- `/`: one-page dashboard with accessible task form, in-memory list, completion/deletion controls, empty/loading/error states, and reduced-motion handling.

## Baseline
- No application build, lint, type-check, or unit-test runner is configured; browser QA uses isolated tools under `frontend-reports/qa/`.
