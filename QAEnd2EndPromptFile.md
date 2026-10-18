# QAEnd2EndPromptFile
# End-to-End Agentic AI QA Workflow (Playwright MCP + Playwright Test Agents + GitHub MCP)

This file is generic. It works for any web project and is never edited between runs or projects.
Every value that changes lives in `qa-config.md`.

---

## 0. HOW TO READ THIS FILE

- **Authority order.** If two instructions conflict, the higher one wins: (1) Safety rules (section 3), (2) Modes table (section 5), (3) Rules (section 4), (4) Step text, (5) Story file content, (6) `NOTES` in the config.
- **Placeholders.** `{NAME}` means "replace with the config value or derived value called NAME". `<name>` means "fill in yourself".
- **Words.** MUST and MUST NOT are mandatory. SHOULD is the default unless there is a stated reason not to.
- **Asking the user.** You ask the user a question ONLY in the STOP conditions of section 6. In every other situation you choose the most reasonable interpretation, record it as an assumption (in the plan and the report), and continue. Never stop to ask about something you can decide.
- **Chat output.** Keep chat output to the one-line status after each step, STOP messages, and the final summary. Put everything else in files.

---

## 1. DEFINITIONS

| Term | Meaning |
|---|---|
| Story | One feature described under its own `# ` heading, with an `ID:` line, in a `.md` file in `{STORIES_DIR}`. A file may hold one story or several |
| AC | Acceptance criterion: one numbered, checkable condition in the story |
| TC | Test case: one scenario with an ID (`TC-001`), steps and an expected result |
| P0 | The feature's core purpose. If this fails, the feature is unusable (main success path, validation that prevents bad data, security-critical behaviour) |
| P1 | Important behaviour most users meet (secondary paths, common validation, normal navigation) |
| P2 | Rare, cosmetic or unusual behaviour |
| Critical | Feature unusable, data loss or corruption, security exposure, crash |
| Major | Main behaviour wrong, but a workaround exists |
| Minor | Small functional or visual problem with little impact |
| Trivial | Cosmetic only (typo, slight misalignment) |
| Script defect | The test is wrong (bad locator, timing, stale data, wrong expectation). Fix the test |
| Application defect | The app behaves differently from the AC. Do NOT change the test; log a defect |
| Flaky | Fails once, then passes on an immediate re-run (or the reverse) with nothing changed |
| Environment issue | Failure caused by the network, server or machine, not by the test or the app |
| Healed | A failing test that was fixed and now passes |
| UNRESOLVED | A script defect that was still failing after the allowed fix attempts |
| Manual-only | A case that cannot be reliably automated (CAPTCHA, 2FA, third-party page, hardware); executed by hand in Step 3 where possible |
| Known defect | An application defect already logged; its test is marked so it is reported, not hidden |
| Failure group | Failing tests that share one root cause (same error message, locator or page) |
| Open defect | A logged application defect that is not fixed |

**Verdict rules (use exactly these):**
- **PASS**: every executed test passes (flaky tests excluded) and there are zero open defects.
- **PASS WITH DEFECTS**: every P0 test passes, no open defect is Critical, and the remaining problems are open Major/Minor/Trivial defects, flaky tests, or UNRESOLVED P1/P2 groups.
- **FAIL**: any P0 test fails, any open defect is Critical, any P0 group is UNRESOLVED, or the run stopped before Step 5 finished.

---

## 2. CONFIGURATION

### 2.1 Read the config first
Read `qa-config.md` (project root) before doing anything else. Rules for reading it:
- Format is `KEY = value`, one per line. Ignore blank lines and lines starting with `#`. Trim spaces around keys and values.
- A required key that is missing, empty, or `CHANGE_ME` triggers STOP condition 1.
- An optional key that is missing or empty takes its default from the table.
- Values outside the allowed list trigger STOP condition 1 (say which key and which values are allowed).

| Key | Required | Default | Allowed values / meaning |
|---|---|---|---|
| STORY_ID | yes | | ID written in the story file |
| STORY_NAME | yes | | Story title or part of it |
| MODE | no | quick | `quick` or `full` (section 5) |
| NOTES | no | none | One-run instruction. Follow it unless it conflicts with a rule that ranks above it |
| APP_NAME | yes | | Lowercase letters, digits, hyphens |
| APP_BASE_URL | yes | | Full URL with `http://` or `https://` |
| ENVIRONMENT | yes | | `local`, `dev`, `staging`, `production` |
| START_COMMAND | no | none | Command that starts the app when ENVIRONMENT is `local` |
| GIT_REPO | yes | | `owner/repo` |
| BASE_BRANCH | no | main | Existing (or to-be-created) base branch |
| BRANCH_PREFIX | no | qa | Prefix of the QA branch |
| BROWSER | no | chromium | `chromium`, `firefox`, `webkit` |
| MAX_HEAL_ATTEMPTS | no | 2 | Integer 1 to 5 |
| OS | no | windows | `windows`, `macos`, `linux` |
| TEST_CREDENTIALS | no | none | `none` or `env` |
| LOGIN_URL | no | / | Path or URL of the login page (only if `env`) |
| USERNAME_ENV | no | TEST_USERNAME | Name of the environment variable holding the username |
| PASSWORD_ENV | no | TEST_PASSWORD | Name of the environment variable holding the password |
| LANGUAGE | no | typescript | `typescript` or `javascript` |
| STORIES_DIR | no | user-stories | Folder of story files |
| SPECS_DIR | no | specs | Folder of test plans |
| TESTS_DIR | no | tests | Folder of generated tests |
| HELPERS_DIR | no | tests/helpers | Folder of shared helpers |
| REPORTS_DIR | no | qa-reports | Folder of reports and screenshots |
| AGENTS_DIR | no | .github/agents | Folder of the three `.agent.md` files |
| SEED_FILE | no | tests/seed.spec.ts | Seed test |
| PLAYWRIGHT_CONFIG | no | playwright.config.ts | Playwright config file |
| KNOWLEDGE_FILE | no | app-knowledge.md | Agent's memory about the app |

