// lib/impactApi.ts
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches civic impact data for a single citizen.
 * Filters by their location (if available).
 */
export async function fetchCitizenImpact(userId: string) {
  try {
    const userLocation = await getUserLocation(userId);

    const { data, error } = await supabase
      .from("impact_tracker")
      .select("*")
      .eq("location", userLocation || ""); // Use plain string, not Promise

    if (error) {
      console.error("❌ Error fetching citizen impact:", error.message);
      return { data: [], error };
    }

    if (!data || !Array.isArray(data)) {
      console.warn("⚠️ No citizen impact data found.");
      return { data: [], error: null };
    }

    // Normalize data
    const normalized = data.map((row) => ({
      id: row.id ?? `row-${Math.random().toString(36).slice(2, 8)}`,
      category: row.category ?? "Unknown",
      location: row.location ?? "—",
      resolved_count: Number(row.resolved_count ?? 0),
      pending_count: Number(row.pending_count ?? 0),
      avg_response_time: Number(row.avg_response_time ?? 0),
      engagement_score: Number(row.engagement_score ?? 0),
    }));

    return { data: normalized, error: null };
  } catch (e: any) {
    console.error("🚨 Unexpected error in fetchCitizenImpact:", e);
    return { data: [], error: e };
  }
}

/**
 * Fetches overall civic impact metrics for ministry users.
 * Returns aggregated or all-impact view data.
 */
export async function fetchMinistryImpact() {
  try {
    const { data, error } = await supabase.from("impact_tracker").select("*");

    if (error) {
      console.error("❌ Error fetching ministry impact:", error.message);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      console.warn("⚠️ No valid ministry impact data returned.");
      return [];
    }

    // Normalize structure to prevent null issues
    const normalized = data.map((row) => ({
      id: row.id ?? `row-${Math.random().toString(36).slice(2, 8)}`,
      category: row.category ?? "Unknown",
      location: row.location ?? "—",
      resolved_count: Number(row.resolved_count ?? 0),
      pending_count: Number(row.pending_count ?? 0),
      avg_response_time: Number(row.avg_response_time ?? 0),
      engagement_score: Number(row.engagement_score ?? 0),
    }));

    return normalized;
  } catch (e: any) {
    console.error("🚨 Unexpected error in fetchMinistryImpact:", e);
    return [];
  }
}

/**
 * Helper to get the user's city from their profile
 * (Used by fetchCitizenImpact)
 */
async function getUserLocation(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("city")
      .eq("id", userId)
      .single();

    if (error) {
      console.warn("⚠️ Failed to get user city:", error.message);
      return "";
    }

    return data?.city || "";
  } catch (e: any) {
    console.error("🚨 Unexpected error in getUserLocation:", e);
    return "";
  }
}
