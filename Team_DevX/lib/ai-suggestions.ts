import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY"));
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    const { problemId } = await req.json();

    if (!problemId) {
      return new Response(
        JSON.stringify({ error: "problemId is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const res = await fetch(
      "https://wfpxknccdypiwpsoyisx.supabase.co/functions/v1/rapid-action",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.get("Authorization")!,
        },
        body: JSON.stringify({
          problemId: problemId,
        }),
      }
    );

    const data = await res.json();
    console.log("AI suggestions =>", data);

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
