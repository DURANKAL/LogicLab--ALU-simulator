# Free component resources

Read by the generator at Step 2 (see `RESOURCES_FILE`). Set `RESOURCES_FILE = none` to disable.
License facts below were read on 2026-10-27. Licenses change, so re-check a row before relying on it for a new project.

## Status values

| Status | Meaning | May the generator reuse code or assets? |
|--------|---------|------------------------------------------|
| VERIFIED | License read on the site's own page or official repo | Yes, within the license column and only for items marked free |
| PARTIAL | License known from secondary sources (listings, mirrors, reviews) | Only after the run fetches the repo `LICENSE` file read-only and records it in the plan table |
| REFERENCE ONLY | No reuse license applies | No. Look at structure and layout ideas only |
| UNVERIFIED | Not checked | No |

## Rules for using this list

1. A site may be fetched read-only only if it is listed here.
2. Reuse only what the Status table allows, and only items marked free. Pro, paid, premium and Beta items are never reused.
3. Third-party code inside a component (for example GSAP) has its own license. Check it before reuse.
4. Type `inspiration` means layout and section ideas only. Never copy a page, its images, text or code, and never make two sites look alike.
5. Type `components` means: adapt to the project's design tokens and accessibility rules (reduced motion, keyboard, contrast). Do not paste unchanged.
6. If the license is unclear, says "personal use only", or conflicts with the use, treat the item as not reusable.
7. Keep the license or copyright notice in copied source files (a short comment is enough), and add any required attribution to the site.
8. Every borrowed item goes into the plan table (Step 3B) and the report section "Third-party components": item, source URL, license, attribution used.

## A. Component libraries

| Site | URL | Type | Offers | Free parts | License | Attribution | License page | Status |
|------|-----|------|--------|------------|---------|-------------|--------------|--------|
| Componentry | https://componentry.dev/ | components | Animated React components, shadcn registry install (about 54 listed) | All components in the open-source repo | MIT. Some components use third-party deps with separate terms: `image-trail` and `layered-stack` need GSAP | Keep MIT notice | https://github.com/harshjdhv/componentry (also https://componentry.dev/terms-of-service) | PARTIAL |
| Skiper UI | https://skiper-ui.com/ | components | Animated components, scroll effects, icons, shadcn registry install | Items marked "Free". Items marked "Pro" are paid | Free to use and modify in personal and commercial projects | Required for free items: credit Skiper UI. Not required with Pro | https://skiper-ui.com/docs/quick-start | VERIFIED |
| Cult UI | https://www.cult-ui.com/ | components | Animated shadcn-style components, AI agent patterns | Everything in the open-source repo. Cult UI Pro (pro.cult-ui.com) is paid | MIT | Keep MIT notice | https://github.com/nolly-studio/cult-ui | VERIFIED |
| Watermelon UI | https://ui.watermelon.sh/ | components | 800+ examples: animated components, landing blocks, dashboards, templates | Registry items | MIT (per listings and per-item license tags) | Keep MIT notice | https://github.com/WatermelonCorp/watermelon-platform | PARTIAL |
| Motion Primitives | https://motion-primitives.com/ | components | Animated components on Framer Motion and Tailwind | Open-source components. Pro (pro.motion-primitives.com) is paid | MIT | Keep MIT notice | https://github.com/ibelick/motion-primitives/blob/main/LICENSE.md | VERIFIED |
| Aceternity UI | https://ui.aceternity.com/ | components | Animated components and templates | Free components on the site. Pro packs and templates are paid | Aceternity License: non-exclusive, worldwide, unlimited end products, multiple uses. No reselling or redistributing the items or derivatives, including on marketplaces. Items with third-party parts follow those licenses | Not stated on the license page | https://ui.aceternity.com/licence | PARTIAL (page is worded for paid items, confirm it covers the free item used) |
| Canvas UI | https://canvasui.dev/ | components | Creative HTML-in-canvas effects, WebGL and WebGPU, 6 frameworks (35 components) | All components | MIT + Commons Clause: free in personal and commercial apps and sites. No reselling or redistributing the components themselves, alone, bundled or ported | Not stated | https://canvasui.dev/ (FAQ), https://github.com/DavidHDev/canvas-ui | VERIFIED |
| vgpu | https://vgpu.sh/ | library | WebGPU library with shader examples (a library, not a UI kit) | Whole library and examples | MIT | Keep MIT notice | https://github.com/vercel-labs/vgpu | PARTIAL |
| ThreeUI | https://threeui.com/browse | components | Three.js components, WebGL backgrounds, hero sections, landing pages | Community edition only (about 50 components, 141 free variants). Pro and Beta are paid | Community code and ThreeUI-authored Community images: MIT. Fonts: OFL 1.1. Three.js: MIT. Remote thumbnails and previews on threeui.com are not under MIT | Keep MIT notice | https://github.com/MengTo/threeui (pricing: https://threeui.com/pricing) | PARTIAL |

