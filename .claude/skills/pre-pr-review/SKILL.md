---
name: pre-pr-review
description: Self-review checklist to run on the current branch before opening a PR — component reuse, hardcoded values, missing states, visual attachment, and (per personal preference) a KB-handoff reminder. Use when the user is about to push, open a PR, or asks for a review of the current branch. Not a gate; a reminder.
---

## What to inspect

Run `git diff origin/main...HEAD --stat` and `git diff origin/main...HEAD --name-only`
first to know exactly what this branch changed. Everything below is scoped to those
files — don't audit the whole repo.

## Checklist

1. **Component reuse** — see `.claude/rules/component-reuse.md`. For any new
   component file under `components/` in the diff:
   - List what's already in `components/ui/` and `components/shared/`.
   - Flag any new component whose primitive purpose matches an existing one
     (button, card, dialog, input, etc.). Suggest extending the existing one
     with a prop or variant instead.

2. **Hardcoded values** — grep the changed files for common leak patterns:
   - Inline hex colors (`#[0-9a-fA-F]{3,8}`) — should be a token in
     `styles/globals.css` and a Tailwind class like `bg-primary` /
     `text-muted-foreground`.
   - Arbitrary Tailwind values (`\[.*px\]`, `\[#.*\]`) — same story.
   - Repeated string literals that look like copy — fine to hardcode (no i18n),
     but if the same string appears 3+ times, suggest a local constant.
   - If `design.md` exists: whether it changed without `styles/globals.css`
     changing, or vice versa, in this diff — the two are meant to move together
     (see `design-tokens-init`), and one moving alone usually means someone
     hand-edited instead of re-running the skill.

3. **States** — for any new UI in the diff, check whether the flow needs loading,
   empty, error, or disabled states and whether they're present. Missing states are
   the most common gap in AI-generated screens.

4. **Naming** — branch name and any new files/components follow
   `.claude/rules/git-workflow.md`. Commit-message format is already enforced by
   commitlint at commit time, no need to re-check here.

5. **Visual** — remind the user that the PR needs a screenshot or short video
   attached. There's no automated way to enforce this — it's a habit reminder.

6. **KB handoff** — read `.claude/kb-link.local.json` for `kb_handoff_proactivity`.
   If the file doesn't exist, treat it as `passive` (the default). Then:
   - `manual` → skip this item silently.
   - `passive` → one line: "¿Esto amerita reflejarse en la KB? Si sí, corré
     `kb-handoff`."
   - `proactive` → if the diff looks like a finished feature/flow (a new route,
     multiple related components, or multiple commits scoped to one area), suggest
     `kb-handoff` directly. For small isolated changes (single-component fix, style
     tweak), fall back to passive-level phrasing — don't nag on every tiny PR.
   - If `.claude/kb-link.json` doesn't exist at all, skip this item silently — no
     KB linked yet, and this skill isn't the right place to nudge them to run
     `repo-init`.

## Output shape

A short bulleted list of findings, grouped by checklist item, with concrete file
paths and line numbers where relevant. If a checklist item has no findings, omit it
— don't pad with "no issues found" for every item. This is a reminder, not a
compliance form.
