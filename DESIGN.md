# Design Brief — Copie Past-e

**Tone & Aesthetic:** Retro-futuristic 1980s cyberpunk time-travel. Neon glow, sharp geometry, synthwave palette. BTTF-inspired checkout and tier upgrade UX. Terminal boot sequence for onboarding. Unmistakable and memorable. FINALIZED & LOCKED.

## Palette (OKLCH)

| Token | OKLCH | Usage |
|-------|-------|-------|
| Background | `0.10 0 0` | Main surface, almost-black |
| Card | `0.16 0 0` | Listing cards, lifted surfaces, terminal windows |
| Foreground | `0.95 0 0` | Primary text, near-white |
| Primary (Electric Blue) | `0.65 0.22 262` | Buttons, highlights, interactive focus, terminal borders |
| Accent (Neon Yellow) | `0.88 0.19 84` | Call-to-action, tier upgrade CTA, drag-over state |
| Muted | `0.25 0 0` | Dimmed UI, archived listings, secondary elements |
| Destructive (Hot Red) | `0.65 0.25 16` | Time circuit warning state, critical alerts |
| Success (Neon Green) | `0.75 0.18 140` | Time circuit ready state, file upload zone, tier upgrade success |
| Terminal Overlay | `0.08 0 0` | Full-page onboarding overlay background |

## Typography

| Layer | Font | Usage | Source |
|-------|------|-------|--------|
| Display | Orbitron | Headings, nav logo, page titles, legal titles, section headers — bold futuristic | Google Fonts |
| Body | Space Grotesk | Main text, descriptions, UI labels, legal body copy — geometric, clean | Bundled `/assets/fonts/` |
| Mono | JetBrains Mono | Countdown timers, technical info, terminal boot headers, file upload labels | Bundled `/assets/fonts/` |

## Structural Zones

| Zone | Background | Border | Treatment |
|------|------------|--------|-----------|
| Header/Nav | `bg-card` | `border-b border-primary/60` | Logo "Copie Past-e ⚡" in Orbitron, active/archived toggle |
| Active Listings | `bg-background` | — | Neon blue accent strip, `glow-blue` on hover |
| Archived Listings | `bg-muted/20` | `border-muted/40` | Grayed out, muted text, delete button in red |
| Checkout Modal | `bg-card` | `neon-border-blue` | Three tier cards with yellow upgrade CTA, Apple Pay + Stripe logos |
| Onboarding Overlay | `terminal-overlay` | — | Full-page, non-dismissible, scanlines effect, terminal window with boot sequence |
| Terminal Window | `bg-card` | `neon-border-blue` | Terminal header bar, step progress indicators, monospace content |
| File Upload Zone | `bg-background` | `border-dashed border-success-green` | Hover: inset glow, dragover: neon yellow border + background lift |
| File List | `bg-card` | `border-l border-primary` | Monospace font, left accent line, tight padding |
| Legal Pages | `bg-background` | — | Orbitron section titles, justified Space Grotesk body, accent list bullets |
| Support Modal | `bg-card` | `neon-border-blue` | Terminal header, file attachments section, ticket form |
| Footer | `bg-background` | — | Minimal, muted text, security badges |

## Component Patterns

- **Tier cards:** `bg-card neon-border-blue`, yellow `glow-yellow` on hover; pricing in accent yellow
- **Checkout CTA:** `bg-accent text-accent-foreground glow-yellow-sm`, "Power Up Your DeLorean" headline in Orbitron 700
- **Terminal window:** `terminal-window` class, `terminal-header` with monospace text, `scanlines` overlay for CRT effect
- **Terminal boot header:** "SYSTEM BOOT SEQUENCE" in monospace, letter-spaced, blue glow text
- **Step progress:** `terminal-step-indicator` with dots: inactive (border only), active (yellow glow), completed (green glow)
- **File upload zone:** `file-upload-zone` with dashed neon green border, hover lift, dragover state turns yellow
- **File list item:** `file-list-item` with left blue accent line, monospace font, tight spacing
- **Legal title:** `legal-title` in Orbitron with subtle blue glow, 2.25rem size
- **Legal section:** `legal-section-title` in uppercase Orbitron 600, blue text with glow, 1.5rem
- **Legal body:** `legal-body` justified Space Grotesk, 0.9375rem, 1.8 line-height, accent list bullets
- **Time circuits:** Monospace font, 6 segments (M/W/D/H/M/S), each with `circuit-glow-red/yellow/green` based on urgency
- **Active listing:** Blue accent strip left, `glow-blue` hover, copy/edit buttons in primary
- **Archived listing:** Muted background, `bg-muted/30`, gray text, delete button in destructive red
- **Loading state:** Pulsing yellow dot, `animate-circuit-pulse` for tier upgrade pending

## Motion & Animation

- **Transitions:** `transition-smooth` (0.3s ease-out) for all interactive elements
- **Import animations:** Sequential lightning strike (0.6s), clock spin (1.2s), yellow glow pulse (final state)
- **Terminal boot sequence:** Scale-up entry (0.8s), typewriter text reveal (0.6s steps), scanlines loop (0.15s linear infinite)
- **Terminal step progress:** Active dot pulses yellow (1.5s), completed dots glow green (static)
- **File upload zone:** Pulsing green border (2s ease-in-out) on hover/focus
- **Checkout:** Tier cards scale-up (5% on hover), subtle `time-bounce` on CTA button
- **Time circuits:** `circuit-pulse` animation (1.5s) on each segment, pulses brighter as countdown shortens
- **Tier upgrade success:** Green glow pulse (2s), "Your DeLorean is fueled!" text in `text-glow-green`
- **Legal page load:** Smooth fade-in (0.3s), section headings appear with subtle blue glow

## Signature Detail

**Glowing time circuits on countdown + Terminal boot sequence.** Onboarding uses full-page overlay with CRT scanlines effect, monospace typewriter text reveal, and step-by-step progress dots. Red (urgent), yellow (medium), green (safe). Each segment pulses with mood-appropriate neon glow. File upload zones feature dashed green borders with hover lift. Combined with Orbitron headlines and neon accents, creates unmistakable retro-cyberpunk boot-up experience. **Design System FINALIZED:** All tokens locked, animations production-ready, fonts bundled locally, no further changes planned.

## Constraints

- Minimal UI — no decorative gradients, no floating shapes, no neumorphism
- No rounded corners except `rounded-sm` (4px) on inputs/buttons, `rounded-md` (6px) on countdown/upload zone segments
- All colors derived from token palette + success green (`0.75 0.18 140`)
- Dark mode only (no light theme)
- Animations are snappy (0.15s–2s range); no long transitions
- Text contrast always AA+ (checked at design time)
- Terminal elements use monospace font, uppercase letter-spacing (0.05em), text-shadows for glow
- CRT scanlines overlay (`scanlines` class) applied to full-page onboarding overlay only, not general UI
- File upload zone pulses green only during drag-over or focus; borders are dashed for visual distinction
- Legal pages use justified body text with accent-color list bullets; section titles uppercase in Orbitron 600
- Admin users exempt from tier/expiration rules — show "ADMIN: UNLIMITED" badge next to active listings