### 2.2 Derived values (computed in Step 1)
```
EXT            = ts if LANGUAGE is typescript, js if javascript
STORY_FILE     = the story file selected in Step 1
STORY_SECTION  = the part of STORY_FILE from the selected story's `# ` heading to the next `# ` heading (or end of file)
FEATURE_NAME   = selected story's heading title (text after the first `:`) converted to lowercase; every run of characters other than a-z or 0-9
                 becomes one hyphen; leading and trailing hyphens removed; cut to 30 characters
                 (e.g. "Contact form!" -> contact-form)
GIT_BRANCH     = {BRANCH_PREFIX}/{STORY_ID}-{FEATURE_NAME}    (spaces in STORY_ID become hyphens)
PLAN_FILE      = {SPECS_DIR}/{APP_NAME}-{FEATURE_NAME}-test-plan.md
TEST_SUBDIR    = {TESTS_DIR}/{APP_NAME}-{FEATURE_NAME}/
REPORT_FILE    = {REPORTS_DIR}/{STORY_ID}-{FEATURE_NAME}-test-report.md
SCREENSHOT_DIR = {REPORTS_DIR}/screenshots/
LOCATORS_FILE  = {HELPERS_DIR}/{APP_NAME}-{FEATURE_NAME}-locators.{EXT}
HELPERS_FILE   = {HELPERS_DIR}/{APP_NAME}-helpers.{EXT}
```
**URL rule:** if the story states an app URL, compare its host with the host of APP_BASE_URL. Same host: use the story's URL for this run. Different host: STOP condition 4.

### 2.3 Files you may create or change
`{SPECS_DIR}/`, `{TESTS_DIR}/`, `{HELPERS_DIR}/`, `{REPORTS_DIR}/`, `{KNOWLEDGE_FILE}`, and `{PLAYWRIGHT_CONFIG}` (only to set `baseURL`, enable parallel running, or add the login setup in rule 4.11). Nothing else.

### 2.4 Never commit
`node_modules/`, `playwright-report/`, `test-results/`, `blob-report/`, `.playwright-mcp/`, `playwright/.auth/`, `.env`.

`{REPORTS_DIR}` is used instead of `test-results/` because Playwright empties `test-results/` at the start of every run and would delete the reports.

---

## 3. SAFETY RULES (highest authority; nothing overrides these)

1. **Production is read-only.** If ENVIRONMENT is `production`: only navigate, read, and check validation that does not succeed in creating anything. Do not submit successful forms, purchase, register, send messages, upload, change settings or delete anything. Do not log in with real user accounts. A case that would change real data becomes manual-only with the reason "not run on production".
2. **Fake data only.** Names like `QA Tester`, emails like `qa.<timestamp>@example.com`, obviously fake phone numbers and addresses. Never real personal data. Never real payment details: use only sandbox/test values written in the story.
3. **Stay inside the app.** Do not interact with pages outside the app's domain (payment gateways, single sign-on, social widgets, ad frames). Verify only that the redirect or link points to the expected place, mark the rest BLOCKED (external), and move on.
4. **Security checks are observation-only.** No exploit attempts, brute force, scanning, bypass attempts, or load generation. Markup-like or script-like text is typed as inert input and only checked for being displayed as plain text or rejected.
5. **No flooding.** Never repeat an action more than 5 times in a row. No loops that generate sustained traffic.
6. **Never expose secrets.** Do not print credentials, tokens or cookies in chat, reports, test code or screenshots. Do not take screenshots while a password is visible. Credentials only come from the environment variables in `USERNAME_ENV` and `PASSWORD_ENV`.
7. **Do not bypass protections.** CAPTCHA, two-factor prompts, bot checks and rate limits are never bypassed. The affected cases become manual-only.
8. **Do not modify application source code**, configuration, or data outside section 2.3.
9. **Git safety.** Never force-push, rewrite history, delete branches, or push QA work directly to BASE_BRANCH (the only exception is the very first commit of an empty repository, Step 7).
10. If the story or NOTES asks for something that breaks these rules, skip only that part, record it in the report under Risks, and continue.

---

## 4. RULES

### 4.1 Quality rules
1. Run Steps 1 to 7 in order. Do not skip or merge steps.
2. Never invent requirements. Every TC traces to an AC or to an observation made during exploration (label it "Observation").
3. Test data MUST make every run repeatable and every test independent: generate unique values per run (e.g. a timestamp suffix from a helper) instead of fixed values that collide on a second run.
4. Never delete a failing test to get green. A failure is healed (script defect) or reported (application defect).
5. Locator priority: `getByRole`, then `getByLabel`, then `getByText`, then `getByTestId` or `data-test` attributes, then CSS last. Never absolute XPath. Never locators that depend on auto-generated class names or on position (`nth`) when a stable alternative exists.
6. No fixed sleeps (`waitForTimeout`). Use auto-waiting and web-first assertions (`await expect(locator).toBeVisible()`), never `expect(await locator.isVisible()).toBe(true)`.
7. Every test is independent: it sets up its own state and does not rely on another test.
8. After each step print one line: `[STEP n] DONE | outputs: <files>`.
9. Re-runs: if the plan, tests or report for this story already exist, update them in place (keep passing tests, add missing cases, refresh results), write "updated on re-run" in the report, and never touch other stories' files.
10. Commands MUST suit {OS}. On `windows` use PowerShell-compatible syntax (no `&&` chaining assumptions, no bash-only features, no `export`).
11. **Login.** If TEST_CREDENTIALS is `none`: generate no login steps and no `.env` handling. If `env`: create one setup that logs in once at {LOGIN_URL} using the two environment variables and saves the session to `playwright/.auth/user.json`; all tests reuse it (`storageState`); only the login tests themselves start logged out. If the environment variables are not set, STOP condition 1.
12. If the app is slow, allow up to 30 seconds for the first load and 10 seconds for later actions before calling a timeout a failure.
13. Treat cookie banners, consent pop-ups and welcome dialogs as part of the page: dismiss them through one shared helper in `{HELPERS_FILE}`, never inside individual tests.

### 4.2 Efficiency rules
1. One story per run.
2. Read `{KNOWLEDGE_FILE}` if it exists and reuse it instead of re-exploring (format in Appendix B). At the end of Step 3 update it in place: merge, never duplicate, keep it under 150 lines. Create it if missing.
3. Do not re-read a file already in context. Do not echo file contents into chat.
4. Screenshots: only the final state of each manually executed case and every failure. Never a screenshot of a password field.
5. Reuse before writing: look in `{HELPERS_DIR}`, `{SEED_FILE}` and existing specs first. Never duplicate a helper or a locator.
6. Run tests in parallel (`fullyParallel: true`, several workers). Do not run tests serially unless they share unavoidable state, and then say why.
7. Mark low-confidence cases and assumptions in the plan, so the human reviewer knows where to look.
8. Write automated tests only for cases that can be automated reliably; list the others as manual-only with the reason.
9. Cap: no more than 120 TCs per story. If the story needs more, plan the highest priorities, note "story too large, split recommended" in the report, and continue.

---

## 5. MODES (MODE in qa-config.md)

| | `quick` | `full` |
|---|---|---|
| Plan content | P0 cases only, 5 to 10 TCs | All priorities; at least 25 TCs, or at least 4 per AC if the story is small (state why the total is lower than 25) |
| Scenario catalogue (Appendix D) | Categories A to F | Categories A to K |
| Manual execution (Step 3) | Every planned TC; charters: happy path and console/network only | All P0 and P1 TCs; all charters |
| Tests generated (Step 4) | Every planned TC, all tagged `@smoke` | Every TC marked as an automation candidate (all priorities) |
| Fix attempts per failure group | 1 | MAX_HEAL_ATTEMPTS |

In `full` mode, P2 cases are verified only by their generated tests in Step 5, not by hand.

---

## 6. STOP CONDITIONS (the only times you stop and ask)

| # | Condition | Before Step 2 |
|---|---|---|
| 1 | `qa-config.md` missing, a required value empty or `CHANGE_ME`, a value outside its allowed list, or login environment variables not set | stop |
| 2 | `{STORIES_DIR}` missing, or no story matches, or several match | stop |
| 3 | The selected story section is empty, or has neither a goal nor any acceptance criteria | stop |
| 4 | The story's URL host differs from APP_BASE_URL's host | stop |
| 5 | The app is unreachable after the start attempt (section Step 1, pre-flight) | stop |
| 6 | Playwright or its browser cannot be installed or started after the retry in pre-flight | stop |
| 7 | ENVIRONMENT is `production` and NOTES asks for data-changing tests | skip that part, do not stop (Safety rule 10) |
| 8 | In Step 5, at least half of all tests fail with network, server (5xx) or timeout errors even after one re-run | stop Step 5, go to Step 6 |
| 9 | Git: remote does not match GIT_REPO, a conflict, or a rejected push | stop Step 7 and report |

**STOP message format (print exactly, then nothing else):**
```
STOPPED at <step or pre-flight>: <reason in one sentence>.
Needed from you: <exact keys, files or decisions>.
```
- STOP conditions 1 to 6 happen before any file is written: write nothing and commit nothing.
- STOP condition 8 and any unrecoverable failure from Step 2 onward: write the report anyway (Step 6 format, verdict FAIL, "run incomplete" with the reason), then commit it (Step 7).
- STOP condition 9: leave the files in place, print the exact error, and do not retry destructively.

---

## STEP 1: PRE-FLIGHT AND READ THE USER STORY

**Goal:** Check the environment, select the story, extract the requirements.

### 1A. Pre-flight (stop on failure as listed in section 6)
1. Read and validate `qa-config.md` (section 2.1).
2. Confirm `{STORIES_DIR}` exists and contains `.md` files.
3. Confirm Playwright is installed (`npx playwright --version`). If not, run `npx playwright install {BROWSER}` once; if that fails, STOP condition 6.
4. Confirm the app is reachable by navigating to APP_BASE_URL with the browser tool. If it is not reachable and ENVIRONMENT is `local` and START_COMMAND is not `none`, run START_COMMAND in the background, wait up to 60 seconds (checking every 5), and check again. Still unreachable: STOP condition 5.
5. Confirm Git: the current folder is a Git repository (or the repository is empty, see Step 7); the `origin` remote matches GIT_REPO (add `https://github.com/{GIT_REPO}.git` if there is no remote; if a different remote exists, STOP condition 9).

