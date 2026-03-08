import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { lead, brandAnalysis, senderCompany } = await req.json();

    if (!lead) {
      return new Response(JSON.stringify({ error: "Lead data required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const senderContext = brandAnalysis
      ? `
Sender company: ${senderCompany || "our company"}
Value proposition: ${brandAnalysis.value_proposition || ""}
Services: ${(brandAnalysis.services || []).slice(0, 3).join(", ")}
ICP: ${brandAnalysis.icp_description || ""}
Positioning: ${brandAnalysis.positioning || ""}
`
      : `Sender company: ${senderCompany || "our company"}`;

    const systemPrompt = `You are an expert B2B cold email copywriter. Write concise, highly personalized cold emails that:
- Are 80-120 words maximum (3-4 short paragraphs)
- Lead with a specific, genuine observation about the recipient's company
- Connect the sender's value to the recipient's specific situation
- Have ONE clear, low-friction CTA (e.g., "Would a 15-min call make sense?")
- Sound human, never corporate or salesy
- Never use generic openers like "I hope this finds you well"
- Use the contact's first name only, never full name
Format: Return ONLY the email body (no subject line, no metadata). Start directly with the greeting.`;

    const userPrompt = `Write a cold email with these details:

RECIPIENT:
- Company: ${lead.company_name}
- Contact: ${lead.contact_person || "the team"}
- Role: ${lead.role || "decision maker"}
- Industry: ${lead.industry || "their industry"}
- Why they're a good fit: ${lead.fit_reason || "they match our ideal customer profile"}

SENDER:
${senderContext}

Write the email body only. Be specific, personal, and concise.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "Failed to generate email. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const emailBody = data.choices?.[0]?.message?.content?.trim() || "";

    // Generate subject line separately
    const subjectResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: "Generate 3 different cold email subject lines. Return as a JSON array of strings. No markdown. Just the JSON array.",
          },
          {
            role: "user",
            content: `Email recipient: ${lead.contact_person || "contact"} at ${lead.company_name} (${lead.role || "decision maker"}).\nEmail body:\n${emailBody}\n\nReturn 3 subject line options as JSON array.`,
          },
        ],
        temperature: 0.8,
      }),
    });

    let subjectLines: string[] = [`Quick question, ${(lead.contact_person || "").split(" ")[0] || lead.company_name}`];
    if (subjectResponse.ok) {
      const subjectData = await subjectResponse.json();
      const subjectContent = subjectData.choices?.[0]?.message?.content?.trim() || "";
      try {
        const match = subjectContent.match(/\[[\s\S]*\]/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed) && parsed.length > 0) subjectLines = parsed;
        }
      } catch {
        // use default
      }
    }

    return new Response(JSON.stringify({ email_body: emailBody, subject_lines: subjectLines }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Compose email error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
