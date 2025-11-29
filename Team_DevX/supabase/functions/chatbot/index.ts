import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY"));
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const getPublicStats = async () => {
  const { data, error } = await supabaseAdmin.rpc("get_ministry_dashboard_stats");
  if (error) throw new Error(`Failed to fetch stats: ${error.message}`);
  
  const { total_problems, problems_by_status, top_category } = data;
  
  let statsSummary = `Here are some current public statistics:\n`;
  statsSummary += `- Total problems reported: ${total_problems}\n`;
  statsSummary += `- Top problem category: ${top_category}\n`;
  statsSummary += `Problems by status:\n`;
  
  problems_by_status.forEach((s: { status: string, count: number }) => {
    statsSummary += `  - ${s.status}: ${s.count}\n`;
  });

  return statsSummary;
}

serve(async (req) => {
  console.log("Chatbot function invoked.");

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request.");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log("Received message:", message);

    if (!message) {
      console.error("No message provided in the request body.");
      return new Response(JSON.stringify({ error: "No message provided." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const intentPrompt = `
      You are an AI assistant for VoiceUp, a civic engagement platform.
      Your personality is helpful, concise, and friendly.
      You have two capabilities:
      1. General conversation: You can chat about various topics.
      2. Data queries: You can answer questions about public data on the platform.

      When a user asks a question, first determine their intent.
      
      If the user's intent is a 'data_query' (e.g., "how many problems are there?", "show me stats", "what's the top category?"), respond ONLY with the string "INTENT:DATA_QUERY".
      
      If the user's intent is 'general_chat' (e.g., "hello", "what is this platform?", "tell me a joke"), respond as you normally would.

      User message: "${message}"
    `;

    console.log("Determining intent with Gemini...");
    const intentResult = await model.generateContent(intentPrompt);
    const intentResponse = await intentResult.response;
    const intent = intentResponse.text();
    console.log("Intent determined:", intent);

    let botResponse;

    if (intent && intent.includes("INTENT:DATA_QUERY")) {
      console.log("Intent is DATA_QUERY. Fetching public stats...");
      botResponse = await getPublicStats();
      console.log("Stats fetched successfully.");
    } else {
      console.log("Intent is general_chat. Forwarding to Gemini for chat...");
      // For general chat, we create a chat session
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: "You are a helpful and friendly AI assistant for the VoiceUp platform.",
          },
          {
            role: "model",
            parts: "Great, I'm ready to help!",
          },
        ],
      });
      
      const result = await chat.sendMessage(message);
      const response = await result.response;
      botResponse = response.text();
      console.log("General chat response received from Gemini.");
    }

    console.log("Final bot response:", botResponse);

    return new Response(JSON.stringify({ reply: botResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("An error occurred in the main try-catch block:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
