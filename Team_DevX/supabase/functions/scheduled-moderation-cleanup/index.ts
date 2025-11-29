// Supabase Edge Function: scheduled-moderation-cleanup
// This function runs daily to re-moderate and clean up older content.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function moderateOldContent(table) {
  const { data: rows } = await supabase.from(table).select('*').eq('is_flagged', false);
  for (const row of rows || []) {
    // Call the moderation function for each row
    await fetch(`${supabaseUrl}/functions/v1/moderate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, row })
    });
  }
}

serve(async () => {
  await moderateOldContent('problems');
  return new Response(JSON.stringify({ status: 'Problems re-moderated.' }), { headers: { 'Content-Type': 'application/json' } });
});
