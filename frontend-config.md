# FrontendEnd2EndPromptFile.md — Frontend Workflow v2.0

# ============================================================

# 1. RUN

# ============================================================

STORY_ID           = US-001

STORY_NAME         = LogicLab ALU Simulator

TASK               = build

REFERENCE          = none

DEFECTS_FILE       = none

NOTES              = Build a premium digital electronics website with an immersive scrolling homepage and a separate interactive 4-bit ALU simulator, rich animations, responsive layouts, accessible interactions, and genuine Visual QA evidence. Create an original design without using prebuilt website templates.

MOTION             = rich

THREE_D            = yes

DESIGN_CHOICE      = Original engineering-laboratory aesthetic with custom circuit visualizations, technical typography, and restrained electric-cyan accents. Create an immersive scrolling homepage and a dedicated, functional ALU simulator.

# ============================================================

# 2. PROJECT

# ============================================================

APP_NAME           = logiclab

PROJECT_STATE      = empty

GIT_MODE           = push

GIT_REPO           = DURANKAL/AI-Frontend-Workflow-Blueprint

BASE_BRANCH        = main

BRANCH_PREFIX      = frontend

FRONTEND_STACK     = auto

STYLING            = auto

LANGUAGE           = auto

PACKAGE_MANAGER    = auto

START_COMMAND      = auto

APP_BASE_URL       = auto

API_MODE           = mock

API_SOURCES        = none

API_SPEC_FILE      = none

THEME              = dark

DESIGN_SYSTEM      = none

DESIGN_BRIEF       = design/design-brief.md

DESIGN_APPROVAL    = auto

MOTION_LIBRARY     = auto

EXTERNAL_RESOURCES = https://www.awwwards.com/websites/sites_of_the_year/

OS                 = windows

# ============================================================

# 3. DEFAULTS

# ============================================================

UNIT_TESTS         = yes

SCREENSHOTS        = yes

EXPLAIN            = no

MAX_FIX_ATTEMPTS   = 3

QA_FIX_ROUNDS      = 2

UI_LANGUAGE        = en

A11Y_LEVEL         = AA

VIEWPORTS          = 375x667,768x1024,1280x720

LH_PERF_MIN        = 90

LH_A11Y_MIN        = 95

BUDGET_PAGE_KB     = 500

BUDGET_MOTION_KB   = auto

VISUAL_DIFF_MAX    = 0.5

BASELINE_DIR       = frontend-reports/baseline

API_PREFIX         = /api

OFF_LIMITS         = none

STORIES_DIR        = .vscode/user-stories

PLANS_DIR          = frontend-plans

REPORTS_DIR        = frontend-reports

LEARNINGS_DIR      = learnings

EVALUATOR_EVERY    = 5

KNOWLEDGE_FILE     = frontend-knowledge.md

FRONTEND_DIR       = auto

AGENTS_DIR         = .github/agents

# Taste notes (items 1 to 5)

TASTE_FILE = design/taste-notes.md

TASTE_MAX_LINES = 60

TASTE_EXPIRY_DAYS = 90

# Preview (items 6 and 7)

MAX_PREVIEW_VARIANTS = 3

PREVIEW_VIEWPORTS = 1280x800, 390x844

# Free component resources (item 8)

RESOURCES_FILE = design/resources.md   # or: none
