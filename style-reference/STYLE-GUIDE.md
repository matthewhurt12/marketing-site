# In Person — Style Reference

This folder contains the complete visual identity and UI component library extracted from the In Person app. Use these files as the source of truth when building website demos that should match the app's look and feel.

## Design System Overview

**Stack:** Tailwind CSS + shadcn/ui + Radix UI primitives + Framer Motion animations

**Fonts (load via Google Fonts):**
- **Cormorant Garamond** — display/headings (serif, elegant)
- **Instrument Sans** — body text (clean sans-serif)

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

**Color Palette (HSL CSS variables — see `index.css`):**
- Primary: soft blue `hsl(210 55% 70%)`
- Background: white / dark slate
- Cards: warm ivory / dark card
- Accent: muted blue-gray
- Custom "Aura" tokens: `--aura-blue`, `--aura-ivory`, `--aura-champagne`, `--aura-charcoal`

**Dark mode:** Class-based (`.dark` on `<html>`) — full dark palette in `index.css`

**Border radius:** `1rem` base (`--radius`)

**Key animations:** `aura-pulse`, `cta-breathe`, `float-up`, `obd-fade-in`

**Custom shadows:** `shadow-angelic`, `shadow-angelic-sm` — soft blue-tinted elevation

## Folder Contents

```
style-reference/
├── index.css                 # Design tokens, CSS variables, custom utilities, animations
├── tailwind.config.ts        # Tailwind theme: fonts, colors, shadows, keyframes
├── postcss.config.js         # PostCSS (tailwindcss + autoprefixer)
├── components.json           # shadcn/ui configuration
├── lib/
│   └── utils.ts              # cn() helper (clsx + tailwind-merge)
├── context/
│   └── ThemeContext.tsx       # Light/dark/system theme provider
├── components/
│   ├── ui/                   # 29 shadcn/ui primitives (button, card, dialog, drawer, etc.)
│   ├── AppHeader.tsx          # App header with profile completion ring
│   ├── BirthdayWheelPicker.tsx # iOS-style wheel date picker
│   ├── DualRangeSlider.tsx    # Dual-thumb range slider
│   └── date/
│       ├── DateCardWithDrawer.tsx    # Expandable date card with action drawers
│       ├── ProposalExpiryTimer.tsx   # Countdown timer for proposals
│       └── UpcomingDatesHero.tsx     # Hero section with wave/orb decoration
└── pages/
    ├── Welcome.tsx            # Splash screen (falling petals, CTA)
    ├── Onboarding.tsx         # AI interview chat UI (progress ring, chat bubbles, tap options)
    └── Waiting.tsx            # Proposal cards, searching state, confirmed date view
```

## Key UI Patterns

### Chat / Onboarding Interface (Onboarding.tsx)
- Full-screen chat layout with scrollable message area and fixed bottom composer
- AI messages: left-aligned, `text-lg font-normal leading-relaxed`
- User messages: right-aligned, `rounded-2xl rounded-br-sm bg-secondary` pill
- Tap options: `rounded-full border` pills with hover → primary fill
- Progress ring: SVG circle with animated stroke-dashoffset
- Composer: borderless textarea with mic + send buttons

### Proposal Cards (Waiting.tsx)
- Card: `bg-card rounded-2xl border border-border shadow-angelic`
- Partner header: avatar + name/age + interest chips
- Venue hero: gradient overlay on photo with activity icon fallback
- Compatibility section: score, "why you match" reasons, shared interest chips
- Accept/decline buttons: `rounded-xl` with primary fill vs ghost border

### Welcome Screen (Welcome.tsx)
- Centered layout, `font-display text-6xl font-light` for product name
- Falling petal animation via Framer Motion
- CTA: `rounded-full bg-primary text-sm font-medium tracking-widest uppercase`

## Required npm Dependencies

```
tailwindcss  tailwindcss-animate  postcss  autoprefixer
clsx  tailwind-merge  class-variance-authority
lucide-react  framer-motion  date-fns
@radix-ui/react-alert-dialog  @radix-ui/react-avatar
@radix-ui/react-checkbox  @radix-ui/react-collapsible
@radix-ui/react-dialog  @radix-ui/react-label
@radix-ui/react-popover  @radix-ui/react-progress
@radix-ui/react-select  @radix-ui/react-separator
@radix-ui/react-slider  @radix-ui/react-slot
@radix-ui/react-switch  @radix-ui/react-toast
@radix-ui/react-toggle  @radix-ui/react-tooltip
vaul  sonner  react-hook-form
```

## Import Aliases

The app uses `@/` as an alias for `src/`. When integrating into your website project, adjust imports accordingly or set up the same alias in your bundler config.
