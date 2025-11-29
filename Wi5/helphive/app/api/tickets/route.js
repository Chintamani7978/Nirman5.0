import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase.from("tickets").select("*");
  return Response.json(data);
}

export async function POST(req) {
  const data = await req.formData();

  const file = data.get("image");
  const title = data.get("title");
  const description = data.get("description");
  const lat = data.get("lat");
  const lng = data.get("lng");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = Date.now() + "-" + file.name;

  await supabase.storage.from("ticket-images").upload(filename, buffer, {
    contentType: file.type,
  });

  const { data: publicUrlData } = supabase.storage
    .from("ticket-images")
    .getPublicUrl(filename);

  const category = "general";

  await supabase.from("tickets").insert({
    title,
    description,
    category,
    image_url: publicUrlData.publicUrl,
    location_lat: lat,
    location_lng: lng,
  });

  return Response.json({ success: true });
}