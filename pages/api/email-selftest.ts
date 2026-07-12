import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail, emailConfigured, OWNER_EMAIL } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

/**
 * Email pipeline self-test.
 *
 * Sends a single branded test email to OWNER_EMAIL (the business inbox — it can
 * never be pointed at an arbitrary address, so it can't be used to spam) and
 * returns exactly what Resend reported. Use it to prove end-to-end delivery and
 * the branded MAIL_FROM sender without guessing.
 *
 *   GET /api/email-selftest
 *   GET /api/email-selftest?token=XXXX   (required if EMAIL_TEST_TOKEN is set)
 *
 * Response: { configured, from, to, result: { sent, reason? } }
 */
const limit = rateLimit('email-selftest', 6, 60_000);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!limit(req, res)) return;

  // Optional shared-secret gate. When EMAIL_TEST_TOKEN is configured, the
  // caller must present it; otherwise the endpoint is open (still owner-only).
  const required = process.env.EMAIL_TEST_TOKEN;
  if (required) {
    const supplied = (req.query.token as string) || '';
    if (supplied !== required) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }
  }

  const from = process.env.MAIL_FROM || 'M&M Auto Performance <onboarding@resend.dev>';

  const html = `<!DOCTYPE html><html><body style="margin:0;background:#121316;font-family:Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#121316;padding:32px 0;"><tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1b1d21;border:1px solid rgba(197,165,114,0.25);border-radius:14px;overflow:hidden;">
        <tr><td style="padding:28px 32px;">
          <div style="color:#C5A572;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">M&amp;M Auto Performance</div>
          <h1 style="color:#fff;font-size:22px;margin:10px 0 14px;">Email pipeline is live ✓</h1>
          <p style="color:#cfd2d6;font-size:14px;line-height:1.6;margin:0 0 12px;">
            This is an automated self-test. If you are reading it in your inbox, transactional email is working end-to-end.</p>
          <p style="color:#8b8e93;font-size:12px;margin:0;">Sent from: ${from}</p>
        </td></tr>
      </table>
    </td></tr></table>
  </body></html>`;

  const result = await sendEmail({
    to: OWNER_EMAIL,
    subject: 'M&M Auto Performance — email self-test',
    html,
  });

  return res.status(result.sent ? 200 : 502).json({
    configured: emailConfigured(),
    from,
    to: OWNER_EMAIL,
    result,
  });
}
