import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Keywords for detecting life-threatening issues
const CRITICAL_KEYWORDS = {
  flood: ["flood", "water", "inundation", "submerged", "drowning", "waterlogged"],
  cyclone: ["cyclone", "storm", "hurricane", "tornado", "high wind", "severe weather"],
  fire: ["fire", "burning", "ablaze", "smoke", "arson", "wildfire"],
  earthquake: ["earthquake", "tremor", "seismic", "collapsed", "building collapse"],
  medical: ["injury", "injured", "accident", "collision", "poisoning", "medical", "ambulance", "emergency"],
  safety: ["attack", "violence", "shooting", "danger", "threat", "emergency", "trapped"],
};

interface ProblemData {
  id: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  pincode: string;
}

interface DetectionResult {
  isEmergency: boolean;
  emergencyType: string;
  severity: "critical" | "high" | "medium" | "low";
  lifeThreateningScore: number;
  confidenceScore: number;
  reasoning: string;
}

// Rule-based detection
function detectEmergencyRules(problem: ProblemData): DetectionResult {
  const text = `${problem.title} ${problem.description}`.toLowerCase();
  
  let maxScore = 0;
  let detectedType = "other";
  
  for (const [type, keywords] of Object.entries(CRITICAL_KEYWORDS)) {
    const matches = keywords.filter(kw => text.includes(kw)).length;
    const score = matches / keywords.length;
    if (score > maxScore) {
      maxScore = score;
      detectedType = type;
    }
  }
  
  const lifeThreateningScore = maxScore;
  const isEmergency = lifeThreateningScore > 0.3;
  
  let severity: "critical" | "high" | "medium" | "low" = "low";
  if (lifeThreateningScore > 0.7) severity = "critical";
  else if (lifeThreateningScore > 0.5) severity = "high";
  else if (lifeThreateningScore > 0.3) severity = "medium";
  
  return {
    isEmergency,
    emergencyType: detectedType,
    severity,
    lifeThreateningScore,
    confidenceScore: Math.min(lifeThreateningScore + 0.1, 1),
    reasoning: `Detected ${detectedType} emergency with ${Math.round(lifeThreateningScore * 100)}% confidence based on keywords.`,
  };
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { problemId } = body;

    if (!problemId) {
      return new Response(JSON.stringify({ error: "Missing problemId" }), { status: 400 });
    }

    // Fetch the problem
    const { data: problem, error: fetchError } = await supabase
      .from("problems")
      .select("id, title, description, category, latitude, longitude, pincode")
      .eq("id", problemId)
      .single();

    if (fetchError || !problem) {
      return new Response(JSON.stringify({ error: "Problem not found" }), { status: 404 });
    }

    // Run detection rules
    const detection = detectEmergencyRules(problem);

    if (detection.isEmergency) {
      // Insert into emergency_incidents
      const { data: incident, error: insertError } = await supabase
        .from("emergency_incidents")
        .insert({
          problem_id: problemId,
          incident_type: detection.emergencyType,
          severity: detection.severity,
          title: problem.title,
          description: problem.description,
          latitude: problem.latitude,
          longitude: problem.longitude,
          life_threatening: detection.lifeThreateningScore > 0.6,
          ai_confidence_score: detection.confidenceScore,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting emergency incident", insertError);
        return new Response(JSON.stringify({ error: "Failed to create incident" }), { status: 500 });
      }

      return new Response(
        JSON.stringify({
          success: true,
          isEmergency: true,
          incident,
          detection,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        isEmergency: false,
        detection,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Emergency detection error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
});
