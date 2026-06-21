/**
 * Lightweight transactional email via the Resend REST API.
 *
 * Intentionally dependency-free (plain fetch) and fail-soft: if RESEND_API_KEY
 * is not set, sends are skipped and logged rather than throwing, so the booking
 * and contact flows never break over email delivery.
 *
 * Required env to actually deliver:
 *   RESEND_API_KEY      - https://resend.com API key
 *   MAIL_FROM           - verified sender, e.g. "M&M Auto Performance <bookings@mandmautoperformance.com>"
 *   ADMIN_NOTIFY_EMAIL  - where new-lead notifications go (defaults to the gmail below)
 */

const BRAND = '#C5A572';
const BG = '#121316';
const PANEL = '#1b1d21';

export const OWNER_EMAIL =
  process.env.ADMIN_NOTIFY_EMAIL || 'mandmautoperformance@gmail.com';

const DEFAULT_FROM = 'M&M Auto Performance <onboarding@resend.dev>';

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailParams): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set — skipped "${subject}"`);
    return { sent: false, reason: 'not_configured' };
  }

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || DEFAULT_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => '');
      console.error(`[email] Resend ${resp.status}: ${detail}`);
      return { sent: false, reason: `resend_${resp.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error('[email] send failed:', err);
    return { sent: false, reason: 'exception' };
  }
}

// ---------------------------------------------------------------------------
// Branded HTML templates (inline styles — email clients ignore <style>/classes)
// ---------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function layout(heading: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:${BG};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${PANEL};border:1px solid rgba(197,165,114,0.25);border-radius:14px;overflow:hidden;font-family:Helvetica,Arial,sans-serif;">
        <tr><td style="padding:28px 32px 8px 32px;">
          <div style="color:${BRAND};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">M&amp;M Auto Performance</div>
          <h1 style="color:#ffffff;font-size:22px;margin:10px 0 0 0;">${heading}</h1>
        </td></tr>
        <tr><td style="padding:12px 32px 28px 32px;color:#cfd2d6;font-size:14px;line-height:1.6;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:18px 32px;border-top:1px solid rgba(197,165,114,0.18);color:#7a7d82;font-size:11px;">
          M&amp;M Auto Performance · Luxury &amp; supercar hire · London &amp; Hertfordshire
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;color:#8b8e93;font-size:12px;width:130px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#ffffff;font-size:14px;">${value}</td>
  </tr>`;
}

export interface LeadEmailData {
  model: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime?: string;
  passengers?: number | string;
  estimateGbp?: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

/** Notification to the business owner about a new reservation lead. */
export function reservationOwnerEmail(d: LeadEmailData): string {
  const details = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    ${row('Vehicle', escapeHtml(d.model))}
    ${row('Pickup', `${escapeHtml(d.pickupDate)}${d.pickupTime ? ' · ' + escapeHtml(d.pickupTime) : ''}`)}
    ${row('Return', escapeHtml(d.returnDate))}
    ${row('Passengers', escapeHtml(String(d.passengers ?? 1)))}
    ${row('Estimate', d.estimateGbp != null ? `£${Number(d.estimateGbp).toLocaleString()}` : '—')}
    ${row('Name', escapeHtml(d.name))}
    ${row('Email', `<a href="mailto:${escapeHtml(d.email)}" style="color:${BRAND};">${escapeHtml(d.email)}</a>`)}
    ${row('Phone', `<a href="tel:${escapeHtml(d.phone)}" style="color:${BRAND};">${escapeHtml(d.phone)}</a>`)}
    ${d.notes ? row('Notes', escapeHtml(d.notes)) : ''}
  </table>`;
  return layout(
    'New reservation request',
    `<p style="margin:0 0 14px 0;">A customer has requested a vehicle. Reply to this email to reach them directly.</p>${details}
     <p style="margin:18px 0 0 0;color:#8b8e93;font-size:12px;">Manage this lead in your admin dashboard → Reservations.</p>`,
  );
}

/** Confirmation to the customer that their request was received. */
export function reservationCustomerEmail(d: LeadEmailData): string {
  const first = (d.name || '').split(' ')[0] || 'there';
  return layout(
    'We’ve received your request',
    `<p style="margin:0 0 14px 0;">Hi ${escapeHtml(first)},</p>
     <p style="margin:0 0 14px 0;">Thank you for your interest in the <strong style="color:#fff;">${escapeHtml(d.model)}</strong>.
     Our team will be in touch very shortly to confirm availability for
     <strong style="color:#fff;">${escapeHtml(d.pickupDate)}</strong> → <strong style="color:#fff;">${escapeHtml(d.returnDate)}</strong>
     and finalise the details.</p>
     <p style="margin:0 0 14px 0;">If anything changes in the meantime, just reply to this email.</p>
     <p style="margin:18px 0 0 0;color:#cfd2d6;">Warm regards,<br/>The M&amp;M Auto Performance team</p>`,
  );
}

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Notification to the business owner about a new contact-form message. */
export function contactOwnerEmail(d: ContactEmailData): string {
  const details = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    ${row('From', escapeHtml(d.name))}
    ${row('Email', `<a href="mailto:${escapeHtml(d.email)}" style="color:${BRAND};">${escapeHtml(d.email)}</a>`)}
    ${row('Subject', escapeHtml(d.subject))}
  </table>
  <p style="margin:16px 0 0 0;color:#cfd2d6;white-space:pre-wrap;">${escapeHtml(d.message)}</p>`;
  return layout('New contact message', details);
}
