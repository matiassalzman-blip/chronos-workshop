---
name: kb-handoff
description: Draft a plain-text handoff brief for the linked Knowledge Base — captures what was built and why in this prototype, ready to paste as the first message of a Claude Code session in the KB repo. Use when the user says "documentá esto en la KB", "quiero pasar esto a la KB", "reflect this in the knowledge base", or when `pre-pr-review` surfaces it based on the personal proactivity preference.
---

This skill hands off **intent**, not documents. It does not open the KB, does not
write into it, does not choose a layer or a file path. The KB's own `CLAUDE.md` and
companion decide all of that when the brief arrives — it has more state on that repo
than this session does. The brief is context for the KB's agent to work from, not a
draft of the resulting doc.

## When this skill runs

The `kb_handoff_proactivity` value in `.claude/kb-link.local.json` (set once during
`repo-init`) controls when this skill is volunteered:

- `manual` — never volunteered. Only runs when the user asks directly
  ("documentá esto en la KB", `/kb-handoff`, or an equivalent phrase).
- `passive` (default) — `pre-pr-review` adds one reminder line to its output if the
  branch touches feature-level work. The user decides whether to run this skill;
  it doesn't run automatically.
- `proactive` — suggested the moment a coherent unit of work looks done (feature
  merged, flow closed), without waiting for `pre-pr-review`. Still a suggestion,
  not an auto-run — the user has to say go before the brief is composed.

If the file is missing or the field is unset, treat it as `passive`.

## Steps

1. **Read the link config**:
   - `.claude/kb-link.json` → `kb_repo_url`. If missing, tell the user to run
     `repo-init` first; there's nothing linked to hand off to.
   - `.claude/kb-link.local.json` → `kb_local_path`. If missing, resolve it the same
     way `repo-init`'s step 6 does (sibling check, then ask) — and offer to save it
     so the next handoff doesn't ask again.

2. **Gather the intent**. Use whatever's already in front of you first, ask only for
   what's missing. Sources, in order of preference:
   - Current conversation (what has this session been doing?).
   - `git log origin/main..HEAD --oneline` and `git diff origin/main...HEAD --stat`
     for the current branch — cheap and often enough.
   - Direct user answers.

   The brief needs, at minimum:
   - **What** was built or changed (feature, flow, screen — one or two lines).
   - **Why** it was built that way — the decisions and tradeoffs a reviewer wouldn't
     recover from the code alone (states considered/discarded, alternatives tried,
     accessibility considerations).
   - **Relevant paths** in this repo — file paths, routes.
   - **Reference link** if any — Vercel preview, PR URL.

3. **Capture screenshots when the change touches UI.** Design work is where this
   skill helps most, and screenshots carry state the code diff can't.

   Trigger the capture step whenever the branch modifies files under `app/**/page.tsx`,
   `app/**/layout.tsx`, or `components/**`. If the change is pure config/docs/hooks
   with no rendered surface, skip this step.

   Steps:
   - Identify the routes that changed. Map modified `app/**/page.tsx` paths back to
     their URL (`app/entries/page.tsx` → `/entries`, `app/page.tsx` → `/`). If a
     component change affects multiple routes, ask the user which route(s) to
     capture rather than guessing.
   - Check if a dev server is already running (`lsof -i :3000` or `curl -sf
     http://localhost:3000 >/dev/null`). If not, start one in the background (`npm
     run dev`) and wait for it to be reachable before capturing.
   - Use Playwright headless Chromium (already installed in this repo) to capture a
     full-page PNG per route at desktop viewport (1440×900). One shot per route is
     enough for a handoff; don't fan out into every state unless the user asks.
   - Save to `.context/kb-handoff/<YYYY-MM-DD-HHMM>/<route-slug>.png`. The
     `.context/` directory is gitignored, so these stay local.
   - If you started the dev server yourself, tear it down after capturing.

   Include the absolute paths in the brief so the user can drag the files into the
   next KB session's message. Do **not** copy screenshots into the KB repo from
   this session — the KB session decides where assets live.

4. **Layer signal and layer-crossing check.**

   Layer heuristic — a light hint, not a classification:
   - If the summary reads mostly as "why does this exist / who is it for / what
     problem" → likely Layer 1 (Product), owned by PM. The KB companion may pause
     for a Layer 1 final before writing Layer 2.
   - If it reads mostly as "how it looks / behaves / what states / what
     interactions" → likely Layer 2 (Design), your lane.
   - If mixed, note it. Don't reclassify — add one line to the brief so nobody's
     surprised on the KB side.

   Layer-crossing check — before composing, skim `<kb_local_path>/layers/1-product/**/*.md`
   for the feature name(s) touched in this change. If a Product-layer file already
   describes something this design work modifies (e.g. changes the accepted behavior,
   adds/removes a state that was spec'd, alters a rule), add a flag line to the brief:

   > This change may diverge from the Product-layer spec at `<path>`.
   > Confirm with the user whether the Product file should also be updated
   > before writing anything at Layer 2.

   The skill does not decide whether the Product file gets updated. That's a KB-side
   call — the KB companion asks the user and handles it.

5. **Compose the brief in English.** The receiving KB session is a fresh context;
   English is the safe lingua franca even when this session was bilingual. Plain
   text, no YAML frontmatter, no layer path guesses.

   Template:
   ```
   Context: <prototype-repo-name> — high-fidelity UI prototype, no backend.
   What was built: <one-liner>

   Detail:
   - <2–4 bullets covering states, decisions, tradeoffs, discarded options>

   Relevant paths: <files, routes>
   Reference link: <preview or PR URL, or "n/a">
   Screenshots: <absolute paths from step 3, or "n/a">

   Layer signal: <"looks like Layer 2" | "looks like Layer 1" | "mixed — see detail">
   <optional layer-crossing flag line from step 4>

   Please reflect this in the KB following your own layer, sequencing, and
   frontmatter rules. If a Layer 1 final needs to be settled before Layer 2 can
   close, flag it before writing.

   This is a working handoff, not a final artifact. Do not promote anything to
   `final/` without client review and approval — keep new content in `draft/`
   until that's confirmed.
   ```

   `<prototype-repo-name>` comes from `basename "$(pwd)"` or the repo remote.

6. **Deliver.** Show the composed brief to the user and tell them, in one line:
   "Open a Claude Code session in `<kb_local_path>` and paste this as the first
   message. Attach the screenshot files listed at the bottom." Don't try to open
   a session there yourself — the copy-paste flow is the supported one, and Claude
   Code sessions are per working directory. If the harness this session is running
   under does support opening a subsession elsewhere, offer it as an option, don't
   assume.

Skip: choosing a layer, a file path, or a filename for the KB side. Skip: any write
into the KB repo from this session — reading `layers/**/*.md` from the KB is fine
(context, used for the layer-crossing check), but writing is the KB session's job.
Skip: copying screenshots into the KB repo — the KB session decides where assets
live.
