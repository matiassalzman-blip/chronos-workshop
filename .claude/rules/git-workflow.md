# Git workflow for this prototype

This is a single-environment, throwaway prototype — one Vercel preview link, no
staging/production split. That's a deliberate simplification from Dualboot's standard
3-branch (`main`/`staging`/`develop`) model used on production repos: there's no
environment for `staging`/`develop` to represent here.

## Branches

- `main` is the only permanent branch. Every merge to `main` redeploys the Vercel
  preview.
- Work happens on branches off `main`, named `<type>/<short-description>`:
  - `design/` — screens, flows, components
  - `feat/` — new functionality
  - `fix/` — corrections
  - `docs/` — documentation
  - `refactor/` — reorganization, no behavior change
- Lowercase, hyphen-separated, no generic names (`design/cambios`, `fix/varios`).

## Commits

Format is enforced by `commitlint` + husky at commit time — a bad message fails
before the commit lands, not at review. The rules live in `commitlint.config.mjs`.

- `<type>: <description in imperative present>` — e.g. `feat: add onboarding step 2`,
  not `feat: added onboarding step 2`.
- Allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`,
  `revert`, `style`, `test`. To add more (e.g. `design`, `wip`), edit
  `commitlint.config.mjs` — don't try to bypass with `--no-verify`.
- One commit = one conceptual change.
- To save unfinished work without committing, `git stash` — don't force a `wip:`
  message; that type isn't in the allowlist.

Branch prefixes (`design/`, `docs/`, etc.) don't have to match commit types —
they're not linted. Just don't invent new ones for no reason.

## Pull requests

- Open a PR when the work is ready to be reviewed and merged to `main` — not before.
  To show early progress, share the branch or a quick demo instead.
- Every PR needs: what changed, why (notable decisions), and a screenshot or short
  video — there's no other way for a reviewer to evaluate design work here.
- Rebase onto `main` before opening the PR.
- Run the `pre-pr-review` skill before pushing — it's the self-review checklist,
  not a gate.

## Conflicts

A normal part of parallel work, not an error. If unsure which version to keep, don't
guess — check with whoever owns the other side of the conflict.
