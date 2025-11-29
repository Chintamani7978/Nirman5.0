import { supabase } from "@/lib/supabase";

export async function PATCH(req, { params }) {
  const body = await req.json();

  await supabase
    .from("tickets")
    .update({ status: body.status })
    .eq("id", params.id);

  return Response.json({ success: true });
}