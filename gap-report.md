# Gap Report — assistant-ui-zonewise vs DESIGN.md + DESIGN.overrides.md

**Date:** Apr 10, 2026
**Audited by:** Claude (automated)
**Scope:** ZoneWiseSplitScreen.tsx, packages/ui/src/components/, templates/*/globals.css, tailwind config, theme/token files

---

## MATCHES — What Already Aligns

| Item | File | Evidence |
|------|------|----------|
| Brand colors correct | `zonewise/ZoneWiseSplitScreen.tsx` | Uses #1E3A5F (Navy), #F59E0B (Orange), #020617 (Void) throughout |
| Dark-first approach | `zonewise/ZoneWiseSplitScreen.tsx` | All backgrounds use slate-950/void, no light mode paths |
| Semantic token system in UI lib | `packages/ui/src/components/ui/button.tsx` | Uses `bg-primary`, `text-primary-foreground`, `ring-ring` — no hardcoded hex |
| Card component uses tokens | `packages/ui/src/components/ui/card.tsx` | Uses `bg-card`, `border-border`, `shadow-sm` semantic classes |
| Badge component uses tokens | `packages/ui/src/components/ui/badge.tsx` | Semantic variant classes throughout |
| CSS variable architecture | `templates/default/app/globals.css` | OKLch-based `--background`, `--foreground`, `--primary` etc. |
| Border radius scale reasonable | `packages/ui/src/components/ui/button.tsx` | `rounded-md` (~6px) aligns with DESIGN.md small radius |
| No light mode | All | Consistent dark-only rendering |
| Secondary text colors | `zonewise/ZoneWiseSplitScreen.tsx:76,100,120` | Uses #64748B (slate-400) and #94A3B8 (slate-500) per overrides |

## NEEDS REFACTOR — What Conflicts

| Issue | File:Line | Current | Required | Severity |
|-------|-----------|---------|----------|----------|
| Pill buttons | `zonewise/ZoneWiseSplitScreen.tsx:33,50` | `rounded-full` on tool badges | `rounded-md` or `rounded-lg` — CLAUDE.md forbids pill buttons | HIGH |
| Hardcoded hex colors | `zonewise/ZoneWiseSplitScreen.tsx:33,50,76,78,90,92,99,100,109,116,117,120,128,133,149,151` | Inline hex values (#1E3A5F, #F59E0B, etc.) | Should use CSS custom properties (`var(--brand-navy)`) or Tailwind semantic classes | MEDIUM |
| No font-family declarations | `zonewise/ZoneWiseSplitScreen.tsx` | Uses generic `font-mono` class | Should explicitly set Inter for UI, JetBrains Mono for code/financial | MEDIUM |
| No depth/elevation system | `zonewise/ZoneWiseSplitScreen.tsx` | No ring shadows on interactive elements | DESIGN.md specifies `0px 0px 0px 1px` ring system for depth | LOW |
| Inconsistent spacing | `zonewise/ZoneWiseSplitScreen.tsx` | Mix of `my-2`, `px-4`, `py-2.5`, `p-6`, `p-4`, `p-3` | Should follow DESIGN.md 8px base scale (4/8/12/16/24/32/48/64) | LOW |
| Heat graph colors off-brand | `packages/ui/src/components/assistant-ui/heat-graph.tsx:5` | `["#ebedf0", "#c6d7f9", "#8fb0f3", "#5888e8", "#2563eb"]` (blue scale) | Should use Navy scale derived from #1E3A5F | LOW |
| DevTools light theme present | `packages/react-devtools/src/styles/DevToolsModal.styles.ts` | Has full light theme with #f8fafc, #ffffff | Dark-only per overrides; light theme is dead code | LOW |
| Template globals.css not branded | `templates/default/app/globals.css` | Generic shadcn OKLch tokens | Should map to House Brand tokens (Navy/Orange/Slate) | MEDIUM |

## MISSING — Patterns from DESIGN.md Not Yet Implemented

| Pattern | DESIGN.md Section | Status | Priority |
|---------|-------------------|--------|----------|
| Split-screen layout (chat + artifact) | Layout / Container | Partial — ZoneWiseSplitScreen exists but uses hardcoded layout, not DESIGN.md grid system | P1 |
| Artifact panel with tabs | Components / Cards | Missing — no artifact viewer with tab switching | P1 |
| File upload UX | Components / Inputs | Missing — no drag-drop or file upload component | P2 |
| Streaming text display | Components / Typography | Missing — no streaming/typewriter text renderer following DESIGN.md animation specs | P1 |
| Button hover/active states | Components / Buttons | Partial — buttons exist but hover transitions don't follow DESIGN.md timing (150ms ease) | P2 |
| Input focus ring system | Components / Inputs | Missing — no `0px 0px 0px 1px` focus ring + brand color outer ring | P2 |
| Toast/notification system | Components / Feedback | Missing — no toast component following DESIGN.md positioning (bottom-right, 320px) | P3 |
| Keyboard shortcuts overlay | Components / Navigation | Missing — no CMD+K or keyboard nav following DESIGN.md patterns | P3 |
| Responsive collapse strategy | Layout / Responsive | Missing — no breakpoint-driven layout collapse per DESIGN.md (1024px → single column) | P2 |
| Loading skeleton shimmer | Components / Feedback | Missing — no skeleton loader with Navy/Slate palette animation | P3 |
| Typography hierarchy enforcement | Typography | Missing — no explicit 64/52/36/32/25/20/17/16/15px scale implementation | P2 |
| Container max-width system | Layout / Container | Missing — no 640/768/1024/1280/1536px container system | P2 |

## EFFORT ESTIMATE [INFERRED]

| Item | Hours | Notes |
|------|-------|-------|
| Fix pill buttons → rounded-lg | 0.5 | Find-and-replace `rounded-full` in ZoneWiseSplitScreen |
| Extract hardcoded hex → CSS vars | 2 | Create brand token CSS vars, update all inline hex refs |
| Add font-family declarations | 1 | Configure Inter + JetBrains Mono in globals.css + Tailwind |
| Implement depth/ring system | 2 | Add ring shadow utilities per DESIGN.md spec |
| Align spacing to 8px scale | 1.5 | Audit and update arbitrary spacing values |
| Brand heat graph colors | 0.5 | Swap blue scale → Navy scale |
| Remove DevTools light theme | 0.5 | Delete or disable light theme object |
| Brand template globals.css | 3 | Map all OKLch tokens to House Brand equivalents |
| Artifact panel with tabs | 6 | New component: tabbed artifact viewer |
| Streaming text display | 4 | Implement typewriter/streaming renderer |
| File upload UX | 4 | Drag-drop + file preview component |
| Responsive collapse | 3 | Breakpoint-driven layout switching |
| Button hover/active states | 1 | Add DESIGN.md transition timing |
| Input focus ring system | 1.5 | Ring shadow + brand color focus states |
| Toast system | 2 | Bottom-right positioned toast component |
| Typography scale enforcement | 2 | Configure full DESIGN.md type scale |
| Container max-width system | 1 | Tailwind container config |
| **TOTAL** | **~36** | INFERRED — based on component complexity, not benchmarked |

---

**Honesty Tags:**
- MATCHES section: VERIFIED (file reads performed, hex values confirmed)
- NEEDS REFACTOR section: VERIFIED (line numbers confirmed via source read)
- MISSING section: VERIFIED (searched repo, patterns not found)
- EFFORT ESTIMATE: INFERRED (engineering judgment, not benchmarked)
