# DESIGN.overrides.md — House Brand over Claude DNA

> **Reads AFTER `DESIGN.md`.** Claude's layout, typography scale, spacing, depth, and interaction patterns remain authoritative. Only brand tokens are swapped.

## Brand Token Overrides

### Primary
- **Everest Navy** (`#1E3A5F`) — replaces Claude Terracotta `#c96442` for CTAs and brand accents
- **Summit Orange** (`#F59E0B`) — replaces Claude Coral `#d97757` for secondary emphasis

### Surface & Background
- **Slate-950** (`#020617`) — replaces Parchment `#f5f4ed` as primary background (dark-first)
- **Slate-900** (`#0f172a`) — replaces Ivory `#faf9f5` for elevated cards
- **Slate-800** (`#1e293b`) — replaces Warm Sand `#e8e6dc` for interactive surfaces

### Neutrals & Text
- **Slate-100** (`#f1f5f9`) — primary text on dark (replaces Charcoal Warm)
- **Slate-400** (`#94a3b8`) — secondary text (replaces Olive Gray)
- **Slate-500** (`#64748b`) — tertiary text (replaces Stone Gray)

### Borders
- **Slate-800** (`#1e293b`) — standard border (replaces Border Cream)
- **Navy/20** (`#1E3A5F33`) — accent border for active states

### Typography Family Swap
- **Headlines:** `Inter` weight 600 — replaces `Anthropic Serif` / Georgia
- **Body/UI:** `Inter` weight 400–500 — replaces `Anthropic Sans`
- **Code:** `JetBrains Mono` — replaces `Anthropic Mono`
- **KEEP Claude's hierarchy scale exactly** (64/52/36/32/25/20/17/16/15px)
- **KEEP Claude's line-heights exactly** (1.10 tight → 1.60 relaxed)

### KEEP UNCHANGED FROM CLAUDE DESIGN.md
- Spacing scale (all values)
- Border radius scale (all values)
- Depth/elevation ring system (`0px 0px 0px 1px`)
- Component structure: buttons, cards, inputs, navigation
- Grid and container widths
- Responsive breakpoints and collapsing strategy
- Touch target minimums
- Do's and Don'ts (except "warm-only neutrals" → "slate-only neutrals")

## Agent Read Order
1. `DESIGN.md` — Claude DNA (authoritative for layout, spacing, components, depth, responsive)
2. `DESIGN.overrides.md` — House Brand (authoritative for colors + fonts ONLY)

When conflict: overrides win for colors/fonts only. Everything else = DESIGN.md.
