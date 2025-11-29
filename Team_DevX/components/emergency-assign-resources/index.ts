import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Resource {
  id: string;
  resource_type: string;
  current_latitude: number;
  current_longitude: number;
  status: string;
  available_capacity: number;
}

interface Incident {
  id: string;
  incident_type: string;
  latitude: number;
  longitude: number;
  severity: string;
}

interface Assignment {
  resourceId: string;
  incidentId: string;
  distanceKm: number;
  etaMinutes: number;
  priorityScore: number;
}

// Haversine distance
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Match resources to incident type
function getMatchingResourceTypes(incidentType: string): string[] {
  const typeMap: Record<string, string[]> = {
    flood: ["ambulance", "rescue_unit", "medical_unit", "shelter", "water_tanker"],
    cyclone: ["shelter", "rescue_unit", "ambulance", "medical_unit"],
    fire: ["fire_team", "ambulance", "rescue_unit", "medical_unit"],
    earthquake: ["ambulance", "rescue_unit", "medical_unit", "shelter"],
    medical_emergency: ["ambulance", "medical_unit"],
    accident: ["ambulance", "rescue_unit", "police"],
    other: ["ambulance", "rescue_unit"],
  };
  return typeMap[incidentType] || ["ambulance", "rescue_unit"];
}

// Calculate assignment priority
function calculateAssignmentPriority(distance: number, capacity: number, severity: string): number {
  const severityMap = { critical: 3, high: 2, medium: 1, low: 0.5 };
  const distancePenalty = Math.min(distance / 50, 5); // 0-5 penalty based on distance
  const capacityBonus = Math.min(capacity / 10, 2); // 0-2 bonus for capacity
  const severityBonus = severityMap[severity as keyof typeof severityMap] || 1;
  
  return severityBonus * 10 + capacityBonus * 5 - distancePenalty;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { incidentId } = body;

    if (!incidentId) {
      return new Response(JSON.stringify({ error: "Missing incidentId" }), { status: 400 });
    }

    // Fetch incident
    const { data: incident, error: incidentError } = await supabase
      .from("emergency_incidents")
      .select("*")
      .eq("id", incidentId)
      .single();

    if (incidentError || !incident) {
      return new Response(JSON.stringify({ error: "Incident not found" }), { status: 404 });
    }

    // Get matching resource types
    const matchingTypes = getMatchingResourceTypes(incident.incident_type);

    // Fetch available resources
    const { data: resources, error: resourceError } = await supabase
      .from("emergency_resources")
      .select("*")
      .in("resource_type", matchingTypes)
      .eq("status", "available")
      .gte("available_capacity", 1);

    if (resourceError) {
      console.error("Error fetching resources", resourceError);
      return new Response(JSON.stringify({ error: "Failed to fetch resources" }), { status: 500 });
    }

    if (!resources || resources.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          incidentId,
          assignments: [],
          message: "No available resources matching incident type",
        }),
        { status: 200 }
      );
    }

    // Calculate assignments (closest resources first)
    const assignments: Assignment[] = resources
      .map((resource) => {
        const distance = haversineDistance(
          resource.current_latitude,
          resource.current_longitude,
          incident.latitude,
          incident.longitude
        );
        const eta = Math.ceil(distance * 2); // Rough estimate: 30 km/h average speed
        const score = calculateAssignmentPriority(distance, resource.available_capacity, incident.severity);

        return {
          resourceId: resource.id,
          incidentId: incidentId,
          distanceKm: parseFloat(distance.toFixed(2)),
          etaMinutes: eta,
          priorityScore: parseFloat(score.toFixed(2)),
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 5); // Top 5 resources

    // Create resource deployments in database
    for (const assignment of assignments) {
      const { error: insertError } = await supabase
        .from("resource_deployments")
        .insert({
          incident_id: assignment.incidentId,
          resource_id: assignment.resourceId,
          deployment_status: "pending",
          distance_km: assignment.distanceKm,
          eta_minutes: assignment.etaMinutes,
          priority_score: assignment.priorityScore,
        });

      if (insertError) {
        console.error("Error creating deployment", insertError);
      }
    }

    // Log activity
    await supabase
      .from("crisis_activity_log")
      .insert({
        incident_id: incidentId,
        activity_type: "resource_assigned",
        description: `${assignments.length} resources assigned to incident`,
        metadata: { assignments: assignments },
      });

    return new Response(
      JSON.stringify({
        success: true,
        incidentId,
        assignments,
        totalAssigned: assignments.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Resource assignment error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
});
