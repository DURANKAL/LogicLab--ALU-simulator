# frontend-config.md

# Settings for FrontendEnd2EndPromptFile.md (frontend-only workflow), workflow version v2.0.

#

# Format: KEY = value (one setting per line, keys in CAPITALS)

# Lines starting with # are comments. Never put a comment after a value.

# Every setting has a number (1.1, 1.2, 2.1 ...) in the comment above it.

# The number is for reference only; it is not part of the setting name.

# (required) = must be filled in.

# (required if ...) = must be filled in only in that case.

# Every other setting already holds its default; change it only if you need to.

# auto = the workflow detects the value from your project, or picks a default for an empty project.

#

# Day to day you only edit section 1.

# New project: copy this file and FrontendEnd2EndPromptFile.md into the project, then edit section 2 once.

# Section 3 holds defaults you rarely need to change.

# The run stops and tells you what is missing if a (required) value is empty or still says CHANGE_ME.

# ============================================================

# 1. RUN (change every run)

# ============================================================

# 1.1 (required unless TASK = evaluate or regress) The ID written in the story file, e.g. US-001

STORY_ID           = CHANGE_ME

# 1.2 (required unless TASK = evaluate or regress) The story title, or part of it, e.g. Contact form

STORY_NAME         = CHANGE_ME

# 1.3 What to do

# build    = implement the story

# fix      = fix the problems listed in DEFECTS_FILE or NOTES (existing project only)

# audit    = review the existing frontend against the story and the quality rules, change no source code (existing project only)

# evaluate = read the metrics and learnings, report trends, write improvement proposals (no story needed)

# regress  = re-run the 3 fixed test stories in a scratch folder and compare with the baseline (use after you change the prompt file)

TASK               = build

# 1.4 Design reference for this story: a path to an image or text file inside the project, or none

# Example: design/contact-form.png

REFERENCE          = none

# 1.5 File listing the problems to fix, or none (used only when TASK = fix)

# Any readable format; each problem needs steps, expected result and actual result

DEFECTS_FILE       = none

# 1.6 Extra instruction for this run only, written as a sentence, or none

# Example after the approval gate: Option B but with a warmer primary colour

NOTES              = none

# 1.7 Motion level for this story

# auto   = the story's Motion line if it has one, otherwise subtle

# none   = no animation except hover, focus and state changes

# subtle = native CSS and IntersectionObserver only, no library

# rich   = one animation library, scroll effects; smooth scroll and 3D only if the story names them

MOTION             = auto

# 1.8 Design concept picked at the approval gate: none | A | B | C

# Leave none until the run stops and shows you the options in the concepts file in PLANS_DIR

DESIGN_CHOICE      = none

# ============================================================

# 2. PROJECT (set once per project)

# ============================================================

# 2.1 (required) Lowercase letters, digits and hyphens only, no spaces, e.g. my-site

APP_NAME           = CHANGE_ME

# 2.2 (required) empty | existing

# empty    = the folder has no frontend code yet; the workflow creates the project

# existing = the folder already holds the frontend; the workflow follows what is there

PROJECT_STATE      = CHANGE_ME

# 2.3 Git behaviour

# push   = create a branch, commit, and push it to GIT_REPO

# commit = create a branch and commit locally, no remote needed

# none   = no Git commands at all

GIT_MODE           = push

# 2.4 (required if GIT_MODE = push) GitHub repository as owner/repo

GIT_REPO           = CHANGE_ME

# 2.5 Branch the work branch is created from: main or master

BASE_BRANCH        = main

# 2.6 Prefix of the work branch name, giving e.g. frontend/US-001-contact-form

BRANCH_PREFIX      = frontend

# 2.7 auto | html | react | vue | svelte | next | angular | astro

FRONTEND_STACK     = auto

# 2.8 auto | css | scss | tailwind

STYLING            = auto

# 2.9 auto | typescript | javascript

LANGUAGE           = auto

# 2.10 auto | npm | pnpm | yarn | bun | none (none = plain HTML with no build step)

PACKAGE_MANAGER    = auto

# 2.11 Command that starts the site on your machine, or auto

# Example: npm run dev

START_COMMAND      = auto

# 2.12 Full address where the site runs, including http://, or auto

# Example: http://localhost:5173

APP_BASE_URL       = auto

# 2.13 Where the frontend gets its data

# mock = fake data inside the frontend, no server needed

# live = real network calls to the addresses in your .env file (falls back to mock if an address is missing)

API_MODE           = mock

# 2.14 APIs the frontend talks to: none, or names separated by commas

# backend = this project's own server. Any other name = an outside API.

# Example: backend, weather

API_SOURCES        = none

# 2.15 Path to an OpenAPI or JSON file describing those APIs, or none

