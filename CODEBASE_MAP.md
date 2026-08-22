# In Person — Marketing Site: Codebase Map & Redesign Reference

> Handoff reference for the **marketing/landing site** (this is a *separate* repo from the
> mobile app). Purpose: let another agent quickly understand the structure, find the logic,
> and identify what still needs to change to match the new "dreamy purple" In Person brand.
>
> Last updated: 2026-06-07, mid-redesign (Phase A done, Phase B pending — see bottom).

---

## 1. Project at a glance

- **What it is:** a single-page marketing/landing site for In Person — a hero, a few
  scroll-reveal statement sections, an **animated iPhone demo**, and a **waitlist email capture**.
- **Local path:** `C:\Users\matth\marketing-site`
- **Stack:** Vite 5 · React 18 · TypeScript · Tailwind CSS 3 · Framer Motion (animation) · lucide-react (icons)
- **Hosting / integrations:**
  - GitHub repo `matthewhurt12/marketing-site` → **Vercel** (auto-deploy).
  - Serverless functions live in `/api` (Vercel).
  - Analytics: **Microsoft Clarity** (snippet in `index.html`).
  - Waitlist email: **Resend** (key in `.env`, gitignored).
- **Branch:** all redesign work is on the **`redesign`** branch (local only, not pushed).
  `main` is the live production site — leave it untouched.
- **Run it:** `npm install`, then `npm run dev` → http://localhost:3000 .
  Production build: `npm run build` → outputs `dist/`.
- **If sharing the code with another AI:** include everything EXCEPT `node_modules/`,
  `dist/`, and **`.env`** (it holds the Resend API key — keep that private).

---

## 2. Directory tree (purpose + redesign status)

```
marketing-site/
├─ index.html                 # Home HTML shell: canonical SEO, OG/Twitter, JSON-LD, fonts,
│                             #   Microsoft Clarity snippet, and the pre-React splash screen.   [RESKINNED]
├─ {privacy,terms}.html       # Route-specific crawlable metadata shells for the legal pages
├─ package.json               # dependencies + scripts (dev / build / preview / generate:assets)
├─ vite.config.ts             # Vite: React plugin, three HTML inputs, "@" → ./src, port 3000
├─ tailwind.config.ts         # Tailwind theme: maps brand colors → CSS vars, fonts, radii, shadows  [RESKINNED]
├─ tsconfig.json              # TypeScript config
├─ postcss.config.js          # PostCSS (tailwindcss + autoprefixer)
├─ vercel.json                # SPA rewrites + /api routing for Vercel
├─ .env                       # RESEND_API_KEY  (gitignored — DO NOT SHARE)
│
├─ api/                       # Vercel serverless functions (run on the server, not in the browser)
│  ├─ waitlist.ts             #   POST { email } → sends a notification via Resend to matthewhurt999@gmail.com
│
├─ public/                    # static assets served as-is
│  ├─ logo.png                #   the source brand heart mark (pink→purple→blue)
│  ├─ inperson-share-2026.png #   static 1200×630 social-link preview
│  ├─ icon-*.png, apple-touch-icon.png, favicon-*.png
│  ├─ site.webmanifest        #   Android/Chrome install identity and app shortcuts
│  ├─ robots.txt, sitemap.xml #   crawler discovery files for tryinperson.com
│  └─ {alex,jordan,sam}-profile.{jpg,webp}   # demo profile photos used by the phone demo
│
├─ style-reference/           # SNAPSHOT of the real app's UI components (shadcn/ui + app screens like
│                             #   DateCardWithDrawer, UpcomingDatesHero). REFERENCE ONLY — not imported by
│                             #   the site. Likely STALE vs the current app; treat as historical.
│
└─ src/
   ├─ main.tsx                # React entry point; mounts <App/> and removes the splash screen
   ├─ App.tsx                 # PAGE COMPOSITION — the section order (see §4)
   ├─ index.css               # DESIGN TOKENS (:root CSS variables) + utility classes + .dreamy-bg background  [RESKINNED]
   ├─ lib/
   │  └─ utils.ts             # cn() classname helper (clsx + tailwind-merge)
   └─ components/
      ├─ DreamBackground.tsx  # Fixed dreamy gradient background (renders the .dreamy-bg layer)   [NEW]
      ├─ GrainOverlay.tsx     # Faint full-screen film-grain SVG overlay (reduces gradient banding)
      ├─ SiteNav.tsx          # Fixed top nav: logo + "In Person" wordmark + "Join Waitlist" pill
      ├─ HeroSection.tsx      # Hero: eyebrow, giant "In Person" wordmark, subcopy, CTA, scroll cue
      ├─ IndictmentScroll.tsx # Scroll-reveal statement lines ("Dating apps gave you a thousand faces…")
      ├─ AppDemo.tsx          # ★ THE PHONE FRAME + ANIMATION STATE MACHINE (see §5)
      ├─ AppDemoChat.tsx      #   phone phase: AI "interview" chat (typewriter, options, composer)
      ├─ AppDemoMatch.tsx     #   phone phase: a match card (partner, venue, compatibility, "I'm in")
      ├─ AppDemoDate.tsx      #   phone phase: upcoming-dates list (an expanding date card)
      ├─ AntiPositioning.tsx  # Scroll-reveal "No swiping… Just go." lines
      ├─ WaitlistSection.tsx  # Email capture form → POST /api/waitlist
      └─ SiteFooter.tsx       # Footer: logo, Privacy/Terms/Instagram, tagline
```

