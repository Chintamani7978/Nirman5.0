// lib/ministryImpactApi.ts
import { supabase } from "@/integrations/supabase/client";

export async function fetchMinistryImpact() {
  // Query impact data from Supabase
  const { data, error } = await supabase
    .from("impact_tracker")
    .select("*");

  if (error) {
    console.error("❌ Error fetching ministry impact:", error.message);
    return []; // Fallback to empty array to avoid breaking render
  }

  if (!data || !Array.isArray(data)) {
    console.warn("⚠️ No valid impact data returned from Supabase.");
    return [];
  }

  // Optional: Normalize fields to match ImpactRow type in dashboard
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
}
