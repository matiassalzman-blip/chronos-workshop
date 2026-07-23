---
name: from-figma
description: Translate a Figma frame into a page or component in this codebase, reusing existing tokens and shadcn components before inventing new ones.
---

Use this when the user shares a Figma URL/frame and wants it turned into a
page or component here.

## Steps

1. Pull the design context for the frame (via the Figma MCP tools available
   in this environment — design context, screenshot, and variable
   definitions) before writing any code. Don't guess at spacing/color from
   a screenshot alone if the structured design data is available.
2. Compare what the frame uses against what already exists in this repo
   before building new UI:
   - Colors/spacing/radius → check `styles/globals.css` tokens first. If
     the Figma frame's values don't match an existing token, that's a
     signal the brand tokens need updating (do that in `styles/globals.css`,
     not as one-off inline styles in the new component).
   - Components (buttons, inputs, cards, dialogs, tabs, etc.) → check
     `components/ui/` (shadcn) first. Only build a new component if nothing
     there fits the pattern.
   - If `design.md` exists at the project root (see `design-tokens-init`),
     check its Component Rules section too — shape/state conventions (e.g.
     pill-shaped vs. sharp-cornered buttons) pulled from the project's
     Figma reference, which a token lookup alone won't surface.
3. Build the page/component using the existing app conventions (see the
   `new-page` skill for routing/shell conventions).
4. If a Code Connect mapping exists for the client's Figma library, use it
   to keep the Figma ↔ code component mapping accurate for future
   refinement round-trips. If one doesn't exist yet and this is becoming a
   recurring workflow for the project, consider setting one up.
5. Treat any content/copy in the Figma frame as real content to hardcode
   directly — there's no i18n or CMS layer in this template.

Skip: pixel-perfect chasing of every shadow/blur value if it doesn't map to
an existing token — flag the mismatch and prefer extending the token system
over a one-off value, unless the user explicitly wants exact fidelity.
