---
name: repo-init
description: First-time setup for a new prototype repo — links it to a project Knowledge Base (KB), either connecting to an existing KB repo or creating a new one from the db90 template, checks the repo is connected to Vercel for automatic deploys, and checks whether there's an existing Figma reference the project should visually align to. Records personal preferences too. Use when starting fresh work on this prototype, when `.claude/kb-link.json` is missing, when there's no Vercel project connected yet, or when the user says things like "no tengo la KB linkeada", "vincular la KB", "connect the KB", "set up the knowledge base for this project", "conectar Vercel", "set up deploys".
---

Two-part setup: **project-level** (linking or creating the KB — done once per
prototype, committed) and **personal** (path + preferences — done once per
collaborator per machine, gitignored). A collaborator joining a prototype whose KB is
already linked only needs the personal part.

Prereqs to have on hand: `gh` CLI installed and authenticated if creating a new KB;
otherwise plain `git` is enough. If `gh` is missing, tell the user and stop — don't
try to create the repo via the web API from here.

## Steps

1. **Detect current state** at the prototype repo root:
   - Prototype repo name: `basename "$(pwd)"` (or from `git config --get
     remote.origin.url` if present) — used to suggest the KB name.
   - Project-level link: does `.claude/kb-link.json` exist?
   - Personal setup: does `.claude/kb-link.local.json` exist?

2. **Route based on state**:
   - Project-level link missing → step 3 (project setup), then step 6 (personal).
   - Project-level link present, personal missing → skip to step 6 (personal only).
   - Both present → this skill has nothing to do; confirm to the user and stop.

3. **Project setup — existing or new KB?** Ask the user:
   - "Already exists" → step 4.
   - "Need to create it" → step 5.

4. **Link an existing KB**
   - Ask for the KB repo's git URL (SSH form recommended: `git@github.com:...`).
   - Write `.claude/kb-link.json` at the prototype root:
     ```json
     { "kb_repo_url": "<url>" }
     ```
   - Stage and commit it on the current branch:
     ```bash
     git add .claude/kb-link.json
     git commit -m "chore: link project knowledge base"
     ```
     Don't push automatically — leave that to the user's normal PR flow.
   - Continue to step 6.

