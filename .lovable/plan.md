
# Improve Lead Generation Process & Onboarding

## Current Assessment

After reviewing all code, I see these concrete weak points:

### Onboarding Problems
1. **No real-time validation feedback** — company URL field accepts garbage input, no URL format check
2. **Analyzing phase blocks navigation** — the final "Analyzing your brand..." state redirects immediately to dashboard even while AI runs in background. Users land on dashboard with no brand analysis yet and no indication it's loading.
3. **No visual brand analysis preview after onboarding** — user goes straight to an empty dashboard with no confirmation that the AI ran
4. **Step 2 (social links) feels like a dead-end** — no indication of what AI actually does with these links
5. **No back navigation safety** — if user refreshes on step 2, they lose all entered data

### Lead Generation Problems
6. **Form has no smart suggestions** — target location/industry fields are plain text with zero guidance. User doesn't know what values work best.
7. **Brand analysis banner is passive** — shows value prop text but doesn't let user expand/inspect it inline on the generate page
8. **Generating screen timer is fixed at 2.5s per step** — if the API responds in 8 seconds, 3 steps are shown as done before the data arrives. If it takes 45 seconds, user sees the last step "done" but nothing happened.
9. **Results have no "Generate Again" shortcut** — the back button only says "← Generate Leads" which is confusing UX
10. **No AI-suggested improvements** — after leads are generated, no tips on how to get better results next time (e.g., "Add LinkedIn profile for 40% better match")
11. **Lead cards: score ring loads but no entrance animation** — they all appear at once, missing a staggered reveal
12. **No "copy all leads" / "add to campaign" quick action** in the results header
13. **ProtectedRoute re-fetches profile on every navigation** — causes a loading flash every time user clicks a menu item

### DashboardResearch Problems
14. **"Re-analyze" replaces analysis instantly** — no confirmation; accidental clicks can overwrite a good analysis
15. **Profile completeness pill tags are too small** — hard to read on mobile
16. **The "Save" and "Save & Analyze" buttons are side by side** — confusing which to click

---

## Plan

### 1. Onboarding — Smart URL validation + async AI feedback
**File: `src/pages/Onboarding.tsx`**

- Add URL format validation on the company URL field (must start with `http(s)://` or auto-prefix)
- On step transition from step 0 → 1, trigger a lightweight "website preview check" (just a visual ping, not a real fetch — show a green "✓ Website detected" badge if URL looks valid)
- Change the final submit flow: instead of redirecting immediately, show a proper **AI analyzing screen** inline within the onboarding card (animated, with step messages like "Reading your website... Building brand profile...") and only redirect when the `analyze-brand` call fully completes (with data)
- After success, redirect to `/dashboard/research` (not `/dashboard`) so user immediately sees their brand analysis
- Add `sessionStorage` backup of form data so refresh on step 2 doesn't lose data
- Add a "Why do we need this?" tooltip on the social links step

### 2. Lead Generation Form — Guided Input
**File: `src/pages/Dashboard.tsx`**

- **AI-recommended suggestions for location/industry**: When `brandAnalysis` exists and has `recommended_industries` / `recommended_locations`, show clickable suggestion chips below those fields. One click fills the input. E.g. "Suggested: SaaS · FinTech · E-commerce" as chips the user can click to auto-fill.
- **Expand brand context banner**: Make the brand analysis banner expandable (like the Research page card) — clicking it shows value prop + ICP description inline without leaving the page
- **Fix the progress timer**: Instead of a fixed 2.5s per step, use a smarter system — advance steps 1-3 on the timer, but hold the last step at "active" until the actual API response arrives. When the response comes, quickly animate through remaining steps then jump to results.
- **Results header**: Add "Generate New Search" as a clearly labeled primary action instead of a ghost button that says "← Generate Leads"
- **Post-generation tip card**: After results load, if brand analysis is missing, show a highlighted card: "💡 You could get better leads — add your LinkedIn profile and run an AI brand analysis first." with a link to `/dashboard/research`

### 3. Lead Cards — Better UX
**File: `src/pages/Dashboard.tsx`**

- Staggered entrance animation on each card (already has `delay: i * 0.04` but the `initial` state needs to be more dramatic — use `y: 20` and `opacity: 0` for a proper reveal)
- Add "Add to Pipeline" quick action button alongside "Write" on each card — one click adds that lead to `lead_pipeline` table with stage `new` and shows a toast. No modal needed.
- Show a phone icon quick-copy alongside email icon if `lead.phone` exists

### 4. DashboardResearch — Confirmation modal for re-analyze
**File: `src/pages/DashboardResearch.tsx`**

- Wrap the `handleAnalyze` call with a simple confirm: if `brandAnalysis` already exists, show an inline warning banner "This will replace your current analysis. Continue?" with Confirm/Cancel buttons before calling the edge function
- Improve the profile completeness section: replace tiny text chips with larger rows showing field name + filled/empty status with a "Fill in →" link pointing to the form section

### 5. ProtectedRoute — Cache profile check
**File: `src/components/ProtectedRoute.tsx`**

- Store the onboarding check result in `sessionStorage` after first check, so subsequent navigations don't re-trigger the profile fetch and loading flash
- Clear the sessionStorage cache on sign-out

---

## Files Changed

| File | Change |
|---|---|
| `src/pages/Onboarding.tsx` | URL validation, async AI wait screen, sessionStorage backup, redirect to research |
| `src/pages/Dashboard.tsx` | AI suggestion chips, smarter progress timer, Add to Pipeline action, better empty state tip |
| `src/pages/DashboardResearch.tsx` | Re-analyze confirmation, better completeness rows |
| `src/components/ProtectedRoute.tsx` | sessionStorage cache to eliminate loading flash |

No new edge functions. No database migrations needed. No new dependencies.
