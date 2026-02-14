

# Major Upgrade: AI Deep Research, Image Generation, Enhanced UI & Animations

A comprehensive overhaul covering new AI research functionality, AI-generated images for the landing page, lower prices, richer animations, and a beautiful results display with export capabilities.

---

## 1. AI Business Research Feature (New Core Feature)

**New Dashboard Form Fields** in `src/pages/Dashboard.tsx`:
- Add input fields for social media links: Facebook URL, Instagram URL, LinkedIn URL
- Add a "website URL" field (already exists) that AI will scrape/research
- When user submits, AI first does a "deep research" phase analyzing the business from all provided links
- Then uses that understanding to find matching clients across various portals

**New Edge Function: `supabase/functions/generate-leads/index.ts`** (update existing):
- Phase 1: Use Perplexity `sonar-pro` with a research prompt to analyze the business from the provided URLs (website, Facebook, Instagram, LinkedIn)
- Phase 2: Use the business understanding to search for ideal clients with deep research using `sonar-deep-research` or `sonar-pro`
- Return structured leads with AI match scores, detailed fit reasons, and business context
- Add `score` field to each lead (0-100)

**Database update**: Add columns to `profiles` table:
- `facebook_url` (text, nullable)
- `instagram_url` (text, nullable)  
- `linkedin_url` (text, nullable)

---

## 2. AI-Generated Images for Landing Page

**New Edge Function: `supabase/functions/generate-images/index.ts`**:
- Uses Lovable AI (`google/gemini-2.5-flash-image`) to generate images
- Generates hero dashboard mockup, feature icons, and section illustrations

**However, since image generation is slow and expensive at runtime**, a better approach:
- Generate images once and store them as static assets
- Create a set of custom SVG illustrations and gradient icon components instead
- Build reusable `<GradientIcon>` components for features section

**New file: `src/components/landing/illustrations/`**:
- `HeroIllustration.tsx` -- animated SVG dashboard mockup with gradient fills
- `FeatureIcons.tsx` -- 4 custom animated SVG icons for each feature step
- `BackgroundEffects.tsx` -- floating gradient orbs, animated mesh gradient

---

## 3. Beautiful Results Display

**Update `src/pages/Dashboard.tsx`**:
- Each lead displayed as an expandable card (not just a table row)
- Card shows: company logo placeholder (colored initial), name, contact, role, AI match score as a radial progress indicator
- Expandable section shows: fit reason, website link, email, phone, industry
- Color-coded score badges: green (90+), blue (80-89), amber (70-79)
- "New" animated badge with a pulse effect
- Summary stats cards at top with animated counters
- Smooth staggered card entrance animations

**Export options**:
- CSV download (already exists, keep)
- Add JSON export button
- Add "Copy all emails" button
- Each lead card has individual copy/share actions

---

## 4. Lower Prices

**Update `src/i18n/locales/en.json`** (and other locale files):
- Growth: $129 -> $79 per generation
- Pro: $499/mo -> $299/mo  
- Annual Growth: $103 -> $63
- Annual Pro: $399 -> $239
- Update unlock CTA: "$129" -> "$79"

**Update `src/pages/DashboardBilling.tsx`**:
- Growth: $129/mo -> $79/mo
- Pro: $499/mo -> $299/mo

---

## 5. Enhanced Animations

**Update `tailwind.config.ts`** -- add new keyframes:
- `float` -- gentle up-down floating for decorative elements
- `shimmer` -- subtle shine effect for premium cards
- `pulse-soft` -- gentle opacity pulse
- `slide-up` -- entrance animation for cards
- `gradient-shift` -- animated gradient background movement
- `count-up` -- for number animations

**Update `src/index.css`** -- add utility classes:
- `.animate-float` -- floating animation
- `.animate-shimmer` -- shine sweep effect
- `.animate-gradient` -- moving gradient background
- `.hover-lift` -- smooth lift on hover with shadow

**Component-level animations using framer-motion**:
- Staggered card entrances on all sections
- Smooth page transitions between dashboard views
- Parallax-like scroll effects on hero section
- Animated gradient mesh background on hero
- Typewriter effect on hero headline
- Number counting animations on stats (already exists, enhance)
- Hover micro-interactions on all interactive elements
- Smooth accordion expand for lead detail cards

