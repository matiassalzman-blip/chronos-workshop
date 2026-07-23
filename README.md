# Dualboot Prototype Starter

This is a starting point for building a **high-fidelity, throwaway-toward-production UI prototype** — not a production app. It's meant for designers to build directly in code (typically by driving Claude Code), with occasional refinement in Figma, and to hand off a deployed preview link to the client and this repo to a development team who will extend it toward production.

See `CLAUDE.md` for the working rules this template assumes (no backend, reuse tokens/components, keep it extendable but not over-engineered).

## What this is for

- Focus on **UI and interaction fidelity** — visual polish, real navigation, realistic (but hardcoded/mock) data, working state for forms and flows.
- **Ignore backend concerns.** There's no database, no auth, no real API. Fake data lives directly in components or fixtures.
- **Every fork diverges.** The brand colors, spacing, and components here are a generic starting point — reskin `styles/globals.css` and swap/add shadcn components per client.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/) — brand tokens defined in `styles/globals.css`
- [shadcn/ui](https://ui.shadcn.com/) — component primitives in `components/ui/`, restyled via the Tailwind tokens above
- [Prettier](https://prettier.io/) + [ESLint 9](https://eslint.org/) + [husky](https://www.npmjs.com/package/husky) — fast formatting/lint checks on commit only; no enforced tests or build gate, since this is a fast-iteration prototyping template
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) — available if you want to sanity-check something tricky, not required

## Reskinning for a new client

1. Edit the brand tokens in `styles/globals.css` (`--color-gray-*`, `--color-blue-*`, etc., and the `:root`/`.dark` alias blocks that shadcn components read from).
2. Add any additional shadcn components you need: `pnpm dlx shadcn@latest add <component>`.
3. Swap the app shell (`components/Header`, `components/Sidebar`, `app/layout.tsx`) for whatever the client's product actually needs — it's a starting example, not a fixed layout.

## Adding a page or component

Ask Claude to build it — the `new-page` and `from-figma` project skills in `.claude/skills/` encode the conventions (routing, reusing tokens/components before inventing new ones, pulling directly from a Figma frame when one exists).

## Deploying a preview for the client

This template deploys to [Vercel](https://vercel.com/) with zero config.

**First-time setup for a new prototype repo:** run the `repo-init` skill — it now
also checks whether this repo is connected to a Vercel project and walks through
connecting it if not (`vercel link` + `vercel git connect`, plus confirming
**Production Branch** is set to `main` in the Vercel dashboard).

Once connected, deploys are automatic — no manual step needed for day-to-day work:

- Every merge to `main` becomes a **Production** deployment at the project's
  `<project-name>.vercel.app` domain. That's the one stable link to hand the
  client — it always reflects the latest merged work.
- Every other branch or open PR gets its own **Preview** deployment automatically,
  useful for sharing early progress before something merges.

You can still trigger a one-off preview manually if you want to share work before
opening a PR:

```bash
vercel deploy
```

Preview links are open by default (no password protection) — add protection per-project if a specific client engagement needs it. Promote to production only at hand-off time, if needed.

## Hand-off

- The **client** gets a deployed Vercel link — not this repo.
- The **dev team** gets this repo and continues building on it toward production (wiring up a real backend, auth, etc.).
- `CLAUDE.md` and `.claude/skills/` ship committed in the repo — the dev team inherits the same context this prototype was built under.

## Code quality tools

- Prettier + ESLint run on `git commit` via husky (fast, catches real issues).
- There is intentionally **no enforced test run or build gate** on push — the priority is iteration speed. `pnpm build` still runs cleanly; run it yourself before a hand-off milestone if you want the extra confidence.

## Next.js Documentation

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

---

## Changelog

### [Prototype starter fork] - 2026-07-16

Adapted from Dualboot's `dbp-nextjs-v16-seed` into a designer-driven prototype template. See `CHANGES.md` for the full delta (i18n removed, shadcn/ui adopted, Storybook and enforced test/build gates removed, `CLAUDE.md` + project skills added).

### [Version 16.2.6] - 2026-07-02

**By:** rafael.torre@dualbootpartners.com

#### 🚀 Major Upgrades

- **Upgraded**: `next` from `15.5.x` to `16.2.6` — Turbopack is now the default bundler (removed `--turbopack` flags from scripts)
- **Upgraded**: `react` and `react-dom` to `19.2.4`
- **Upgraded**: `@commitlint/cli`, `@commitlint/config-conventional`, and `commitlint` to `21.0.1`
- **Upgraded**: `conventional-changelog-conventionalcommits` to `9.3.1`
- **Upgraded**: `postcss` to `8.5.15` and `@chromatic-com/storybook` to `5.2.1`
- **Aligned**: project `node` engine to `24.18.0`

#### 🔧 Migrations

- **Migrated**: `middleware.mjs` → `proxy.ts` (Next.js 16 Proxy API, typed with `NextRequest`)
- **Removed**: `next/config` and `publicRuntimeConfig` — replaced with `process.env.NEXT_PUBLIC_*`
- **Updated**: ESLint setup to the native flat config flow compatible with Next.js 16
- **Added**: `pnpm` overrides for `fast-uri` and `postcss` to keep the dependency tree free of known vulnerabilities
- **Updated**: `eslint.config.mjs` to native flat config — imports `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` directly and exports a plain config array (FlatCompat removed)
- **Updated**: Husky hooks simplified — removed shebang and `husky.sh` source lines, deleted `.husky/_/` directory
- **Updated**: All ESLint plugins to latest (`react-hooks` 7.0, `prettier` 5.5.5, `import` 2.32, `eslint-config-prettier` 10)

#### 🔒 Security

- **Fixed**: Reduced audit vulnerabilities from 28 to 2 via direct upgrades and `pnpm.overrides`
- **Patched**: `minimatch`, `flatted`, `lodash`, `bn.js`, `ajv`, `qs`, `diff` via `pnpm.overrides`
- **Accepted**: 2 remaining `elliptic`-chain vulnerabilities (deep Storybook transitive dep — no patched version available upstream)

---

### [Version 15.4.0] - 2025-12-18

**By:** santiago.camelo@dualbootpartners.com

#### 🔒 Security

- **Fixed**: Upgraded `react` and `react-dom` from `19.0.0` to `19.0.3` to patch critical vulnerabilities:
  - CVE-2025-55182 (Critical): Remote Code Execution in React Server Components
  - CVE-2025-55184 (High): Denial of Service vulnerability
  - CVE-2025-67779 (High): Denial of Service vulnerability
  - CVE-2025-55183 (Medium): Source Code Exposure vulnerability
- **Fixed**: Upgraded `next` from `15.5.4` to `15.5.9` to patch CVE-2025-66478 and related vulnerabilities
- **Updated**: Aligned `@next/eslint-plugin-next` and `eslint-config-next` to `15.5.9` for compatibility

#### 🧪 Testing

- **Improved**: Updated Jest coverage thresholds to `80%` across all metrics (`branches`, `functions`, `lines`, `statements`)

### [Version 15.3.0] - 2025-09-25

**By:** santiago.camelo@dualbootpartners.com

#### 🚀 Features

- **Added**: Turbopack support for production builds (`pnpm build --turbopack`)
- **Updated**: Upgraded Next.js to `15.5.4` with enhanced performance and developer experience

#### 🛠️ Improvements

- **Updated**: Storybook packages to latest `next` channel for improved Next.js 15 compatibility
- **Updated**: `@chromatic-com/storybook` to `^5.0.0-next.1`
- **Updated**: `i18next` to `^25.4.1`
