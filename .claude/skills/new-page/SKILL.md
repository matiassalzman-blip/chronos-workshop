---
name: new-page
description: Scaffold a new route/page in this prototype following the existing app/ + shadcn/ui conventions.
---

Use this when the user asks to add a new page, screen, or route to the
prototype (e.g. "add a settings page", "create a /projects/[id] route").

## Steps

1. Check `routes/appRoutes.ts` — add a helper for the new path there rather
   than hardcoding the string at call sites, following the existing pattern
   (e.g. `rootPath: () => "/"`).
2. Create the route under `app/`, following existing conventions in this
   repo:
   - A folder per segment, `page.tsx` as the entry.
   - Reuse the existing shell — pages render inside `app/layout.tsx`'s
     `<Header>`/`<Sidebar>`/`<main>` structure automatically; don't
     re-wrap the page in another layout unless the page genuinely needs a
     different shell (e.g. a full-bleed screen).
   - Use `components/shared/Link` for internal navigation, not a raw
     `next/link`, to stay consistent with the rest of the app.
3. Build the page content with the installed shadcn/ui components in
   `components/ui/` first (`Card`, `Table`, `Tabs`, `Dialog`, etc.) before
   creating a new one-off component. Use the existing brand tokens
   (`bg-primary`, `text-muted-foreground`, the `.loop-*` utility classes in
   `styles/globals.css`) rather than arbitrary colors.
4. If the page needs data, hardcode realistic-looking mock data directly in
   the component or a co-located fixture — there is no backend in this
   phase (see `CLAUDE.md`). Don't build a data-fetching layer.
5. If the route needs a distinct `<title>`, export a `metadata` object from
   the page (see `app/layout.tsx` for the pattern) rather than reintroducing
   any dynamic/translated title logic — this template has no i18n.

Skip: adding tests unless the user explicitly asks for one — testing isn't
enforced in this template (see `CLAUDE.md`).