---

## 6. Landing Page UI Improvements

### Hero Section (`src/components/landing/HeroSection.tsx`):
- Add animated gradient mesh background (CSS only, no canvas)
- Add floating abstract shapes with `animate-float`
- Typewriter-style headline animation
- Animated badge with shimmer effect
- Better "trusted by" section with animated company logos sliding

### Features Section (`src/components/landing/FeaturesSection.tsx`):
- Replace simple icons with custom gradient SVG illustrations
- Add connecting dotted line between steps (desktop)
- Hover effects with card background color shift
- Step number circles with gradient fills

### Demo Preview (`src/components/landing/DemoPreview.tsx`):
- Add animated "scanning" effect on table rows
- Shimmer loading skeleton before data appears
- Score badges with animated fill
- Pulsing lock icon

### Pricing Section (`src/components/landing/PricingSection.tsx`):
- Featured card with animated gradient border
- Hover scale effect on cards
- Animated checkmarks appearing one by one
- "Popular" badge with shimmer

### Social Proof (`src/components/landing/SocialProof.tsx`):
- Auto-scrolling testimonial carousel on mobile
- Hover card lift with shadow
- Animated quote marks

### CTA Banner (`src/components/landing/CTABanner.tsx`):
- Animated gradient background shift
- Floating sparkle particles (CSS-only)
- Pulsing CTA button

---

## 7. Dashboard Panel Improvements

### New sidebar item: "AI Research" in `src/components/dashboard/DashboardSidebar.tsx`
- Add a new nav item for a dedicated "Business Research" page
- Shows AI's understanding of the user's business

### New page: `src/pages/DashboardResearch.tsx`
- Shows the AI's analysis of the user's business
- Displays extracted info: what the business does, target audience, positioning
- Social media links with status indicators
- "Re-analyze" button to refresh AI understanding
- Visual cards showing business profile

### Update `src/App.tsx`:
- Add route for `/dashboard/research`

### Update exports page with better cards:
- Each export card shows a mini chart of score distribution
- Animated list entrance

---

## Technical Details

### Files to Create:
1. `src/pages/DashboardResearch.tsx` -- AI business research page
2. `src/components/landing/illustrations/HeroIllustration.tsx` -- animated SVG hero
3. `src/components/landing/illustrations/FeatureIcons.tsx` -- gradient feature icons  
4. `src/components/landing/illustrations/BackgroundEffects.tsx` -- animated gradient effects

### Files to Modify:
1. `src/index.css` -- new animation utilities, gradient mesh
2. `tailwind.config.ts` -- new keyframes and animations
3. `src/components/landing/HeroSection.tsx` -- gradient mesh bg, floating shapes, typewriter
4. `src/components/landing/FeaturesSection.tsx` -- custom icons, connecting lines
5. `src/components/landing/DemoPreview.tsx` -- scanning effect, better scores
6. `src/components/landing/PricingSection.tsx` -- lower prices, animated border, shimmer
7. `src/components/landing/SocialProof.tsx` -- carousel, hover effects
8. `src/components/landing/CTABanner.tsx` -- animated gradient, sparkles
9. `src/components/landing/StatsCounter.tsx` -- enhanced animations
10. `src/components/landing/Navbar.tsx` -- scroll-based transparency
11. `src/pages/Dashboard.tsx` -- social media inputs, card-based results, better export
12. `src/pages/DashboardExports.tsx` -- enhanced cards
13. `src/pages/DashboardBilling.tsx` -- lower prices
14. `src/components/dashboard/DashboardSidebar.tsx` -- add Research nav item
15. `src/components/dashboard/DashboardMobileNav.tsx` -- add Research nav item
16. `src/App.tsx` -- add research route
17. `src/i18n/locales/en.json` -- lower prices, new keys for research
18. `src/i18n/locales/pl.json` -- Polish translations for new features
19. `src/i18n/locales/de.json`, `es.json`, `fr.json` -- translations
20. `supabase/functions/generate-leads/index.ts` -- enhanced AI prompt with social links

### Database Migration:
- Add `facebook_url`, `instagram_url`, `linkedin_url` columns to `profiles` table

### No new dependencies needed
All animations use framer-motion (already installed) and CSS. SVG illustrations are hand-crafted components.

