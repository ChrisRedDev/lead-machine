

# Fix: Edge Function "generate-leads" Crash

## Problem

The edge function crashes with `supabaseKey is required` because it references an environment variable called `SUPABASE_PUBLISHABLE_KEY` which does not exist. The correct secret name is `SUPABASE_ANON_KEY`.

## Fix

**File: `supabase/functions/generate-leads/index.ts`** (line 31)

Change:
```typescript
Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!
```
To:
```typescript
Deno.env.get("SUPABASE_ANON_KEY")!
```

This is a one-line fix. No other changes needed.

## Technical Details

The secrets configured in the backend include `SUPABASE_ANON_KEY` but not `SUPABASE_PUBLISHABLE_KEY`. The edge function uses a second Supabase client (with the anon key) solely to verify the user's JWT token -- the service role client is already correctly configured on line 24-25.

