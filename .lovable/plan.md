
## What I Found

### Root Cause of the Edge Function Error
Line 31 in `supabase/functions/generate-leads/index.ts` uses `Deno.env.get("SUPABASE_PUBLISHABLE_KEY")` — but the secret stored is named `SUPABASE_ANON_KEY`. This causes the Supabase client constructor to throw `supabaseKey is required`, crashing the function with a 500 before it even gets to the AI logic.

### UI Issues to Fix
1. **Dashboard form** pre-fills from saved profile on `DashboardResearch` page but NOT on `Dashboard.tsx` generate page — so users re-type everything every time
2. **DashboardHome** uses 100% mock/hardcoded data — should pull real data from `lead_exports` and `credits`
3. **Results cards** show a flat score badge but no visual progress ring
4. **Generating screen** is fullscreen overlay — should instead be inline within the dashboard layout (sidebar is hidden behind it)
5. **HeroSection** floating shapes reference `animate-float-delayed` which may not exist in Tailwind config
6. The **edge function** deducts a credit even if Perplexity returns zero leads — this wastes user credits on failed calls

---

## Plan

### 1. Fix the Edge Function (Critical)
**File:** `supabase/functions/generate-leads/index.ts`

- Line 31: `SUPABASE_PUBLISHABLE_KEY` → `SUPABASE_ANON_KEY`
- Move credit deduction to AFTER successfully parsing at least 1 lead (not before) — prevents wasting credits on empty results
- Add a fallback: if Perplexity returns 0 leads, return a clear error without deducting credits

### 2. Auto-fill Form from Saved Profile
**File:** `src/pages/Dashboard.tsx`

- On mount, fetch the user's profile from Supabase and pre-populate `companyUrl`, `description`, `targetLocation`, `targetIndustry`, `idealClient`, `facebookUrl`, `instagramUrl`, `linkedinUrl`
- Show a small "Profile loaded" pill at the top of the form
- Add a "Save this as default" checkbox to update the profile after generation

### 3. Fix Generating Screen (No More Fullscreen Takeover)
**File:** `src/pages/Dashboard.tsx`

- Replace `fixed inset-0 z-50` with an inline card inside the dashboard layout
- Add a proper animated circular progress indicator (SVG ring) instead of just a linear progress bar
- Show the current step with a staggered list of all steps (completed ones checked, current one animated)

### 4. Enhance Lead Result Cards
**File:** `src/pages/Dashboard.tsx`

- Add a proper radial SVG score ring on each lead card (like a donut chart arc colored by score)
- Show industry as a colored pill tag
- Add a direct "Visit Website" external link button that opens in new tab
- "Copy email" button works on click without expanding the card

### 5. Real Data in Dashboard Home
**File:** `src/pages/DashboardHome.tsx`

- Replace mock `stats` array with real queries:
  - Total leads: `SELECT SUM(lead_count) FROM lead_exports WHERE user_id = ?`
  - Total exports: count of rows in `lead_exports`
- Replace mock lead list with the most recent export's leads (real data from `lead_exports` table, latest entry, first 6 rows)
- Keep the chart as-is (decorative) but update the stat numbers below it to match real data

### 6. Hero Section Animation Fix
**File:** `src/index.css` + `tailwind.config.ts`

- Ensure `animate-float-delayed` keyframe exists (it's used in HeroSection but may be missing from the config)
- Add a clean `float-delayed` animation that is offset by 2s

### 7. Export Page — Add Score Column
**File:** `src/pages/DashboardExports.tsx`

- When viewing a saved export in detail view, add a "Score" column to the table
- Add color-coded score badges (green/blue/amber) matching the Dashboard results view

---

## Files Changed

| File | Change |
|---|---|
| `supabase/functions/generate-leads/index.ts` | Fix `SUPABASE_ANON_KEY`, fix credit deduction timing |
| `src/pages/Dashboard.tsx` | Auto-fill from profile, inline generating screen, radial score ring |
| `src/pages/DashboardHome.tsx` | Real data from `lead_exports` + `credits` tables |
| `src/pages/DashboardExports.tsx` | Add score column with color coding |
| `src/index.css` | Ensure float-delayed animation exists |
| `tailwind.config.ts` | Add `float-delayed` animation entry if missing |

No new dependencies. No database migrations needed.
