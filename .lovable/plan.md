
## Plan: AI Support Chatbot

### What the user wants
Add a live AI-powered support chatbot with a knowledge base about the product — accessible from everywhere on the site (landing page + dashboard). The chatbot should use the already-configured `LOVABLE_API_KEY` via the Lovable AI Gateway.

### Current state
- `LOVABLE_API_KEY` is already in secrets — AI gateway is ready
- `contact-ai` edge function exists (one-shot acknowledgment, not a conversational chat)
- No chatbot widget exists anywhere
- All edge functions use `verify_jwt = false`

### What to build

#### 1. New edge function: `support-chat`
Streaming chat function with a rich system prompt (product knowledge base):
- What LeadMachine AI is and how it works
- Pricing plans: Growth ($79/mo), Pro ($299/mo), Basic (free — 10 credits)
- Features: lead generation, brand analysis, pipeline, campaigns, exports, credits
- How to get started, common issues, FAQ answers
- Polite escalation to `/contact` for complex issues

#### 2. Chat widget component: `SupportChatWidget.tsx`
A floating bubble button (bottom-right) that expands into a chat panel:
- Animated open/close with framer-motion
- Message list with user/assistant bubbles
- Streaming token-by-token rendering
- Typing indicator
- Quick-start suggestion chips (e.g. "How do I generate leads?", "What are the pricing plans?")
- Graceful 429/402 error handling

#### 3. Wire it globally
Mount `SupportChatWidget` in `App.tsx` outside of routes — renders on every page (landing + dashboard).

#### 4. Register function in `config.toml`

---

### Files to create/edit

```text
supabase/functions/support-chat/index.ts   [NEW]
src/components/SupportChatWidget.tsx        [NEW]
src/App.tsx                                 [EDIT — add widget]
supabase/config.toml                        [EDIT — add function entry]
```

### Knowledge base (system prompt topics)
- Product overview: B2B lead generation SaaS, AI-powered
- How it works: 4 steps (Scan URL → AI Analysis → Get Leads → Outreach)
- Plans: Basic (50 credits free), Growth ($79/mo), Pro ($299/mo)
- Credits: 1 credit = 1 lead generation run, starting balance 50
- Features list: Generate leads, Brand research, Pipeline kanban, Campaigns, Exports (CSV/JSON), Analytics, Team, Integrations, Settings
- Common questions: how to generate leads, how to add company URL, how to export, billing/cancellation
- Escalation: for account issues → /contact

### Technical approach
- Edge function: SSE streaming, `verify_jwt = false`, reads `LOVABLE_API_KEY`
- Frontend: `fetch()` directly to Supabase Functions URL with SSE parsing, no SDK (streaming requires direct fetch)
- State: local React state only (no DB persistence needed for chat sessions)
- No new DB table needed
