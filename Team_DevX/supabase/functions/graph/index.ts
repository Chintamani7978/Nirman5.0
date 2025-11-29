import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    // Fetch core entities
    const { data: users, error: userError } = await supabase
      .from("profiles")
      .select("id, full_name");

    const { data: problems, error: problemError } = await supabase
      .from("problems")
      .select("id, title");

    const { data: ministries, error: ministryError } = await supabase
      .from("ministries")
      .select("id, name");

    const { data: relationships, error: relError } = await supabase
      .from("problem_relationships")
      .select("problem_id_a, problem_id_b, similarity_score, relationship_type");

    if (userError || problemError || ministryError || relError) {
      throw userError || problemError || ministryError || relError;
    }

    // Construct nodes
    const nodes = [
      ...(users ?? []).map((u) => ({ id: u.id, type: "user", label: u.full_name })),
      ...(problems ?? []).map((p) => ({ id: p.id, type: "problem", label: p.title })),
      ...(ministries ?? []).map((m) => ({ id: m.id, type: "ministry", label: m.name })),
    ];

    // Construct edges
    const edges = [
      ...(relationships ?? []).map((rel) => ({
        source: rel.problem_id_a,
        target: rel.problem_id_b,
        type: rel.relationship_type,
        strength: rel.similarity_score,
      })),
    ];

    // Return response
    return new Response(JSON.stringify({ nodes, edges }), { headers });
  } catch (err) {
    console.error("graph-api error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
});