---

## 3. The design system / theme (where "the brand" lives)

Two files control the entire look:

### `src/index.css`
- The `:root` block holds **all colors as HSL CSS variables**. Change a value here and it
  propagates everywhere (Tailwind reads these via `hsl(var(--x))`).
- Current brand tokens (new "dreamy" set):

  | Token | Value (hex) | Role |
  |-------|-------------|------|
  | `--background` | `#1a1340` | deep indigo "dream" base |
  | `--foreground` | `#eeedf5` | off-white text |
  | `--primary` | `#5d48db` | brand violet (buttons, accents) |
  | `--lilac` | `#b48cff` | accent over the gradient |
  | `--warm` | `#ff9b78` | warm blob / accents |
  | `--rose` | `#ee7bb6` | rose accent |
  | `--gold` | `#e0b36a` | warm gold accent |
  | `--card` / `--secondary` / `--muted` / `--border` | indigo tints | surfaces & borders |

- **`.dreamy-bg`** = the signature animated background: ONE fixed element at `z-index:-1`
  painting `#1a1340` + three layered radial-gradient "blobs" (exact stops from the app's
  `blob-gradient`), slowly drifting via `@keyframes dreamy-drift`. Respects reduced-motion.
- Utility classes: `.font-display` (Spectral), `.shadow-angelic`, `.aura-transition`,
  and the `cta-breathe` / `aura-pulse` animations.

### `tailwind.config.ts`
- `fontFamily.display` → **Spectral** (serif), `fontFamily.sans` → **Instrument Sans**.
- Maps the CSS vars above to Tailwind color classes (`bg-primary`, `text-lilac`, etc.).
- Radii and the violet `shadow-angelic`.

### Fonts (loaded in `index.html`)
- **Spectral** weights **400 / 600 / 700** (headings + the "In Person" wordmark use **700**).
- **Instrument Sans** for UI/body text.

---

## 4. Page composition — `src/App.tsx`

Render order (top → bottom):

```
<DreamBackground/>     ← fixed gradient bg (behind everything, z-index:-1)
<GrainOverlay/>        ← faint grain (z-40)
<SiteNav/>             ← fixed top nav (z-50)
<main>
  <HeroSection/>
  <IndictmentScroll/>
  <AppDemo/>           ← the phone
  <AntiPositioning/>
  <WaitlistSection/>
</main>
<SiteFooter/>
```

Most sections fade/slide in on scroll using Framer Motion's `useInView`.

---

## 5. ★ The phone demo — the main "logic" (and the focus of Phase B)

The animated iPhone is built from four files. **This currently shows the OLD concept
(chat → match → upcoming dates) and is the thing being rebuilt into the real onboarding
preview.**

- **`AppDemo.tsx`** — the phone frame (rounded shell + notch) and a **state machine**:
  - `Phase = "chat" | "search" | "match" | "date" | "closing"` plus a `started` flag.
  - Starts when scrolled into view (`useInView`, margin `-20%`); resets when it leaves view.
  - Advance order: `chat → search → match → date → closing → (loops back to) chat`.
  - Timing: `search` auto-advances after 3000ms, `closing` after 7000ms; `chat`/`match`/`date`
    advance when their child calls `onComplete`. A caption is shown per phase.
  - The `search` ("Finding someone…") and `closing` ("Then you meet — in person." + CTA)
    screens are defined inline here; the other three phases are the components below.
- **`AppDemoChat.tsx`** — millisecond-choreographed "interview": an AI question types in,
  a user answer types into a composer (`useTypewriter` hook), a send-button flash, animated
  "thinking" dots, a second question, multiple-choice chips, and an auto-tap selection.
  Has a progress-ring header and a composer with a mic + arrow-up send button.
