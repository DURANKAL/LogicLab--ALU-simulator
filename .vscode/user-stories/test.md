# US-000: <Short feature title>

ID: US-000
Motion: subtle

<!-- Motion: none | subtle | rich. Leave the line out to default to subtle.
     3D is NOT set here. It is set with THREE_D in frontend-config.md.
     The story's heading text after the first ":" becomes FEATURE_NAME, so keep it short. -->

## Story

As a <role>, I want <goal>, so that <value>.

## Acceptance Criteria

<!-- One checkable true/false condition per number. Give exact visible text in quotes.
     Delete the groups you do not need. Renumber at the end. -->

### Layout and visual design
1. The page shows the exact heading "<heading>", <supporting text>, and <main controls>.
2. The design uses <theme: background, surfaces, typography, accent>, with clearly distinguishable interactive elements.

### Core behaviour
3. The input shows the exact placeholder "<placeholder>". The visitor can <action> by clicking "<button label>" or pressing Enter in the field.
4. When <valid action>, <result> appears in <where>.
5. Each <item> shows <fields> and the buttons "<Action 1>" and "<Action 2>", which have accessible names.
6. When the visitor clicks "<Action 1>", <result>. The item remains visible.
7. When the visitor clicks "<Action 2>", <result>. Other items stay unchanged.

### Validation and messages
8. When the input is empty or whitespace-only, the page shows the exact message "<error text>", nothing is added, and the field shows an error state.

### Screen states
9. When there is no data, the page shows the exact empty message "<empty text>".
10. Moving between the empty and populated states is smooth, in both directions.

### Motion (include only if Motion is subtle or rich)
11. <Item> entrance and exit use <opacity and a small position change> and cause no layout shift.
12. Animations never block clicking, typing, scrolling or reading, and other items stay usable while one animates.
13. With `prefers-reduced-motion: reduce`, non-essential animation is removed or reduced and all functions still work.

### Accessibility and responsiveness
14. Every interactive element can be reached and used with the keyboard, with a clearly visible focus indicator.
15. The page uses semantic HTML, accessible labels, enough colour contrast, and status announcements for additions, changes, deletions and errors.
16. The page has no horizontal scroll, clipped content or overlapping controls at <widths, e.g. 375px, 768px, 1280px>.
17. <State A> and <State B> differ visibly without relying on colour alone.

### Robustness and checks
18. If an unexpected runtime error occurs, the page shows a fallback message and not a blank screen.
19. The build, lint, type-check, unit-test and Visual QA checks that exist are run. Every reported result comes from a real run, and anything that could not run is marked unverified.

## Preconditions / Test data

- The app starts with <initial state, e.g. an empty list>.
- No sign-in or account is needed.
- Sample data (fake only):
  - "<sample 1>"
  - "<sample 2>"
  - "<sample 3>"
- Test: empty input, whitespace-only input, valid input, duplicates, <action 1>, <action 2>, the empty state before and after, keyboard-only use, reduced motion on and off, and widths <list>.

## Out of scope

- Sign-up and sign-in
- Backend APIs and databases
- Saving data across page reloads
- <Features you do not want built, e.g. editing, reordering, due dates>
- Sound effects
- 3D scenes, WebGL and physics (unless THREE_D is yes in the config)
- Paid assets and third-party animation services

## Notes

- Frontend only, using the configured stack. Keep data in client memory.
- Trim whitespace before validating. Duplicates are <allowed | not allowed>.
- Use the exact visible text from the acceptance criteria.
- Motion: use one consistent set of durations and easing curves. Prefer `transform` and `opacity`. Avoid flashing, bouncing and continuous motion.
- Visual hierarchy: keep the main input and primary action easy to find. Avoid unnecessary nested cards.
- Add no dependency unless it is clearly needed.
- Keep accessibility working when animation is off.
- Report passed, failed, blocked and unverified checks separately. Include real screenshots and tool output where supported.
- Do not build anything listed under Out of scope.