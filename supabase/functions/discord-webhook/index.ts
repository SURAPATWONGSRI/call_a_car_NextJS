// supabase/functions/discord-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
serve(async (req) => {
  try {
    const payload = await req.json();
    const webhookUrl = Deno.env.get("DISCORD_WEBHOOK_URL");
    // Check if we have embed data or just a regular message
    const discordPayload = payload.embeds
      ? {
          embeds: payload.embeds,
        }
      : {
          content: payload.message,
        };
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    });
    if (!res.ok) {
      const errorText = await res.text();
      return new Response(`Failed to send: ${errorText}`, {
        status: 500,
      });
    }
    return new Response("Sent to Discord!", {
      status: 200,
    });
  } catch (err) {
    return new Response(`Error: ${err}`, {
      status: 500,
    });
  }
});
