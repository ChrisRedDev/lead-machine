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
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate AI acknowledgment
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a friendly customer support AI for LeadMachine AI, a B2B lead generation platform. Generate a brief, personalized acknowledgment response (2-3 sentences) to the customer's message. Be warm, professional, and mention their specific topic. Do NOT use markdown.",
          },
          {
            role: "user",
            content: `Name: ${name}\nSubject: ${subject}\nMessage: ${message}`,
          },
        ],
      }),
    });

    let aiText = "Thank you for reaching out! Our team will review your message and get back to you within 24 hours.";

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      aiText = aiData.choices?.[0]?.message?.content || aiText;
    } else if (aiResponse.status === 429) {
      console.error("AI rate limited");
    } else if (aiResponse.status === 402) {
      console.error("AI payment required");
    }

    // Save to database
    await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      ai_response: aiText,
    });

    return new Response(JSON.stringify({ success: true, ai_response: aiText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact AI error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
