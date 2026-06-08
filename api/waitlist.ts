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

  if (!apiKey || !audienceId) {
    console.error("Waitlist not configured: missing RESEND_API_KEY or RESEND_AUDIENCE_ID");
    return res.status(500).json({ error: "Server not configured" });
  }

  try {
    // 1) Store the signup in the Resend audience (this IS the waitlist).
    const contactRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ email: cleanEmail, unsubscribed: false }),
      }
    );

    if (!contactRes.ok) {
      const err = await contactRes.json().catch(() => ({} as { message?: string }));
      const message = (err?.message || "").toLowerCase();
      // A repeat signup is not an error — treat "already exists" as success.
      const alreadyExists = contactRes.status === 409 || message.includes("already");
      if (!alreadyExists) {
        console.error("Resend contact add failed:", contactRes.status, err);
        return res
          .status(500)
          .json({ error: "Could not save your signup. Please try again." });
      }
    }

    // 2) Best-effort: notify you of the new signup. Never blocks the signup itself.
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "In Person <onboarding@resend.dev>",
          to: "matthewhurt999@gmail.com",
          subject: "New Waitlist Signup",
          html: `<p>New waitlist signup: <strong>${cleanEmail}</strong></p>`,
        }),
      });
    } catch (notifyErr) {
      console.error("Notification email failed (non-fatal):", notifyErr);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
