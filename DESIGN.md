# Design Brief — Copie Past-e

**Tone & Aesthetic:** Retro-futuristic 1980s cyberpunk time-travel. Neon glow, sharp geometry, synthwave palette. BTTF-inspired checkout and tier upgrade UX. Unmistakable and memorable.

## Palette (OKLCH)

| Token | OKLCH | Usage |
|-------|-------|-------|
| Background | `0.10 0 0` | Main surface, almost-black |
| Card | `0.16 0 0` | Listing cards, lifted surfaces |
| Foreground | `0.95 0 0` | Primary text, near-white |
| Primary (Electric Blue) | `0.65 0.22 262` | Buttons, highlights, interactive focus |
| Accent (Neon Yellow) | `0.88 0.19 84` | Call-to-action, tier upgrade CTA |
| Muted | `0.25 0 0` | Dimmed UI, archived listings, secondary elements |
| Destructive (Hot Red) | `0.65 0.25 16` | Time circuit warning state, critical alerts |
| Success (Neon Green) | `0.75 0.18 140` | Time circuit ready state, tier upgrade success |

## Typography

| Layer | Font | Usage |
|-------|------|-------|
| Display | Orbitron | Headings, nav logo, page titles, checkout headlines — bold futuristic |
| Body | Space Grotesk | Main text, descriptions, UI labels — geometric, clean |
| Mono | JetBrains Mono | Countdown timers, technical info, BTTF time circuits |

## Structural Zones

| Zone | Background | Border | Treatment |
|------|------------|--------|-----------|
| Header/Nav | `bg-card` | `border-b border-primary/60` | Logo "Copie Past-e ⚡" in Orbitron, active/archived toggle |
| Active Listings | `bg-background` | — | Neon blue accent strip, `glow-blue` on hover |
| Archived Listings | `bg-muted/20` | `border-muted/40` | Grayed out, muted text, delete button in red |
| Checkout Modal | `bg-card` | `neon-border-blue` | Three tier cards with yellow upgrade CTA, Apple Pay + Stripe logos |
| Time Circuits | `bg-background` | — | Monospace countdown, glowing segments (red/yellow/green) per time unit |
| Fuel Success | `bg-background` | — | "Your DeLorean is fueled!" headline, glowing green circuit display |
| Footer | `bg-background` | — | Minimal, muted text, security badges |

## Spacing & Density

- **Compact:** Tier cards (0.75rem padding), countdown segments (tight grid)
- **Breathing room:** Checkout sections (1.5rem gap between tiers), tier upgrade success (2rem margin)
- **Icon scale:** 20px tier badges, 16px inline
- **Margin scale:** 0.5rem, 1rem, 1.5rem, 2rem (no arbitrary gaps)

## Component Patterns

- **Tier cards:** `bg-card neon-border-blue`, yellow `glow-yellow` on hover; pricing in accent yellow
- **Checkout CTA:** `bg-accent text-accent-foreground glow-yellow-sm`, "Power Up Your DeLorean" headline in Orbitron 700
- **Time circuits:** Monospace font, 6 segments (M/W/D/H/M/S), each with `circuit-glow-red/yellow/green` based on urgency
- **Active listing:** Blue accent strip left, `glow-blue` hover, copy/edit buttons in primary
- **Archived listing:** Muted background, `bg-muted/30`, gray text, delete button in destructive red
- **Loading state:** Pulsing yellow dot, `animate-circuit-pulse` for tier upgrade pending

## Motion & Animation

- **Transitions:** `transition-smooth` (0.3s ease-out) for all interactive elements
- **Import animations:** Sequential lightning strike (0.6s), clock spin (1.2s), yellow glow pulse (final state)
- **Checkout:** Tier cards scale-up (5% on hover), subtle `time-bounce` on CTA button
- **Time circuits:** `circuit-pulse` animation (1.5s) on each segment, pulses brighter as countdown shortens
- **Tier upgrade success:** Green glow pulse (2s), "Your DeLorean is fueled!" text in `text-glow-green`

## Signature Detail

**Glowing time circuits on countdown.** Red (urgent), yellow (medium), green (safe). Each segment pulses with mood-appropriate neon glow. This is the hero animation for tier upgrade UX and active listing countdowns. Combined with Orbitron headlines ("Power Up Your Time Machine"), creates unmistakable BTTF brand experience.

## Constraints

- Minimal UI — no decorative gradients, no floating shapes, no neumorphism
- No rounded corners except `rounded-sm` (4px) on inputs/buttons; countdown segments use `rounded-md`
- All colors derived from token palette + success green (`0.75 0.18 140`)
- Dark mode only (no light theme)
- Animations are snappy (0.3s–1.5s range); no long transitions
- Text contrast always AA+ (checked at design time)
- Admin users exempt from tier/expiration rules — show "ADMIN: UNLIMITED" badge next to active listings
