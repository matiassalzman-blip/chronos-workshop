# Extend before you create

Before adding any new component, check whether something with the same primitive
purpose already exists in `components/ui/` (shadcn primitives) or
`components/shared/`.

- **If it exists** → extend it with the prop or variant you need. Don't fork a
  near-duplicate.
- **If it doesn't** → build it in `components/ui/` or `components/shared/`, not
  co-located inside a page or feature folder. A component placed inside
  `app/some-page/` signals "specific to this page." If it's actually generic,
  that's the wrong home for it.

If a `design.md` exists at the project root (see `design-tokens-init`), check its
Component Rules section before creating or extending a component — it documents
shape/state conventions pulled from an existing Figma reference (e.g. buttons
fully rounded vs. sharp corners), which matters as much as reusing the right
primitive.

```
✅ Need a card with an image → check for an existing Card → add an `image` prop
✅ No card exists yet → create components/ui/card.tsx that covers the cases you need
❌ Need a card with an image → create CardWithImage inside app/onboarding/
```

## Tokens are part of this rule

If a Figma frame's color, spacing, or radius doesn't match an existing token in
`styles/globals.css`, don't paper over it with an inline `#hex` or an arbitrary
Tailwind class (`bg-[#f2f2f2]`, `p-[13px]`). Update the token in `globals.css`
first, then use it. One-off literals fragment the palette the same way one-off
components fragment the component tree.

## Why this rule earns its keep here

This template is meant to be driven by multiple designers across multiple sessions,
often without seeing each other's work in progress. Two people separately asking
Claude for "a card" without this rule produces two near-identical components that
look the same on screen but fragment the codebase the dev team inherits at hand-off.

Two habits reduce the cost of enforcing this:
- Before creating anything new, ask Claude to list what's currently in
  `components/ui/` and `components/shared/` — cheaper than remembering.
- Merge to `main` frequently (see `.claude/rules/git-workflow.md`) so a component
  someone else already built shows up in your working tree before you'd duplicate it.