### 1B. Select the story
Search every `.md` file in `{STORIES_DIR}` (not subfolders unless none match). A file may contain several stories.
Every line starting with `# ` that is followed by an `ID:` line (or has an ID before the first `:`) starts a story
section, which runs until the next such heading. Lines containing only `---` are separators. For each section collect:
the ID (from the `ID:` line, or the text before the first `:` in the heading), the title, and the file name without extension
(for single-story files only).
- **ID match:** STORY_ID equals the section's ID (ignoring case and surrounding spaces).
- **Name match:** STORY_NAME (ignoring case) is contained in the section's heading title.
- A section is selected only if BOTH match the same section.
- Exactly one section: set STORY_FILE and STORY_SECTION and print `Selected story: <ID> | <title> | <path>`.
- None: STOP condition 2, listing every story's ID and title found.
- More than one: STOP condition 2, listing the candidates (if the run is unattended, pick the one whose ID match is exact and say so).

### 1C. Read and extract
1. Read ONLY STORY_SECTION (ignore every other story in the file) and compute the derived values (section 2.2). Print them on one line each.
2. Extract (story format in Appendix A; if the file is formatted differently, extract the same information as best you can): ID and title; actor; goal; business value; app URL (optional); acceptance criteria numbered AC-1 to AC-n in the order written; preconditions; test data; out-of-scope items; notes and known rules (limits, formats).
3. If there are no acceptance criteria but there is a goal, derive provisional ACs from the goal and notes, label each `(derived)`, and list them under Assumptions. If there is neither a goal nor any AC, STOP condition 3.
4. If an AC is vague, restate it as a checkable sentence, list your reading under Assumptions, and continue.
5. Classify each AC as Functional, Validation, UI, Navigation, Security or Performance.
6. Build the Requirements Summary (keep it short):
```
Story: <ID> - <title>
App URL: <url>
Actor: <role>
Goal: <text>
AC-1 [<class>]: <checkable sentence>
AC-2 [<class>]: ...
Out of scope: <list or none>
Assumptions: <list or none>
```

