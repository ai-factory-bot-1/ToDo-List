# DESIGN.md — Synpulse Design System

> **For agents.** This file tells you how to build any Synpulse-branded UI: PoCs, internal tools, client and advisor portals, risk and supervision dashboards, software-factory screens and client-lifecycle flows. Treat it as the source of truth for color, type, spacing, elevation, motion, copy and accessibility. Use the exact values here and never approximate them. If something isn't covered, use the nearest existing token rather than inventing a new value, and mention the gap in your output.
>
> Theme: **Light only** (v1). There is no dark theme yet, so don't make one up.
> Brand scope: Synpulse only. Don't mix in any other client or brand system.

---

## 0. The rules that matter most

1. **Orange (`flag-500` #F47321) means "needs a person." Nothing else, ever.** It is never a primary button, link, decoration, hover state or brand flourish. The only exception is the wordmark.
2. **If orange appears twice on a screen for two different reasons, one of them is wrong.**
3. **Screens are greyscale.** Structure comes from near-black ink, three flat greys and 1px rules. Color appears only where it carries a status.
4. **Primary action = `ink-800`** with white text. It is never orange and never blue.
5. **Text stops at `ink-500`.** `ink-400` and anything lighter is for non-text only.
6. **Every text/background pair must clear WCAG AA (4.5:1).** Large text (24px+) and non-text marks need 3:1.
7. **The AI is never announced.** No sparkles, no "AI-generated" badges, no confidence percentages, no chat surface. Drafts are marked because they need approval, not because of what produced them.
8. **Flat.** No gradients, glassmorphism, photos, illustrations, textures, colored glows or bounces.

---

## 1. Drop-in CSS variables

Paste this as your `:root`. Every rule below refers to these names.

```css
:root {
  /* Neutrals: ink (zinc) */
  --ink-900: #09090b;   /* headlines, figures, focus ring */
  --ink-800: #18181b;   /* primary button fill, active segments */
  --ink-700: #3f3f46;   /* body text */
  --ink-600: #52525b;   /* labels, secondary text */
  --ink-500: #71717a;   /* meta text, lightest text ink (white/canvas only) */
  --ink-400: #a1a1aa;   /* NON-TEXT: icons, comparison marks, chart rules */
  --ink-300: #d4d4d8;   /* NON-TEXT: strong lines, control borders */
  --ink-200: #e4e4e7;   /* NON-TEXT: the 1px line; nav active fill */

  /* Surfaces */
  --surface-sunken: #f4f4f5; /* wells, inactive segments, table header rows */
  --canvas:         #fafafa; /* page background, sidebar, top bar */
  --surface:        #ffffff; /* cards, inputs, popovers, dialogs */
  --scrim: rgba(9, 9, 11, 0.45); /* modal/drawer dim, the ONLY translucency */

  /* flag: needs a person (Synpulse orange) */
  --flag-900: #442009;
  --flag-800: #75380f;  /* strong text on flag-100 */
  --flag-700: #a14c16;  /* orange text on white / flag-100; counts */
  --flag-500: #f47321;  /* THE accent: rails, dots, wordmark */
  --flag-300: #fabc94;  /* non-text: bars/fills in the attention band */
  --flag-100: #fdebe0;  /* badge tint */
  --flag-050: #fff9f5;  /* faint wash: chart band, row needing attention */

  /* stop: conflict / breach / critical */
  --stop-700: #be123c;  /* text; fill with white text */
  --stop-500: #e11d48;  /* marks, lines, dots (non-text or 24px+) */
  --stop-100: #ffe4e6;
  --stop-050: #fff1f2;

  /* draft: generated, not yet approved */
  --draft-700: #6d28d9;
  --draft-500: #7c3aed;
  --draft-400: #a78bfa; /* dotted underline on drafted values */
  --draft-100: #ede9fe;
  --draft-050: #f5f3ff;

  /* ok: verified / done */
  --ok-700: #047857;
  --ok-500: #059669;
  --ok-100: #d1fae5;
  --ok-050: #ecfdf5;

  /* info: informational, links, neutral chart series */
  --info-700: #1d4ed8;
  --info-500: #2563eb;
  --info-100: #dbeafe;
  --info-050: #eff6ff;

  /* Type */
  --font-sans: "IBM Plex Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  /* Spacing: 4pt base, 8pt rhythm */
  --s-1: 2px;  --s-2: 4px;  --s-3: 6px;  --s-4: 8px;
  --s-5: 12px; --s-6: 16px; --s-7: 20px; --s-8: 24px;
  --s-9: 32px; --s-10: 40px; --s-11: 48px; --s-12: 64px;

  /* Radius */
  --r-xs: 4px; --r-sm: 6px; --r-md: 8px; --r-lg: 10px; --r-xl: 14px; --r-pill: 999px;

  /* Elevation: every level leads with the 1px ring */
  --ring: 0 0 0 1px #e4e4e7;
  --e-1: 0 0 0 1px #e4e4e7, 0 1px 2px 0 rgba(9, 9, 11, 0.04);
  --e-2: 0 0 0 1px #e4e4e7, 0 4px 6px -1px rgba(9, 9, 11, 0.06), 0 2px 4px -2px rgba(9, 9, 11, 0.05);
  --e-3: 0 0 0 1px #e4e4e7, 0 10px 15px -3px rgba(9, 9, 11, 0.09), 0 4px 6px -4px rgba(9, 9, 11, 0.06);
  --focus-ring: 0 0 0 2px #ffffff, 0 0 0 4px #09090b;

  /* Layout chrome */
  --rail: 64px; --sidebar: 256px; --inspector: 360px;
  --topbar: 56px; --row-h: 44px; --card-pad: 20px;

  /* Motion */
  --ease: cubic-bezier(.2, .6, .2, 1);
  --dur-state: 120ms; --dur-reveal: 200ms; --dur-panel: 320ms;
}

body {
  font-family: var(--font-sans);
  font-size: 14px; line-height: 22px;
  color: var(--ink-700);
  background: var(--canvas);
  font-variant-numeric: tabular-nums;
}
```

Fonts (Google Fonts):
`https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap`

---

## 2. Color

### 2.1 Roles

| Family | Tokens | Means | Use for |
|---|---|---|---|
| **ink** | `ink-900` … `ink-200` | Structure | Text, primary actions, borders, focus |
| **flag** (orange) | `flag-*` | **Needs a person** | Due today, awaiting review, unanswered, overdue queue items |
| **stop** (rose) | `stop-*` | Conflict / breach / critical | Severity critical/high, policy breach, conflicting data |
| **draft** (violet) | `draft-*` | Generated, not yet approved | Machine-drafted values awaiting sign-off |
| **ok** (emerald) | `ok-*` | Verified / done | Approved, complete, clean |
| **info** (blue) | `info-*` | Informational | Links, neutral notices, the neutral chart series |

**flag vs stop:** these do different jobs. "A person has to act" is flag. "Something is wrong or in conflict" is stop. In a risk dashboard, a severity band is stop (critical/high) or a flag tint (elevated), a due or overdue queue item is flag, and a clean record is ok. Don't use orange for both a severity and a due date on the same screen unless both truly mean "a person has to act."

### 2.2 How to use each shade (same pattern for every status family)

| Step | Job |
|---|---|
| `-700` | Text on white and on its own `-100` tint; solid fill behind white text (stop) |
| `-500` | Dots, rails, icons, chart marks, fills. Text only at 24px+ (or with white text where the ratio allows, see 2.3) |
| `-400`/`-300` | Non-text fills and rules (draft underline, flag chart bars) |
| `-100` | Badge/chip background behind `-700` (or `flag-800`) text |
| `-050` | Faint wash: chart threshold bands, highlighted rows |

### 2.3 Approved text pairings (computed contrast)

| Use | Foreground | Background | Ratio |
|---|---|---|---|
| Headlines, figures | `ink-900` | `surface` | 19.9:1 |
| Primary button | `surface` (white) | `ink-800` | 17.7:1 |
| Body | `ink-700` | `surface` | 10.4:1 |
| Labels / secondary | `ink-600` | `surface` / `canvas` / `surface-sunken` | 7.7 / 7.4 / 7.0:1 |
| Meta (lightest text) | `ink-500` | `surface` / `canvas` **only** | 4.8 / 4.6:1 |
| Orange text, counts | `flag-700` | `surface` / `flag-100` | 5.9 / 5.1:1 |
| Flag badge (strong) | `flag-800` | `flag-100` | 7.8:1 |
| Critical text | `stop-700` | `surface` / `stop-100` | 6.3 / 5.2:1 |
| Critical solid fill | `surface` (white) | `stop-700` | 6.3:1 |
| Draft text | `draft-700` | `surface` / `draft-100` | 7.1 / 6.0:1 |
| Draft solid fill | `surface` (white) | `draft-500` | 5.7:1 |
| Done text | `ok-700` | `surface` / `ok-100` | 5.5 / 4.8:1 |
| Info / link | `info-700` | `surface` / `info-100` | 6.7 / 5.5:1 |
| Info solid fill | `surface` (white) | `info-500` | 5.2:1 |

**Forbidden pairs:**

- `ink-500` on `surface-sunken` (4.4:1, fails)
- `flag-500` as text on white (2.9:1, fails)
- `stop-500` as body text (4.7:1, fine only for 24px+ or non-text)
- any `ink-400`/`ink-300`/`ink-200` text

### 2.4 Surfaces and backgrounds

- Page: `canvas`. Cards: `surface` with `e-1`. Wells, inactive segments, table header rows: `surface-sunken`.
- **Sidebar and top bar are light**: `canvas` with a 1px `ink-200` rule. The active nav item fills `ink-200`. Never use a dark sidebar.
- The only translucency is `scrim` behind modals and drawers.

---

## 3. Typography

IBM Plex Sans for everything. IBM Plex Mono for **identifiers and codes only** (e.g. `CASE-4471`), never for numbers: Plex Sans has tabular figures (`font-variant-numeric: tabular-nums` on `body`).

| Style | Size / line | Weight | Tracking | Use | Example |
|---|---|---|---|---|---|
| `display` | 30 / 36 | 600 | −0.02em | Page-level statement, one per screen | "Two things need you today." |
| `h1` | 22 / 28 | 600 | −0.014em | Screen and panel titles | "Review completion & timeliness" |
| `h2` | 16 / 24 | 600 | −0.008em | Card titles | "Where the risk sits" |
| `h3` | 14 / 20 | 600 | −0.006em | Sub-sections, table captions | "Regulatory basis" |
| `body` | 14 / 22 | 400 | — | Default reading text | "Signature missing on page 4." |
| `body-sm` | 13 / 20 | 400 | — | Dense tables, secondary descriptions | |
| `meta` | 12 / 17 | 400 | — | Timestamps, qualifiers (`ink-600`/`ink-500`) | "Raised 28 Sep · due today" |
| `micro` | 11 / 15 | 400 | — | Footnotes (`ink-600` minimum) | "Data as of 30 Sep 2026" |
| `label` | 11 / 14 | 600 | +0.06em, UPPERCASE | Labels, **always `ink-600`** | "RECORDS" |
| `figure` | 22 / 26 | 600 | — | Stat-card numbers (Sans, not Mono) | "1,114" |
| `code` | 12 / 17 (mono) | 400 | — | Identifiers only | "CASE-4471 · US-1187" |

---

## 4. Spacing, radius, elevation, layout

- **Spacing:** 4pt base, 8pt structural rhythm (`s-1`…`s-12`). Card padding is `s-7` (20px). Card headers are 16px vertical and 20px horizontal. Table cells are `s-5` (12px). Page gutters are `s-9` (32px). Between page sections, `s-10` (40px).
- **Layout:** flex and grid with `gap`. Don't stack margins.
- **Radius:**
  - Controls (buttons, inputs, chips, segments): `r-sm` 6px
  - Menus, popovers, heat-map cells: `r-md` 8px
  - Cards and dialogs: `r-lg` 10px
  - Large tiles and drawers: `r-xl` 14px
  - Checkboxes: `r-xs` 4px
  - Pills and avatars: `r-pill`
- **Elevation:** a 1px `ink-200` line does almost all the work.
  - Cards: `e-1`
  - Drawers and dialogs: `e-2`
  - Popovers and toasts: `e-3`
- **Chrome:**
  - Icon rail: 64px
  - Sidebar: 256px
  - Right inspector: 360px
  - Top bar: 56px
  - Row height and minimum touch target: 44px

---

## 5. Interaction and motion

- **Hover:** fill with the next grey up (secondary button goes to `surface-sunken`, table row goes to `canvas`). Never change the hue, never lift.
- **Press:** nothing shrinks.
- **Focus:** `box-shadow: var(--focus-ring)` (2px white gap, then a 4px near-black ring). No colored glow.
- **Motion:** 120ms state change, 200ms reveal, 320ms panel, all on `cubic-bezier(.2,.6,.2,1)`. Nothing bounces.
- **Generated content appears the way saved content appears:** no typewriter reveal, shimmer or pulse. Skeletons are static.

---

## 6. Component guidance

| Component | Spec |
|---|---|
| Primary button | `ink-800` fill, white text, `r-sm`, focus = `focus-ring`. Never orange. |
| Secondary button | `surface` fill, 1px `ink-300` border, `ink-900` text. Hover fills `surface-sunken`. |
| Input | `surface`, 1px `ink-300` border, `r-sm`, `ink-900` text, `ink-500` placeholder. |
| Card | `surface`, `e-1`, `r-lg`, padding `card-pad`. Title in `h2`. |
| Status badge | `-100` background, `-700` text (`flag-800` for the strong flag variant), `r-xs` or `r-pill`, `label` or `meta` style. |
| Status dot | 6–8px circle in `-500`. |
| "Needs a person" row / rail | 2–3px left rail or dot in `flag-500` plus a `flag-700` count. Optional `flag-050` row wash. |
| Drafted value | `draft-700` text with a dotted `draft-400` underline. Mark it because it needs approval. |
| Table | Header row `surface-sunken` with `label` text. Rows `row-h` 44px, 1px `ink-200` dividers, hover `canvas`. |
| Modal / drawer | `scrim` behind, `e-2`, `r-lg` / `r-xl`. Title asks the whole question ("Reassign four records?"); the body states the consequence. |
| Stat card | `label` caption, then `figure` number, then `meta` qualifier. |
| Nav | Light (`canvas`), 1px `ink-200` rule, active item fill `ink-200`. |

### Human-in-the-loop patterns (keep the structure, rename the copy)

Any flow where a machine drafts and a person approves needs all seven:

1. Provenance value
2. Split summary header
3. Exception queue row
4. Diff row + downstream trace
5. Approval card
6. Locale pair
7. Uncertainty card (states *why*, never a confidence %)

---

## 7. Charts

Build charts in CSS or inline SVG, never with a charting library, so they inherit the tokens and keep to the one-accent rule. Use a single series per chart wherever possible.

| Series | Style |
|---|---|
| Subject | `ink-900`, 2–3px solid |
| Comparison (peer median, baseline) | `ink-400`, dashed |
| Threshold | `stop-500` or `flag-500` dashed, with a `stop-050` / `flag-050` band behind |
| Neutral series | `info-500` |
| Attention-band bars | `flag-300` |

Tell series apart by lightness, not hue alone. Prefer blue/orange to red/green.

---

## 8. Iconography

Almost icon-free. The few glyphs (search, checkbox tick, padlock on an approval gate, document tile, status dot) are inline SVG or CSS at **1.5px stroke in `ink-500`**. Use Unicode for arrows and chevrons: `→ ‹ › ⋯ ×`. If you need a broader set, use **Lucide** at 1.5px stroke in `ink-500`. No emoji, no sparkle icons.

---

## 9. Brand mark

- The asset is `assets/Brand/logo-mask.png`, the Synpulse wordmark as an alpha mask (220×56, aspect 3.9286).
- Paint it with `flag-500`:
  ```css
  .wordmark { width: 120px; aspect-ratio: 3.9286; background: var(--flag-500);
    -webkit-mask: url(logo-mask.png) no-repeat center / contain;
            mask: url(logo-mask.png) no-repeat center / contain; }
  ```
- Size: 100–140px wide in a top bar, 96px minimum. Leave clear space of one cap-height on every side.
- Never stretch, outline or recolor it, and never put it on a photo.
- Fallback when you can't use the mask: the word `synpulse` in lower case, IBM Plex Sans 600, `flag-500`, −0.01em tracking.

---

## 10. Voice and content

- Second person, present tense, sentence case.
- Write what the reader has to do, not what the screen is called. Write "Two things need you today. Everything else is done." Don't write "Dashboard overview."
- **Give the count, then the consequence:** "16 need you." Then "Nothing downstream moves until this is answered."
- **Say why, never how sure:** "Signature missing on page 4." Don't write "82% confidence."
- **Titles are the whole question:** "Reassign four records?"
- No emoji in UI or copy.
- A second language is written, not translated, and runs 15–20% longer. Size containers for the longer one.

---

## 11. Agent checklist (run before you hand anything back)

- [ ] Orange appears only for "needs a person" (plus the wordmark), and only for one reason per screen
- [ ] The primary button is `ink-800` and white
- [ ] No text lighter than `ink-500`; no `ink-500` on `surface-sunken`; labels are `ink-600`
- [ ] Every text pair is in table 2.3 or computed to ≥ 4.5:1
- [ ] Only tokens from section 1 are used, with no new hex values
- [ ] Light sidebar/top bar, flat surfaces, no gradients, glass or colored glows
- [ ] Plex Sans for numbers (tabular); Plex Mono only for identifiers
- [ ] Focus states use `focus-ring`; hover never changes hue
- [ ] No AI branding, confidence %, sparkles or emoji
- [ ] Copy is second person and sentence case, and states counts and consequences

---

*Licensing: token architecture from shadcn/ui (MIT), status hues from Tailwind (MIT), type IBM Plex (OFL). Source of truth: the Synpulse Design System artifact (`tokens.json` + `README.md`).*
