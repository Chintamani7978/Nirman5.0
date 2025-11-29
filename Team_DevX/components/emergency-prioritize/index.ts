import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface IncidentForPrioritization {
  id: string;
  severity: string;
  life_threatening: boolean;
  affected_population: number;
  latitude: number;
  longitude: number;
  incident_type: string;
  created_at: string;
}

interface PriorityResult {
  incidentId: string;
  priorityScore: number;
  ranking: number;
  rationale: string;
}

// Haversine distance formula (km)
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate priority score (0-100)
function calculatePriorityScore(incident: IncidentForPrioritization): number {
  let score = 0;

  // Severity factor (0-40 points)
  const severityMap: Record<string, number> = {
    critical: 40,
    high: 30,
    medium: 15,
    low: 5,
  };
  score += severityMap[incident.severity] || 5;

  // Life-threatening factor (0-25 points)
  if (incident.life_threatening) score += 25;

  // Population affected factor (0-20 points)
  const popScore = Math.min(incident.affected_population / 100, 20);
  score += popScore;

  // Recency factor (0-15 points) - newer incidents get higher priority
  const ageMinutes = (Date.now() - new Date(incident.created_at).getTime()) / (1000 * 60);
  const recencyScore = Math.max(15 - (ageMinutes / 10), 0);
  score += recencyScore;

  // Incident type factor (0-10 bonus points for high-impact types)
  const highImpactTypes = ["flood", "cyclone", "fire", "earthquake"];
  if (highImpactTypes.includes(incident.incident_type)) score += 10;

  return Math.min(score, 100);
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Fetch all active emergency incidents
    const { data: incidents, error: fetchError } = await supabase
      .from("emergency_incidents")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching incidents", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch incidents" }), { status: 500 });
    }

    if (!incidents || incidents.length === 0) {
      return new Response(JSON.stringify({ success: true, priorities: [] }), { status: 200 });
    }

    // Calculate priority scores
    const priorities: PriorityResult[] = incidents
      .map((incident) => ({
        incidentId: incident.id,
        priorityScore: calculatePriorityScore(incident),
        rationale: `Score: ${incident.severity} (${incident.affected_population} affected, ${incident.life_threatening ? "life-threatening" : "non-threat"})`,
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .map((p, idx) => ({ ...p, ranking: idx + 1 }));

    // Update incident priorities in database
    for (const priority of priorities) {
      await supabase
        .from("crisis_activity_log")
        .insert({
          incident_id: priority.incidentId,
          activity_type: "prioritization",
          description: `Assigned priority ranking #${priority.ranking} (score: ${priority.priorityScore})`,
          metadata: { score: priority.priorityScore, ranking: priority.ranking },
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        priorities,
        totalIncidents: incidents.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Priority calculation error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
});
