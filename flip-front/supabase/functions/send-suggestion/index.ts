import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("SUGGESTION_FROM_EMAIL") ?? "onboarding@resend.dev";
const TO_EMAIL = Deno.env.get("SUGGESTION_TO_EMAIL") ?? "hello@flipgame.app";

interface Payload {
  game: string;
  suggestion: string;
}

export default {
  fetch: withSupabase({ auth: ["publishable"] }, async (req) => {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (!RESEND_API_KEY) {
      return Response.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    let payload: Payload;
    try {
      payload = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const game = (payload.game ?? "").toString().slice(0, 120).trim();
    const suggestion = (payload.suggestion ?? "").toString().slice(0, 2000).trim();

    if (!suggestion) {
      return Response.json({ error: "Empty suggestion" }, { status: 400 });
    }

    const subject = `[Flip] Suggestion — ${game || "Tous les jeux"}`;
    const html = `
      <h2>Nouvelle suggestion</h2>
      <p><strong>Jeu :</strong> ${escapeHtml(game || "Tous les jeux")}</p>
      <p><strong>Question :</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(suggestion)}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return Response.json({ error: "Resend failed", detail }, { status: 502 });
    }

    return Response.json({ ok: true });
  }),
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
