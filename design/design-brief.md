# Design brief: immersive-task-manager
Status: user-directed | Date: 2026-10-21 | Concept: Doing Club

## Audience
People organizing personal daily tasks across phones, tablets, and desktop screens who want an upbeat, direct workspace.

## Tone
Playful, bold, and human. Use short, encouraging language without making productivity feel like a performance.

## References
The user requested Awwwards Sites of the Year as broad inspiration for confident art direction and expressive composition. Do not copy site-specific layouts, code, text, or assets.

## Do
- Use a deep plum canvas (#29152F), citrus accent (#D7FF45), and pale lavender working surface (#EEE8F1).
- Keep every surface solid and opaque; no glassmorphism, blur, translucent panels, gradients, or glow.
- Establish hierarchy with oversized, heavy sans-serif typography, sharp geometry, and a playful graphic stamp.
- Make completion visible through a checkmark and text styling, not color alone.
- Keep every control legible, keyboard accessible, and touch friendly.
- Let the desktop intro breathe while keeping the task workspace prominent and easy to scan.

## Don't
- Add account features, persistence, unrelated task metadata, or decorative 3D.
- Use external fonts, images, or hosted assets.
- Use generic floating cards, pill-shaped controls, gradient washes, or ornamental status dots.
- Make hover or animation necessary to discover or use an action.

## Visual language
Palette and dimensions are defined in `assets/css/tokens.css`. Use the plum canvas and vivid citrus accents against pale lavender for the task workspace. Pair a system sans-serif with heavy, oversized display text. Keep the composition graphic, flat, and square-cornered; stack the intro and controls cleanly on smaller screens.

## Motion
Personality: lively but purposeful. Use tokenized native opacity and transform effects for task changes and control feedback. Keep interactions responsive; honor reduced-motion and static mobile/data-saving modes. Highest level: rich. Preferred technique: native CSS and the Web Animations API.

## Files
Tokens file: assets/css/tokens.css
