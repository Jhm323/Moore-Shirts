function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.headers["x-webhook-secret"] !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { type, table, record } = req.body || {};
  if (type !== "INSERT" || table !== "orders" || !record) {
    return res.status(400).json({ error: "Unexpected payload" });
  }

  const { id, design_name, size, price, shipping, created_at } = record;
  const s = shipping || {};

  const html = `
    <h2>New order received</h2>
    <p><strong>Order ID:</strong> ${escapeHtml(id)}</p>
    <p><strong>Design:</strong> ${escapeHtml(design_name)} &mdash; Size ${escapeHtml(size)}</p>
    <p><strong>Price:</strong> $${escapeHtml(price)}</p>
    <h3>Shipping</h3>
    <p>
      ${escapeHtml(s.name)}<br/>
      ${escapeHtml(s.address1)}${s.address2 ? "<br/>" + escapeHtml(s.address2) : ""}<br/>
      ${escapeHtml(s.city)}, ${escapeHtml(s.region)} ${escapeHtml(s.postal)}<br/>
      ${escapeHtml(s.country)}
    </p>
    <p><strong>Contact:</strong> ${escapeHtml(s.email)}${s.phone ? " | " + escapeHtml(s.phone) : ""}</p>
    <p style="color:#888;font-size:12px;">Placed at ${escapeHtml(created_at)}</p>
  `;

  try {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Common Thread Orders <onboarding@resend.dev>",
        to: [process.env.ORDER_NOTIFICATION_EMAIL],
        subject: `New order: ${design_name} (${size})`,
        html,
      }),
    });

    if (!emailRes.ok) {
      console.error("Resend error:", await emailRes.text());
      return res.status(502).json({ error: "Email send failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("send-order-email error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