## B. Design tool

| Site | URL | Type | Offers | Free parts | License | Attribution | License page | Status |
|------|-----|------|--------|------------|---------|-------------|--------------|--------|
| Spline | https://spline.design/ | tool | 3D design and interactive scenes, exports and embeds | Free plan: personal files, library of 3D models | Spline Library items are available for commercial use. Spline Community files are CC0 1.0 | Free plan exports carry the Spline logo or watermark, so paid plan is needed for a clean production export | https://docs.spline.design/basics/community-platform and https://docs.spline.design/basics/what-is-spline | PARTIAL (library and community terms read on the official docs, watermark detail from a secondary source) |

## C. Inspiration galleries (layout and section ideas only)

For these sites no reuse license applies. Their terms were not read. Never copy designs, images, text or code from them.

| Site | URL | Type | What it offers | Status |
|------|-----|------|----------------|--------|
| Httpster | https://httpster.net/ | inspiration | Curated website designs | REFERENCE ONLY |
| Recent Design | https://recent.design/ | inspiration | Recent website designs | REFERENCE ONLY |
| Dark Design | https://www.dark.design/ | inspiration | Dark-theme website designs | REFERENCE ONLY |
| Nicely Done | https://nicelydone.club/ | inspiration | UI and UX flows | REFERENCE ONLY |
| Minimal Gallery | https://minimal.gallery/ | inspiration | Minimal website designs | REFERENCE ONLY |
| Designspiration | https://www.designspiration.com/ | inspiration | Design image boards | REFERENCE ONLY |
| Screens Design | https://screensdesign.com/ | inspiration | App screen designs | REFERENCE ONLY |
| UI.live | https://ui.live/ | inspiration | Design snippets posted by individual designers (not a component library). No site terms found. Each design belongs to its poster | REFERENCE ONLY |

## Per-site cautions

- **Skiper UI:** the site says many components are recreations of other people's designs, for example an Apple-style carousel. Do not reuse any item that copies a known brand's look.
- **Canvas UI:** the Commons Clause means you may build sites and apps with it, but you must not publish the components themselves as a template, kit or library.
- **Aceternity UI and ThreeUI:** do not mix Pro or paid items into a free-only build. If a component page shows "Pro", skip it.
- **Componentry:** a mirror of its items on 21st.dev shows "no license" on some components. Treat an item as reusable only if the repo `LICENSE` covers it.
- **ThreeUI landing pages:** use them for section structure only. Do not ship their images, fonts or 3D assets unless the Community license above clearly covers them.
- **Canvas UI and vgpu:** WebGPU effects need a modern browser. Always keep a plain-HTML fallback and respect `prefers-reduced-motion`.

## How to update a row

1. Open the license page named in the row.
2. Update `Free parts`, `License` and `Attribution` in your own words.
3. Set Status to VERIFIED only if you read the license on the official page or repo.
4. Add the check date to the top of this file.
