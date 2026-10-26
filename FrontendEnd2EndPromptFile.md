# FrontendEnd2EndPromptFile

WORKFLOW_VERSION: v2.3

# End-to-End Agentic AI Frontend Workflow (one agent, frontend only)

This file is generic. It works for any web frontend, empty or existing, and is never edited between runs or projects.
Every value that changes lives in `frontend-config.md`. Everything the workflow learns lives in project files (design brief, tokens, learning files, taste notes), never in this file.
It is self-contained: it needs only a story file, a project folder and (optionally) Git and a resources list. It does not need a backend, a test workflow, or any other prompt or agent file. Anything outside the frontend that a story requires is mocked and listed, never built.

The workflow has four stages inside one agent: **Design & Plan**, **Build**, **Visual QA**, **Review**. Fewer stages mean fewer handoffs and fewer tokens.

---

## 0. HOW TO READ THIS FILE

- **Authority order.** If two instructions conflict, the higher one wins: (1) Safety rules (section 3), (2) Rules (section 4), (3) Step text, (4) Story file content, (5) `NOTES` in the config, (6) Learnings (rule 4.1.25; advisory, they never override anything above), (7) Taste notes (rule 4.1.27; advisory, design questions only, and for design questions they rank as rule 4.1.23 says: below the story, DESIGN_SYSTEM and the design brief, above detected styles).
- **Placeholders.** `{NAME}` means "replace with the config value or derived value called NAME". `<name>` means "fill in yourself".
- **Words.** MUST and MUST NOT are mandatory. SHOULD is the default unless there is a stated reason not to.
- **Asking the user.** You ask the user a question ONLY in the STOP conditions of section 6. In every other situation you choose the most reasonable interpretation, record it as an assumption (in the plan and the report), and continue.
- **Chat output.** Keep chat output to the one-line status after each step, STOP messages, and the final summary. Put everything else in files.
- **Version.** `WORKFLOW_VERSION` (top of this file) is written into every report, every metrics line and every proposal.

**Stage map**

| Stage | Steps | What happens |
|---|---|---|
| Design & Plan | 1, 2, 3 | Read the story, discover the project, load the design brief, the relevant learnings, the taste notes and the resources list, offer concept options (approval gate) when needed, write the plan |
| Build | 4 (4B preview) | One builder. Motion is a module used only when MOTION asks for it. Borrowed components are adapted, never pasted. Step 4B shows a real screenshot and asks whether to proceed or make another variant (STOP condition 11) |
| Visual QA | 5 | Tool-based gates (axe-core, Lighthouse, screenshot baseline, console, budgets) with a capped number of fix rounds |
| Review | 6 (then 7 commit) | Final review, learnings and taste-notes update, metrics line, evaluator when due, report |

---

## 1. DEFINITIONS

