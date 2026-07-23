---
# Source: DB Design System (connected team library, dTRqtu1RXdIXMjoB29lOlv — cover/icons
# only, no rendered screens) resolved against a live product screen that uses the library:
# https://www.figma.com/design/HfuZfYxTfhQ8qjlhCcRTz1/DB90-Product-Design?node-id=406-70878
# ("Events" table). Dark-only theme, confirmed 2026-07-23.
#
# Values marked (confirmed) were read directly off resolved variable bindings on real
# component instances. Values marked (unconfirmed) are named in the library but weren't
# bound anywhere on the one screen inspected — kept from template defaults as a starting
# point, not sourced from Figma. Re-run design-tokens-init against a screen that uses them
# (larger cards, headings) to tighten these.

color-black: "#000000"           # (confirmed) Background/background, Background/primary
color-white: "#ffffff"           # (confirmed) Foreground/primary
color-surface-secondary: "#1c1c1c" # (confirmed) Background/secondary
color-foreground-secondary: "#a5a5a5" # (confirmed)
color-foreground-muted: "#767676"     # (confirmed)
color-button-foreground: "#d7d7d7"    # (confirmed) Buttons/Secondary,Tertiary,Ghost foreground-default
color-accent: "#53b1fd"          # (confirmed) Foreground/accent
color-success: "#3ccb7f"         # (confirmed) Foreground/success
color-warning: "#fac515"         # (confirmed) Foreground/warning
color-destructive: "#f63d68"     # (confirmed) Foreground/destructive

# Alpha overlays — white/black over the near-black background, used for borders,
# badge fills, subtle button fills. Suffix is the opacity percent.
color-white-4: "rgba(255,255,255,0.04)"   # (confirmed) Alpha Light/4, Badge/background
color-white-8: "rgba(255,255,255,0.08)"   # (confirmed) Alpha Light/8, Border/subtle, Badge/border, Buttons/Secondary background-default
color-white-12: "rgba(255,255,255,0.12)"  # (confirmed) Border/default, Buttons/Secondary & Tertiary border-default
color-white-24: "rgba(255,255,255,0.24)"  # (confirmed) Border/strong
color-black-2: "rgba(0,0,0,0.02)"         # (confirmed) Buttons/Ghost & Tertiary background-default
color-black-4: "rgba(0,0,0,0.04)"         # (confirmed) Alpha Dark/4 (Search input fill)

font-family-sans: "Geist"        # (confirmed) font/family/body, /label, /title, /button
font-family-mono: "Geist Mono"   # (confirmed) font/family/mono
font-weight-regular: 400         # (confirmed)
font-weight-medium: 500          # (confirmed)

font-size-2xs: "0.625rem"  # 10px (confirmed) Label/Xs, Body/Strong/xSmall
font-size-xs: "0.75rem"    # 12px (confirmed) Label/Sm, Button/Sm, Mono/Sm, Body/Sm
font-size-base: "1rem"     # 16px (confirmed) Display/Sm
font-size-lg: "1.125rem"   # (unconfirmed — template default, no heading sample seen)
font-size-xl: "1.25rem"    # (unconfirmed — template default)
font-size-2xl: "1.5rem"    # (unconfirmed — template default)
font-size-3xl: "1.875rem"  # (unconfirmed — template default)

# Spacing scale is self-describing in Figma (spacing-N = N px), so every named step
# is high-confidence even where a given step wasn't directly observed on this screen.
space-0: "0px"
space-2: "0.125rem"   # 2px
space-4: "0.25rem"    # 4px  (confirmed, used in Shortcut chip)
space-6: "0.375rem"   # 6px  (confirmed, badge padding)
space-8: "0.5rem"     # 8px  (confirmed, search input padding)
space-12: "0.75rem"   # 12px (confirmed, table cell padding, button gap)
space-16: "1rem"      # 16px (confirmed, container padding)
space-20: "1.25rem"
space-24: "1.5rem"
space-32: "2rem"      # (confirmed)
space-40: "2.5rem"
space-56: "3.5rem"
space-64: "4rem"
space-72: "4.5rem"
space-96: "6rem"

radius-xs: "0.25rem"   # 4px (confirmed) — Shortcut chip
radius-sm: "0.375rem"  # 6px (confirmed) — buttons, search input, badges/tags
radius-md: "0.5rem"    # (unconfirmed — template default, kept as next step up)
radius-lg: "0.75rem"   # (unconfirmed — template default)
radius-xl: "1rem"      # (unconfirmed — template default)
radius-full: "9999px"  # (confirmed) $border-radius-full
---

## Notes on this token set

- **Dark-only.** This prototype targets the dark theme exclusively — confirmed with
  the user 2026-07-23. `app/layout.tsx` forces the `dark` class on `<html>` and the
  light/dark localStorage toggle script was removed; there is no light-mode fallback
  to maintain.
- **Font**: the reference uses **Geist** (sans) and **Geist Mono**. Installing the
  actual `geist` package (next/font compatible) is a follow-up — this pass only wires
  the CSS variable names and font-family fallback stack (`Geist, ui-sans-serif, ...`).
  Swap in the real font whenever component work first needs accurate type rendering.
- **Radius**: small and consistent (4–6px) across buttons, inputs, and status badges —
  nothing in this system uses the template's old 12–16px card radius. Badges look
  pill-shaped at a glance but are actually `radius-sm` (6px) on a ~20px-tall element,
  not `radius-full`.
- **Colors beyond what's here**: the connected library (`DB Design System`) also
  defines a full `Gray/25…900` primitive ramp and additional semantic groups (e.g.
  per-variant button state colors for hover/pressed/disabled) that weren't bound on
  the one screen inspected, so their resolved hex values aren't captured here. Re-run
  this skill against additional screens (forms, cards, hover states) to fill these in
  as they come up.

## Component Rules

| Component | Radius | Notes |
|---|---|---|
| Button | `radius-sm` (6px) | Variants: Primary, Secondary, Tertiary, Ghost, Destructive filled, Accent brand. Sizes include Small (~28px height) and Medium. Icon-only and label+icon layouts both exist (`Icon Button` boolean prop). |
| Search / text input | `radius-sm` (6px) | 28px height, `1px` border (`Border/default`), fill is a barely-visible `black-4` overlay on the black background, not a distinct card color. |
| Badge / status tag | `radius-sm` (6px) | Small padding (`space-6` x / `space-2` y), `white-4` background, `white-8` border, label in **Mono** font, foreground color varies by status (success/warning/destructive/neutral `Foreground/secondary`). |
| Table row / cell | none | 36px row height, `space-12` horizontal padding, bottom-only `1px` divider in `white-8`, no vertical dividers. |
| Card | `radius-sm`–`radius-lg` (unconfirmed exact value — no card instance inspected yet) | Existing "Auth Card" / "Sign Up Card" components in the library reference `radius-lg` and `space-16` padding on a `Surface/secondary` fill per their Figma descriptions, but weren't inspected directly — treat as provisional until a card screen is reviewed. |
| Nav rail (collapsed) | — | 56px fixed width, icon-only. |
