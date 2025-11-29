import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

// Define CORS headers directly in the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY"));
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Function to get AI insights using Gemini
async function getAIInsights(description: string): Promise<{ summary: string; tags: string[] }> {
  const prompt = `
    Analyze the following citizen problem report. Provide a concise, one-sentence summary and a JSON array of 3-5 relevant keyword tags.
    The output must be a single, valid JSON object with two keys: "summary" and "tags". Do not include any other text or markdown formatting.

    Problem Description:
    "${description}"

    JSON Output:
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  if (!content) {
    throw new Error("Gemini returned no content.");
  }

  try {
    // Clean the response to ensure it's valid JSON
    const jsonString = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonString);
    return {
      summary: parsed.summary || "AI summary could not be generated.",
      tags: parsed.tags || [],
    };
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    console.error("Raw response from Gemini:", content);
    throw new Error("Invalid JSON response from Gemini.");
  }
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();

    // 1. We only want to process new problems
    if (!record || !record.id || !record.description) {
      return new Response(JSON.stringify({ error: "Invalid record provided." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // 2. Generate AI summary and tags
    console.log(`Processing problem ${record.id}: "${record.description}"`);
    const { summary, tags } = await getAIInsights(record.description);
    console.log(`Generated insights for ${record.id}:`, { summary, tags });

    // 3. Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("VITE_SUPABASE_URL") ?? "",
      Deno.env.get("VITE_SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 4. Update the problem record with the AI-generated data
    console.log(`Updating problem ${record.id} in Supabase.`);
    const { error: updateError } = await supabaseAdmin
      .from("problems")
      .update({
        ai_summary: summary,
        ai_tags: tags,
      })
      .eq("id", record.id);

    if (updateError) {
      console.error(`Failed to update problem ${record.id}:`, updateError);
      throw updateError;
    }

    console.log(`Successfully processed and updated problem ${record.id}.`);
    return new Response(JSON.stringify({ message: `Successfully processed problem ${record.id}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("An error occurred:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500, // Use 500 for server-side errors
    });
  }
});
