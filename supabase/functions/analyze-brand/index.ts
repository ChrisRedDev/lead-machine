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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = authHeader.replace("Bearer ", "");
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { company_url, company_name, description, facebook_url, instagram_url, linkedin_url, target_location, target_industry } = await req.json();

    if (!company_url && !description) {
      return new Response(JSON.stringify({ error: "Company URL or description required" }), {
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

    const socialLinks: string[] = [];
    if (facebook_url) socialLinks.push(`Facebook: ${facebook_url}`);
    if (instagram_url) socialLinks.push(`Instagram: ${instagram_url}`);
    if (linkedin_url) socialLinks.push(`LinkedIn: ${linkedin_url}`);
    const socialContext = socialLinks.length > 0 ? `\nSocial profiles:\n${socialLinks.join("\n")}` : "";
    const locationContext = target_location ? `Target market location: ${target_location}.` : "";
    const industryContext = target_industry ? `Target industry: ${target_industry}.` : "";

    const prompt = `Deeply research this business and return a structured brand analysis.

Company website: ${company_url || "not provided"}
Company name: ${company_name || "unknown"}
Description: ${description || "not provided"}
${socialContext}
${locationContext}
${industryContext}

Research the website and any available information about this company. Then return a JSON object with these exact keys:
- services: array of strings (3-6 core services/products the company offers)
- positioning: string (1-2 sentences on market positioning and brand voice)
- target_audience: array of strings (3-5 specific audience segments they serve)
- value_proposition: string (the unique value they deliver in 1 sentence)
- market_summary: string (2-3 sentences summarizing the business, market fit, and opportunity)
- recommended_industries: array of strings (4-6 industries where they should find B2B clients)
- recommended_locations: array of strings (3-5 geographic markets that make sense based on the business)
- strengths: array of strings (3-4 competitive strengths or differentiators)
- icp_description: string (ideal customer profile description in 1-2 sentences)

Return only valid JSON, no markdown.`;

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
            content: "You are a brand intelligence analyst. Research businesses from their website and social profiles, then return structured JSON analysis. Return only valid JSON with no markdown formatting.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!perplexityResponse.ok) {
      const errText = await perplexityResponse.text();
      console.error("Perplexity error:", perplexityResponse.status, errText);
      return new Response(JSON.stringify({ error: "Failed to analyze brand. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const perplexityData = await perplexityResponse.json();
    const content = perplexityData.choices?.[0]?.message?.content || "";

    let brandAnalysis: any = null;
    try {
      // Try direct JSON parse first
      brandAnalysis = JSON.parse(content);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          brandAnalysis = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Failed to parse brand analysis JSON:", e);
        }
      }
    }

    // Fallback: use Lovable AI to structure the output
    if (!brandAnalysis) {
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
                content: "Extract brand analysis data from the text and return ONLY a JSON object with keys: services (array), positioning (string), target_audience (array), value_proposition (string), market_summary (string), recommended_industries (array), recommended_locations (array), strengths (array), icp_description (string). No other text.",
              },
              { role: "user", content },
            ],
          }),
        });

        if (structureResponse.ok) {
          const structureData = await structureResponse.json();
          const structuredContent = structureData.choices?.[0]?.message?.content || "";
          try {
            const jsonMatch2 = structuredContent.match(/\{[\s\S]*\}/);
            if (jsonMatch2) brandAnalysis = JSON.parse(jsonMatch2[0]);
          } catch (e) {
            console.error("Fallback parse also failed:", e);
          }
        }
      }
    }

    if (!brandAnalysis) {
      return new Response(JSON.stringify({ error: "Could not parse brand analysis. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save brand_analysis to profile
    await supabaseAdmin
      .from("profiles")
      .update({ brand_analysis: brandAnalysis })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ brand_analysis: brandAnalysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Analyze brand error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
