import type { VercelRequest, VercelResponse } from "@vercel/node";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body ?? {};

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: "A valid email is required" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey) {
    console.error("Waitlist not configured: missing RESEND_API_KEY");
    return res.status(500).json({ error: "Server not configured" });
  }

  let ok = false;

  // 1) Store the signup in the Resend audience when one is configured.
  //    If it isn't set up yet, don't break the signup — the email below still
  //    captures it.
  if (audienceId) {
    try {
      const r = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ email: cleanEmail, unsubscribed: false }),
      });
      if (r.ok) {
        ok = true;
      } else {
        const err = await r.json().catch(() => ({} as { message?: string }));
        const message = (err?.message || "").toLowerCase();
        if (r.status === 409 || message.includes("already")) {
          ok = true; // a repeat signup is fine
        } else {
          console.error("Resend contact add failed:", r.status, err);
        }
      }
    } catch (e) {
      console.error("Resend contact add error:", e);
    }
  }

  // 2) Always notify by email — the reliable capture path, with or without an audience.
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: "In Person <onboarding@resend.dev>",
        to: "matthewhurt999@gmail.com",
        subject: "New Waitlist Signup",
        html: `<p>New waitlist signup: <strong>${cleanEmail}</strong></p>`,
      }),
    });
    if (r.ok) ok = true;
    else console.error("Notification email failed:", r.status);
  } catch (e) {
    console.error("Notification email error:", e);
  }

  if (!ok) {
    return res.status(500).json({ error: "Could not save your signup. Please try again." });
  }
  return res.status(200).json({ success: true });
}