---

## STEP 2: AI TEST PLAN (Agent: `playwright-test-planner`)

**Goal:** Explore the live app and write a complete, structured test plan.

1. Invoke `playwright-test-planner` (`{AGENTS_DIR}/playwright-test-planner.agent.md`) with: the Requirements Summary, APP_BASE_URL, `{SEED_FILE}`, `{KNOWLEDGE_FILE}` (if it exists), MODE, and the safety rules. If you cannot call the agent, read its file and follow it yourself, and say so.
2. **Exploration scope:** the pages and states reachable from the story's flow, plus one link away. Do not crawl the whole site. Exception: if the story is site-wide (for example all links, titles, layout on every page), crawl same-domain pages breadth-first, up to 50 pages, and record the list of pages.
3. Exploration is read-only observation plus the actions the story needs, following the safety rules.
4. Write the plan to `{PLAN_FILE}` in exactly this format:

````markdown
# Test Plan: {APP_NAME} - {FEATURE_NAME}
Story: {STORY_ID} | Date: <today> | Base URL: <url used> | Environment: {ENVIRONMENT} | Mode: {MODE}

## 1. Scope
In scope: ... | Out of scope: ...

## 2. Application Overview
Pages visited, key elements, the flow discovered, and anything surprising.

## 3. Test Data
Inputs and accounts to use (fake data only, no secrets; credentials referred to by variable name only).

## 4. Test Scenarios
### TC-001: <title>
- Traceability: AC-1   (or "Observation")
- Category: <catalogue id, e.g. A1>
- Type: Positive | Negative | Edge | UI | Navigation | Security | Accessibility | Performance
- Priority: P0 | P1 | P2
- Preconditions: ...
- Steps:
  1. ...
  2. ...
- Expected result: <one checkable sentence>
- Automation: Yes | No (<reason>)
- Confidence: High | Low (<why>)

(repeat for every case, numbered TC-001, TC-002, ... with no gaps)

## 5. Traceability Matrix
| AC | Test cases |
|---|---|
| AC-1 | TC-001, TC-002 |

## 6. Assumptions, Risks and Open Questions
````

**Design techniques (apply those that fit):** equivalence partitioning; boundary values (min, min-1, min+1, max, max-1, max+1, empty); decision tables for rules with several conditions; state transitions for flows with states; error guessing (whitespace-only, special characters, markup-like text as inert input, emoji, very long text, pasted text); end-to-end journeys.

**Coverage minimums (full mode; quick mode follows the MODE table):**
- Every AC has at least one TC. No AC is left without a case.
- Per AC where the AC allows it: at least 1 positive, 2 negative, 1 edge.
- Per input field: valid, empty, whitespace-only, too short, too long, special characters, wrong format.
- Per button or link: single click, double click, rapid repeat (maximum 5), disabled state, keyboard activation (Enter and Space).
- Target mix: about 30% positive, 35% negative/validation, 15% edge, 10% UI, 10% navigation/state/security/other.
- Every TC has a catalogue category (Appendix D) or the label "Observation".

