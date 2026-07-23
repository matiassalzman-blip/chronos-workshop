---
name: design-tokens-init
description: Generate a basic design.md at the project root from an existing Figma reference — pulling local variables if present, a connected library's variables if not, or a best guess from reference screens as a last resort — then sync those tokens into styles/globals.css. Use when a new prototype has an existing Figma file to visually align to; normally triggered from repo-init's first-clone questionnaire, but can also be run directly whenever a Figma reference shows up later, or to re-sync after design.md's tokens are hand-edited.
---

This skill answers one question: does an existing Figma reference exist, and if
so, what should this prototype's token system become to match it? It produces
two files that must stay in sync — `design.md` (the readable reference) and
`styles/globals.css` (what the app actually renders with).

## When to use

- Normally invoked from `repo-init`'s first-clone flow, once the user confirms
  there's a Figma file to align to.
- Also run directly any time a Figma reference is introduced later in a
  project that skipped this at setup, or to re-sync `styles/globals.css`
  after `design.md`'s tokens are hand-edited.

## Steps

1. **Collect inputs**
   - Figma file URL (required).
   - 1–2 representative screens/frames within it — ask for specific
     node-level URLs, not the whole file. A screen with buttons/forms is
     usually enough. These matter even when variables exist, since
     component-level rules (radius, shadow weight, spacing rhythm) aren't
     fully captured by variables alone.
   - Don't try to read the entire file — that's what makes this messy and
     unreliable. Scope to the file's variables/styles plus the specific
     screens given.

2. **Extract the token source, in this order** (use whichever Figma MCP
   tools are available in this environment for design-system extraction,
   variable definitions, library variables, and screenshots):
   - **Local variables**: check whether the file has Variables defined. If
     yes, pull them directly — this is the token source.
   - **Connected library**: if the file has no local variables, check
     whether a team library is connected. If the library has variables,
     **ask the user**: use the library's variables, or the file's local
     ad-hoc styles (colors/type applied directly, not through variables)?
     Don't assume — a designer may have intentionally diverged from the
     library for this project.
   - **Best guess**: if neither local variables nor a library exist, read
     values directly off the 1–2 provided screens (colors, spacing, radius,
     type) via screenshot/design-context inspection. Flag in `design.md`
     that these are inferred, not sourced from variables, so a future pass
     can tighten them once the Figma file has real tokens.

3. **Read component-level conventions from the screens** — shape/radius per
   component type (e.g. buttons fully rounded vs. sharp corners, card
   border vs. shadow), independent of whether the value maps cleanly to a
   token. This becomes `design.md`'s Component Rules section — the thing
   that guides component creation before any components exist yet in a
   blank repo.

4. **Generate `design.md` at the repo root.** Keep it basic — tokens and
   component rules only, no philosophy or competitive-analysis work (that
   belongs in the project KB's Layer 2, not in this repo). Structure:
   - A one-line note at the top: source of these tokens (local variables /
     library variables / best-guess from screens) and the Figma file URL,
     so a future re-run knows what changed.
   - YAML frontmatter whose keys mirror the exact CSS variable names
     already used in `styles/globals.css` (e.g. `color-blue-500`,
     `primary`, `radius-md`, `space-4`, `font-size-base`) — matching names
     is what makes step 5 mechanical instead of a reinterpretation.
   - A **Component Rules** section: a short table per component type
     (button, input, card, etc.) noting shape/radius and any deviation from
     the global default.

5. **Sync into `styles/globals.css`.** Replace only a clearly delimited
   generated block:
   ```css
   /* design-tokens: start (generated from design.md — do not hand-edit,
      see design-tokens-init skill) */
   ...
   /* design-tokens: end */
   ```
   Never touch anything outside those markers — the shadcn structural CSS,
   dark-mode logic, and any hand-written classes (e.g. `.loop-*`) stay
   untouched. If the markers don't exist yet (first run), add the block
   right after the existing `@theme` block, matching the file's existing
   raw-scale → semantic-alias structure.

6. **State the sync contract to the user explicitly**: `design.md` is the
   source of truth — any future token change should go through this skill
   again (re-run it in sync mode) rather than hand-editing
   `styles/globals.css` directly, or the two will drift. `pre-pr-review`
   flags a diff where one changed without the other as a safety net, but
   that's a reminder, not enforcement.

## Skip

- Full philosophy/competitive-analysis work — that belongs in the project
  KB's Layer 2, not in this repo.
- Pixel-perfect extraction of every shadow/blur value from the Figma file if
  it doesn't cleanly map to a token — same principle as `from-figma`: flag
  the mismatch, prefer extending the token system over a one-off value.
