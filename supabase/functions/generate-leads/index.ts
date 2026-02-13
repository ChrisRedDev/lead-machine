import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!
    ).auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check credits
    const { data: creditData } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (!creditData || creditData.balance <= 0) {
      return new Response(JSON.stringify({ error: "No credits remaining. Please upgrade your plan." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { companyUrl, description, targetLocation, targetIndustry, idealClient } = await req.json();

    if (!companyUrl || !description) {
      return new Response(JSON.stringify({ error: "Company URL and description are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) {
      return new Response(JSON.stringify({ error: "Perplexity API not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build the research prompt
    const locationContext = targetLocation ? `in ${targetLocation}` : "";
    const industryContext = targetIndustry ? `in the ${targetIndustry} industry` : "";
    const clientContext = idealClient ? `Ideal client: ${idealClient}.` : "";

    const prompt = `I need to find potential B2B clients for a company. Here are the details:

Company website: ${companyUrl}
What they do: ${description}
${clientContext}

Find 10 real companies ${locationContext} ${industryContext} that would be ideal customers for this business. For each company, provide:
1. Company Name
2. Contact Person (a real decision-maker if findable, otherwise the likely title)
3. Their Role/Title
4. Company Website
5. Public Email (only publicly available)
6. Phone (if publicly available)
7. Industry
8. A short reason (1-2 sentences) why they're a good fit

Only include real, existing companies with publicly available information. Format as a JSON array with keys: company_name, contact_person, role, website, email, phone, industry, fit_reason`;

    const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: "You are a B2B lead research assistant. Always return valid JSON arrays. Only include real companies with publicly available information. Never fabricate contact details.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!perplexityResponse.ok) {
      const errText = await perplexityResponse.text();
      console.error("Perplexity error:", perplexityResponse.status, errText);

      if (perplexityResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Failed to generate leads. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const perplexityData = await perplexityResponse.json();
    const content = perplexityData.choices?.[0]?.message?.content || "";

    // Parse the JSON from the response
    let leads = [];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        leads = JSON.parse(jsonMatch[0]);
      }
    } catch (parseErr) {
      console.error("Failed to parse leads:", parseErr);
      // Use AI to structure it
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (LOVABLE_API_KEY) {
        const structureResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content: "Extract lead data from the text and return ONLY a JSON array with objects having keys: company_name, contact_person, role, website, email, phone, industry, fit_reason. No other text.",
              },
              { role: "user", content },
            ],
          }),
        });

        if (structureResponse.ok) {
          const structureData = await structureResponse.json();
          const structuredContent = structureData.choices?.[0]?.message?.content || "";
          const jsonMatch2 = structuredContent.match(/\[[\s\S]*\]/);
          if (jsonMatch2) {
            leads = JSON.parse(jsonMatch2[0]);
          }
        }
      }
    }

    // Deduct credit
    await supabase
      .from("credits")
      .update({
        balance: creditData.balance - 1,
        total_used: (creditData as any).total_used + 1,
      })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ leads, count: leads.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generate leads error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