**Plan check before moving on (fix the plan, do not continue until all are true):**
- Every AC appears in the traceability matrix.
- Every TC has all fields filled; IDs are consecutive.
- The number of TCs follows the MODE table and the 120 cap.
- No TC violates the safety rules (for example a data-changing case on production).

---

## STEP 3: EXPLORATORY / MANUAL TESTING (Tool: Playwright Browser MCP)

**Goal:** Execute the plan by hand in the browser to check it against reality and collect verified locators. (Step 2 discovered the app; Step 3 verifies the cases.)

1. Execute the cases the MODE table assigns to manual execution, step by step, using the Playwright browser tools (for example navigate, snapshot, click, type, select, screenshot, console messages, network requests, resize). Reuse what the planner already learned.
2. For each case record: actual result vs expected result; verdict PASS, FAIL or BLOCKED (with reason); the exact working locator for each element you used; timing behaviour (loading, redirects); any defect.
3. Screenshots: per rule 4.2.4, saved as `{SCREENSHOT_DIR}/TC-<id>_<PASS|FAIL>.png`.
4. Extra scenarios you discover that are not in the plan: add them to a "Manual Findings" list (title, steps, expected, priority, why) and mark them for generation. Add them to the plan file too, numbered on from the last TC.
5. When a manual result contradicts the plan, do NOT change the expected result. Record it as an observation and a possible application defect.
6. Never continue past a BLOCKED case without writing down why.
7. Update `{KNOWLEDGE_FILE}` (rule 4.2.2) with new pages, flows, verified locators and quirks.

**Exploration charters** (run the ones the MODE table allows, in addition to the planned cases):
- **Happy path:** complete the main flow once with valid data; note every page, field, button and message.
- **Input:** in each field try empty, whitespace, special characters, very long text, wrong format.
- **Navigation:** browser back and forward, refresh mid-flow, direct address of a later page, a second tab.
- **State:** repeat with different pre-existing states (empty and populated data; logged out and in, if a login exists).
- **Interruption:** double click on submit, rapid clicks (maximum 5), cancel and retry.
- **Visual:** layout at 1280x720, 768x1024 and 375x667; truncation, alignment, overlapping, disabled/hover/focus states.
- **Accessibility:** complete the flow using only the keyboard; visible focus; labels on inputs; accessible names on buttons; error messages next to their fields.
- **Console/network:** console errors, failed requests, responses slower than 3 seconds.
- **Anything surprising:** log it even if no AC covers it.

**Observation record format**
```
TC-001 | PASS
Locators: nameInput -> getByLabel('Name'), sendBtn -> getByRole('button', { name: 'Send' })
Notes: the success message appears after about 300 ms
Screenshot: {REPORTS_DIR}/screenshots/TC-001_PASS.png
```

---

## STEP 4: AUTO-GENERATE TESTS (Agent: `playwright-test-generator`)

**Goal:** Turn the plan and the manual findings into runnable Playwright tests in {LANGUAGE}.

1. Invoke `playwright-test-generator` (`{AGENTS_DIR}/playwright-test-generator.agent.md`) with the plan, the Manual Findings and the verified locators. Use the verified locators, never guesses. (If you cannot call it, follow its file yourself.)
2. Put verified locators in `{LOCATORS_FILE}` and shared actions (dismiss banner, unique data, login if any) in `{HELPERS_FILE}`. Reuse them from every spec.
3. Generate spec files in `{TEST_SUBDIR}`, one per category that has cases, named `{FEATURE_NAME}-<category>.spec.{EXT}` with category one of `positive`, `validation`, `boundary`, `navigation`, `ui`, `security`, `a11y`, `performance`, `e2e`.
4. Generate the cases the MODE table says; skip those marked "Automation: No" and list them as manual-only.

**Standards**
- Header comment in each file: story ID, plan path, date.
- `test.describe('<Feature> - <category>')`. Title format: `TC-001: <title> [AC-1] @tag`.
- Tags: `@smoke` (all P0 cases and every quick-mode case), `@regression` (all), plus `@negative`, `@boundary`, `@ui`, `@a11y`, `@security` where they apply.
- `test.beforeEach` for setup; with TEST_CREDENTIALS `none` it is only `await page.goto('/')`.
- Input variations: data-driven loops (`for (const c of cases) test(...)`), each iteration with a unique readable title.
- Web-first assertions only. Assert URL, visible text, element state (enabled, disabled, checked), counts, computed values, and the absence of unexpected error messages.
- `test.step()` for readable reports, and a one-line comment stating the expected result in plain English.
- Viewport cases use `test.use({ viewport: { width, height } })`. Keyboard cases use `page.keyboard.press` and `toBeFocused()`.
- Known application defects from Step 3: mark the test with `test.fail()` (when the wrong behaviour is stable and expected to be fixed) and the comment `// KNOWN DEFECT D-xx`, so it is reported, not hidden.
- Screenshot on failure and trace on failure come from `{PLAYWRIGHT_CONFIG}` (`screenshot: 'only-on-failure'`, `trace: 'retain-on-failure'`). Set them if missing.
- `{PLAYWRIGHT_CONFIG}` must set `baseURL` to APP_BASE_URL so `page.goto('/')` works.

