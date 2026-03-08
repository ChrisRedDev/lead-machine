
# 10 pomysłów na ulepszenie aplikacji

After reviewing every page, edge function, and data model, here are 10 high-value improvements ranked from highest to lowest impact.

---

## 1. Stripe Billing — prawdziwe płatności za kredyty
**Gdzie:** `DashboardBilling.tsx`, `DashboardCredits.tsx`, nowa edge function `stripe-checkout`

Currently the "Upgrade" and "Buy More Credits" buttons do nothing. Real monetization is missing.

- Integrate Stripe Checkout — clicking "Upgrade" or "Buy More Credits" opens a Stripe-hosted payment page
- Webhook edge function receives payment confirmation and updates `credits.balance` and `credits.plan` in the database
- After successful payment, user is redirected back to the dashboard with updated credits
- Show real invoice history pulled from Stripe in the Billing page

**Impact:** Converts the app from a demo into a revenue-generating product.

---

## 2. Zapisywanie ulubionych leadów (Saved Leads / Favorites)
**Gdzie:** `Dashboard.tsx`, `DashboardExports.tsx`, `DashboardHome.tsx`, nowa tabela `saved_leads`

Currently leads exist only inside bulk exports (JSONB). Users cannot bookmark individual leads.

- Add a "star" / bookmark icon on every lead card in Generate results AND in the Exports detail view
- One click saves the lead to a new `saved_leads` table with their own notes field
- New "Saved Leads" section in `DashboardHome.tsx` sidebar or a full page at `/dashboard/saved`
- Saved leads can be added to pipeline or campaign with one click from anywhere

**Impact:** Transforms lead workflow — users can collect leads across multiple searches.

---

## 3. Real-time powiadomienie po zakończeniu generowania leadów
**Gdzie:** `Dashboard.tsx`, `supabase/functions/generate-leads`

The generate page requires the user to stay on it and watch the progress bar. If they navigate away, they lose the results and have to re-generate (costing credits).

- When a generation starts, save a pending job to a new `generation_jobs` table
- Edge function writes results to the `lead_exports` table immediately when done (already happens)
- Subscribe to Supabase Realtime on `lead_exports` in a global context (or sidebar)
- When a new row appears, show a toast "Your leads are ready! View results →" with a link, regardless of which page the user is on
- Also add a badge indicator on the sidebar "Generate" icon when a job is running

**Impact:** Eliminates user anxiety during the ~30s wait. They can browse the rest of the dashboard.

---

## 4. Wyszukiwanie i filtrowanie w Exports
**Gdzie:** `DashboardExports.tsx`

Currently Exports has a search bar but it only filters export names, not the leads inside them. When a user has 500 leads across 10 exports, there's no way to find "all SaaS leads with score >85".

- Add a "Search within leads" mode: enter a company name, role, or email — searches across all exports' JSONB leads data
- Add filter chips: Industry, Score range (80+, 90+), Has Email, Has Phone
- Add column sorting in the lead table inside an export (click column header to sort by score, company name, etc.)
- Show a count of filtered results vs total

**Impact:** Dramatically improves usability for power users with many exports.

---

## 5. AI Lead Enrichment — dogłębne info o konkretnym leadzie
**Gdzie:** `Dashboard.tsx`, `DashboardPipeline.tsx`, nowa edge function `enrich-lead`

Each lead card shows only what Perplexity returns initially. No ability to dig deeper.

- Add an "Enrich" button on lead cards in both Generate results and Pipeline
- Clicking triggers a new `enrich-lead` edge function (uses Perplexity) to research that specific company in depth: recent news, funding, company size, LinkedIn profiles of key people, tech stack used, buying signals
- Shows enriched data in an expanded side panel or modal
- Costs 1 credit per enrichment
- Save enrichment result to the pipeline card's `notes` field for persistence

**Impact:** Turns a surface-level lead list into actionable intelligence per lead.

---

## 6. Kampanie — śledzenie otwarć + "Mark as Replied"
**Gdzie:** `DashboardCampaigns.tsx`

