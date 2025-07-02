// supabase/functions/upload-session-photos/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const { user_id, session_label, files } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: customer, error: customerErr } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", user_id)
    .maybeSingle();

  if (!customer || customerErr) {
    return new Response("Customer not found", { status: 404 });
  }

  let sessionId: string;

  const { data: existingSession } = await supabase
    .from("sessions")
    .select("id")
    .eq("session_label", session_label)
    .eq("user_id", user_id)
    .maybeSingle();

  if (existingSession?.id) {
    sessionId = existingSession.id;
  } else {
    const { data: newSession, error: sessionErr } = await supabase
      .from("sessions")
      .insert([
        {
          user_id,
          customer_id: customer.id,
          session_label,
          session_name: session_label,
          session_date: new Date().toISOString().split("T")[0],
        },
      ])
      .select()
      .single();

    if (sessionErr) {
      return new Response("Failed to create session", { status: 400 });
    }

    sessionId = newSession.id;
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const { name, base64, contentType } = file;
    const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const path = `${user_id}/${sessionId}/${Date.now()}-${name}`;

    const { error: uploadErr } = await supabase.storage
      .from("customer-photos")
      .upload(path, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadErr) continue;

    const { data: { publicUrl } } = supabase.storage
      .from("customer-photos")
      .getPublicUrl(path);

    await supabase.from("customer_photos").insert({
      user_id,
      session_id: sessionId,
      file_url: publicUrl,
      is_approved: false,
      uploaded_at: new Date().toISOString(),
    });

    uploadedUrls.push(publicUrl);
  }

  return new Response(JSON.stringify({ uploadedUrls }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
