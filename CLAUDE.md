# This is a prototype, not a production app

This repo is a starting point for a high-fidelity UI prototype for a client
project. It is built and iterated on primarily by designers driving Claude
Code, usually with occasional refinement in Figma. The deliverable at the end
of this phase is a deployed preview link the client can click through, and
this repo handed to a development team who will extend it toward production.
Keep that audience and goal in mind for every change.

## What this means in practice

- **Optimize for visual and interaction fidelity, not backend correctness.**
  There is no real backend. Do not add a database, auth, real API
  integrations, or a data-access abstraction layer "for later" — hardcode
  realistic-looking data directly in components or local fixtures. If a flow
  needs to feel persistent across a session, use local component state or
  `localStorage`, not a real backend.
- **Reach for what's already installed before adding something new.** This
  template ships shadcn/ui (`components/ui/*`) restyled with this project's
  Tailwind tokens. Check there first before hand-rolling a new
  button/input/dialog/etc.
- **Tokens over one-off styles.** Colors, spacing, radius, and the shadcn
  semantic tokens (`--primary`, `--background`, etc.) are defined in
  `styles/globals.css`. When a client's brand differs from the current
  palette, change the values there — don't sprinkle inline hex codes or
  arbitrary Tailwind values through components.
- **Keep it clean enough to extend, not "enterprise."** The dev team will
  build on top of this exact codebase. Use meaningful names and typed props
  so they can follow what a component does — but don't add abstractions,
  config layers, or defensive error handling for problems that can't happen
  in a prototype with no real backend. Three similar lines beat a premature
  abstraction.
- **No enforced tests or coverage.** Jest/Testing Library are available if
  you want to sanity-check something tricky, but nothing here is gated on
  tests passing or coverage thresholds. Don't spend time writing tests for
  their own sake.
- **Ship it visible.** This template intentionally does not hide its own
  rules/skills from whoever receives the repo — unlike this org's Cursor
  rules convention, there's no reason to gitignore this file or `.claude/`
  here, since the client never receives the repo (only a deployed link does).

## Team rules

Committed here (not left in a wiki) for the same reason the rest of this file is:
the dev team inherits this exact context at hand-off. Add new team rules as their
own file under `.claude/rules/` and import them below, rather than growing this
file directly — keeps each rule's own history visible in `git log`.

@.claude/rules/component-reuse.md
@.claude/rules/git-workflow.md

## Knowledge Base

This prototype can be linked to a project Knowledge Base (KB) — a separate repo
documenting product/design decisions in more depth than this codebase does on its
own. If `.claude/kb-link.json` doesn't exist yet, run the `repo-init` skill. To
reflect recent work here into the KB, run the `kb-handoff` skill — it hands off
intent only; the KB's own rules decide how it gets documented.

## Structure worth knowing

- `app/` — flat Next.js App Router routes (no i18n/locale segment).
- `components/ui/` — shadcn/ui primitives, restyled via `styles/globals.css`.
- `components/shared/` — small project-specific wrappers (currently just
  `Link`).
- `components/Header`, `components/Sidebar` — the default app shell; treat
  it as a starting example, not a fixed layout every project must keep.
- `styles/globals.css` — the single source of truth for brand tokens
  (`--color-*`) and the shadcn semantic aliases built on top of them.

## Deploying

See the README for the Vercel preview-deploy flow — that's how the client
sees progress. There is no password-protection convention by default; add
one per-client if a specific engagement needs it.