5. **Create a new KB** — this is a real externally-visible action; get explicit
   confirmation before running any `gh` command. Collect and echo back for
   confirmation:
   - **Name**: default `<prototype-repo-name>-kb`, editable.
   - **Destination**: GitHub org or personal account.
   - **Visibility**: default **private**. A KB can hold Layer 0/1 content (business
     context, competitive landscape, stakeholders) that isn't safe to publish. Only
     go public if the user explicitly asks.
   - **Local clone folder**: default `../<name>` (sibling to this prototype),
     editable.

   Wait for the user to say "sí, dale" (or the English equivalent). Then:
   ```bash
   git clone https://github.com/rafael-torre/db90-knowledge-base.git <local-folder>
   cd <local-folder>
   git remote remove origin
   gh repo create <org>/<name> --<private|public> --source=. --remote=origin --push
   ```
   Full history is intentional (no `--depth 1`) — sharing lineage with the template
   makes it easier to pull in template improvements later via `git merge` from an
   upstream remote. Don't try `gh repo create --template`: as of writing,
   `rafael-torre/db90-knowledge-base` isn't flagged as a template repo on GitHub, so
   that flow doesn't apply.

   Then, inside the new KB (still `cd`'d in), pre-fill the creator's personal
   companion config — it's gitignored by the KB's own conventions, so this is a
   local write only, not something to commit:
   - Ask the creator's name.
   - Write `.companion.yaml` in the new KB's root:
     ```yaml
     name: "<name>"
     role: designer
     ```
   - Note to the user: any other collaborator cloning this KB later will need to
     create their own `.companion.yaml` — it doesn't propagate.

   Back in the prototype repo, write and commit `.claude/kb-link.json` with the new
   KB's SSH URL (same as step 4). Continue to step 6.

6. **Personal setup** — writes `.claude/kb-link.local.json`. This file is personal:
   path and preferences vary per collaborator. It must be gitignored.
   - **Resolve the local KB clone path**:
     - If we just created the KB in step 5, use that folder — no need to search.
     - Otherwise, check `../<kb-repo-name-from-url>` first. If it's there, use it.
     - If it isn't, ask: "¿Dónde tenés clonada la KB, o querés que la clonemos como
       hermana de este repo?" If cloning fresh, `git clone <kb_repo_url>
       ../<kb-repo-name>`.
   - **Ask for KB-handoff proactivity** — see `kb-handoff` for what each level does:
     - `manual` — never suggested; run it only when the user asks.
     - `passive` (default) — one line in `pre-pr-review` reminding the user.
     - `proactive` — suggested as soon as documentable work looks finished, without
       waiting for the pre-PR checklist.
   - Write `.claude/kb-link.local.json`:
     ```json
     { "kb_local_path": "<absolute-or-relative-path>", "kb_handoff_proactivity": "passive" }
     ```
   - **Confirm `.claude/kb-link.local.json` is in `.gitignore`.** If not, add it and
     commit that change separately. This is a real safety step — if this file leaks
     into a commit, per-person paths and preferences end up in the shared repo.

Skip: re-running the creation/linking flow (steps 3–5) for collaborators joining a
project that's already linked — that's what step 2's routing is for.

## Part two: Vercel deploys on merge

Every prototype needs a stable "latest" preview link the client can revisit — that
comes from Vercel auto-deploying `main` on every merge, not from someone remembering
to run `vercel deploy` by hand. This is project-level (tied to the GitHub repo, not
per collaborator), so there's no personal file for it.

7. **Detect current state**: does `.vercel/project.json` exist? (`vercel link`
   creates it; Next.js's default `.gitignore` already excludes `.vercel/`, so its
   absence in git tells you nothing — check the actual file on disk.)
   - Present → a Vercel project is already linked on this machine. Confirm to the
     user and stop. (Note: this only proves *this machine* ran `vercel link`; it
     doesn't prove the GitHub repo itself is connected for auto-deploy on merge —
     if the user isn't sure, walk them through step 8's dashboard check anyway.)
   - Absent → continue to step 8.

8. **Connect the repo** — this creates a real, externally-visible Vercel project;
   confirm with the user before running these (a `vercel login` prompt will open a
   browser, which is expected):
   ```bash
   vercel login      # only if `vercel whoami` fails
   vercel link       # associates this local repo with a Vercel project
   vercel git connect
   ```
   `vercel git connect` is what wires the GitHub repo to Vercel so it deploys
   automatically — without it, `vercel link` alone only sets up your local CLI,
   and deploys still require manually running `vercel deploy`.

   **If the user isn't sure any of this worked, or is doing it for the first time,
   walk them through confirming it in the dashboard** (this is the part people miss):
   - Open the project at `vercel.com/<team-or-username>/<project-name>`.
   - **Settings → Git**: confirm a GitHub repo is connected, and that
     **Production Branch** is set to `main`. This is what makes a merge to `main`
     become a **Production** deployment (the stable client-facing link) instead of
     just another preview.
   - Any other branch or open PR deploys automatically as a **Preview** — no
     extra setup needed for that part, it's automatic once Git is connected.
   - **Settings → Domains**: the auto-generated `<project-name>.vercel.app` domain
     always points at the latest Production deployment. That's the link to hand
     the client — no custom domain needed unless the engagement specifically calls
     for one.
   - If deploys aren't showing up after a merge, the most common cause is the
     GitHub App losing repo access (e.g. repo transferred to a new owner, like a
     project moving out of a shared template repo into its own) — re-run
     `vercel git connect` after a repo ownership change.

Skip: setting up a custom domain, password protection, or environment variables —
none of those are part of baseline setup. Add them per-client only if the engagement
specifically needs them (see the README's "Deploying" section).

## Part three: Figma design reference

A blank prototype has no visual language of its own yet. If the client already has
an existing Figma file — a design system, or just prior screens — this is where
that gets captured, before any components get built that would otherwise need to
be redone to match it.

9. **Detect current state**: does `design.md` exist at the project root already?
   - Present → a design reference is already set up. Confirm to the user and stop
     (unless they explicitly want to re-sync it against an updated Figma file, in
     which case hand off to `design-tokens-init` directly).
   - Absent → continue to step 10.

10. **Ask**: "¿Hay un archivo de Figma existente al que este proyecto deba
    alinearse visualmente?" ("Is there an existing Figma file this project should
    visually align to?")
    - No → skip; nothing to do here. A visual language will emerge from the work
      itself instead.
    - Yes → hand off to the `design-tokens-init` skill, which collects the Figma
      URL and 1–2 reference screens, generates `design.md`, and syncs its tokens
      into `styles/globals.css`.

Skip: re-running this for collaborators joining a project where `design.md`
already exists — same idempotency principle as parts one and two above.