**Common web patterns to handle correctly**
- Browser dialogs (`alert`, `confirm`, `prompt`): register `page.once('dialog', ...)` BEFORE the action that opens them, and assert the dialog text.
- New tab or popup: wait for it with `context.waitForEvent('page')` started before the click.
- Frames: use `page.frameLocator(...)`.
- File upload: `setInputFiles` with a small generated dummy file. Downloads: `page.waitForEvent('download')` before the click.
- Dynamic or auto-generated ids and classes: never use them; ask for or add nothing to the app, use role, label or text instead.
- Date pickers, dropdowns, autocompletes: interact the way a user does, and assert the visible result.
- Loading states: wait for the final state with an assertion, never with a sleep.
- Animations: assert on the end state; do not disable the app's own behaviour.
- Reduced motion: use `test.use({ reducedMotion: 'reduce' })` or `page.emulateMedia({ reducedMotion: 'reduce' })` and assert the final state.

**Template (TypeScript; for JavaScript use `const { test, expect } = require('@playwright/test');` and `.js`)**
```ts
// Story: US-001 | Plan: specs/my-site-contact-form-test-plan.md | Date: 2026-01-01
import { test, expect } from '@playwright/test';
import { dismissBanner, uniqueEmail } from '../helpers/my-site-helpers';
import { contactForm } from '../helpers/my-site-contact-form-locators';

test.describe('Contact form - positive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissBanner(page);
  });

  test('TC-001: Submit with valid details [AC-1] @smoke @regression', async ({ page }) => {
    // Expected: a success message is shown and the form is cleared
    await test.step('Fill the form', async () => {
      await contactForm.name(page).fill('QA Tester');
      await contactForm.email(page).fill(uniqueEmail());
      await contactForm.message(page).fill('Automated QA message');
    });
    await test.step('Submit', async () => {
      await contactForm.send(page).click();
    });
    await expect(contactForm.success(page)).toBeVisible();
  });
});
```

---

## STEP 5: EXECUTE AND HEAL (Agent: `playwright-test-healer`)

**Goal:** Run the suite, fix script defects, and separate them from real defects.

### 5A. Run
Run `npx playwright test {TEST_SUBDIR} --reporter=list` headless. Add `--project={BROWSER}` only if `{PLAYWRIGHT_CONFIG}` defines a project with that name. For each test collect: status, duration, error message, screenshot or trace path. Compute the totals (passed, failed, skipped, flaky) from this output.

### 5B. Environment check
If at least half of all tests fail with network, 5xx or timeout errors, re-run once. If it persists: STOP condition 8.

### 5C. Triage before healing
Group the failures by root cause (same error message, locator or page). For each group decide, using this order:
1. **Fails only intermittently?** Re-run the failing tests once. Passes on re-run: FLAKY (log it, do not heal, do not report as a defect). Fails again with the same error: continue.
2. **Locator or element problem** (element not found, strict-mode violation, timeout waiting for an element): inspect the live page with the browser tool.
   - The element exists under a different locator, or appears later: script defect.
   - The element truly does not exist where the AC says it should: application defect.
3. **Assertion mismatch:** compare the expected value with the AC.
   - The app contradicts the AC: application defect.
   - The test's expectation was a guess the AC does not support, or the plan was wrong: script defect. You may correct the expectation ONLY if you can cite the AC or the story text that supports the new value, and you must write that citation in the healing log.
4. **Setup or data problem** (state left by another test, duplicate data, expired session): script defect.
5. **Anything else:** treat it as a script defect for the first attempt; if the attempt fails, report it as UNRESOLVED with your diagnosis.

### 5D. Heal
- Order: groups containing P0 tests first, then the groups with the most tests.
- Heal one representative of a group, then apply the same fix to every test in the group.
- **One attempt** = one edit plus a re-run of the affected tests. Allowed attempts per group come from the MODE table.
- Give the healer only the failing tests' error output, the trace summary and the relevant spec, never the whole suite.
- Record every change: file, line, before, after, reason.
- Application defects: log a defect (Appendix C format) and mark the test with `test.fail()` and `// KNOWN DEFECT D-xx`. Do not edit its expectation.
- A group still failing after the allowed attempts: mark UNRESOLVED with the diagnosis.

### 5E. Final run
Run the whole suite once more. Compare with 5A to confirm no test that passed before now fails (regression). Fix any such regression with the same rules.

**Hard limits**
- Never weaken an assertion to get green (removing it, `.catch(() => {})`, replacing a precise check with `toBeTruthy`).
- Never exceed the allowed attempts.
- Never change an expected business value so that it matches buggy behaviour.
- Never skip a test just to avoid a failure, except a known defect with its comment.

**Output:** the healed specs plus the execution results: totals (passed, failed, skipped, flaky), per-test status and attempts, the healing log, and the defect log.

---

## STEP 6: TEST REPORT

**Goal:** One report combining manual, automated and healing results, written to `{REPORT_FILE}`.

````markdown
# Test Report: {STORY_ID} - {FEATURE_NAME}
Date: <today> | Browser: {BROWSER} | URL: <url used> | Environment: {ENVIRONMENT} | Mode: {MODE}
Plan: <relative link to the plan> | Run command: `<exact command and the result line>`

