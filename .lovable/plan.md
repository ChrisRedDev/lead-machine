

# LeadMachine AI — Implementation Plan

**Tagline: "One Click. Infinite Opportunities."**

A modern AI-powered SaaS that generates targeted B2B leads from a single company URL input.

---

## Phase 1: Foundation & Design System

### Dark-mode SaaS Shell
- Set up a dark-mode-first design system with neon blue/purple gradients, glassmorphism cards, and smooth animations
- Create the app shell with sidebar navigation (Generate Leads, Previous Exports, Usage Credits, Settings)
- Mobile-responsive layout with clean SaaS aesthetic
- Branding: "LeadMachine AI" logo, tagline, futuristic AI-inspired design language

### Landing / Marketing Page
- Hero section with tagline and CTA
- Feature highlights and how-it-works steps
- Pricing preview (Basic / Pro / Agency)

---

## Phase 2: Authentication & Database

### Supabase Setup
- Enable Lovable Cloud with Supabase
- Magic link email authentication
- User profiles table (company info, preferences)
- Credits table to track usage per user
- Leads/exports table to store generated results
- Row-level security on all tables

### Auth Flow
- Clean login page with magic link input
- Post-login redirect to dashboard
- Onboarding flow for first-time users

---

## Phase 3: Onboarding & Lead Generation Form

### Onboarding Form (Step 1)
- Multi-field form with:
  - Company website URL (required)
  - Short company description (required)
  - Target location (optional)
  - Target industry (optional)
  - Ideal client description (optional)
- Clean, minimal form design with glassmorphism cards
- Validation and helpful placeholders

---

## Phase 4: AI Business Analysis Engine

### Website Scraping (Firecrawl)
- Use Firecrawl connector to scrape the user's company website
- Extract services, value propositions, and business context

### AI Analysis (Lovable AI)
- Send scraped content to AI to:
  - Identify services offered
  - Define Ideal Customer Profile (ICP)
  - Extract niche positioning
  - Generate target keywords and industries
- Display analysis results in a summary card before lead generation

---

## Phase 5: Lead Generation Engine

### Perplexity-Powered Research
- Use Perplexity connector to search for companies matching the ICP
- Query public business directories and databases
- Structure results into: Company Name, Contact Person, Role, Website, Email, Phone, Industry, Fit Reason

### One-Click Experience
- Single "Generate Leads" button after onboarding
- Cinematic animated loading screen with progressive status messages:
  - "AI analyzing your website…"
  - "Finding ideal customer profile…"
  - "Scanning market…"
  - "Matching best prospects…"
- Glowing gradient animations with progress states

---

## Phase 6: Results Dashboard & Export

### Lead Results Table
- Preview generated leads in a paginated, sortable data table
- Columns: Company, Contact, Role, Website, Email, Phone, Industry, Fit Reason
- Search and filter capabilities

### Export
- One-click CSV download
- Store exports in database for future access

### Previous Exports
- Dashboard section showing past generations
- Re-download or view previous results
- Timestamps and lead counts

---

## Phase 7: Credit System & Billing

### Credit System
- Each lead generation consumes credits
- Display remaining credits in dashboard header
- Warning when credits are low

### Stripe Integration
- Three pricing tiers: Basic / Pro / Agency
- Stripe checkout for plan upgrades
- Credits automatically added on purchase
- Billing management page

---

## Phase 8: Polish & Performance

### UI Polish
- Smooth page transitions and micro-animations
- Loading skeletons throughout
- Toast notifications for all actions
- Mobile-first responsive testing

### Settings Page
- Account settings
- API preferences
- Notification preferences

