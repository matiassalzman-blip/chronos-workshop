# Migration: seed → prototype starter

This repo started as Dualboot's internal `dbp-nextjs-v16-seed` — a production-app
starter for engineering teams. This document summarizes how and why it was
adapted into a template for designers to build high-fidelity, throwaway-toward-production
prototypes directly in code (mostly via Claude Code), separate from the
designer-facing usage docs in `README.md`.

## Why

The seed's tooling (enforced test coverage, build-gated git hooks, full i18n
routing, strict branch-naming) optimizes for long-lived, backend-connected,
multi-engineer codebases. That's the opposite of what a fast-iterating,
backend-free UI prototype needs. The goal of this fork is a template whose
actual "product" is its rules and conventions (`CLAUDE.md`, `.claude/skills/`),
not a fixed visual kit — every client project is expected to reskin the
tokens/components/shell heavily.

## Removed

- **i18n stack** (`i18next`, `react-i18next`, `i18next-resources-to-backend`,
  `next-i18n-router`, `i18nConfig.ts`, `proxy.ts`, `utils/i18n.ts`,
  `components/TranslationsProvider`, `components/LanguageChanger`, `locales/`,
  `docs/i18n-configuration.md`) — most prototypes are single-language demos;
  the `app/[locale]/` routes were collapsed into flat `app/` routes with
  hardcoded English copy.
- **Storybook** (`.storybook/`, the `storybook`/`build-storybook`/`postbuild`
  scripts, the `app/design-system` redirect page, `eslint-plugin-storybook`) —
  pure build overhead once shadcn/ui (extensively documented upstream) is the
  component base, and there's no client-facing repo hand-off to justify a
  published component catalog.
- **Enforced quality gates** — the pre-commit branch-name regex, the
  `pnpm test`/`pnpm build` pre-push gate, `pnpm test` in lint-staged, and the
  Jest `coverageThreshold` block. Prettier + ESLint still run on commit;
  everything else was pure friction for a team optimizing for iteration speed.
- **The hand-built component kit** (`components/shared/Button`, `Divider`,
  `Loading`) — superseded by shadcn/ui.

## Added

- **shadcn/ui** as the component base (`components/ui/*`, `components.json`,
  `lib/utils.ts`), with its semantic tokens (`--primary`, `--background`,
  etc.) aliased onto the seed's existing brand palette in
  `styles/globals.css` instead of shadcn's default oklch scale — so every
  shadcn component renders in brand colors in both light and dark mode with
  no per-component overrides. The CLI's own token scaffolding collided with
  the existing `--radius-*` scale and introduced a disconnected color system;
  see the reconciled `:root`/`.dark` blocks in `styles/globals.css`.
- **`CLAUDE.md`** — states the prototype-not-production framing, the
  hardcode-mock-data convention, and "reuse tokens/components before
  inventing new ones," committed and visible (not gitignored the way this
  org's Cursor rules are) since the client never receives this repo — only
  the dev team does, and they benefit from the same context.
- **`.claude/skills/new-page` and `.claude/skills/from-figma`** — project
  skills encoding this template's routing and Figma-to-code conventions.
- **Vercel preview-deploy flow**, documented in the README, as the standard
  way a client sees progress (open link, no password protection by default).

## Net result

A flat, i18n-free Next.js App Router structure; a shadcn/ui component base
restyled to the existing brand tokens; fast, low-friction git hooks; no
Storybook; and a committed set of rules/skills that travel with every fork
of this template.