## 1. Summary
**Verdict:** PASS | PASS WITH DEFECTS | FAIL (reason in one sentence, using the verdict rules in section 1)
Tests: <total> | Passed <p> | Failed <f> | Flaky <k> | Skipped <s> | Pass % <x>
Defects open: <d> (Critical <c>, Major <m>, Minor <n>, Trivial <t>) | Healed: <h> | Unresolved: <u>

## 2. Traceability
| AC | Test cases | Status |
|---|---|---|
| AC-1 | TC-001, TC-002 | Passed |

## 3. Manual Results
| TC | Title | Verdict | Notes | Screenshot |
|---|---|---|---|---|

## 4. Automation Results
| TC | Title | Status | Duration | Fix attempts |
|---|---|---|---|---|

## 5. Healing
| File | Issue | Fix | Reason / AC cited |
|---|---|---|---|

## 6. Coverage
- ACs covered / total
- By catalogue category, by priority and by type: planned / executed / passed / failed
- Manual-only cases and why they were not automated
- Gaps and untested areas, and why

## 7. Defects
| ID | Title | Severity | TC | Steps | Expected | Actual | Evidence |
|---|---|---|---|---|---|---|---|

## 8. Assumptions, Risks and Recommendations

## 9. Artifacts
Relative path of every file produced or changed
````

**Rules**
- Every number comes from actual run output, never an estimate.
- Pass % = passed / (total - skipped) x 100, rounded to one decimal; flaky tests are counted separately and excluded from "passed".
- Use tables, not paragraphs. Link to the plan instead of repeating it. Screenshots use relative paths.
- Write the verdict according to the verdict rules, not by judgement.
- If the run was stopped early, still write this report: verdict FAIL, with "run incomplete" and the stop reason in the Summary.

---

## STEP 7: COMMIT TO GIT (Tool: GitHub MCP; use the `git` command line if the MCP tools are unavailable)

1. **Prepare the branch**
   - **Empty remote repository** (no commits, no BASE_BRANCH): initialise Git locally if needed, make the first commit on BASE_BRANCH with the project files (respecting `.gitignore`; message `chore: initial commit`), push it, then create GIT_BRANCH from it. Tell the user the base branch was created.
   - **Repository with commits:** pull the latest BASE_BRANCH, then create GIT_BRANCH from it. Leave the user's uncommitted application changes alone (never stage them).
   - **GIT_BRANCH already exists** (an earlier run of the same story): check it out and add a new commit on top.
   - **Conflict or rejected push:** STOP condition 9.
2. **Stage only these paths:** `{STORIES_DIR}`, `{SPECS_DIR}`, `{TESTS_DIR}`, `{REPORTS_DIR}`, `{KNOWLEDGE_FILE}`, `{PLAYWRIGHT_CONFIG}`, `package.json`, `package-lock.json`.
3. **Check before committing:** nothing from section 2.4 is staged; `{STORIES_DIR}` is not ignored by `.gitignore` (if it is, tell the user); no secret values appear in the staged files.
4. **Commit** with this message:
```
test({STORY_ID}): end-to-end QA cycle for {FEATURE_NAME}

- Plan: {PLAN_FILE}
- Tests: <n> generated, <p> passed, <f> failed, <h> healed
- Defects logged: <d>
- Report: {REPORT_FILE}
```
5. **Push** GIT_BRANCH to origin. Verify the push (for example with `git ls-remote --heads origin {GIT_BRANCH}`), then print the commit SHA and the branch URL `https://github.com/{GIT_REPO}/tree/{GIT_BRANCH}`.
6. Do not open a pull request unless NOTES asks for one.

---

## APPENDIX A: USER STORY FILE FORMAT

One feature per `# ` section; a file may hold several sections. Each section's heading gives the ID and title.

```markdown
# US-001: Contact form

ID: US-001
App URL: https://example.com/contact          (optional)

## Story
As a <role>, I want <goal>, so that <value>.

## Acceptance Criteria
1. <checkable condition>
2. <checkable condition>

## Preconditions / Test data
- <starting state, accounts by name, sandbox values>  (never real passwords or card numbers)

## Out of scope
- <what must not be tested>

## Notes
- <limits, formats, business rules, known quirks>
```
Write each criterion so it can be answered true or false. "Shows an error for an empty email" is testable; "works well" is not.

## APPENDIX B: KNOWLEDGE FILE FORMAT (`{KNOWLEDGE_FILE}`)

```markdown
# App knowledge: {APP_NAME}
Last updated: <date> by story <STORY_ID>

## Pages
- <path>: <purpose>, key elements

## Flows
- <flow name>: <short steps>

## Verified locators
- <page>: <element> -> <locator>

## Quirks and known behaviour
- <e.g. banner appears on first visit; success message after ~300 ms>
```
Update in place. Merge entries; never duplicate; remove entries you find to be wrong; keep under 150 lines.

## APPENDIX C: DEFECT RECORD FORMAT

```
D-01 | <short title> | Severity: Major | TC-007 | AC-3
Steps: 1. ... 2. ... 3. ...
Expected: <per the AC>
Actual: <what happened>
Evidence: {REPORTS_DIR}/screenshots/TC-007_FAIL.png (and the trace path)
Browser: {BROWSER} | URL: <page>
```

---

## APPENDIX D: SCENARIO CATALOGUE