# The workflow reads it and never edits it. With none, the workflow assumes the API shapes and writes them down.

API_SPEC_FILE      = none

# 2.16 auto | light | dark | both (both = follows the visitor's system setting)

THEME              = auto

# 2.17 Path to a file or folder describing your colours, fonts and spacing, or none

# It overrides the palette in the design brief where they differ

DESIGN_SYSTEM      = none

# 2.18 Path of the design brief (audience, tone, references, do and don't, motion personality)

# If the file does not exist, the workflow creates it once (empty project: after you pick a concept)

DESIGN_BRIEF       = design/design-brief.md

# 2.19 Approval gate for design concepts: auto | on | off

# auto = on for an empty project with no brief, otherwise off. Always off for fix and audit

# on   = write 2 or 3 short text options, then stop so you can pick one with DESIGN_CHOICE

# off  = never stop for design

DESIGN_APPROVAL    = auto

# 2.20 Animation library used at motion level rich: auto | native | motion | gsap

# auto   = the library already in the project, otherwise the simplest one that does the job

# native = never use a library, even at rich

# motion = the Motion library (formerly Framer Motion)

# gsap   = GSAP (free, includes ScrollTrigger and SplitText)

MOTION_LIBRARY     = auto

# 2.21 Outside hosts the pages may load fonts, scripts or images from: none, or hostnames separated by commas

# Example: fonts.googleapis.com, fonts.gstatic.com

EXTERNAL_RESOURCES = none

# 2.22 Operating system your commands must suit: windows | macos | linux

OS                 = windows

# ============================================================

# 3. DEFAULTS (rarely changed)

# ============================================================

# 3.1 yes | no

# Write small unit tests for the logic and components you create

UNIT_TESTS         = yes

# 3.2 yes | no

# Save a screenshot of every page at every viewport after the final fix. no also turns off the visual baseline check

SCREENSHOTS        = yes

# 3.3 yes | no

# Explain every file in plain English in the report

EXPLAIN            = no

# 3.4 Fix attempts per failing check (install, lint, tests, build, start), 1 to 5

MAX_FIX_ATTEMPTS   = 3

# 3.5 Visual QA fix rounds, 0 to 3

# One round = fix everything that failed, then re-run the failed checks. Stops endless polishing loops

QA_FIX_ROUNDS      = 2

# 3.6 Language of the pages, written into the HTML lang attribute, e.g. en, hi, fr

UI_LANGUAGE        = en

# 3.7 Accessibility level to meet: AA | AAA

A11Y_LEVEL         = AA

# 3.8 Screen sizes to check, WIDTHxHEIGHT separated by commas (phone, tablet, desktop)

VIEWPORTS          = 375x667,768x1024,1280x720

# 3.9 Lighthouse performance score every page must reach (median of 3 runs on the production build), 0 to 100

LH_PERF_MIN        = 90

# 3.10 Lighthouse accessibility score every page must reach, 0 to 100

LH_A11Y_MIN        = 95

# 3.11 Largest allowed initial page load in KB (compressed)

BUDGET_PAGE_KB     = 500

# 3.12 Extra KB that motion code and assets may add, or auto

# auto = 0 for none, 15 for subtle, 250 for rich

BUDGET_MOTION_KB   = auto

# 3.13 Largest allowed screenshot difference against the baseline on pages the story does not touch, in percent

VISUAL_DIFF_MAX    = 0.5

# 3.14 Folder holding the accepted baseline screenshots

BASELINE_DIR       = frontend-reports/baseline

# 3.15 Path prefix of this project's own server routes (used only by the backend source)

API_PREFIX         = /api

# 3.16 Extra paths the workflow must never change: none, or paths separated by commas

OFF_LIMITS         = none

# 3.17 Folder holding the user story .md files

STORIES_DIR        = .vscode/user-stories

# 3.18 Folder for plans and design concept files

PLANS_DIR          = frontend-plans

# 3.19 Folder for reports, screenshots and the QA tools

REPORTS_DIR        = frontend-reports

# 3.20 Folder for what the workflow learns: common-failures.md, lessons-learned.md, metrics.csv, proposals, test-stories.md

LEARNINGS_DIR      = learnings

# 3.21 Run the evaluator every N stories (it only reads the metrics and learning files). 0 = only when you ask with TASK = evaluate

EVALUATOR_EVERY    = 5

# 3.22 File where the workflow keeps what it learned about the project, so it need not re-explore

KNOWLEDGE_FILE     = frontend-knowledge.md

# 3.23 Folder holding the frontend source code, or auto

FRONTEND_DIR       = auto

# 3.24 Folder holding optional agent files (frontend-design-planner, frontend-developer, frontend-visual-qa, frontend-reviewer)

AGENTS_DIR         = .github/agents