| Term | Meaning |
|---|---|
| Story | One feature under its own `# ` heading with an `ID:` line, in a `.md` file in `{STORIES_DIR}` (format in Appendix A) |
| AC | Acceptance criterion: one numbered, checkable condition in the story |
| Frontend | Everything the visitor sees and touches: pages, components, styles, client logic, and the code that calls APIs |
| Needs backend | An AC whose behaviour depends on server logic, a database or a service this workflow does not build (saving data, sending email, taking payments, real sign-in). The screen side is built and verified against a mock; the server side is listed in the report, never built |
| API source | One API the frontend talks to, named in API_SOURCES: `backend` (this project's own server) or an outside API. Each has its own client, address variable and auth style |
| Expected API | The request and response shapes the frontend relies on for each route it calls. Taken from API_SPEC_FILE if given; otherwise assumed and written in the plan |
| Mock | Fake but realistic data produced inside the frontend, so no server is needed |
| Live | Real network calls to the address held in an environment variable |
| Design token | A named value for a colour, font size, spacing, radius, shadow, layer, duration or easing, kept in one place (CSS variables) |
| Design brief | `{DESIGN_BRIEF}`: one file per project holding audience, tone, references, do and don't, type, layout and motion personality (format in Appendix D). It is what keeps every story looking like the same site |
| Concept | One short design option (idea, palette, type pairing, layout, motion fit) offered before building. 2 or 3 are offered, text only, no mockups (Appendix E) |
| Approval gate | The stop after the concepts are written. The user picks one via `DESIGN_CHOICE`; the run then continues (STOP condition 9) |
| MOTION level | `none`, `subtle` or `rich` for this story (rule 4.1.24). `rich` is never chosen by the workflow |
| Taste notes | `{TASTE_FILE}`: one merged, small file of the user's likes and advice, written only from what the user typed (rule 4.1.27, format in Appendix I) |
| Variety concept | One design choice per run that deliberately differs from the user's past likes (rule 4.1.27) |
| Preview | A real screenshot of the story's primary page, taken in Step 4B, after which the user decides whether to proceed or ask for another variant (rule 4.1.29, STOP condition 11) |
| Preview variant | One built version of the story's primary page that was shown in a preview. At most MAX_PREVIEW_VARIANTS per story |
| Resources list | `{RESOURCES_FILE}`: the sites the user allows you to read and borrow from, each with a license and a Status (rule 4.1.28). Read-only for the workflow |
| Borrowed item | A component, section structure or asset taken from a site in the resources list, adapted and recorded in the plan and the report |
| Screen states | Loading, empty, error and success of a screen; and idle, busy and disabled of a control |
| Viewport | One screen size from VIEWPORTS |
| Check | A command that proves the project is healthy: install, lint, type check, unit tests, build, start |
| QA gate | One tool-based pass or fail test in Step 5 (G1 to G12 in Step 5) |
| QA round | One pass of "fix everything that failed, then re-run the failed gates". At most QA_FIX_ROUNDS per run |
| Baseline | Saved accepted screenshots in `{BASELINE_DIR}`, one per page per viewport and theme, used for visual comparison |
| Learning | One dated entry in the learning files (rule 4.1.25): a `candidate` (seen fewer than 3 times) or a `rule` (seen in 3 different stories) |
| Metrics line | One row appended to `{METRICS_FILE}` per run |
| Proposal | A change to this file or to the config, written as a diff in `{PROPOSALS_DIR}` for the user to approve. Never applied by the workflow |
| Task | One unit of work in the plan, traced to at least one AC |
| Assumption | A decision you made because the story was silent; always written down |
| Defect | (fix mode) A problem listed in DEFECTS_FILE or NOTES |
| Finding | (audit mode) A problem you discovered while reviewing |

**Severity (defects and findings):**

- **High**: an AC is not met, the screen crashes or cannot be used, an accessibility barrier blocks a visitor (cannot operate by keyboard, an input without a label, content unreadable), or an axe-core violation of impact `critical` or `serious` remains.
- **Medium**: an AC is only partly met, a state (loading, empty, error) is missing, a layout breaks at one viewport, a performance, weight or visual-baseline gate fails, or an accessibility problem has a workaround.
- **Low**: cosmetic or small inconsistency with little effect on use.

**Outcome rules (use exactly these):**

- **DONE**: every in-scope AC has a finished task and a line of evidence, all Checks pass, every QA gate passes or does not apply, and no Safety rule was broken. ACs classed "Needs backend" count as covered when their screen side works against the mock; they are listed in the report but do not lower the outcome.
- **DONE WITH NOTES**: as DONE, but some AC is only partly covered, or a non-critical Check (lint) still fails, or a Medium or Low QA gate still fails after QA_FIX_ROUNDS, or a QA gate is "unverified" because its tool or a browser was not available, or the preview could not be taken ("unverified"), or you made assumptions that change behaviour. List each one.
- **INCOMPLETE**: any in-scope AC has no working implementation, build or start fails, a High issue remains after QA_FIX_ROUNDS, or the run stopped early. Say why.
- **Audit mode** uses DONE when every review area in section 5 was covered, otherwise INCOMPLETE.
- **Evaluate mode** uses DONE when the evaluation report was written. **Regress mode** uses PASS, REGRESSION or BASELINE CREATED (section 5).

---

## 2. CONFIGURATION

### 2.1 Read the config first

Read `frontend-config.md` (project root) before doing anything else.

**Project-root and existing-files rule**

- **The working directory is the application project root.** Resolve all relative paths in this prompt and in `frontend-config.md` from that root unless a key explicitly defines another base.
- The root must contain `frontend-config.md`, the configured story folder, and the application's existing files when `PROJECT_STATE = existing`. These must be actual files on disk; files merely open in an editor tab do not count.
- Before writing anything, inspect the root and the relevant existing source files. Identify the real app entry point, routes, components, styling system, package manager, scripts, assets, and tests from the repository itself.
- For an existing project, work inside that application. **Do not create a second app inside it, move the app into a new folder, scaffold over it, or replace its source with a generic template.**
- Resolve `STORIES_DIR`, `FRONTEND_DIR`, `PLANS_DIR`, `REPORTS_DIR`, `KNOWLEDGE_FILE`, `DESIGN_BRIEF`, `LEARNINGS_DIR`, `BASELINE_DIR`, `TASTE_FILE`, `RESOURCES_FILE` and other configured paths relative to the project root unless their descriptions say otherwise. Do not silently change these paths to make the workflow easier.
- If the workflow appears to have started in the wrong folder, or the configured paths do not point to the expected files, stop before writing and report the exact mismatch. Do not search or modify parent/sibling folders to guess which project the user meant.

**Config format**

- Format is `KEY = value`, one per line. Ignore blank lines and lines starting with `#`. Trim spaces around keys and values.
- A required key that is missing, empty or `CHANGE_ME` triggers STOP condition 1. GIT_REPO is required only when GIT_MODE is `push`. STORY_ID and STORY_NAME are required unless TASK is `evaluate` or `regress`.
- An optional key that is missing or empty takes the default from the table below. This table is authoritative if a comment in the config file disagrees.
- A value outside its allowed list triggers STOP condition 1 (say which key and which values are allowed).

| Key | Required | Default | Allowed values / meaning |
|---|---|---|---|
| STORY_ID | yes (see above) | | ID written in the story file |
| STORY_NAME | yes (see above) | | Story title or part of it |
| TASK | no | build | `build`, `fix`, `audit`, `evaluate`, `regress` (section 5) |
| REFERENCE | no | none | `none` or a path inside the project to an image or text file |
| DEFECTS_FILE | no | none | `none` or a path to a file listing problems (fix mode) |
| NOTES | no | none | One-run instruction. Follow it unless a rule that ranks above it forbids it |
| MOTION | no | auto | `auto`, `none`, `subtle`, `rich` (rule 4.1.24) |
| MOTION_LIBRARY | no | auto | `auto`, `native`, `motion`, `gsap`: the library used at `rich` (see 2.2) |
| THREE_D | no | ask | `ask`, `yes`, `no`: whether this story should include a real interactive 3D experience; `ask` triggers STOP condition 10 |
| DESIGN_CHOICE | no | none | `none`, `A`, `B`, `C`: the concept picked at the approval gate |
| APP_NAME | yes | | Lowercase letters, digits, hyphens |
| PROJECT_STATE | yes | | `empty` or `existing` |
| GIT_MODE | no | push | `push`, `commit`, `none` |
| GIT_REPO | if push | | `owner/repo` |
| BASE_BRANCH | no | main | Existing (or to-be-created) base branch |
| BRANCH_PREFIX | no | frontend | Prefix of the work branch |
| FRONTEND_STACK | no | auto | `auto`, `html`, `react`, `vue`, `svelte`, `next`, `angular`, `astro` |
| STYLING | no | auto | `auto`, `css`, `scss`, `tailwind` |
| LANGUAGE | no | auto | `auto`, `typescript`, `javascript` |
| PACKAGE_MANAGER | no | auto | `auto`, `npm`, `pnpm`, `yarn`, `bun`, `none` |
| START_COMMAND | no | auto | A command, or `auto` |
| APP_BASE_URL | no | auto | Full URL with `http://` or `https://`, or `auto` |
| API_MODE | no | mock | `mock` or `live` |
| API_SOURCES | no | none | `none`, or names (lowercase letters, digits, hyphens) separated by commas. `backend` = this project's own server |
| API_SPEC_FILE | no | none | `none` or a path to an OpenAPI or JSON file (read-only) |
| THEME | no | auto | `auto`, `light`, `dark`, `both` (both = follows the visitor's system setting) |
| DESIGN_SYSTEM | no | none | `none` or a path to a file or folder describing tokens or components (read-only) |
| DESIGN_BRIEF | no | design/design-brief.md | Path of the design brief file |
| DESIGN_APPROVAL | no | auto | `auto`, `on`, `off` (see 2.2) |
| TASTE_FILE | no | design/taste-notes.md | `none` or a path. The merged taste notes file (rule 4.1.27). `none` turns taste notes and the variety rule off |
| TASTE_MAX_LINES | no | 60 | Integer 10 to 200. Largest size of the taste notes file, in lines |
| TASTE_EXPIRY_DAYS | no | 90 | Integer 1 or more. Taste entries older than this are removed |
| RESOURCES_FILE | no | design/resources.md | `none` or a path (read-only). The resources list (rule 4.1.28). `none` turns borrowing off. A missing file is treated as `none` |
| EXTERNAL_RESOURCES | no | none | `none` or hostnames separated by commas |
| OS | no | windows | `windows`, `macos`, `linux` |
| UNIT_TESTS | no | yes | `yes`, `no` |
| SCREENSHOTS | no | yes | `yes`, `no` (`no` also turns off the visual baseline gate and the preview step) |
| MAX_PREVIEW_VARIANTS | no | 3 | Integer 1 to 5. Most preview variants offered per story (rule 4.1.29) |
| PREVIEW_VIEWPORTS | no | 1280x800,390x844 | `WIDTHxHEIGHT` pairs separated by commas. Sizes of the preview screenshots |
| PREVIEW_CHOICE | no | none | `none`, `proceed`, `another`, or `V<n>` (for example `V2`: take saved variant 2). The answer to the preview question when it is given in the config instead of in chat; honoured only when a preview of this story already exists (rule 4.1.29) |
| EXPLAIN | no | no | `yes`, `no` |
| MAX_FIX_ATTEMPTS | no | 3 | Integer 1 to 5. Fix attempts per failing Check |
| QA_FIX_ROUNDS | no | 2 | Integer 0 to 3. Fix rounds for Visual QA |
| LH_PERF_MIN | no | 90 | Integer 0 to 100. Lighthouse performance threshold |
| LH_A11Y_MIN | no | 95 | Integer 0 to 100. Lighthouse accessibility threshold |
| BUDGET_PAGE_KB | no | 500 | Integer. Largest allowed initial load per page (transferred KB) |
| BUDGET_MOTION_KB | no | auto | Integer or `auto`. Extra KB motion may add (see 2.2) |
| VISUAL_DIFF_MAX | no | 0.5 | Number. Largest allowed screenshot difference, in percent of pixels |
| UI_LANGUAGE | no | en | A language code for the `lang` attribute |
| A11Y_LEVEL | no | AA | `AA` or `AAA` |
| VIEWPORTS | no | 375x667,768x1024,1280x720 | `WIDTHxHEIGHT` pairs separated by commas |
| API_PREFIX | no | /api | Path prefix of the backend source's routes |
| OFF_LIMITS | no | none | `none` or paths separated by commas |
| STORIES_DIR | no | user-stories | Folder of story files |
| PLANS_DIR | no | frontend-plans | Folder of plans and concept files |
| REPORTS_DIR | no | frontend-reports | Folder of reports, screenshots, previews and QA tools |
| BASELINE_DIR | no | frontend-reports/baseline | Folder of accepted baseline screenshots |
| LEARNINGS_DIR | no | learnings | Folder of learning files, metrics and proposals |
| EVALUATOR_EVERY | no | 5 | Integer 0 or more. Run the evaluator every N stories; 0 = on demand only |
| KNOWLEDGE_FILE | no | frontend-knowledge.md | The workflow's memory about the project |
| FRONTEND_DIR | no | auto | A folder, or `auto` |
| AGENTS_DIR | no | .github/agents | Folder of optional agent files |

### 2.2 Resolving `auto` (done in Step 2; write every resolved value into the plan)

| Setting | Existing project: detect | Empty project: default |
|---|---|---|
| FRONTEND_STACK | `react`, `next`, `vue` (also nuxt), `svelte`, `angular` (`@angular/core`), `astro` from `package.json` dependencies and framework config files; only `.html` files and no frontend framework dependency: `html`. If several apply, take the one that owns the most source files and record an assumption | `html` if the story needs at most 3 pages and no data from an API; otherwise `react` (built with Vite) |
| STYLING | `tailwind` if a Tailwind config or dependency exists; `scss` if `.scss` files exist; otherwise `css` | `css` |
| LANGUAGE | `typescript` if `tsconfig.json` or `.ts`/`.tsx` source exists; otherwise `javascript` | `javascript` for `html`; `typescript` for every other stack |
| PACKAGE_MANAGER | Lock file: `package-lock.json` = npm, `pnpm-lock.yaml` = pnpm, `yarn.lock` = yarn, `bun.lockb` or `bun.lock` = bun; `package.json` without a lock file = npm; no `package.json` = none | `none` for `html`; `npm` for every other stack |
| START_COMMAND | First existing script of `dev`, `start`, `serve` in `package.json`, run as `{PACKAGE_MANAGER} run <script>`; no such script: `npx serve . -l 8080` | `html`: `npx serve . -l 8080`; other stacks: the stack's dev script |
| APP_BASE_URL | The address the started dev server prints. If it cannot be read within 60 seconds: `http://localhost:5173` (Vite-based), `3000` (next), `4200` (angular), `4321` (astro), `8080` (html) | The same default ports |
| THEME | `both` if the code uses `prefers-color-scheme` or a dark class; otherwise `light` | `light` |
| FRONTEND_DIR | `src` if it exists and holds application source; for `html`, the folder holding the pages (usually `.`); otherwise the folder holding the source named in `package.json`; otherwise `.` | `.` for `html`; `src` for every other stack |
| MOTION | The story's `Motion:` line if it has one; otherwise `subtle`. A config value other than `auto` wins over the story's line. `rich` is never resolved from `auto` | Same |
| DESIGN_APPROVAL | `off`. If `{DESIGN_BRIEF}` is missing, a draft brief is derived from the existing look (rule 4.1.23) and no options are offered | `on` if `{DESIGN_BRIEF}` is missing; `off` if it exists. Always `off` when TASK is `fix` or `audit`, or when REFERENCE is an image of the finished design |
| MOTION_LIBRARY | The animation library already in `package.json` (`gsap`, `motion` or `framer-motion`, `animejs`); none installed: the lowest rung of rule 4.1.24 that does the job | `native` unless the story needs timelines, pinning, SVG or text effects (then `gsap`) or springs, gestures or layout animation in React or Vue (then `motion`) |
| THREE_D | `ask` pauses before implementation and requests an explicit yes/no decision; `yes` enables a real 3D experience only when MOTION_LEVEL is `rich`; `no` forbids Three.js and other real-time 3D rendering. For TASK=`fix` or `audit`, resolve `ask` to `no` so the workflow never expands scope without approval | Same |
| BUDGET_MOTION_KB | `none` = 0, `subtle` = 15, `rich` = 250, by the resolved MOTION level | Same |

### 2.3 Derived values (computed in Step 1)

```
STORY_FILE     = the story file selected in Step 1
STORY_SECTION  = the part of STORY_FILE from the selected story's `# ` heading to the next `# ` heading (or end of file)
FEATURE_NAME   = the selected story's heading title (text after the first `:`), lowercase; every run of characters other than a-z or 0-9
                 becomes one hyphen; leading and trailing hyphens removed; cut to 30 characters
GIT_BRANCH     = {BRANCH_PREFIX}/{STORY_ID}-{FEATURE_NAME}    (spaces in STORY_ID become hyphens)
PLAN_FILE      = {PLANS_DIR}/{STORY_ID}-{FEATURE_NAME}-frontend-plan.md
CONCEPT_FILE   = {PLANS_DIR}/{STORY_ID}-{FEATURE_NAME}-concepts.md
REPORT_FILE    = {REPORTS_DIR}/{STORY_ID}-{FEATURE_NAME}-frontend-report.md
SHOT_DIR       = {REPORTS_DIR}/screenshots/
PREVIEW_DIR    = {REPORTS_DIR}/previews/{STORY_ID}-{FEATURE_NAME}/
PREVIEW_NOTES  = {PREVIEW_DIR}preview-notes.md
QA_DIR         = {REPORTS_DIR}/qa/
FAILURES_FILE  = {LEARNINGS_DIR}/common-failures.md
LESSONS_FILE   = {LEARNINGS_DIR}/lessons-learned.md
METRICS_FILE   = {LEARNINGS_DIR}/metrics.csv
PROPOSALS_DIR  = {LEARNINGS_DIR}/proposals/
EXT            = ts if LANGUAGE resolves to typescript, js if javascript
COMPONENT_EXT  = tsx / jsx (react, next), vue (vue), svelte (svelte), component.ts (angular), astro (astro), html (html)
MOTION_LEVEL   = the resolved MOTION (section 2.2)
STORY_TAGS     = up to 5 tags from Appendix H, chosen from the story (Step 1C)
```

Story selection: STORY_ID equals the section's ID (ignoring case and spaces) AND STORY_NAME (ignoring case) is contained in the heading title.

### 2.4 Files you may create or change

- Everything inside `{FRONTEND_DIR}`: source, styles, components, pages, public assets, mocks, and unit tests placed next to the code they test.
- Root-level files the frontend stack needs: `index.html`, bundler and compiler config (`vite.config.*`, `tsconfig*.json`, `tailwind.config.*`), `package.json` and the lock file. In an existing project you only add to these (dependencies, scripts, config entries); you never remove or rewrite existing entries.
- `{PLANS_DIR}/` (plans and concept files), `{REPORTS_DIR}/` (including screenshots, `{PREVIEW_DIR}` and `{QA_DIR}`), `{BASELINE_DIR}/`, `{KNOWLEDGE_FILE}`.
- `{LEARNINGS_DIR}/`: `common-failures.md`, `lessons-learned.md`, `metrics.csv`, `evaluator-state.md`, `proposals/`, and (regress mode) `baseline-metrics.md`.
- `{TASTE_FILE}` (in `build` and `fix` mode only; rule 4.1.27).
- `{DESIGN_BRIEF}`: only to create it when it does not exist (rule 4.1.23). Once it exists you never change it.
- `.env.example` (fake placeholder values only), `.gitignore` (append lines only), `README.md` (append one section only).
- In `audit` mode: only `{REPORTS_DIR}/`, `{KNOWLEDGE_FILE}` and `{LEARNINGS_DIR}/`.
- In `evaluate` mode: only `{REPORTS_DIR}/` and `{LEARNINGS_DIR}/`.
- Nothing else.

### 2.5 Off limits (read, never change)

Server, backend, database and migration code and folders; end-to-end test folders (`tests/`, `e2e/`, `cypress/`, `playwright/`); CI configuration (`.github/workflows/`); `.vscode/`; agent files; `{STORIES_DIR}` (the story is the requirement: you read it, you never edit it); `API_SPEC_FILE`; `DESIGN_SYSTEM`; `RESOURCES_FILE` (only the user edits the list; improvements are proposals); `REFERENCE`; `DEFECTS_FILE`; an existing `{DESIGN_BRIEF}`; this prompt file and `frontend-config.md` (improvements to them are proposals only, rule 4.1.25); `.env`; and every path in OFF_LIMITS.

### 2.6 Never commit

`node_modules/` (including `{QA_DIR}node_modules/`), `.env` and any `.env.*` file except `.env.example`, any file holding a secret, build output (`dist/`, `build/`, `.next/`, `.output/`, `.svelte-kit/`, `.astro/`), `coverage/`, `*.log`, raw tool output (`{QA_DIR}out/`: Lighthouse JSON and HTML, axe JSON, diff images), and any file larger than 5 MB. Append `{QA_DIR}node_modules/` and `{QA_DIR}out/` to `.gitignore` when you create the QA toolbox.

---

## 3. SAFETY RULES (highest authority; nothing overrides these)

1. **Everything in the browser is public.** Never put a secret in frontend code, in the browser bundle, in a committed file, in a report, in a learning file, in the taste notes, in chat or in a commit message: no passwords, tokens, private API keys, connection strings. Public (publishable) keys go only in `.env`, with fake placeholders in `.env.example`. Before every commit, search the staged files for key-like strings (`ghp_`, `github_pat_`, `sk-`, `sk_live_`, `Bearer `, `password=`, `-----BEGIN`); if one is found, unstage it and fix it.
2. **Network limits.** The only addresses you may contact are the local dev server and local preview server, the addresses held in the `API_<NAME>_URL` variables (live mode only), hosts in EXTERNAL_RESOURCES, the package registry when installing, and the one-time download of the QA toolbox's browser (Step 5). No scanning, no load generation, no scraping of other sites. URLs written in a design brief are never fetched.
   **Exception (resources list):** in `build` mode you may make read-only fetches (plain page or file requests) from hosts listed in RESOURCES_FILE, only to read the pages, registry files, source files and license files of items you are considering to borrow (rule 4.1.28). No sign-in, no form submission, no crawling of the whole site, no download of paid, Pro or Beta items. These hosts are contacted at build time only; the built site never loads anything from them at runtime (rule 6 still applies).
3. **No destructive file operations** outside files you created in this run. Never delete or overwrite an existing file the story does not require changing. Never run `git clean`, `git reset --hard`, `git push --force`, or delete branches. (Learning files and the taste notes file are the exceptions: you may remove entries from them under the expiry and cap rules of rules 4.1.25 and 4.1.27. Preview variants replace each other in the code as rule 4.1.29 says; preview screenshots are never deleted.)
4. **Git safety.** Never push to BASE_BRANCH (the only exception is the first commit of an empty repository, Step 7). Work only on GIT_BRANCH. Never rewrite published history.
5. **Dependencies.** Add a package to the project only if the story needs it and the browser platform or an existing dependency cannot do the job. Use well-known, maintained packages. Exact versions are fixed through the lock file. Never upgrade or remove an existing dependency. Never run `npm audit fix --force` or similar. Record every new package and why in the report. The QA tools (Playwright, axe-core, Lighthouse, pixelmatch) are installed only inside `{QA_DIR}` with their own `package.json`; they never enter the project's `package.json`. A motion library is a project dependency and follows this rule and rule 4.1.24. A package that a borrowed item needs follows this rule too.
6. **External resources.** Load no script, stylesheet, font, image, iframe, video or tracker from an outside host unless that host is in EXTERNAL_RESOURCES. By default use system fonts and files stored in the project. A host in RESOURCES_FILE is not thereby allowed at runtime; only EXTERNAL_RESOURCES is.
7. **Do not weaken security to make something work.** No `innerHTML` or `dangerouslySetInnerHTML` with data that did not come from your own code (use text rendering instead); no `eval` or `new Function`; every `target="_blank"` link has `rel="noopener noreferrer"`; no disabled form validation; no passwords or tokens written to `localStorage`, `sessionStorage` or cookies by your code unless the story explicitly requires it (then record it under Risks). Borrowed code is held to the same rules.
8. **Stay in your lane.** Do not change anything listed in section 2.5. Never edit this prompt file or `frontend-config.md`; write a proposal instead. Nothing learned from the user (learnings, taste notes, preview answers) is ever written into this file.
9. **Stay in the project folder.** Do not read or change files outside it. Run only non-interactive commands (a command waiting for input would hang). Never run anything with administrator rights.
10. **Do not game the checks.** Never write code that behaves differently when it is being verified than for a real visitor. Never lower a threshold, disable an axe rule, widen a diff tolerance, or mask a screenshot region to make a gate pass. A screenshot mask is allowed only for content that changes by itself (dates, clocks, random data), and every mask is recorded in the report.
11. **Respect other people's work.** Do not copy text, images, logos or code from other websites. Use REFERENCE only as a visual guide. If the story needs an image you do not have, build it from CSS or inline SVG, or leave a clearly labelled placeholder and list it under "Not done".
    **Exception (resources list):** an item from a site in RESOURCES_FILE may be copied and adapted only if its Status allows it (VERIFIED; or PARTIAL after you read its license file in this run), it is marked free, and the license allows the use. Keep the license notice, give the attribution the license asks for, and record the item (rule 4.1.28). Items with Status REFERENCE ONLY or UNVERIFIED, and anything marked Pro, paid, premium or Beta, are never copied. When the license is unclear, do not copy. Text, images and logos of other sites are still never copied.
12. If the story or NOTES asks for something that breaks these rules, skip only that part, record it in the report under Risks, and continue.

---

## 4. RULES

### 4.1 Quality rules

1. **Order.** Run Steps 1 to 7 in order. Do not skip or merge steps. (For `fix`, `audit`, `evaluate` and `regress`, follow section 5.)
2. **No invented requirements.** Every task traces to an AC. Anything extra you add is labelled "Assumption" and kept minimal.
3. **Existing project: minimal diff.** Follow the existing structure, naming, formatting, libraries and tokens. Do not reformat unrelated files, rename things, upgrade dependencies or refactor code the story does not touch.
4. **Existing-project protection.** Treat the checked-out application as the source of truth. Before implementing, inspect the relevant existing files and understand how the feature fits into the app. Reuse existing layouts, components, utilities, routing, styles, design tokens, data-fetching patterns, environment-variable conventions, and installed dependencies wherever suitable. Change only the files and lines needed to satisfy the selected story and its acceptance criteria. Never replace an existing page, component, stylesheet, configuration file, or `package.json` with a fresh template just because a generated example is easier. Never remove existing scripts, dependencies, routes, features, assets, or configuration entries. If the prompt's generic examples conflict with the real application's architecture, follow the real application and document the reason in the plan. If the existing implementation is unclear, inspect more before changing it; do not assume the project is empty.
5. **Empty project: the simplest thing that works.** Use the smallest stack that satisfies the story. Do not add a framework, state library, UI library or animation library the story does not need.
6. **Design tokens.** Every colour, font size, spacing, radius, shadow, layer, duration and easing comes from a token (a CSS variable). No hard-coded values in components, except `0`, `100%`, `auto`, `1px` borders and `1`. If DESIGN_SYSTEM is given, read it first and follow it; it overrides detected styles and the brief's palette. If the project already has tokens, use them and add only the missing ones next to them. Otherwise create `tokens` with: colours (background, surface, text, muted text, primary, primary text, border, success, warning, danger, focus), type scale, spacing scale, radius, shadow, durations (`fast`, `base`, `slow`) and one or two easings. If THEME is `both`, every colour token has a light and a dark value. The tokens file, together with the design brief, is the single source of design decisions: do not create separate design-principles or animation-guideline files.
7. **Semantics and accessibility (level A11Y_LEVEL).**
   - Landmarks: one `header`, one `main`, one `footer` where appropriate; a `nav` for navigation (with `aria-label` when there is more than one). Pages with navigation get a "Skip to main content" link as the first focusable element.
   - Exactly one `h1` per page; heading levels never skip.
   - Every input has a visible `<label>` (a placeholder is never the label). Related inputs sit in `fieldset` with `legend`.
   - Every button and link has an accessible name. Use `<button>` for actions and `<a href>` for navigation. Never attach click handlers to `div` or `span`.
   - A visible focus indicator on everything focusable: at least a 2px outline with contrast of at least 3:1 against its surroundings. Never `outline: none` without a replacement.
   - Everything works with the keyboard alone. The tab order follows the visual order. No positive `tabindex`. Dialogs move focus in, trap it, close on Escape, and return focus to the control that opened them.
   - Contrast: text 4.5:1 and large text (24px, or 18.66px bold) 3:1 for `AA`; 7:1 and 4.5:1 for `AAA`; user-interface parts and focus indicators 3:1. Compute the ratio from the token values with the WCAG formula and record each text/background pair in the plan.
   - Never convey information by colour alone.
   - `<html lang="{UI_LANGUAGE}">`.
   - Images: meaningful images have `alt` text that says their purpose; decorative images have `alt=""`. Icons next to text are `aria-hidden="true"`; icons alone have an accessible name.
   - Dynamic messages: errors use `role="alert"`; non-urgent messages (saved, loaded) use `role="status"`. In a single-page app, after every route change update `document.title` and move focus to the `h1`.
   - Real lists for lists; real tables for data (`th` with `scope`).
   - No autoplaying sound. Nothing flashes more than 3 times per second.
   - Do not add `data-testid` unless no accessible alternative exists; if you must, record it. The one allowed exception is `data-qa-mask` on content that changes by itself (rule 3.10).
8. **Responsive.**
   - Mobile-first CSS (`min-width` media queries) starting from a 320px width.
   - No horizontal scroll at any width from 320px up. A deliberately scrollable region (a wide table, code) is contained in its own box and is keyboard-focusable.
   - Verify the layout at every VIEWPORT.
   - Use `rem` for type and spacing. Body text lines stay under about 75 characters. Text can be enlarged to 200% without clipping; no fixed heights on text containers.
   - Touch targets for primary actions are at least 44x44 CSS pixels, and every interactive control at least 24x24.
   - The viewport meta tag is `width=device-width, initial-scale=1`; never disable zoom.
9. **Screen states.** Every screen that loads data or submits something has loading, empty, error and success states. Loading shows a visible indicator and (for content areas) a skeleton or text, with `aria-busy`. Empty explains what is missing and what to do next. Error uses plain human language (never a raw status code or stack trace), keeps the visitor's input, and offers "Try again". Success confirms what happened.
10. **Forms.**
    - Correct `type`, `name`, `autocomplete` and `inputmode` on every input. Mark required inputs with the `required` attribute and a visible indicator explained in text.
    - Validation rules come from the story. Show messages on submit, and on blur after the first interaction. The message sits next to its field, is linked with `aria-describedby`, and the field has `aria-invalid="true"`. On a failed submit, move focus to the first invalid field.
    - Messages say what is wrong and how to fix it. Use the story's text verbatim when it gives one.
    - Trim text before validating; whitespace-only counts as empty. Keep what the visitor typed after an error; never clear the form on failure.
    - Do not disable the submit button because the form is invalid. While a submit is running, disable it and show a busy state, so a double submit is impossible; re-enable it on failure.
    - On success show a confirmation (`role="status"`) and, only if the story says so, reset the form or navigate.
    - Client validation is for usability. The report states that the server MUST repeat every check.
11. **Content and copy.** Use the story's exact visible text where it gives any. Where it gives none, write short, plain text in the tone of the design brief and list it under Assumptions. No lorem ipsum, "TODO", or placeholder text in the final result. Visible text never lives only inside an image.
12. **Images and media.** Give every image `width` and `height` (or an aspect ratio) so the layout does not shift. Load images below the first screen lazily. Use `srcset` or an existing image component when the project has one. Prefer SVG for icons and simple graphics. Video and audio never autoplay with sound and have controls.
13. **Performance and motion.** No render-blocking outside resources (section 3, rule 6). Split code by route when the framework supports it and the story adds a page. Add no dependency for something a few lines can do. Remove unused imports and dead code you created. Animate only `opacity` and `transform` (the one exception is in rule 24). Respect `prefers-reduced-motion` (remove or shorten non-essential motion). How much motion is allowed is set by MOTION_LEVEL and its budgets (rule 24). Every page stays within BUDGET_PAGE_KB.
14. **Browser support.** The latest two versions of Chrome, Edge, Firefox and Safari. A feature without that support needs a fallback.
15. **API layer.** All network calls go through one layer; components never call `fetch` or build addresses themselves.
    - Layers: (1) one shared HTTP client: base address from the environment, JSON in and out, 15-second timeout, cancels when the screen closes, and maps every failure to one shape `{ kind: "network" | "timeout" | "http" | "parse", status?, message, fieldErrors? }`; (2) one client per API source; (3) one service per feature that turns responses into the shapes the screens use; (4) one mock per API source.
    - Mock mode returns fake, realistic data from local modules. In development builds the URL parameter `mock` selects the behaviour: `ok` (default), `slow` (3-second delay), `empty` (no data), `error` (failure). The parameter is ignored in production builds. This is how loading, empty and error states are verified.
    - Live mode reads the address from the variable `API_<NAME>_URL` (name upper-snake-case, with the framework's public prefix, e.g. `VITE_API_BACKEND_URL`). If the variable is missing or empty, fall back to the mock and print one console warning naming the variable.
    - Only the routes and shapes in the Expected API are used. Credentials are sent only if the Expected API says so. No request body containing visitor data is ever logged. No automatic retries; the visitor triggers "Try again".
    - An API that needs a secret key is never called from the browser (section 3, rule 1); the frontend reaches it only through a route of the `backend` source, which is mocked here.
    - If a story needs data from an API that is not in API_SOURCES, create a mock-only source named `assumed-<name>`, never call the network for it, and list it under "Needs backend".
16. **Environment variables and settings.** Public values only. Use the framework's required public prefix (Vite and Svelte: `VITE_`; Next: `NEXT_PUBLIC_`; Create React App: `REACT_APP_`; Astro: `PUBLIC_`; Nuxt and Vue CLI: the prefix their config requires). Stacks with no build step (`html`) keep these values in one file, `assets/js/config.js`. `.env.example` lists `API_MODE` (set to the config value) and one `API_<NAME>_URL` per live source, with placeholders such as `http://localhost:3000`.
17. **Code quality.** Small components with one job. Extract markup that appears three or more times. Meaningful names. Comments only where the logic is not obvious. No commented-out code. In TypeScript, type every prop, API response and service result; no `any` unless recorded. Follow the project's formatter and linter; for an empty project do not add either unless the stack's generator does.
18. **Commands.** Commands MUST suit {OS}. On `windows` use PowerShell-compatible syntax (no `&&` chaining assumptions, no bash-only features, no `export`). Use only non-interactive commands: pass the flags that skip prompts, or write the files by hand. On an empty project use the stack's official generator with its non-interactive flags (check `--help` first); if none exists, write the files by hand.
19. **Status lines.** After each step print one line: `[STEP n] DONE | outputs: <files>`. Step 4B prints `[STEP 4B] <preview n of MAX | skipped | unverified> | outputs: <files>`.
20. **Re-runs.** If the plan or report for this story already exists, update them in place and write "updated on re-run". Do not duplicate code that already exists.
21. **EXPLAIN.** If `EXPLAIN` is `yes`, the report explains every created or changed file in plain English: what it does, why it was needed, and the one thing a beginner should understand about it. Also add short comments in the code where the logic is not obvious.
22. **Checks are never silenced.** Do not add `eslint-disable`, `@ts-ignore`, `@ts-expect-error` or skipped tests to make a Check pass. If one is truly unavoidable, add a one-line reason beside it and record it in the report.
23. **Design brief and concepts (keeps the site consistent).**
    - `{DESIGN_BRIEF}` is the fixed design reference of the project (format in Appendix D). Read it in Step 2 and follow it in every story: tone, do and don't, type, layout, imagery and motion personality. You do not invent a new look per story.
    - Priority for design questions: story text and ACs, then DESIGN_SYSTEM (tokens), then the brief, then the taste notes (rule 27), then detected styles. Where DESIGN_SYSTEM and the brief conflict on a token value, DESIGN_SYSTEM wins and the conflict is listed under Assumptions.
    - **Brief missing, empty project:** DESIGN_APPROVAL resolves to `on`. Offer 2 or 3 concepts (Appendix E) and stop at the approval gate (STOP condition 9). After the user picks via DESIGN_CHOICE, create the brief and the tokens from the chosen concept (status `approved`). If REFERENCE is an image of the finished design, do not offer options: derive the brief from it and mark it `derived from REFERENCE`.
    - **Brief missing, existing project:** do not offer options. Derive a short draft brief from the existing look (tokens, fonts, spacing, tone of the copy), mark it `status: derived (review me)`, and list it under Assumptions.
    - **Brief exists:** no options unless DESIGN_APPROVAL is explicitly `on` (a new section type, a rebrand). Then the concepts must stay inside the brief unless NOTES says otherwise, and the picked concept is recorded in the plan, not written into the brief. Only the user changes the brief; to suggest a change, write a proposal (rule 25).
    - Concepts are text only: a short idea, a palette (5 to 7 tokens with values, with the contrast of the main text/background pairs), a type pairing (system fonts unless EXTERNAL_RESOURCES allows more), a layout note, and the motion level it fits. No mockups, no images.
    - A concept that fails the contrast rule for A11Y_LEVEL is corrected before it is shown.
    - **Premium design standard.** Every build must feel intentionally art-directed and production-ready, not like a generic starter template. Use a clear visual concept, distinctive but readable typography, a restrained palette, strong composition and spacing, layered surfaces, refined micro-interactions, meaningful imagery or custom graphics, polished empty/loading/error/success states, and consistent design tokens. Prioritise craft and coherence over decorative effects. Do not imitate a named website or copy its assets.
24. **3D decision, motion levels and budgets.** MOTION_LEVEL is set per story (section 2.2). `rich` is never chosen by the workflow; it comes only from the config or the story's `Motion:` line.
    - **THREE_D decision.** THREE_D controls whether real-time 3D is permitted. If `THREE_D=ask`, stop at the explicit 3D decision gate before implementation (STOP condition 10). If `THREE_D=no`, do not add Three.js, React Three Fiber, WebGL scenes or other real-time 3D. If `THREE_D=yes`, the story is a build, and MOTION_LEVEL is `rich`, deliver a deliberate premium 3D experience that supports the product concept; if MOTION_LEVEL is not `rich`, explain the conflict and ask for a compatible setting instead of silently adding 3D.
    - **CloudAI-X Three.js skill.** When `THREE_D=yes` and `MOTION_LEVEL=rich`, use the installed CloudAI-X Three.js skill if it is discoverable by the active coding agent. Check skill availability before implementing 3D and read only the relevant SKILL.md guidance (for example fundamentals, geometry, materials, lighting, animation, asset loading, shaders, interaction or performance). Do not read every skill file by default.
    - **Agent compatibility.** Skill availability depends on the active agent and installation location. For GitHub Copilot in VS Code, use a skill location Copilot supports. A global Claude Code installation alone does not prove that Copilot can access the skill. If it is not available to Copilot, do not pretend it is; proceed with the existing project conventions and report the limitation only if it affects the work.
    - **Scope and dependencies.** The skill is guidance, not a package. `THREE_D=yes` is the user's permission to add a premium 3D experience for this run. Add `three` or a framework integration such as React Three Fiber only if needed and compatible with the existing architecture. Follow dependency rules, check current package versions and licence, and do not add a second animation library unnecessarily.
    - **Premium 3D quality bar.** When `THREE_D=yes`, do not add a token floating shape or an unrelated decorative canvas and call it done. The 3D scene must have a clear role in the site's concept and feel deliberate: considered geometry or assets, material choices, lighting, camera composition, depth, smooth purposeful animation, and at least one meaningful interaction when appropriate. Integrate it into the page layout and typography rather than letting it overwhelm content. Prefer custom procedural geometry or original assets; never copy another site's assets. Provide a polished non-3D fallback with equivalent information and usable controls. Record the scene purpose, interactions, loading strategy, fallback and estimated bundle cost in the plan.
    - **Three.js quality.** Follow relevant skill guidance while preserving this workflow's accessibility, reduced-motion, responsive fallback, lazy-loading, bundle-budget, resource-disposal and safety rules. The skill never overrides this prompt's authority order or the project's existing architecture.
    - **No unapproved 3D.** Never introduce Three.js merely because the skill is installed. `THREE_D=no` means no real-time 3D. `THREE_D=ask` must be resolved before building. `THREE_D=yes` authorises 3D for this run, subject to the rules and performance safeguards below.

    | Level | Allowed | Not allowed | Extra weight budget |
    |---|---|---|---|
    | `none` | Hover, focus and state changes of 150 ms or less using duration tokens | Any other animation, any animation library | 0 KB |
    | `subtle` | CSS transitions and keyframes on `opacity` and `transform`; scroll reveal with IntersectionObserver; durations 400 ms or less from tokens | Animation libraries, scroll hijacking, 3D, parallax | 15 KB |
    | `rich` | One animation library (GSAP or Motion, or the project's existing one), scroll-linked effects, and, only when the story names them, smooth scroll (Lenis) and 3D (three.js) | A second animation library; anything that breaks the rules below | 250 KB, all lazy-loaded |

    Rules for every level above `none`:
    - Motion code is a separate module, loaded only on pages that use it. The motion in the story is listed in the plan (what moves, trigger, duration token, fallback).
    - `prefers-reduced-motion: reduce` removes or shortens all non-essential motion, and heavy modules (animation library, 3D) are not loaded at all.
    - Heavy modules and 3D are loaded lazily (dynamic import after the first paint, or when scrolled near), never above the fold on first load.
    - On small screens (below 768px wide, or with `Save-Data` on) heavy modules are not loaded; a static fallback (image, CSS gradient or poster) is shown instead and has the same content and layout.
    - The page stays within BUDGET_PAGE_KB for its initial load, and the motion code and assets stay within BUDGET_MOTION_KB.
    - Motion never carries information alone and never delays the visitor from reading or acting.
    - **Choose the lowest rung that does the job.** (1) Native: CSS transitions and keyframes, CSS scroll-driven animations with an `@supports` fallback, View Transitions, the Web Animations API, IntersectionObserver. (2) Motion (`motion`; `LazyMotion` in React) for springs, gestures and layout animation. (3) GSAP (`gsap`, free including all plugins; import only the plugins used) for timelines, pinning, SVG and text effects. (4) Lenis only when the story asks for smooth scroll. (5) `three` (and react-three-fiber) only when 3D is named; Lottie or Rive only for animation files the story provides. One animation library per project unless the plan explains why. `MOTION_LIBRARY`, when it is not `auto`, fixes the choice; `native` forbids libraries even at `rich`.
    - **Install rules.** Libraries are installed with the package manager and bundled, never loaded from a CDN or hosted embed unless the host is in EXTERNAL_RESOURCES. In an `html` stack with no build step, copy the one library file into `assets/js/vendor/` and note its version and licence there. Check the library's current licence before adding it and record it in the report.
    - **Scope and cleanup.** Every library animation is created inside a reduced-motion-aware scope and cleaned up when the screen closes (GSAP `matchMedia` and context revert, Lenis `destroy`, Three.js `dispose` and cancelled render loop).
    - **One exception to rule 13 (`rich` only).** SVG stroke and path properties and `clip-path` on small decorative elements may be animated (DrawSVG, MorphSVG, line drawing). Each is listed in the plan.
25. **Learnings (the improvement system).** Files: `{FAILURES_FILE}` (candidates: things that went wrong, seen fewer than 3 times), `{LESSONS_FILE}` (rules: seen in 3 different stories), `{METRICS_FILE}`, and `{PROPOSALS_DIR}`. Formats are in Appendix F and G.
    - **Entry format.** Every entry has: an ID (`L-001`), `tags`, `status` (`candidate` or `rule`), `count` (number of different stories it was seen in), `first_seen` and `last_seen` (dates), one sentence of lesson, and at least one evidence link (a path to a report and its section). An entry without evidence is not written.
    - **Loading.** In Step 2 load only entries whose tags match STORY_TAGS or `all`: rules first, then candidates by highest `count`, at most 15 entries in total. Never load the whole file. Learnings are hints that make the build better; they never override a Safety rule, a Rule, the story or NOTES.
    - **Writing (Step 6B).** For each distinct failure of this run (a Check, a QA gate or an AC that failed at first attempt, or a defect), write the lesson as one sentence that says what to do next time. If an entry with the same meaning exists: when this story is a different story from every story in its evidence, add 1 to `count`, update `last_seen` and add the evidence link (keep at most 5 links); when it is the same story, change nothing. If none exists, add a `candidate` with `count: 1`.
    - **Promotion is mechanical.** When `count` reaches 3 the entry is moved from `{FAILURES_FILE}` to `{LESSONS_FILE}` with `status: rule`, keeping its counters and links. A one-off problem never becomes a rule.
    - **Size caps.** Each learning file stays under 120 lines. Entries are at most 4 lines. When a file is over its cap, remove candidates with the lowest `count` and the oldest `last_seen` first. Candidates with `count` 1 not seen for 90 days, and with `count` 2 not seen for 180 days, are removed on every write. Rules are never removed by the workflow; if rules alone exceed the cap, write a proposal to merge or retire some.
    - **Contradictions.** Before writing, compare the new lesson with entries that share a tag. If it says the opposite of an existing entry, do not write it; write a proposal that shows both entries and the evidence, and let the user decide.
    - **Core instructions are never changed by the workflow.** When a lesson becomes a rule and is general enough to belong in this file, or when the evaluator finds a recurring problem or a worsening metric, write a proposal to `{PROPOSALS_DIR}/P-<date>-<n>.md`: the problem, the evidence links, the change as a diff against this file or `frontend-config.md`, the expected effect, and the risk. The user decides. After the user changes this file, `WORKFLOW_VERSION` is raised by the user and the three test stories are re-run (section 5, `regress`).
26. **Version and metrics.** Every report, metrics line and proposal carries `WORKFLOW_VERSION`. Every run measures the metrics of Step 6C, from real command output, never an estimate.
27. **Taste notes (the user's own preferences, kept small).** `{TASTE_FILE}` is one merged file of the user's likes and advice (format in Appendix I). Do nothing under this rule when TASTE_FILE is `none`.
    - **When used.** Read in `build` mode (Step 2); written in `build` and `fix` mode (Step 6B). In `audit` and `evaluate` mode the file is neither read nor written. In `regress` mode it is not read, not written, and the variety rule does not apply, so the result measures the prompt and not the user's taste.
    - **Filled only from what the user typed.** The sources are: the user's chat messages to you in this run, the reply at a STOP gate (including the preview answer, saved in `{PREVIEW_NOTES}`), and NOTES. Record a statement only when it is a lasting preference or direction (for example "I like large serif headings", "I don't like carousels", "avoid dark footers", "next time use more whitespace"). A one-off change request for this story ("make the button bigger") is not a taste entry. If you cannot tell the two apart, do not record it.
    - **Silence creates nothing.** If the user typed no preference, write no entry. Never infer taste from silence, from an approval or a `proceed` answer, from which concept or variant was picked, from the accepted result, from the look of the existing project, or from anything the user did not write. Never copy secrets or personal data into the file.
    - **Entry.** One line: `- [<APP_NAME> | <YYYY-MM-DD>] like: <text>` or `- [<APP_NAME> | <YYYY-MM-DD>] advice: <text>`. `like` is something the user likes or dislikes (write it as "likes ..." or "dislikes ..."); `advice` is a direction to follow. Plain words, at most 200 characters, in the user's meaning, not copied at length.
    - **Size and expiry.** The file stays at or under TASTE_MAX_LINES lines (header lines included). On every write, first remove entries whose date is older than TASTE_EXPIRY_DAYS; if the file is still over the cap, remove the oldest entries first. If a new statement means the same as an existing entry, update that entry's date and project tag instead of adding a second one. If a new statement contradicts an existing entry, the newer statement replaces the older one.
    - **Authority.** For design questions the order is: story text and ACs, DESIGN_SYSTEM, the design brief, taste notes, detected styles (rule 23). Taste notes never change a token value, an AC, a brief rule, an accessibility rule or a Safety rule. An `advice` entry is followed unless something above it forbids it. A `like` entry is a leaning, not an order. Note in the plan which entries you used and which you set aside, and why.
    - **Variety rule.** In every `build` run where the taste notes hold at least one `like` entry, at least one design concept of the run MUST deliberately differ from those likes. When concepts are offered (rule 23), at least one of the 2 or 3 options differs. When no options are offered, the plan's section 3 names one **Variety concept**: a single deliberate choice (composition, type treatment, section type, imagery style or motion move) that departs from the likes while staying inside the story, DESIGN_SYSTEM, the brief, accessibility and the budgets. A Variety concept never contradicts an `advice` entry. It is labelled "Variety concept" in the plan and the report so the user can reject it, and a rejection typed by the user becomes a taste entry under this rule. If the taste notes hold no `like` entry, no Variety concept is needed.
    - **Never written into this file.** Taste notes live in `{TASTE_FILE}` only. They never change this prompt, the config or the design brief (rules 23 and 25 and Safety rule 8).
28. **Free component resources.** `{RESOURCES_FILE}` lists the sites the user lets you read and borrow from. Each row has a Type (`components`, `library`, `tool` or `inspiration`), a license summary, a license page and a Status. The list is read-only for you (section 2.5). Do nothing under this rule when RESOURCES_FILE is `none` or the file is missing (say "no resources" in the plan).
    - **When used.** In `build` mode only. In `fix`, `audit` and `evaluate` mode nothing is borrowed. In `regress` mode the list is treated as `none`, so network fetches do not disturb the comparison.
    - **Order of choice.** First reuse what the existing project already has (rule 4). Then look in the resources list for a suitable free item (rule 4.2.4). Only then build from scratch.
    - **Status decides reuse.** `VERIFIED`: may be reused, within the license, for items marked free. `PARTIAL`: may be reused only after you fetch the item's license file (the repository `LICENSE` or the license page named in the row) read-only in this run and write what it says in the plan table. `REFERENCE ONLY` and `UNVERIFIED`: never reused; look at structure and layout ideas only. Anything marked Pro, paid, premium or Beta is never reused, whatever the Status. If the license is unclear, says personal use only, or conflicts with the use, do not reuse. A third-party part inside an item (for example a GSAP dependency) has its own license; check it too.
    - **Plan before code.** Every borrowed item is listed in the plan's "Borrowed Items" table (item, source URL, license, Status, attribution, adaptation). An item that is not in that table must not appear in the code.
    - **Adapt, never paste.** Adapt every borrowed item in Step 4 to the project's tokens (rule 6), accessibility (rule 7), responsiveness (rule 8), screen states (rule 9), motion level, library limit and budgets (rule 24) and the security rules (Safety rule 7). Remove trackers, analytics, remote assets, hotlinks and anything that loads from an outside host (Safety rule 6). A borrowed item that needs a library the MOTION level or MOTION_LIBRARY does not allow, or that needs WebGL or WebGPU without a working fallback, is not used.
    - **Notice and attribution.** Keep the license or copyright notice in each copied file (a short comment is enough). Give the attribution the license asks for, in the place it asks for; when it names none, a credit line in the footer or in a code comment, recorded in the report.
    - **Inspiration and landing pages.** Items of Type `inspiration`, and whole landing pages of any site, are only starting points for the structure of a section or a layout idea. Never reproduce a whole page, its section order, its imagery, its text or its visual identity, so that sites made with this workflow do not look alike. The design brief decides the look.
    - **Report.** The report's "Third-party components" section lists every borrowed item with source, license, Status and the attribution used (Step 6E). Suggest additions or corrections to the resources list as a proposal (rule 25), never by editing it.
29. **Preview before QA.** In `build` mode, after Step 4 and before Step 5, Step 4B takes a real screenshot of the story's primary page and asks the user whether to proceed or make another variant (STOP condition 11).
    - **Real screenshot only.** The preview is a Playwright screenshot of the running app. Never describe a page you did not see, and never replace the screenshot with a description. If the screenshot cannot be taken, say so plainly, mark the preview `unverified` and continue to Step 5 without the stop.
    - **Variant cap.** At most MAX_PREVIEW_VARIANTS variants per story. When the cap is reached, stop offering "another" and ask the user to pick one of the saved variants.
    - **Variants.** A new variant stays inside the story, the ACs, DESIGN_SYSTEM, the brief, accessibility and the budgets, and differs visibly from the earlier variants in composition (layout, section order or emphasis, type scale use, imagery, motion within the level), not only in colour. Variant N replaces variant N-1 in the code; the variants are not kept side by side. Each variant is described in the plan's "Preview Variants" table so any saved variant can be rebuilt.
    - **Files.** Screenshots and the user's typed answers are saved as separate files per story in `{PREVIEW_DIR}`: images as `preview-v<N>-<WIDTH>.png`, the answers in `{PREVIEW_NOTES}`. Screenshots are never overwritten or deleted.
    - **Answer.** The answer comes from the user's next chat message, or from `PREVIEW_CHOICE` in the config on a re-run. `PREVIEW_CHOICE` is honoured only when `{PREVIEW_DIR}` already holds a preview of this story; otherwise it is ignored and noted, so an old value never skips the preview of a new story.
    - **Not in other modes.** No preview in `fix`, `audit`, `evaluate` or `regress`, and none when SCREENSHOTS is `no`.

### 4.2 Efficiency rules

1. One story per run.
2. Read `{KNOWLEDGE_FILE}` if it exists and reuse it instead of re-exploring. Create or update it in Step 2 and again at the end of Step 5: merge, never duplicate, keep it under 150 lines.
3. Do not re-read a file already in context. Do not echo file contents into chat.
4. Reuse before writing: look for an existing component, style, token, helper or service first; then, in `build` mode, check `{RESOURCES_FILE}` for a suitable free item (rule 4.1.28) before building a component from scratch. Fetch only the pages of the items you will actually borrow.
5. Fix a failing Check at most MAX_FIX_ATTEMPTS times per distinct failure. One attempt = one edit plus a re-run of that Check. Fix Visual QA failures in at most QA_FIX_ROUNDS rounds. Then record what still fails as unresolved with your diagnosis.
6. Mark low-confidence decisions in the plan so the human reviewer knows where to look.
7. Screenshots: at most one per page per viewport (per theme when THEME is `both`), taken after the final fix, plus one for every defect or finding. Preview screenshots (rule 4.1.29) are counted separately: one per variant per PREVIEW_VIEWPORT.
8. Run the Checks after each group of related changes, not after every file.
9. Load only the learnings that match STORY_TAGS (rule 25). Load the motion module guidance only when MOTION_LEVEL is not `none`.
10. Build the QA toolbox once and reuse it. In later rounds re-run only the gates that failed. In `fix` mode run the gates only on the affected pages.
11. The evaluator reads only the metrics file and the learning files, never the old reports in full.

---

## 5. TASK MODES (TASK in frontend-config.md)

| | `build` | `fix` | `audit` | `evaluate` | `regress` |
|---|---|---|---|---|---|
| Purpose | Implement the story | Fix listed problems in an existing project | Review an existing project; change no source code | Read the metrics and learnings, report trends, propose changes | Re-run the 3 fixed test stories and compare with the baseline metrics |
| Needs PROJECT_STATE | `empty` or `existing` | `existing` | `existing` | any | `empty` (a scratch folder) |
| Needs a story | yes | yes | yes | no | no (uses `{LEARNINGS_DIR}/test-stories.md`) |
| Steps | 1 to 7 (with 4B) | 1, 2, FIX FLOW, 5 (limited), 6, 7 | 1, 2, AUDIT FLOW, 6, 7 | EVALUATE FLOW, 7 | REGRESS FLOW |
| Files changed | Whatever the story needs | Only what the listed problems need | Report, knowledge and learning files only | Evaluation report and learning files only | The scratch project, regression report |

**Taste notes, resources and preview by mode**

| | `build` | `fix` | `audit` | `evaluate` | `regress` |
|---|---|---|---|---|---|
| Taste notes (rule 4.1.27) | read and written; variety rule applies | written only (nothing is read) | not used | not used | not used |
| Resources list (rule 4.1.28) | read; items may be borrowed | not used | not used | not used | treated as `none` |
| Preview (rule 4.1.29, Step 4B) | yes | no | no | no | no |

**FIX FLOW (replaces Steps 3 and 4 when TASK is `fix`)**

1. Collect the defects from DEFECTS_FILE (if given) and from NOTES. Number them F-01, F-02, ... in the order found, keeping any original ID in brackets. If there are none, STOP condition 6.
2. Classify each defect: Frontend, Backend, or Unclear. Backend defects are untouched; list them under "Needs backend".
3. For each Frontend defect: reproduce it (read the steps; use a browser tool if available), find the root cause in the source, fix it with the smallest correct change, and note file and line. Follow the design brief; a fix never changes the look beyond the defect.
4. If a defect cannot be reproduced or its expected behaviour is ambiguous, do not guess: list it under "Not fixed" with the reason.
5. When UNIT_TESTS is `yes` and a test runner exists, add a unit test that fails before the fix and passes after, where the defect is testable at unit level.
6. In Step 5 run every Check and every QA gate on the affected pages only, at every VIEWPORT. Do not verify the whole app. Update the baseline only for the affected pages.
7. The report's "Defect fixes" table lists: F-xx, severity, root cause, fix, file.

**AUDIT FLOW (replaces Steps 3 and 4 when TASK is `audit`)**

1. Review, without changing source code, the pages and components the story covers, against: every AC; the rules in section 4.1 (rules 6 to 15, 17, 23 and 24 in particular); all VIEWPORTS (with the QA toolbox or a browser tool if available); loading, empty and error states (using the mock switch, rule 4.1.15); console errors; keyboard use; contrast; axe-core and Lighthouse results; the build output size and the largest assets; unused dependencies; consistency with the design brief and the project's conventions.
2. Run the Checks and the QA gates (Step 5). You may start the app and the build; these must not change tracked files. If they would, stop that Check and record why. The baseline is not updated.
3. Record each problem as a finding F-xx: severity, the AC or rule it breaks (for example "4.1.6"), location (`file:line`, or page and viewport), what is wrong, and the suggested fix.
4. Write the report (Step 6) with the "Findings" table sorted High to Low. Then Step 7 commits the report, the knowledge file and the learning files only.

**EVALUATE FLOW (TASK is `evaluate`; also runs automatically at the end of Step 6 when due)**

The evaluator is cheap by design: it reads `{METRICS_FILE}`, `{FAILURES_FILE}`, `{LESSONS_FILE}`, `{LEARNINGS_DIR}/evaluator-state.md` and the baseline metrics file, nothing else (rule 4.2.11). It never reads the taste notes.

- **When it runs.** On demand (`TASK = evaluate`), or automatically at the end of Step 6 when EVALUATOR_EVERY is above 0 and the number of metrics rows minus `last_evaluated_rows` in `evaluator-state.md` is at least EVALUATOR_EVERY.
- **What it writes** to `{REPORTS_DIR}/evaluation-<date>.md` (one page): for the rows since the last evaluation and for the window before it: average share of ACs passing on the first try, average fix loops per story, Lighthouse performance and accessibility, bundle size, visual difference, minutes and tokens per story, each with the trend (better, same, worse); the 3 most repeated failures with their counts; learning-file sizes against the caps, new rules, contradictions found; and a list of proposals written.
- **Proposals.** If a metric got worse over two windows in a row, or a failure repeats while a rule already exists for it, write a proposal (rule 25) with a diff. Never apply it.
- **Regression notice.** If `WORKFLOW_VERSION` differs from the version recorded in `{LEARNINGS_DIR}/baseline-metrics.md`, say so and recommend `TASK = regress`.
- Then set `last_evaluated_rows` in `evaluator-state.md` to the current row count.

**REGRESS FLOW (TASK is `regress`)**

Run only after this prompt file changed, never because a learning file changed. Run it in a scratch folder.

1. Preconditions: PROJECT_STATE is `empty`, GIT_MODE is `none`, `{LEARNINGS_DIR}/test-stories.md` holds the three fixed stories (a landing page `RT-001`, a form `RT-002`, a dashboard `RT-003`) and `{DESIGN_BRIEF}` exists. Otherwise STOP condition 1.
2. For each test story, in order, run Steps 1 to 6 as `build` with DESIGN_APPROVAL `off`, MOTION `subtle` and `UNIT_TESTS` as configured. Do not read the learning files or the taste notes (so the result measures the prompt, not past lessons or taste), treat RESOURCES_FILE as `none`, and skip Step 4B (no preview, no question). Do not write learnings or taste notes. Do not commit.
3. Collect for each story: outcome, share of ACs passing on the first try, fix loops, Lighthouse performance and accessibility, bundle size, visual difference against the story's own earlier run if any.
4. Compare with `{LEARNINGS_DIR}/baseline-metrics.md`:
   - **BASELINE CREATED**: no baseline exists; write it now with `WORKFLOW_VERSION`.
   - **REGRESSION**: any story's outcome is worse, or first-pass AC share drops by more than 10 points, or fix loops rise by 2 or more, or Lighthouse performance or accessibility drops by more than 5 points, or bundle size grows by more than 20 percent.
   - **PASS**: none of those.
5. Write `{REPORTS_DIR}/regression-<WORKFLOW_VERSION>-<date>.md`: a table of the three stories with baseline and new values, the verdict, and for a REGRESSION the metrics that got worse. The baseline file is replaced only when NOTES says `accept baseline`.

---

## 6. STOP CONDITIONS (the only times you stop and ask)

| # | Condition | When |
|---|---|---|
| 1 | `frontend-config.md` missing, a required value empty or `CHANGE_ME`, a value outside its allowed list, or `regress` preconditions not met | stop before any file is written |
| 2 | `{STORIES_DIR}` missing, or no story matches, or several match | stop before any file is written |
| 3 | The selected story has neither a goal nor any acceptance criteria | stop before any file is written |
| 4 | `PROJECT_STATE` is `existing` but no project files are found; or `empty` but the folder already holds frontend application code; or TASK is `fix` or `audit` and PROJECT_STATE is `empty` | stop before any file is written |
| 5 | After classification, no AC has a screen side (everything is server-only or out of scope) | stop before any file is written |
| 6 | TASK is `fix` and there are no defects in DEFECTS_FILE or NOTES | stop before any file is written |
| 7 | Git: the remote does not match GIT_REPO, a conflict, or a rejected push | stop Step 7 and report |
| 8 | Install, build or start still fails after MAX_FIX_ATTEMPTS and nothing runnable exists | stop Step 5, then do Steps 6 and 7 and report INCOMPLETE |
| 9 | Approval gate: DESIGN_APPROVAL resolved to `on`, the concepts are written, and `DESIGN_CHOICE` is `none` (or names an option that is not in the concept file) | stop after writing the concept file |
| 10 | `THREE_D=ask` for a build task: stop before implementation and ask the user to set `THREE_D=yes` or `THREE_D=no` in `frontend-config.md`. Do not assume a choice from `MOTION=rich` or from the installed skill | stop after pre-flight validation and project discovery; do not implement or commit |
| 11 | Preview gate (Step 4B): a real preview screenshot of a variant has been taken and the user has not yet answered whether to proceed or make another variant (or, at the cap, which saved variant to take) | stop after saving the screenshots; Step 5 does not start until the answer is given |

**STOP message format (print exactly, then nothing else):**

```
STOPPED at <step or pre-flight>: <reason in one sentence>.
Needed from you: <exact keys, files or decisions>.
```

- STOP conditions 1 to 6: write nothing and commit nothing.
- STOP condition 7: leave the files in place, print the exact error, and do not retry destructively.
- STOP condition 8: write the report anyway (outcome INCOMPLETE, with the reason), then commit it.
- STOP condition 9: leave the knowledge file and the concept file in place, commit nothing. The message is: `STOPPED at STEP 3: design concepts are ready in {CONCEPT_FILE}.` then `Needed from you: set DESIGN_CHOICE = A, B or C in frontend-config.md (add changes you want in NOTES) and run again.` On the re-run, Steps 1 and 2 are repeated quickly (reuse the knowledge file) and Step 3 continues with the chosen concept.
- STOP condition 10: do not start implementation and do not commit. Print:

```
STOPPED at STEP 2: 3D approval is required before implementation.
Needed from you: set THREE_D = yes to build the premium 3D experience, or THREE_D = no to build a premium non-3D site, in frontend-config.md, then run again.
```

- STOP condition 11: leave all files in place, commit nothing, do not start Step 5. Print one of these two messages, with the real paths and numbers:

```
STOPPED at STEP 4B: preview <N> of {MAX_PREVIEW_VARIANTS} is ready.
Screenshots: <one path per PREVIEW_VIEWPORT>
Needed from you: reply "proceed" to continue to QA, or "another" for a different variant. You can add what you like or dislike in the same message. In a new run, set PREVIEW_CHOICE = proceed or another in frontend-config.md instead.
```

```
STOPPED at STEP 4B: the limit of {MAX_PREVIEW_VARIANTS} preview variants is reached.
Screenshots: <paths of every saved variant>
Needed from you: reply with the variant to keep (V1, V2, ...). In a new run, set PREVIEW_CHOICE = V<n> in frontend-config.md instead.
```

  If the chat session is still open, the user's next message is the answer: "proceed", "ok", "looks good" or similar means proceed; "another", "different", "try again" or similar means another; a variant name means that variant. If the reply is unclear, print the STOP message once more; do not guess. Any like, dislike or advice typed in the reply is saved to `{PREVIEW_NOTES}` (rule 4.1.27).

---

## STEP 1: PRE-FLIGHT AND READ THE STORY  (stage: Design & Plan)

**Goal:** Validate the setup, select the story, extract the requirements.

### 1A. Pre-flight

1. Read and validate `frontend-config.md` (section 2.1). Note the start time (used for the metrics line).
2. Confirm `{STORIES_DIR}` exists and contains `.md` files.
3. If the stack needs Node (anything but plain `html` with PACKAGE_MANAGER `none`), confirm `node --version` and the package manager's `--version` work.
4. Check PROJECT_STATE against the folder (STOP condition 4). "Existing" means a `package.json` with a frontend dependency, or `.html` pages, or source files in a frontend folder.
5. If GIT_MODE is not `none`: confirm the folder is a Git repository (or is empty of Git, see Step 7). If GIT_MODE is `push`, confirm the `origin` remote matches GIT_REPO (add `https://github.com/{GIT_REPO}.git` if there is none; if a different remote exists, STOP condition 7).
6. Confirm every path named in the config (REFERENCE, DEFECTS_FILE, API_SPEC_FILE, DESIGN_SYSTEM, RESOURCES_FILE) exists when it is not `none`. A missing REFERENCE or DESIGN_SYSTEM: note it as an assumption and continue without it. A missing API_SPEC_FILE: treat it as `none` and note it. A missing RESOURCES_FILE: treat it as `none` and note it. A missing DEFECTS_FILE in fix mode: STOP condition 6. A missing DESIGN_BRIEF or TASTE_FILE is not an error (Step 3A and Step 6B handle them).
7. Version notice: if `{LEARNINGS_DIR}/baseline-metrics.md` exists and its `WORKFLOW_VERSION` differs from this file's, print one line: `Prompt changed since the regression baseline: run TASK = regress`. Do not stop.

### 1B. Select the story

Search every `.md` file in `{STORIES_DIR}`. A story section starts at a line beginning with `# ` and ends at the next such line. A section's ID is the text before the first `:` in its heading, or the value of an `ID:` line inside the section (the `ID:` line wins).

- Exactly one section matches the rule in section 2.3: set STORY_FILE and STORY_SECTION and print `Selected story: <ID> | <title> | <path>`.
- None, or more than one: STOP condition 2, listing every story ID and title found (or the candidates).

### 1C. Read and extract

1. Read ONLY STORY_SECTION. Compute the derived values (section 2.3) and print them, one per line.
2. Extract: ID and title; actor; goal; business value; acceptance criteria as AC-1 to AC-n in the order written; preconditions; test data; out-of-scope items; notes and rules (limits, formats, visible texts); the optional `Motion:` line.
3. If there are no ACs but there is a goal, derive provisional ACs, label each `(derived)`, and list them under Assumptions. If there is neither, STOP condition 3.
4. If an AC is vague, restate it as a checkable sentence and list your reading under Assumptions.
5. Classify each AC as **Frontend**, **Needs backend**, or **Out of scope** (out of scope = named by the story, or purely server-side with no screen side). If no AC is Frontend or Needs backend, STOP condition 5.
6. Choose STORY_TAGS: up to 5 tags from Appendix H that describe the story.
7. Build the Requirements Summary (short):

```
Story: <ID> - <title>
Actor / Goal: <text>
AC-1 [<Frontend|Needs backend>]: <checkable sentence>
Out of scope: <list or none>
Tags: <list>
Assumptions: <list or none>
```

---

## STEP 2: DISCOVER THE PROJECT  (stage: Design & Plan)

**Goal:** Know what exists before changing anything, resolve every `auto`, and load only what is relevant.

1. Read `{KNOWLEDGE_FILE}` if it exists.
2. **Existing project:** detect the stack, styling, language, package manager, start command, base address and theme (table in section 2.2); the folder structure; how pages or routes are defined; existing components, styles and tokens (where they live, how they are named); how data is fetched today and where; environment variable names and their prefix; lint and format settings; existing unit-test setup; naming and formatting conventions; and which animation libraries are already installed (`gsap`, `motion`, `framer-motion`, `lenis`, `three`, `animejs`, Lottie or Rive packages).
3. **Three.js skill check.** Check for the installed CloudAI-X Three.js Agent Skill in the skill locations supported by the active coding agent (including repository-level Copilot skills and supported user-level skill directories). Read the relevant SKILL.md only when the selected story or NOTES explicitly requires 3D/Three.js.
   - Do not assume that a skill installed for Claude Code is automatically available to GitHub Copilot. If the skill is not discoverable to the active agent, continue using the project's existing knowledge and dependencies; do not claim the skill was used, do not clone or copy a second repository, and record the limitation in the plan/report when it materially affects implementation.
   - Do not copy the skill's contents into this prompt or duplicate the skill files. Treat the installed skill as supplementary implementation guidance, not as a requirement to add Three.js to every project.
4. **Empty project:** apply the "Empty project" column of section 2.2. Record each choice as an assumption.
5. Read DESIGN_SYSTEM and REFERENCE when given. Read API_SPEC_FILE when given; note which routes it defines.
6. Read `{DESIGN_BRIEF}` and the tokens file when they exist (rule 4.1.23).
7. **Taste notes.** In `build` mode, when TASTE_FILE is not `none` and the file exists, read it (it is small by design). Note how many entries it holds and how many are `like` and `advice`. Remove no entry now (expiry happens when the file is written, Step 6B). Not in `fix`, `audit`, `evaluate` or `regress` mode. List the entries you will use in the plan.
8. **Resources list.** In `build` mode, when RESOURCES_FILE is not `none` and the file exists, read it and note each site's Type, license summary, license page and Status. Do not fetch anything yet; fetching happens only for items you decide to borrow (Step 3B and Step 4). If the file is `none`, missing, or the mode is not `build`, write "no resources" in the plan. In `regress` mode always write "no resources".
9. Load the learnings (rule 4.1.25): only entries tagged with a STORY_TAG or `all`, rules first, at most 15. List their IDs in the plan. In `regress` mode do not load them.
10. Resolve MOTION, MOTION_LIBRARY, THREE_D, DESIGN_APPROVAL and BUDGET_MOTION_KB (section 2.2).
11. **3D gate.** For TASK=`build`, if `THREE_D=ask`, complete read-only discovery and resolve the other settings, then stop using STOP condition 10 before writing implementation, design files or reports. Ask only this decision: should this premium site include real interactive 3D? The user must choose yes or no by updating THREE_D in `frontend-config.md` and rerunning. Do not infer yes from `MOTION=rich`, NOTES mentioning premium visuals, or skill availability. For TASK=`fix` or `audit`, `THREE_D=ask` resolves to `no`.
12. **Existing project only:** run the Checks that already exist (install if `node_modules` is missing, lint, type check, unit tests, build, start) once to learn the baseline. Record what already fails, so you do not take the blame or "fix" it unasked.
13. Write or update `{KNOWLEDGE_FILE}` (format in Appendix B).
14. Print the resolved settings, one per line.

---

## STEP 3: DESIGN AND PLAN  (stage: Design & Plan)

**Goal:** A fixed design reference, an approved direction when one is needed, and a short, reviewable plan.

### 3A. Design

Follow rule 4.1.23:

1. DESIGN_APPROVAL `off` and a brief exists: use the brief and the tokens. Go to 3B.
2. No brief, existing project: derive a short draft brief from the existing look, mark it `status: derived (review me)`, record it under Assumptions. Go to 3B.
3. DESIGN_APPROVAL `on` and DESIGN_CHOICE is `none`: write `{CONCEPT_FILE}` (Appendix E) with 2 or 3 concepts, each with a contrast check, then **STOP condition 9**. Do not start the plan. When the taste notes hold a `like` entry, at least one concept must deliberately differ from the likes (rule 4.1.27) and is labelled "Variety concept".
4. DESIGN_CHOICE is `A`, `B` or `C`: take that concept (apply any change written in NOTES and record it). If no brief exists, create `{DESIGN_BRIEF}` (Appendix D) with `status: approved` and create the tokens from the concept. Go to 3B.
5. REFERENCE is an image of the finished design and approval is `auto`: derive the brief from it, mark it `derived from REFERENCE`, and skip the options.
6. **Taste and variety (build mode, when taste notes were read).** Decide which taste entries you apply and which you set aside (an entry above it in the authority order wins). When no concept options are offered and the notes hold a `like` entry, choose the one Variety concept (rule 4.1.27). Write both decisions into plan section 3.

### 3B. Plan

Write `{PLAN_FILE}` in exactly this format:

````markdown
# Frontend Plan: {APP_NAME} - {FEATURE_NAME}
Story: {STORY_ID} | Date: <today> | Task: {TASK} | State: {PROJECT_STATE} | Stack: <resolved> | Workflow: {WORKFLOW_VERSION}

## 1. Summary
What will exist when this is done, in two or three sentences.

## 2. Resolved Settings and Decisions
| Setting | Value | How decided (config / detected / default) |
|---|---|---|
Then every decision taken, each with a one-line reason. List the learnings loaded (IDs), the number of taste entries read, and whether a resources list is in use.

## 3. Design and Motion
- Design brief: path, status, version or date. Concept chosen (A, B, C or none) and any change requested.
- Taste notes: entries applied and entries set aside, each with a one-line reason (omit when none were read).
- Variety concept: the one deliberate choice that differs from the user's likes, and why it still fits the story, brief and accessibility (omit when there is no `like` entry).
- MOTION level and how it was resolved. MOTION_LIBRARY and the reason for the choice. THREE_D decision (ask/yes/no), the user's approval, and whether the CloudAI-X skill was available. Budgets: BUDGET_PAGE_KB and BUDGET_MOTION_KB.
- Motion table (omit when MOTION is `none`):
| Effect | Element | Trigger | Technique or library | Duration and easing tokens | Reduced-motion behaviour | Mobile fallback | Est. KB |
|---|---|---|---|---|---|---|---|

## 4. Design Tokens
Existing tokens reused; new tokens added (name, value, use). A table of every text/background pair with its contrast ratio and pass or fail for A11Y_LEVEL.

## 5. Pages and Routes
| Route or file | Purpose | AC |
|---|---|---|

## 6. Components
A tree of components. For each: what it shows, its inputs, its states, the AC it serves, and whether it is new, reused or borrowed (section 12).

## 7. Screens and States
For each screen: layout at each viewport (short), exact visible text, loading / empty / error / success behaviour, keyboard behaviour, and the focus order.

## 8. Data and API
For each API source: name | address variable (name only) | auth: none, public key, or via backend | mode: mock, live, or assumed.
Then the Expected API, one block per route:
### <METHOD> <route>
- Purpose / AC: AC-1
- Request: <fields, types, rules>
- Success: <status, body shape>
- Errors: <status, body shape for each failure>
Then the mock behaviour: sample data for `ok` and `empty`, and the message for `error`.

## 9. Tasks
| ID | Task | AC | Files |
|---|---|---|---|
| T-01 | ... | AC-1 | ... |

## 10. Traceability
| AC | Tasks |
|---|---|

## 11. Needs Backend, Assumptions and Risks

## 12. Borrowed Items
Write "none" when nothing is borrowed or there is no resources list.
| Item | Source URL | Type | License (as read) | Status | License page read this run (yes / not needed) | Attribution | Adaptation to tokens and accessibility | Extra packages |
|---|---|---|---|---|---|---|---|---|

## 13. Preview Variants
Filled in Step 4B (omit in modes without a preview).
| Variant | What differs from the earlier variants | Screenshots | Answer |
|---|---|---|---|
````

**Plan check before moving on (fix the plan; do not continue until all are true):**

- Every in-scope AC appears in the traceability table.
- Every task has an AC and files.
- Every route a screen calls is in the Expected API; every route in the Expected API is used by a task.
- Every API source in the plan is in API_SOURCES (or is named `assumed-<name>`).
- No API that needs a secret key is called from the browser.
- Every text/background pair meets A11Y_LEVEL (change the tokens until it does).
- Every animation in the motion table has a reduced-motion behaviour and a mobile fallback, the estimated total fits BUDGET_MOTION_KB, at most one animation library is planned, and no 3D or smooth scroll is planned unless the story or NOTES names it.
- Every borrowed item has Status VERIFIED, or PARTIAL with its license page read in this run; none is marked Pro, paid, premium or Beta; its license allows the use; its extra packages and motion needs fit rules 4.1.24 and Safety rule 5; and it is not a whole copied page.
- When the taste notes hold a `like` entry, the plan names a Variety concept (or a concept option that differs), and no used taste entry conflicts with the story, DESIGN_SYSTEM, the brief, accessibility or a Safety rule.
- Nothing in the plan breaks a Safety rule or touches a path in section 2.5.

---

## STEP 4: BUILD  (stage: Build)

**Skip when TASK is `fix` or `audit`.**

The four optional agent files (`frontend-design-planner`, `frontend-developer`, `frontend-visual-qa`, `frontend-reviewer`, all `*.agent.md`) may exist in `{AGENTS_DIR}`. If `frontend-developer.agent.md` exists, you may hand this step to it, passing the Requirements Summary, the plan, `{KNOWLEDGE_FILE}`, the loaded learnings, the taste notes in use, the borrowed-items table and all of sections 3 and 4. You remain responsible for every other step, and the rules in this file win over the agent files. If a file is absent, or you cannot call agents, do the work yourself; nothing else is needed.

Build in this order, running the Checks after each group (rule 4.2.8):

1. **Project (empty project only).** Create the project files for the resolved stack (rule 4.1.18), the folder layout in Appendix C, `.gitignore`, `.env.example`, and a `README.md` with how to run it.
2. **Tokens and base styles.** The tokens file (with duration and easing tokens); a minimal reset; base typography; the focus style; the reduced-motion rule; the theme switching when THEME is `both`.
3. **Shared components** the plan lists (layout shell, navigation, buttons, form fields, messages, loading and empty and error blocks).
4. **Borrowed items** (only those in plan section 12; skip when it says "none"). For each item, in this order:
   - **Fetch read-only** from the listed host only, using the method the site documents (its registry command or its source page), with non-interactive flags (rule 4.1.18). Fetch nothing that is not in the table. For a PARTIAL item, fetch and read its license file first and write what it says into section 12; if it does not allow the use, drop the item and build that part yourself (record it).
   - **Adapt, do not paste.** Replace every hard-coded colour, size, spacing, radius, shadow, duration and easing with the project's tokens (rule 4.1.6). Bring it up to rules 4.1.7 to 4.1.9: semantics, labels, keyboard use, visible focus, contrast, responsive layout, and the four screen states. Make it follow MOTION_LEVEL, the single-library limit, reduced motion, lazy loading, the mobile fallback and the budgets (rule 4.1.24); give any WebGL or WebGPU part a polished static fallback.
   - **Clean.** Remove trackers, analytics, remote images, fonts and scripts, hotlinks, demo data and unused code (Safety rules 6 and 7). Install a needed package only under Safety rule 5.
   - **Mark.** Keep the license notice in each copied file as a short comment, and add the attribution the license asks for.
   - **Look different.** Items of Type `inspiration`, and landing pages of any site, give only the structure of a section or a layout idea (rule 4.1.28). The design brief decides the look.
5. **API layer and mocks** (rule 4.1.15), for every source in the plan. Include the `mock` switch.
6. **Pages and screens**, in task order, with their exact text, all four screen states, and keyboard behaviour.
7. **Motion module** (only when MOTION is not `none`): effects exactly as in the plan's motion table, in a separate module loaded lazily, with duration and easing read from tokens, a reduced-motion branch, cleanup, and a static fallback (rule 4.1.24).
8. **Premium 3D experience** (only when `THREE_D=yes` and `MOTION_LEVEL=rich`): implement the scene described in the plan, using the CloudAI-X Three.js skill when discoverable. Lazy-load it after first paint or near the relevant section; do not load real-time 3D below 768px, with Save-Data, or when reduced motion is requested. Provide a visually polished static fallback that preserves the same information and layout. Dispose of geometries, materials, textures, renderers and event listeners, and cancel animation loops on unmount. Verify keyboard access to all controls; never make essential content available only inside the canvas.
9. **Accessibility pass** over everything you built, against rule 4.1.7.
10. **Responsive pass** at every VIEWPORT, against rule 4.1.8.
11. **Unit tests** when UNIT_TESTS is `yes`: use the existing runner. If there is none and PACKAGE_MANAGER is not `none`, add the runner that matches the stack (Vitest for Vite-based stacks, the stack's default otherwise) as a dev dependency and record it. If PACKAGE_MANAGER is `none`, skip and record why. Test the logic (validation, formatting, services, mocks) and component behaviour (states, error messages), placed next to the source. NEVER under `tests/`, `e2e/`, `cypress/` or `playwright/`.
12. **Environment example.** Update `.env.example` (rule 4.1.16) and add the `README.md` section.

Record, per task: status, files created or changed, and any change to the Expected API (written back into the plan first). For motion also record library, version, licence and size. For each borrowed item record the files it created and the attribution given.

### STEP 4B: PREVIEW  (stage: Build; `build` mode only)

**Goal:** Let the user see the real page before the QA work starts, and let them ask for a different variant (rule 4.1.29).

**Skip this step** (record the reason in the report and print `[STEP 4B] skipped`) when TASK is not `build`, SCREENSHOTS is `no`, or TASK is `regress`. **Mark it unverified** (print `[STEP 4B] unverified`, continue to Step 5, no stop) when the app cannot be started yet or no browser can be run; never describe a page you did not see.

1. **Find the state.** List `{PREVIEW_DIR}`. N is the highest variant number found in `preview-v<N>-<WIDTH>.png`, or 0 if there is none.
2. **Find the answer, if any.** If N is at least 1, the answer to the earlier preview is the user's chat message, or else PREVIEW_CHOICE. If N is 0 and PREVIEW_CHOICE is not `none`, ignore it and say so in one line. Save any like, dislike or advice the user typed with the answer to `{PREVIEW_NOTES}` (Appendix J), word for word, with the date and the variant number.
   - `proceed`: write the answer in plan section 13 and go to Step 5. Do not rebuild.
   - `V<n>`: if variant n is not the one currently in the code, rebuild it from its description in plan section 13 (replace the current variant, rule 4.1.29), run the Checks, and go to Step 5. If n is not a saved variant, print the second STOP 11 message again.
   - `another`: if N is below MAX_PREVIEW_VARIANTS, go to item 3 and build variant N+1. If N is already MAX_PREVIEW_VARIANTS, print the second STOP 11 message and stop.
   - No answer and N is at least 1: print the matching STOP 11 message again and stop.
3. **Build the variant (only for N+1 after "another").** Rebuild the story's primary page and its sections as a visibly different variant: change composition (layout, section order or emphasis, type-scale use, imagery, motion within the level), not only colours; follow what the user typed about the earlier variant; stay inside the story, ACs, DESIGN_SYSTEM, the brief, accessibility and the budgets; take the other direction on the Variety concept if it helps. The new variant replaces the old one in the code; do not keep both. Run the Checks that apply (rule 4.2.8).
4. **Prepare the tools.** Start the app (Step 5B, item 1) and make sure the QA toolbox exists (Step 5B, item 2; build it now if it does not, and Step 5B will reuse it).
5. **Take the screenshots.** The story's primary page is the first row of plan section 5 (for an `html` project usually `index.html`). With Playwright, for each PREVIEW_VIEWPORT: open the page, wait for load, fonts and images, scroll through the page once so lazy and reveal content appears, scroll back, wait for motion to settle, and take a full-page screenshot to `{PREVIEW_DIR}preview-v<N>-<WIDTH>.png`. Never overwrite an earlier file.
6. **Check the files.** Each file exists, is not empty, and is not a single flat colour. If one fails, retry once; if it still fails, say so plainly, mark the preview `unverified` and continue to Step 5.
7. **Record.** Add or update the row for this variant in plan section 13: variant number, what differs from the earlier variants (one or two lines, enough to rebuild it), the screenshot names, answer pending.
8. **Ask (STOP condition 11).** Print `[STEP 4B] preview <N> of {MAX_PREVIEW_VARIANTS} | outputs: <paths>`, then the matching STOP 11 message (the second message when N equals MAX_PREVIEW_VARIANTS). Stop. Step 5 does not start until the answer is given. On a re-run, Steps 1 to 4 are repeated quickly (the plan and the code already exist; update them in place, rule 4.1.20) and this step continues from item 1.

---

## STEP 5: VISUAL QA  (stage: Visual QA)

**Goal:** Prove it works with tools and numbers, not by judging screenshots by eye. In `fix` mode limit this step to the affected pages. In `audit` mode this step is part of the audit flow and changes no tracked file. In `build` mode this step starts only after Step 4B is finished (the user answered "proceed" or chose a variant, or the preview was skipped or unverified).

### 5A. Checks

1. Run the Checks in this order and record each result: install, lint (if configured), type check (if TypeScript), unit tests (if any), build (if configured), start.
2. Fix a failing Check within MAX_FIX_ATTEMPTS per failure. Record every fix (file, before, after, reason). If install, build or start cannot be made to work and nothing runnable exists: STOP condition 8.
3. Hard limits: never delete a Check or a failing unit test to get green; never weaken accessibility, validation or security to get green.

### 5B. Start and toolbox

1. Start the app (START_COMMAND) and confirm it answers at APP_BASE_URL. If the port is busy, use the next free port and say so.
2. Build the QA toolbox once in `{QA_DIR}` with its own `package.json`: Playwright (with its Chromium browser), `@axe-core/playwright`, Lighthouse, `pixelmatch` and `pngjs`. Never add these to the project's `package.json`. Append `{QA_DIR}node_modules/` and `{QA_DIR}out/` to `.gitignore`. Write one script (`{QA_DIR}qa.mjs`) that takes the base address, the viewports and the page list and writes results as JSON to `{QA_DIR}out/`. Reuse it on later runs, and reuse the toolbox that Step 4B may already have built.
3. Serve the production build locally for G4 and G5 (`{PACKAGE_MANAGER} run preview` if the script exists, otherwise `npx serve <build folder> -l 4173`). A dev server gives meaningless performance scores. Plain `html` projects use the start command.
4. If a tool or browser cannot run (no network, no browser), mark the gates that need it `unverified`, fall back to fetching each page with a command-line request, and continue. Never invent a result.

### 5C. Gates

Run every gate on every page, at every VIEWPORT, and in each theme when THEME is `both`. Record the result of the **first** run of every gate and AC; it gives the first-pass share for the metrics.

| Gate | Tool | Passes when |
|---|---|---|
| G1 Renders and console | Playwright | The page loads; no console errors or warnings from your code (library warnings count); no failed request except those the `error` mock makes on purpose |
| G2 No horizontal scroll | Playwright | `scrollWidth` never exceeds the window width, at every VIEWPORT and at 320px |
| G3 Accessibility engine | axe-core, tags for A11Y_LEVEL (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`; plus `wcag2aaa` for AAA) | 0 violations of impact `critical` or `serious`; list moderate and minor ones in the report |
| G4 Lighthouse | Lighthouse, mobile preset, production build, median of 3 runs per page | Performance at least LH_PERF_MIN, accessibility at least LH_A11Y_MIN, layout shift (CLS) at most 0.1. Record total blocking time |
| G5 Weight | Transfer sizes of the initial load | Initial load within BUDGET_PAGE_KB; motion code and assets within BUDGET_MOTION_KB (compressed size) |
| G6 Visual baseline | Playwright screenshot with animations disabled and reduced motion, `[data-qa-mask]` regions masked, compared with `pixelmatch` (per-pixel tolerance 0.1) against `{BASELINE_DIR}/<page>_<WIDTH>[_<theme>].png` | Pages outside the story's scope: difference at most VISUAL_DIFF_MAX percent. Pages in scope: list the differences for the human, not a failure. No baseline yet: save the screenshot as the new baseline. Skipped when SCREENSHOTS is `no` |
| G7 Reduced motion | Emulate `prefers-reduced-motion: reduce`, then list network requests | No non-essential motion; all content visible; no animation-library, ScrollTrigger, Lenis or three.js chunk requested |
| G8 Motion fallback | Emulate a 375px screen and Save-Data (when MOTION is not `none`) | The static fallback shows with the same content; heavy modules (3D, Lottie, Rive) are not requested |
| G9 AC flows | Playwright or a browser tool | Every in-scope AC performed; one line of evidence each (what you did, what you saw) |
| G10 States | The `mock` switch: `slow`, `empty`, `error` | Loading, empty and error states look and read correctly and "Try again" works |
| G11 Keyboard | Keyboard walk, once per page | Focus always visible, logical order, no traps, Enter and Space activate buttons, Escape closes dialogs and returns focus. With smooth scroll or pinned sections: Tab to an offscreen control scrolls it into view, and Space, Page Down, Home, End and anchor links still work |
| G12 Text size | 200 percent text size | No clipping or overlap |

Motion checks (when MOTION is not `none`):

- **Lazy loading.** Load each page without scrolling and list the requests. No 3D, Lottie, Rive or animation-library chunk is requested above the fold unless the plan says the hero needs it.
- **Cleanup.** Leave an animated page and come back three times. The console stays clean and the animation does not run twice.
- **3D.** The canvas stops rendering when offscreen or when the tab is hidden; a missing WebGL context shows the fallback; the canvas is decorative or labelled and never traps focus.
- **Contrast** in each theme: the plan's contrast table matches the real computed colours.

Borrowed-item check (when plan section 12 lists items): no request goes to a host of the resources list or to any host outside EXTERNAL_RESOURCES at runtime (G1), and each borrowed item passes G3, G7, G8 and G11 like the rest of the page.

### 5D. Fix rounds (capped)

1. One round = fix everything that failed in one editing pass, then re-run only the failed gates plus G1 and the Checks.
2. At most QA_FIX_ROUNDS rounds. After that, list what still fails as unresolved with your diagnosis and severity. A High issue left open makes the outcome INCOMPLETE; a Medium or Low issue makes it DONE WITH NOTES.
3. Fix for real reasons only (Safety rule 10). If a library or asset breaks BUDGET_MOTION_KB, use a lighter technique or asset; never raise the budget.

### 5E. After the last round

1. Save one screenshot per page per viewport (and theme) to `{SHOT_DIR}` (rule 4.2.7) when SCREENSHOTS is `yes`. The preview screenshots stay in `{PREVIEW_DIR}`.
2. Update the baseline: if the outcome is not INCOMPLETE and no High issue is open, copy the screenshots of the pages in the story's scope to `{BASELINE_DIR}` and record that in the report. Never update the baseline in `audit` mode, and in `fix` mode only for the affected pages.
3. Record the build output size (total and the largest files), the Lighthouse medians, the weights and the visual differences.
4. Update `{KNOWLEDGE_FILE}` with the new components, routes, tokens, motion modules and conventions. Stop the app if you started it.

---

## STEP 6: REVIEW AND REPORT  (stage: Review)

### 6A. Review (one pass; no new features; no new QA round)

1. Every in-scope AC has a finished task and a line of evidence. The files changed are a subset of the files in the plan; explain any extra file.
2. Spot checks: no hard-coded colour, size, duration or easing outside tokens; no TODO, lorem ipsum or commented-out code; no leftover `console.log`; no outside host outside EXTERNAL_RESOURCES; no secret; no new dependency without a recorded reason.
3. Design: the result follows the brief's do and don't, and the palette matches the approved concept.
4. Motion (when MOTION is not `none`): the effects built are exactly the effects in the plan; the MOTION level was respected; at most one animation library is installed, pinned by the lock file, loaded only where used and imported by plugin; each effect has reduced-motion handling, cleanup and a fallback.
5. Borrowed items (when plan section 12 lists items): each one in the code is in the table and nothing else was borrowed; each file carries its license notice; the attribution the license asks for is present; each item uses tokens, not its own hard-coded values; no whole page or section order was copied.
6. Taste and preview (build mode): the Variety concept, if the plan names one, is in the result and labelled; the preview variant in the code is the one the user chose; the answers are in `{PREVIEW_NOTES}`.
7. Fix only a one-line problem, then re-run the Checks. Anything bigger goes under "Not done".

### 6B. Learnings and taste notes (rules 4.1.25 and 4.1.27)

1. **Learnings.** Create `{LEARNINGS_DIR}` and its files if they do not exist. For each distinct failure of this run, write or update an entry by the counter rules; promote at `count` 3; apply the caps and the expiry; refuse contradictions and write a proposal instead. Write a proposal for any general rule or worsening trend. Not in `regress` mode.
2. **Taste notes** (`build` and `fix` mode, TASTE_FILE not `none`; never in `regress`). Collect what the user typed in this run: chat messages, NOTES, and `{PREVIEW_NOTES}`. Keep only lasting preferences or directions, not one-off change requests (rule 4.1.27). If there is nothing, write nothing: silence creates no entry and nothing is inferred. Otherwise create the file from Appendix I if it does not exist, remove expired entries, add or update entries (same meaning: update the date; opposite meaning: the newer replaces the older), and then cut the oldest entries until the file is at or under TASTE_MAX_LINES lines. List what was added, updated and removed (the entry text only) in the report.

### 6C. Metrics

Append one row to `{METRICS_FILE}` (header in Appendix F). Every value comes from real output:

- **ac_first_pass_pct**: in-scope ACs whose evidence passed on the first verification run, divided by in-scope ACs, as a percent.
- **fix_loops**: Check fix attempts used plus QA rounds used.
- **lh_perf, lh_a11y**: the lowest median across the pages.
- **bundle_kb**: total build output (compressed size where the tool shows it).
- **visual_diff_pct**: the largest difference among pages outside the story's scope, or `n/a`.
- **minutes**: from the start time of Step 1 to now. **tokens**: from the tool if it shows them, otherwise `n/a`.

### 6D. Evaluator

If EVALUATOR_EVERY is above 0 and enough rows have been added since `last_evaluated_rows`, run the EVALUATE FLOW (section 5).

### 6E. Report

Write `{REPORT_FILE}` in this format:

````markdown
# Frontend Report: {STORY_ID} - {FEATURE_NAME}
Date: <today> | Task: {TASK} | Stack: <resolved> | API mode: {API_MODE} | Workflow: {WORKFLOW_VERSION}
Plan: <relative link, or "none" in audit mode>

## 1. Summary
**Outcome:** DONE | DONE WITH NOTES | INCOMPLETE (reason in one sentence, using the outcome rules in section 1)
Tasks: <done>/<total> | ACs covered: <x>/<y> | Checks: <passed>/<run> | QA gates: <passed>/<run> | Visual checks: verified | unverified
Design: brief <path, status> | concept <A/B/C/none> | Motion: <level> (<library>)

## 2. Acceptance Criteria Evidence
| AC | Class | Tasks | Evidence | Status (Verified / Unverified / Not done) |
|---|---|---|---|---|

## 3. Checks
| Check | Command | Result |
|---|---|---|

## 4. Visual QA
| Gate | First run | Final | Notes |
|---|---|---|---|
Then screens: | Page | Viewport | Theme | Result | Screenshot | Baseline difference |
Rounds used: <n> of {QA_FIX_ROUNDS}. Unresolved: <list>. Screenshot masks used: <list or none>. Baseline updated: <yes/no, pages>.

## 5. Metrics
| Metric | Value |
|---|---|
(the values of the metrics line)

## 6. Changes
| File | Created / Changed | Task |
|---|---|---|

## 7. What Changed and Why (only if EXPLAIN is yes)
For each file: what it does, why it was needed, the one thing to understand about it.

## 8. Dependencies Added
| Package | Version | Licence | Size | Why |
|---|---|---|---|---|

## 9. Motion (omit when MOTION is none)
| Effect | Technique or library | Reduced-motion behaviour | Mobile fallback | Weight KB |
|---|---|---|---|---|

## 10. Expected API (what the server must provide)
Every route the frontend calls, with request, success and error shapes, so the backend can be built to match. "None" if no API is used.

## 11. Needs Backend and Not Done
Everything that depends on the server, every image or asset still needed, everything unresolved or not reproduced, with the reason.

## 12. Defect Fixes (fix mode) or Findings (audit mode)
| ID | Severity | Root cause or problem | Fix or suggested fix | Location |
|---|---|---|---|---|

## 13. Learnings and Proposals
Learning entries added or updated (ID, count, status); promotions; proposals written (paths); learnings applied from the plan.

## 14. Assumptions, Risks and Recommendations

## 15. How to Run
Exact commands to install, start and open the app, and how to switch between mock and live.

## 16. Setup You Must Do (only if API_MODE is live)
The environment variable names to fill in `.env` (names only, never values) and what each must point to.

## 17. Third-Party Components (write "none" when nothing was borrowed)
| Item | Source URL | License | Status | Attribution used (and where) | Files | Adapted to tokens and accessibility |
|---|---|---|---|---|---|---|
Also list items you looked at and dropped, with the reason (license not allowing the use, Pro or paid, no fallback, library not allowed). Suggestions for the resources list go in section 13 as proposals.

## 18. Preview and Taste Notes (build mode)
Preview: variants shown <n> of {MAX_PREVIEW_VARIANTS} | variant kept <V<n>> | screenshots <paths in {PREVIEW_DIR}> | status verified / unverified / skipped (reason).
Variety concept: <the choice, or "none (no like entries)">.
Taste notes: entries used <n>, set aside <n> (with reasons in the plan); changes to {TASTE_FILE}: added <text>, updated <text>, removed <text>, or "nothing typed, no change".
````

Every number comes from real command output, never an estimate. Use tables, not paragraphs. Link to the plan instead of repeating it.

---

## STEP 7: COMMIT  (end of the Review stage)

Follow GIT_MODE:

- `none`: do no Git operation. State that in the final summary and stop.
- `commit` or `push`: continue below. In `commit` mode skip every step that needs a remote (pulling, pushing).

1. **Prepare the branch.**
   - **Not a Git repository, or a repository with no commits:** initialise Git locally if needed; make a first commit on BASE_BRANCH containing only `.gitignore` and `README.md` (message `chore: initial commit`); in `push` mode push it; then create GIT_BRANCH from it. Tell the user the base branch was created.
   - **Repository with commits:** in `push` mode pull the latest BASE_BRANCH; create GIT_BRANCH from it. Leave the user's unrelated uncommitted changes alone.
   - **GIT_BRANCH already exists:** check it out and add a new commit on top.
   - **Conflict or rejected push:** STOP condition 7.
2. **Stage only** the files you created or changed in this run (section 2.4): source, tokens, plan, concept file, report, knowledge file, learning files, proposals, screenshots, the preview screenshots and `{PREVIEW_NOTES}`, `{TASTE_FILE}` when it changed, baseline images and a newly created design brief. Never `git add .`. Never stage anything from section 2.5 or 2.6.
3. **Check before committing:** run `git status` and read the list; search the staged files for secrets (section 3, rule 1); confirm nothing from section 2.5 or 2.6 is staged.
4. **Commit** with this message:

```
feat({STORY_ID}): {FEATURE_NAME}

- Plan: {PLAN_FILE}
- Tasks: <done>/<total> | Checks: <passed>/<run> | QA gates: <passed>/<run>
- Report: {REPORT_FILE}
- Workflow: {WORKFLOW_VERSION}
```

   In `fix` mode use `fix({STORY_ID}): <n> frontend defects` and list the F-xx IDs. In `audit` mode use `docs({STORY_ID}): frontend audit report`. In `evaluate` mode use `docs: workflow evaluation {WORKFLOW_VERSION}`.
5. **Push** (`push` mode only): push GIT_BRANCH to origin, verify it (`git ls-remote --heads origin {GIT_BRANCH}`), then print the commit SHA and `https://github.com/{GIT_REPO}/tree/{GIT_BRANCH}`. In `commit` mode print the commit SHA only.
6. Do not open a pull request unless NOTES asks for one.

---

## APPENDIX A: STORY FILE FORMAT

One feature per section; a file may hold several sections. Each section starts with a `# ` heading that gives the ID and the title.

```markdown
# US-001: Contact form

ID: US-001
App URL: http://localhost:5173          (optional)
Motion: none | subtle | rich            (optional; default subtle)

## Story
As a <role>, I want <goal>, so that <value>.

## Acceptance Criteria
1. <checkable condition>
2. <checkable condition>

## Preconditions / Test data
- <starting state; fake values only>

## Out of scope
- <what must not be built>

## Notes
- <limits, formats, exact visible texts, known rules>
```

Write each criterion so it can be answered true or false. "Shows the message 'Please enter your email' when the email field is empty" is checkable; "looks good" is not. Name 3D or smooth scroll in the story only when you want it.

## APPENDIX B: KNOWLEDGE FILE FORMAT (`{KNOWLEDGE_FILE}`)

```markdown
# Frontend knowledge: {APP_NAME}
Last updated: <date> by story <STORY_ID>

## Stack
Stack: ... | Styling: ... | Language: ... | Package manager: ... | Theme: ...
Design brief: <path, status> | Tokens: <path> | Motion library: <name or none>

## Structure
- <folder>: <purpose>

## Commands
- install: ... | start: ... | build: ... | preview: ... | lint: ... | test: ...
- address: ...

## Conventions
- Naming, where tokens live, how components and pages are organised, where the API layer and the motion module live, how errors look

## Pages and Components
- <route or component>: <purpose>, story that created it

## Baseline
- <what already failed before the first run>
```

Update in place. Merge entries; never duplicate; remove entries you find to be wrong; keep it under 150 lines.

## APPENDIX C: DEFAULT LAYOUT FOR AN EMPTY PROJECT

**`html` (no build step):**

```
index.html and <page>.html          one file per page, in the project root
assets/css/tokens.css, base.css, components.css, <page>.css
assets/js/config.js                 mode and addresses
assets/js/api/http.js, api/sources/<name>.js, api/mocks/<name>.js
assets/js/services/<feature>.js, assets/js/<page>.js
assets/js/motion/                   tokens.js, reduced.js, one file per effect (only when MOTION is not none)
assets/js/vendor/                   a library's single file with its version and licence (only when needed)
assets/img/
.env.example (not read by the browser; documents the values in config.js), README.md, .gitignore
```

Repeated header, navigation and footer markup is kept identical in every page.

**`react` (Vite) and other stacks:**

```
index.html, package.json, vite.config.<EXT>, tsconfig.json (typescript), .env.example, README.md, .gitignore
src/main.<EXT>, src/App.<COMPONENT_EXT>
src/styles/tokens.css, src/styles/base.css
src/components/, src/pages/, src/services/
src/api/http.<EXT>, src/api/sources/, src/api/mocks/
src/motion/                         tokens, reduced, one file per effect (only when MOTION is not none)
src/assets/
```

For `next`, `vue`, `svelte`, `angular` and `astro`, keep the generator's own layout and add the folders `styles/`, `api/`, `services/` and `motion/` inside its source folder.

## APPENDIX D: DESIGN BRIEF FORMAT (`{DESIGN_BRIEF}`)

One file per project, at most 80 lines. Only the user edits it after it is created.

```markdown
# Design brief: {APP_NAME}
Status: approved | derived (review me) | derived from REFERENCE | Date: <date> | Concept: <A/B/C or none>

## Audience
Who visits, on what devices, and what they want in one sentence.

## Tone
Three words, and one sentence on how the copy sounds.

## References
Names or links of 2 to 4 sites or images that set the mood. Text only; the workflow never fetches them and never copies them.

## Do
- ...
## Don't
- ...

## Visual language
Palette (the tokens file is the source of truth), type pairing and scale, layout and grid, spacing rhythm, density, shape (radius, shadow), imagery and icon style.

## Motion
Personality (for example calm, snappy, playful), the usual duration and easing tokens, what may animate and what never does, the highest level used (none, subtle, rich), and the preferred library if any.

## Files
Tokens file: <path>
```

## APPENDIX E: CONCEPTS FILE FORMAT (`{CONCEPT_FILE}`)

Text only, no mockups. Two or three options, short.

```markdown
# Design concepts: {STORY_ID} - {FEATURE_NAME}
Workflow: {WORKFLOW_VERSION} | Date: <today>
Pick one by setting DESIGN_CHOICE in frontend-config.md. Put changes you want in NOTES.

## A. <name>
- Idea: <60 words at most>
- Palette: background, surface, text, muted, primary, primary text, border, focus: <values>
- Contrast: <text/background pairs with ratio and pass or fail for A11Y_LEVEL>
- Type: <heading and body fonts, scale>
- Layout: <two lines>
- Motion fit: <none | subtle | rich> and personality in one line

## B. <name>
...
```

When the taste notes hold a `like` entry, one option is labelled "Variety concept" and says in one line how it differs from the likes (rule 4.1.27).

## APPENDIX F: LEARNING FILE FORMATS

**`{FAILURES_FILE}` and `{LESSONS_FILE}`** (each under 120 lines, entries at most 4 lines):

```markdown
# Common failures            (or: Lessons learned)
Updated: <date> | Workflow: {WORKFLOW_VERSION}

### L-012 | tags: forms, a11y | status: candidate | count: 2 | first_seen: 2026-10-01 | last_seen: 2026-10-18
Lesson: Move focus to the first invalid field when a submit fails.
Evidence: frontend-reports/US-004-signup-frontend-report.md#4 ; frontend-reports/US-007-contact-frontend-report.md#4
```

`status` is `candidate` in the failures file and `rule` in the lessons file. `count` is the number of different stories the lesson was seen in.

**`{METRICS_FILE}`** header (one row per run):

```
date,workflow,story,task,outcome,ac_first_pass_pct,ac_total,fix_loops,qa_rounds,lh_perf,lh_a11y,bundle_kb,visual_diff_pct,minutes,tokens
```

**`{LEARNINGS_DIR}/evaluator-state.md`:** one line, `last_evaluated_rows = <n>`.

**`{LEARNINGS_DIR}/baseline-metrics.md`** (written by `regress`):

```markdown
# Regression baseline
Workflow: <version> | Date: <date>
| Story | Outcome | AC first pass % | Fix loops | LH perf | LH a11y | Bundle KB |
|---|---|---|---|---|---|---|
| RT-001 | | | | | | |
| RT-002 | | | | | | |
| RT-003 | | | | | | |
```

## APPENDIX G: PROPOSAL FORMAT (`{PROPOSALS_DIR}/P-<date>-<n>.md`)

```markdown
# Proposal P-<date>-<n>
Workflow: {WORKFLOW_VERSION} | Status: proposed
Problem: <one or two sentences>
Evidence: <links to reports and learning entries>
Change: a unified diff against FrontendEnd2EndPromptFile.md or frontend-config.md
Expected effect: <which metric or failure should improve>
Risk: <what could get worse>
After you apply it: raise WORKFLOW_VERSION and run TASK = regress.
```

## APPENDIX H: TAGS

Use these tags in learning entries and for STORY_TAGS: `all`, `forms`, `nav`, `layout`, `data`, `dashboard`, `auth`, `content`, `images`, `motion`, `a11y`, `theme`, `perf`, `states`.

## APPENDIX I: TASTE NOTES FORMAT (`{TASTE_FILE}`)

One merged file, at or under TASTE_MAX_LINES lines including the header. The workflow writes it only from what the user typed (rule 4.1.27). The user may also edit it by hand.

```markdown
# Taste notes
Format: - [project | YYYY-MM-DD] like|advice: text   (older than TASTE_EXPIRY_DAYS is removed)
- [shop-site | 2026-10-18] like: likes large serif headings on a plain light background
- [shop-site | 2026-10-18] like: dislikes image carousels
- [portfolio | 2026-10-27] advice: use more whitespace between sections
```

`like` = something the user likes or dislikes (a leaning). `advice` = a direction to follow. One line per entry, at most 200 characters.

## APPENDIX J: PREVIEW NOTES FORMAT (`{PREVIEW_NOTES}`)

One file per story, next to the preview screenshots in `{PREVIEW_DIR}`. The workflow appends to it; it never rewrites earlier entries.

```markdown
# Preview notes: {STORY_ID} - {FEATURE_NAME}
## v1 | 2026-10-27
Shown: preview-v1-1280.png, preview-v1-390.png
User said (word for word): <the text the user typed with the answer, or "nothing typed">
Answer: proceed | another | V<n>
## v2 | 2026-10-27
...
```

## APPENDIX K: RESOURCES LIST (`{RESOURCES_FILE}`, read-only for the workflow)

The user keeps this file. Each site has a Type (`components`, `library`, `tool`, `inspiration`), a license summary, the license page and a Status:

| Status | Meaning | Reuse |
|---|---|---|
| VERIFIED | License read on the site's own page or official repository | Yes, within the license, for items marked free |
| PARTIAL | License known from secondary sources | Only after the run reads the item's license file read-only and records it in plan section 12 |
| REFERENCE ONLY | No reuse license applies | Never; structure and layout ideas only |
| UNVERIFIED | Not checked | Never |

Anything marked Pro, paid, premium or Beta is never reused, whatever the Status.

---

## COMPLETION CRITERIA

- [ ] The report exists; in `build` mode the plan exists too
- [ ] Every in-scope AC has a finished task and a line of evidence (`build`), or every listed defect is fixed or explained (`fix`), or every review area is covered (`audit`)
- [ ] All Checks and QA gates were run (or marked unverified with the reason) and the results are in the report
- [ ] QA fix rounds did not exceed QA_FIX_ROUNDS
- [ ] In `build` mode the preview was shown and answered, or is recorded as skipped or unverified with the reason; no more than MAX_PREVIEW_VARIANTS variants were made
- [ ] Every borrowed item is in plan section 12 and report section 17 with license, Status and attribution; none is Pro, paid, premium, Beta, REFERENCE ONLY or UNVERIFIED
- [ ] The metrics line is appended and the learning files and the taste notes are within their caps
- [ ] The taste notes hold only what the user typed; silence created no entry
- [ ] No secret, no `.env` and no off-limits file is staged or changed; this file, the config, the resources list and an existing brief are untouched
- [ ] The work is committed (and pushed in `push` mode), and the commit SHA is printed (unless GIT_MODE is `none`)

## FINAL RESPONSE FORMAT

```
FRONTEND CYCLE SUMMARY: {STORY_ID} - {FEATURE_NAME}
Task: <build | fix | audit>   Workflow: {WORKFLOW_VERSION}
Outcome: <DONE | DONE WITH NOTES | INCOMPLETE>
Tasks: <done>/<total> | ACs covered: <x>/<y> | Checks: <passed>/<run> | QA gates: <passed>/<run> (rounds <n>/{QA_FIX_ROUNDS})
Screens verified: <pages> x <viewports> | Visual checks: <verified | unverified>
Design: <brief status> | Motion: <level> (<library>) | Lighthouse perf/a11y: <p>/<a>
Preview: <variant kept, n of {MAX_PREVIEW_VARIANTS} | skipped | unverified> | Variety concept: <short text or none>
Borrowed items: <n> (see report section 17) | Taste notes changed: <added/updated/removed counts or none>
Files: <created> created, <changed> changed | Dependencies added: <n>
Needs backend: <count> (see report section 11) | Assumptions made: <count> | Proposals written: <count>
Artifacts: <file paths>
Git: branch {GIT_BRANCH} | commit <sha> | <branch URL>   (or "no Git operations")
Run it: <start command> then open <address>
```

For `evaluate` print the path of the evaluation report and the proposals written. For `regress` print the verdict and the table of the three stories.

---

## START

Read `frontend-config.md` (section 2.1), then begin at STEP 1 and continue in order through STEP 7, including STEP 4B in `build` mode (or follow section 5 when TASK is `fix`, `audit`, `evaluate` or `regress`).