Campaigns currently let users mark leads as "contacted" but there's no deeper tracking. The campaign view doesn't distinguish between "sent but no reply" vs "replied" vs "not interested".

- Add 3 statuses per campaign lead: `not_contacted` → `contacted` → `replied` / `not_interested`
- Replace the binary "contacted" toggle with a 4-button status selector per lead row
- Show a funnel chart in the campaign detail header: X contacted → Y replied → Z converted
- Add a "Last Activity" date column to campaign lead rows
- "Replied" leads get a green highlight; "Not interested" get a grey strikethrough style

**Impact:** Makes the campaigns section actually useful as a lightweight outreach tracker.

---

## 7. Pipeline — notatki per lead jako timeline aktywności
**Gdzie:** `DashboardPipeline.tsx`

The Pipeline Kanban has a "notes" field but it's a single text blob. There's no history of activity.

- Replace single notes textarea with an activity feed per card
- Each note entry has timestamp + text (stored as JSONB array in `lead_pipeline.notes`)
- When user adds a note, it prepends to the feed with "Today at 14:32"
- Auto-generate system events when stage changes: "Moved to Contacted on Mar 8"
- Show a note count badge on each Kanban card
- Add a "Last activity" date to each card for quick scanning

**Impact:** Makes the pipeline feel like a real mini-CRM instead of a static board.

---

## 8. Dark mode toggle w ustawieniach
**Gdzie:** `DashboardSettings.tsx`, `src/index.css`, `tailwind.config.ts`

The app has `next-themes` installed but there's no UI to toggle dark/light mode. The app appears to use dark mode only.

- Add a Theme selector in Settings: Dark / Light / System
- Use the already-installed `next-themes` `ThemeProvider` and `useTheme` hook
- Add proper `light` variant CSS variables in `index.css` (complementing the existing dark ones)
- Place a quick-toggle icon button in the `DashboardHeader` top-right area for convenience

**Impact:** Major UX quality-of-life improvement. Many users prefer light mode.

---

## 9. Team — prawdziwa funkcjonalność zapraszania
**Gdzie:** `DashboardTeam.tsx`, nowe tabele `team_invites`, RLS policies

The Team page shows hardcoded mock data (John Doe, Sarah Smith) that never changes. Inviting someone shows only a toast.

- Create a `team_members` table (user_id, owner_id, role) and a `team_invites` table (email, token, status)
- Invite flow sends a real invitation email (using existing magic link auth as the invite mechanism)
- Invited user lands on a special `/invite/:token` page, signs up/in, and is linked to the team
- Show real team members from the database instead of hardcoded data
- Owner can change roles and remove members

**Impact:** Enables actual team usage of the product — essential for B2B growth.

---

## 10. Export do Google Sheets / direct email via mailto batch
**Gdzie:** `DashboardExports.tsx`, `DashboardCampaigns.tsx`

Currently the only export option is CSV download. There's no direct path from lead list to outreach.

- Add "Open in Google Sheets" button: generates a Google Sheets URL with all lead data pre-encoded as a query string (no API needed — uses Sheets' `importdata` URL trick or the existing CSV download + a Sheets import guide)
- Add "Send via Email Client" batch action in Campaigns: select multiple leads → generates a `mailto:` link with all emails in BCC and the campaign subject/body pre-filled
- Add export to JSON format alongside CSV (useful for developers and Zapier workflows)
- Add a "Copy all emails" button in the export detail view — copies all emails from that export separated by commas

**Impact:** Closes the loop between lead generation and outreach without requiring integrations.

---

## Which ones to build?

The 3 highest-impact improvements that build on each other:

1. **Stripe (#1)** — monetization first
2. **Real-time notifications (#3)** — UX problem affecting every user every time they generate
3. **Lead Enrichment (#5)** — product differentiator, justifies higher credit prices

The easiest quick wins:
- Dark mode (#8) — already has the library installed
- Export improvements (#10) — no backend needed
- Campaigns status tracking (#6) — just database + UI changes
