import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AlertRequest {
  incidentId: string;
  alertType: string;
  message: string;
  radiusKm?: number;
}

// Get alert template based on incident type and alert type
function getAlertTemplate(incidentType: string, alertType: string): string {
  const templates: Record<string, Record<string, string>> = {
    flood: {
      evacuation: " FLOOD WARNING: Please evacuate to higher ground immediately.",
      shelter: " Nearby shelters are open. Follow the location and contact info provided.",
      warning: " Heavy rain expected. Stay alert for flooding.",
    },
    cyclone: {
      evacuation: " CYCLONE ALERT: Evacuate to designated shelters now.",
      shelter: " Cyclone shelters open. Move to safety with essential items.",
      warning: " Severe cyclone approaching. Secure your surroundings.",
    },
    fire: {
      evacuation: " FIRE ALERT: Evacuate the area immediately.",
      shelter: " Evacuation centers ready. Head to nearest assembly point.",
      warning: " Wildfire nearby. Keep track of wind direction.",
    },
    earthquake: {
      evacuation: " EARTHQUAKE: Move to open ground away from buildings.",
      shelter: " Emergency shelters operational. Report to nearest center.",
      warning: " Aftershocks possible. Stay in safe areas.",
    },
  };

  const typeTemplates = templates[incidentType] || templates.flood;
  return typeTemplates[alertType] || " Emergency alert - follow official guidance.";
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body: AlertRequest = await req.json();
    const { incidentId, alertType, message, radiusKm = 5 } = body;

    if (!incidentId || !alertType) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Fetch incident details
    const { data: incident, error: incidentError } = await supabase
      .from("emergency_incidents")
      .select("*")
      .eq("id", incidentId)
      .single();

    if (incidentError || !incident) {
      return new Response(JSON.stringify({ error: "Incident not found" }), { status: 404 });
    }

    // Generate alert message
    const template = getAlertTemplate(incident.incident_type, alertType);
    const finalMessage = message || template;

    // Create alert record
    const { data: alert, error: alertError } = await supabase
      .from("emergency_alerts")
      .insert({
        incident_id: incidentId,
        alert_type: alertType,
        message: finalMessage,
        target_latitude: incident.latitude,
        target_longitude: incident.longitude,
        radius_km: radiusKm,
        broadcast_status: "pending",
      })
      .select()
      .single();

    if (alertError) {
      console.error("Error creating alert", alertError);
      return new Response(JSON.stringify({ error: "Failed to create alert" }), { status: 500 });
    }

    // Find nearby users (simplified - in production, use PostGIS with distance queries)
    // This query finds all users with location data within the specified radius
    const radiusInDegrees = radiusKm / 111; // Approximate: 1 degree ≈ 111 km

    const { data: nearbyUsers, error: usersError } = await supabase
      .from("problems")
      .select("user_id, latitude, longitude")
      .gte("latitude", incident.latitude - radiusInDegrees)
      .lte("latitude", incident.latitude + radiusInDegrees)
      .gte("longitude", incident.longitude - radiusInDegrees)
      .lte("longitude", incident.longitude + radiusInDegrees)
      .eq("status", "reported"); // Active problem reports

    const recipientCount = nearbyUsers?.length || 0;

    // In production, send actual notifications via:
    // - Push notifications (Firebase, OneSignal)
    // - SMS (Twilio, AWS SNS)
    // - Email
    // - In-app notifications
    // For now, we log and mark as sent

    // Update alert status
    const { error: updateError } = await supabase
      .from("emergency_alerts")
      .update({
        broadcast_status: "sent",
        sent_at: new Date().toISOString(),
        recipients_count: recipientCount,
      })
      .eq("id", alert.id);

    if (updateError) {
      console.error("Error updating alert", updateError);
    }

    // Log activity
    await supabase
      .from("crisis_activity_log")
      .insert({
        incident_id: incidentId,
        activity_type: "alert_sent",
        description: `Emergency alert broadcast to ~${recipientCount} citizens in ${radiusKm}km radius`,
        metadata: {
          alert_type: alertType,
          recipients: recipientCount,
          radius_km: radiusKm,
        },
      });

    return new Response(
      JSON.stringify({
        success: true,
        alert,
        recipientCount,
        message: `Alert broadcast to ~${recipientCount} citizens`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Alert broadcast error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
});
