# Common failures
Updated: 2026-10-27 | Workflow: v2.0

### L-001 | tags: a11y, contrast | status: candidate | count: 1 | first_seen: 2026-10-21 | last_seen: 2026-10-21
Lesson: Keep oversized decorative numerals above the 3:1 contrast threshold even when they are hidden from assistive technology.
Evidence: frontend-reports/US-001-immersive-task-manager-frontend-report.md#4

### L-002 | tags: a11y, naming | status: candidate | count: 1 | first_seen: 2026-10-21 | last_seen: 2026-10-21
Lesson: Avoid redundant aria-label values on links when they replace rather than include the visible link text.
Evidence: frontend-reports/US-001-immersive-task-manager-frontend-report.md#4

### L-003 | tags: motion, accessibility | status: candidate | count: 1 | first_seen: 2026-10-21 | last_seen: 2026-10-21
Lesson: Static and reduced-motion modes must remove hover transforms as well as transition animations.
Evidence: frontend-reports/US-001-immersive-task-manager-frontend-report.md#4

### L-004 | tags: qa, keyboard | status: candidate | count: 1 | first_seen: 2026-10-21 | last_seen: 2026-10-21
Lesson: Update keyboard-flow assertions when the page adds or changes focusable links before the main form.
Evidence: frontend-reports/US-001-immersive-task-manager-frontend-report.md#4

### L-005 | tags: qa, visual | status: candidate | count: 1 | first_seen: 2026-10-21 | last_seen: 2026-10-21
Lesson: Make screenshot gates compare pixels against baselines and fail above the configured threshold instead of returning a constant pass.
Evidence: frontend-reports/US-001-immersive-task-manager-frontend-report.md#4

### L-006 | tags: layout, a11y | status: candidate | count: 1 | first_seen: 2026-10-27 | last_seen: 2026-10-27
Lesson: Test narrow viewport overflow and 200% text resizing independently; passing one does not guarantee the other.
Evidence: frontend-reports/US-001-logiclab-interactive-alu-simulator-frontend-report.md#4

### L-007 | tags: a11y | status: candidate | count: 1 | first_seen: 2026-10-27 | last_seen: 2026-10-27
Lesson: Interactive SVG controls need accessible names that retain their visible gate and result context.
Evidence: frontend-reports/US-001-logiclab-interactive-alu-simulator-frontend-report.md#4

### L-008 | tags: motion | status: candidate | count: 1 | first_seen: 2026-10-27 | last_seen: 2026-10-27
Lesson: A Save-Data or mobile motion fallback must render the static hero content, not only skip the heavy animation module.
Evidence: frontend-reports/US-001-logiclab-interactive-alu-simulator-frontend-report.md#4
