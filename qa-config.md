# qa-config.md
# Settings for QAEnd2EndPromptFile.md.
#
# Format: KEY = value  (one setting per line, keys in CAPITALS)
# Lines starting with # are comments. Never put a comment after a value.
# Keys marked (required) have no default and must be filled in.
# Every other key already holds its default; change it only if you need to.
#
# Day to day you only edit section 1.
# New project: copy this file and QAEnd2EndPromptFile.md into the project, then edit sections 2 and 3 once.
# Section 4 only needs changes if your folder layout differs.
# The run stops and tells you what is missing if a (required) value is empty or still says CHANGE_ME.


# ============================================================
# 1. RUN  (change every run)
# ============================================================

# (required) The ID written in the story file, e.g. US-001
STORY_ID           = CHANGE_ME

# (required) The story title, or part of it, e.g. Contact form
STORY_NAME         = CHANGE_ME

# quick = only the most important (P0) cases, fastest and cheapest
# full  = complete scenario catalogue, slower and more thorough
MODE               = quick

# Extra instruction for this run only, written as a sentence, or none
NOTES              = none


# ============================================================
# 2. PROJECT  (set once per project)
# ============================================================

# (required) Lowercase letters, digits and hyphens only, no spaces, e.g. my-site
APP_NAME           = CHANGE_ME

# (required) Full address where the site runs, including http:// or https://
APP_BASE_URL       = CHANGE_ME

# (required) local | dev | staging | production
# production makes every test read-only (nothing is created, changed or deleted)
ENVIRONMENT        = CHANGE_ME

# Command that starts the site on your machine (used only when ENVIRONMENT = local), or none
# Example: npx serve . -l 8080
START_COMMAND      = none

# (required) GitHub repository as owner/repo
GIT_REPO           = CHANGE_ME

# Branch the QA branch is created from: main or master
BASE_BRANCH        = main

# Prefix of the QA branch name, giving e.g. qa/US-001-contact-form
BRANCH_PREFIX      = qa

# chromium | firefox | webkit
BROWSER            = chromium

# Fix attempts per group of failing tests in full mode, 1 to 5 (quick mode always uses 1)
MAX_HEAL_ATTEMPTS  = 3

# Operating system your commands must suit: windows | macos | linux
OS                 = windows


# ============================================================
# 3. LOGIN  (set once per project)
# ============================================================

# none = the site has no login, so no login steps are generated
# env  = the site has a login; credentials are read from environment variables (see below)
TEST_CREDENTIALS   = none

# Login page path or address, used only when TEST_CREDENTIALS = env
LOGIN_URL          = /

# Names of the environment variables (in your .env file) holding the test account
USERNAME_ENV       = TEST_USERNAME
PASSWORD_ENV       = TEST_PASSWORD


# ============================================================
# 4. LAYOUT  (set once per project; matches your folder structure)
# ============================================================

# typescript | javascript
LANGUAGE           = typescript

# Folder holding the user story .md files
STORIES_DIR        = user-stories

# Folder for test plans
SPECS_DIR          = specs

# Folder for generated tests
TESTS_DIR          = tests

# Folder for shared helpers and locator files
HELPERS_DIR        = tests/helpers

# Folder for reports and screenshots (not test-results, which Playwright empties on every run)
REPORTS_DIR        = qa-reports

# Folder holding the planner, generator and healer .agent.md files
AGENTS_DIR         = .github/agents

# Seed test the planner and generator start from
SEED_FILE          = tests/seed.spec.ts

# Playwright configuration file
PLAYWRIGHT_CONFIG  = playwright.config.ts

# File where the agent keeps what it learned about the app, so it need not re-explore
KNOWLEDGE_FILE     = app-knowledge.md