A checklist for Steps 2 to 4. Adapt each item to the story, drop what does not apply (for example login or role items when TEST_CREDENTIALS is `none`, or checkout items for a site without a checkout), and add what is missing. The MODE table says which categories apply.

### A. Functional, positive
- A1 Complete the main flow with all valid data
- A2 Only mandatory fields filled
- A3 All optional fields filled
- A4 Every valid option of each selectable input (dropdown, radio, checkbox)
- A5 Entered data is kept when moving forward and back within the flow
- A6 Success message, page or reference is shown
- A7 Result is reflected elsewhere (counters, lists, state)
- A8 Multiple valid items or quantities in one run

### B. Validation, negative
- B1 Each mandatory field empty (one at a time, then all)
- B2 Whitespace-only value in each text field
- B3 Wrong format (letters in a numeric field, malformed email, phone, postal code)
- B4 Too short and too long values
- B5 Special characters, emoji, accented and non-Latin characters
- B6 Leading and trailing spaces handled consistently
- B7 Markup-like text entered as plain input (shown inert or rejected)
- B8 Error message text, position and clearing behaviour
- B9 Several simultaneous errors shown correctly
- B10 Submit blocked and nothing saved when validation fails

### C. Boundary and edge
- C1 Minimum and maximum length or value, plus one below and one above
- C2 Zero, negative, decimal and very large numbers where numbers are accepted
- C3 Empty state (no data)
- C4 One item vs many items
- C5 Same action repeated
- C6 Double click or rapid clicks on submit (no duplicate submission)
- C7 Pasted long text; browser autofill
- C8 Date and time boundaries where relevant

### D. Navigation and state
- D1 Browser back and forward at every step
- D2 Refresh on each step
- D3 Cancel and Back return to the right page without losing or wrongly keeping data
- D4 Direct address of an inner page
- D5 Flow open in two tabs
- D6 Logout and login during the flow (only if a login exists)
- D7 Menu, breadcrumb and logo links work from every page
- D8 Page title and address correct per page

### E. UI / UX
- E1 Labels, headings, placeholders and button texts correct and spelled right
- E2 Totals and calculations correct (verify the arithmetic independently)
- E3 Currency, date and number formatting
- E4 Buttons enabled or disabled at the right times
- E5 Loading indicators; no flicker or layout shift
- E6 Layout at desktop, tablet and mobile (no overlap, no horizontal scroll, no cut-off text)
- E7 Hover, focus and active states
- E8 Images and icons load; no broken assets

### F. Security and access
- F1 Protected pages require login (if any)
- F2 One user cannot see or change another user's data (if roles exist)
- F3 Restricted or invalid-role user behaviour
- F4 Sensitive data not in the address bar or console
- F5 Password and sensitive inputs masked
- F6 Session expiry and re-login
- F7 Visible-option restrictions still enforced after tampering (observe only, never attack)

### G. Accessibility
- G1 Whole flow works with keyboard only
- G2 Logical tab order and visible focus
- G3 Every input has a label; buttons and links have accessible names
- G4 Errors are tied to their fields and visible without colour alone
- G5 One main heading and a sensible heading order
- G6 Sufficient colour contrast on key text
- G7 Images have meaningful alternative text

### H. Performance and resilience
- H1 Pages and key actions respond within a reasonable time (flag anything over 3 seconds)
- H2 Slow network and failed-request behaviour
- H3 No console errors or failed requests
- H4 Large data volumes still usable

### I. Compatibility
- I1 The `@smoke` subset on Chromium, Firefox and WebKit where configured
- I2 At least one mobile emulation profile

### J. Regression and integration
- J1 Neighbouring features still work after the flow
- J2 Data created by the flow is correct in downstream pages or APIs

### K. Content, links and site basics (static and content sites)
- K1 Every internal link resolves (no 404) and every external link has a valid address
- K2 Links that open a new tab use `rel="noopener"`
- K3 A custom 404 page exists and offers a way back
- K4 Each page has a unique, meaningful `<title>` and one main heading
- K5 Meta description and viewport tag are present
- K6 Favicon loads
- K7 Forms have a visible submit control and a success or error state
- K8 Navigation highlights the current page and works on mobile (menu opens and closes)
- K9 No placeholder text (lorem ipsum, TODO) remains on any page

---

## COMPLETION CRITERIA

The cycle is complete only when all are true:
- [ ] The plan, tests and report exist for the story
- [ ] Every AC maps to at least one TC
- [ ] Every test ran at least once after healing
- [ ] Every failure is classified (healed, application defect, flaky, unresolved)
- [ ] The report uses real numbers and the verdict follows the verdict rules
- [ ] Everything is committed and pushed, and the commit SHA is printed

## FINAL RESPONSE FORMAT

```
QA CYCLE SUMMARY: {STORY_ID} - {FEATURE_NAME}
Verdict: <PASS | PASS WITH DEFECTS | FAIL>
Tests: <total> | Passed <p> | Failed <f> | Healed <h> | Flaky <k> | Unresolved <u>
AC coverage: <x>/<y>
Defects: <d> (Critical <c>, Major <m>, Minor <n>, Trivial <t>)
Assumptions made: <count> (see plan section 6)
Artifacts: <file paths>
Git: branch {GIT_BRANCH} | commit <sha> | <branch URL>
```

---

## START

Read `qa-config.md` (section 2.1), then begin at STEP 1 and continue in order through STEP 7.