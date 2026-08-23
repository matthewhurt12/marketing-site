# In Person marketing site — current codebase map

> Updated August 22, 2026 for the premium V2 concept. The concept lives on the
> `v2-concept` branch. Production should only be changed by an explicit production
> deployment or promotion.

## Project

- Local path: `C:\Users\matth\marketing-site`
- GitHub: `matthewhurt12/marketing-site`
- Hosting: Vercel project `marketing-site`
- Framework: Vite 8, React 18, TypeScript, Tailwind CSS 3, Framer Motion
- Build: `npm run build`
- Output: `dist/`
- Local development: `npm run dev`

Do not use the `in-person-new`, `mobile-app`, or `sandbox` folders for this site.
They are separate In Person product projects.

## Home experience

`src/App.tsx` owns the route and home-page composition:

```text
DreamBackground
GrainOverlay
  SiteNav
  HeroSection
  ExperienceStory
  DateLifeSection
  WaitlistSection
SiteFooter
```

- `HeroSection.tsx`: instant AI-matchmaker positioning and a scan-first product preview.
- `ExperienceStory.tsx`: the three-step Talk / Match / Meet story.
- `DateLifeSection.tsx`: short real-world date chapter using `public/onboarding/`.
- `WaitlistSection.tsx`: email form posting to `/api/waitlist`.
- `SiteNav.tsx` and `SiteFooter.tsx`: global navigation and legal links.

Legacy `AppDemo*`, `ProblemReset`, `PrinciplesSection`, `FAQSection`,
`IndictmentScroll`, and `AntiPositioning` components remain in the repository for
reference but are not mounted by the concise V2 home page.

## Routes and server behavior

- `/`: V2 marketing page.
- `/privacy`: `privacy.html` metadata shell and `PrivacyPage.tsx`.
- `/terms`: `terms.html` metadata shell and `TermsPage.tsx`.
- `/api/waitlist`: Vercel function that validates an email, stores it in a Resend
  audience when configured, and sends an administrative signup notification.

The waitlist requires `RESEND_API_KEY`; `RESEND_AUDIENCE_ID` and
`WAITLIST_NOTIFY_EMAIL` are optional environment variables.

## Brand and public identity

- `public/logo.png`: source heart mark.
- `public/brand-mark-192.png`: transparent UI mark.
- `public/icon-*.png`, `apple-touch-icon.png`, `favicon-*.png`: install/browser icons.
- `public/inperson-share-v3-2026.png`: 1200x630 social-link preview.
- `public/site.webmanifest`: installable web-app identity.
- `public/robots.txt` and `public/sitemap.xml`: crawler discovery.
- `scripts/generate-site-assets.mjs`: regenerates the social card and icon set.

Run `npm run generate:assets` after changing the source logo, share-card copy, or
install background color, then commit the generated assets.

## SEO, privacy, and analytics

The three HTML entry files contain route-specific titles, descriptions, canonicals,
Open Graph/Twitter metadata, JSON-LD, icons, fonts, and pre-React splash markup.

- Canonical public origin: `https://tryinperson.com`
- Analytics: Vercel Analytics only.
- Fonts: Google Fonts (Spectral and Instrument Sans), disclosed in the privacy policy.
- Waitlist processing: Vercel, Resend, and the private administrative mailbox path
  described in `PrivacyPage.tsx`.

Do not add trackers or change the waitlist data flow without updating the privacy
policy to match reality.

## Verification before any deployment

```powershell
npm run generate:assets
npx tsc --noEmit
npx --yes html-validate index.html privacy.html terms.html
npm audit --audit-level=high
npm run build
git diff --check
```

Also inspect desktop and 390px mobile renderings, confirm no horizontal overflow,
test the product-story tabs and FAQ disclosures, and verify that all legal and asset
routes return the expected status. A Vercel preview is not production; do not use
`--prod` for concept review.