- **`AppDemoMatch.tsx`** — a match card: partner avatar ("Alex, 27"), a venue hero
  ("1000 Faces Coffee, Athens GA"), a compatibility/"why you match" block, and Pass / "I'm in".
- **`AppDemoDate.tsx`** — an "Upcoming dates" list (Jordan + Sam) with a new "Alex" card that
  animates in and expands to show the plan.

> ⚠️ All hardcoded demo content (Alex/Jordan/Sam, "1000 Faces Coffee", "Athens GA", the
> profile photos in `public/`) lives in these files.

---

## 6. Waitlist + serverless

- **`WaitlistSection.tsx`** (client): controlled email input → `fetch("/api/waitlist", POST)`
  → shows sending / success / error states.
- **`api/waitlist.ts`** (server): validates the email and calls the **Resend** API to email a
  signup notification to `matthewhurt999@gmail.com`. Needs `RESEND_API_KEY` env var.
- Social previews use the static, versioned **`public/inperson-share-2026.png`** asset.

---

## 7. Redesign status

### Phase A — DONE (the page reskin to the new brand)
- New color tokens (dreamy indigo/violet/lilac/warm) in `index.css` + `tailwind.config.ts`.
- Switched display font **Cormorant → Spectral**; wordmark + headings set to **700**.
- Replaced the old falling-petals background with the **single-layer drifting blob `.dreamy-bg`**
  at `z-index:-1` (fixes seams/banding and content getting painted over).
- Brand copy across hero / scroll sections / meta; recolored leftover hardcoded blues in the phone.
- ✅ Production build passes.

### Phase B — PENDING (rebuild the phone into the real onboarding preview)
Replace the `AppDemo*` content with the actual onboarding-interview animation. Target state
machine (from the spec docs in §8):

```
phone_enter → question_1_typewriter → answer_1_typing → answer_1_send → ai_thinking
→ question_2_typewriter → answer_2_typing → answer_2_send → done_line
→ interests_select → date_vibes_select → photo_check → ready_for_match   (≈12s loop)
```
- Uses the **real app art** (coffee, art-gallery, hiking, low-key, foodie, creative) — these
  need to be copied into `public/`. See §8 for where they are.
- Ends on "You're all set." / "Ready for your first match."

---

## 8. Brand spec — the source of truth

- **★ `C:\Users\matth\OneDrive\Documents\Inperson NEW\BRAND_STYLE_GUIDE.md`** — the most
  authoritative doc (pulled from app source: `theme.ts`, `blob-gradient.ts`, `FontProvider.tsx`,
  `BrandMark.tsx`) with exact CSS. Defines the logo rules, **Spectral 400/600/700** (wordmark
  + headings = 700), the three color modes (use the **Dreamy** set for the site), the exact
  blob-gradient stops, shape/radius language, and a "fix the website" checklist.
- `C:\Users\matth\Downloads\In Person Brand Document.html` — broader brand/positioning/voice.
- `C:\Users\matth\Downloads\in-person-onboarding-web-agent-spec.md` — full spec for the phone
  onboarding animation (state machine, timings, copy, card styling).
- `C:\Users\matth\Downloads\In Person Onboarding Preview Motion Guide.html` — the same as a
  visual storyboard.
- **Real image assets** came bundled with those docs (in the `… _files` folders in Downloads):
  `coffee.png`, `art-gallery.png`, `foodie.png`, `low-key.png`, hi-res `in-person-logo.png`,
  plus textures `welcome-bg.jpg` and `ambient-warm-bokeh.jpg`.

---

## 9. "What still needs to change" — checklist for review

1. **Phone demo (biggest):** still the old chat/match/dates flow. Rebuild into the onboarding
   preview (Phase B) and wire in the real interest/date-vibe art.
2. **Hardcoded demo content** in `AppDemoMatch.tsx` / `AppDemoDate.tsx` (names, "1000 Faces
   Coffee", "Athens GA", profile photos) — decide what stays once the phone is onboarding-only.
3. **Copy pass** for brand voice (warm, plainspoken, no em dashes) across all sections.
4. **Light vs all-dark:** the site is currently all-dark dreamy. The brand also has a calm
   cream/white "product" mode — decide whether any sections should be light.
5. **OG image** (`api/og.tsx`) — verify it reflects the new brand colors/copy.
6. **Logo:** `public/logo.png` matches the brand mark; optionally swap to the 1024px hi-res.
7. **Verify type:** Spectral 400/600/700 only; wordmark + headings at 700 everywhere.
8. **`style-reference/`** folder is a stale snapshot — refresh or ignore.
```
