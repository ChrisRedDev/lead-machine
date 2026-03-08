
# Plan: Smart Onboarding + Brand Overview AI + Enhanced Dashboard

## What currently exists
- `DashboardResearch.tsx` — a static form that saves profile data, but AI does nothing with it. No actual "brand analysis."
- `Dashboard.tsx` (generate page) — good form with social links, auto-fills from profile, good results cards.
- `DashboardHome.tsx` — solid overview with real data.
- No onboarding flow for new users — they land on dashboard with empty state.
- The generate-leads edge function uses Perplexity to find leads, but does a single-step process.

## Core Improvements

### 1. Onboarding Flow (new)
**New file: `src/pages/Onboarding.tsx`**
- Multi-step wizard (3 steps): 
  - Step 1: Company basics — name, website URL, what you do
  - Step 2: Social media links — Facebook, Instagram, LinkedIn
  - Step 3: Target market — location, industry, ideal client description
- Triggers AI "Brand Overview Analysis" after step 3 using Lovable AI
- Saves to `profiles` table
- Redirects to `/dashboard` after completion

**New edge function: `supabase/functions/analyze-brand/index.ts`**
- Accepts: company_url, company_name, description, social links
- Uses Perplexity `sonar-pro` to research the business from the URL
- Returns structured brand overview: `{ services, positioning, target_audience, value_proposition, market_summary, recommended_industries, recommended_locations }`
- Saves result to `profiles.company_description` as enriched text, plus new field `brand_analysis` (JSONB)

**Database migration**: Add `brand_analysis` JSONB column to `profiles` table.

**Flow**: 
- On login, check if profile has `company_url`. If not → redirect to `/onboarding`
- After onboarding → dashboard with brand overview already shown
- Protected route logic: `ProtectedRoute.tsx` or a new wrapper

**App.tsx**: Add `/onboarding` route (outside ProtectedRoute layout).

---

### 2. DashboardResearch.tsx — Real AI Brand Overview
Transform from a dumb form into a rich "Brand Intelligence" page:

- **Top section**: Show AI-generated brand overview card if `brand_analysis` exists:
  - Company summary, positioning, services, target audience chips, value prop highlight
  - "Last analyzed" timestamp
  - "Re-analyze" button that triggers edge function
- **Below**: Keep the edit form for updating info
- **Metrics section**: 
  - Website status indicator (connected/not)
  - Social channels connected count
  - Target market tags
  - ICP strength indicator (how complete the profile is, % score)

---

### 3. Generate Leads Page — Brand Context Injection
**Update `Dashboard.tsx`**:
- If user has `brand_analysis`, show a "Using your brand profile" header card at the top of the form — shows a miniaturized summary of the AI analysis being used
- Add a note: "AI will use your saved brand overview to find better leads"
- The brand analysis gets passed to the edge function automatically

**Update `generate-leads` edge function**:
- Accept an optional `brandAnalysis` field in the request body
- If present, inject it into the Perplexity prompt as context before finding leads
- This makes leads significantly more targeted

---

### 4. DashboardHome — Enhanced with Brand Status
- Add a "Brand Profile" completeness card (new in the overview grid)
- Show an onboarding checklist if profile is incomplete:
  - ✅ Account created
  - ✅/⬜ Website added
  - ✅/⬜ AI brand analysis done
  - ✅/⬜ First leads generated
- Animate the checklist items

---

### 5. DashboardSettings — Actually Save Profile Name
- Wire up the "Display Name" field to actually save `company_name` to profiles
- Add a "Company Profile" sub-section that links to `/dashboard/research`
- Show email as non-editable but with a note explaining magic link auth

---

## Files to Create
1. `src/pages/Onboarding.tsx` — multi-step wizard
2. `supabase/functions/analyze-brand/index.ts` — AI brand analysis edge function
3. `supabase/config.toml` — add `[functions.analyze-brand]` entry

## Files to Modify
1. `supabase/migrations/` — add `brand_analysis` JSONB column to profiles
2. `src/App.tsx` — add `/onboarding` route + smart redirect logic
3. `src/contexts/AuthContext.tsx` — expose profile data or add `hasProfile` check
4. `src/pages/DashboardResearch.tsx` — full AI brand overview UI
5. `src/pages/Dashboard.tsx` — inject brand context into lead gen
6. `src/pages/DashboardHome.tsx` — brand completeness card + onboarding checklist
7. `src/pages/DashboardSettings.tsx` — wire up name save
8. `src/components/ProtectedRoute.tsx` — optionally check onboarding completion
9. `supabase/functions/generate-leads/index.ts` — accept + use `brandAnalysis`

## Technical Details

### Database migration (one migration)
```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS brand_analysis jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name text;
-- company_name already exists, so just brand_analysis is needed
```
Actually checking the schema: `company_name` already exists. Only `brand_analysis` is missing.

### analyze-brand edge function
Uses Perplexity `sonar-pro` to research the company URL. Prompt:
> "Research this business: [url]. Description: [desc]. Social: [links]. Return a structured JSON with: services (array), positioning (string), target_audience (array of segments), value_proposition (string), market_summary (string 2-3 sentences), recommended_industries (array), recommended_locations (array)"

Uses Lovable AI (gemini-3-flash-preview) to structure the output if JSON parse fails (same fallback pattern as generate-leads).

### Onboarding redirect logic
In `App.tsx`, wrap the dashboard with a component that checks if `profile.company_url` is null, and redirects to `/onboarding`. The onboarding route is outside the dashboard layout but inside `AuthProvider`.

### Brand overview passed to lead generation
`Dashboard.tsx` fetches `profile.brand_analysis` on mount (alongside the rest of profile). When generating, passes it as `brandAnalysis` in the edge function body. Edge function includes it in the Perplexity prompt as additional context.

### config.toml addition
```toml
[functions.analyze-brand]
verify_jwt = false
```

## Summary of user-visible improvements
- New users go through a beautiful 3-step onboarding wizard
- AI automatically analyzes their business from URL/social links
- Research page shows rich brand intelligence cards (not just a form)
- Lead generation is smarter — uses brand analysis context
- Dashboard home shows profile completeness + onboarding progress
