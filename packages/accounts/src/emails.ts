import type { Mail } from './mailer';

/** Where people talk to each other and to us; every email points there. */
export const DISCORD = 'https://discord.gg/GTZtn8pTXC';

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

interface Message {
  to: string;
  subject: string;
  /** Paragraphs before and after the button. */
  intro: ReadonlyArray<string>;
  action: { label: string; url: string };
  outro: ReadonlyArray<string>;
}

/**
 * One email, as plain text and simple HTML: a few paragraphs, one button,
 * then the same footer everywhere (Discord, and that replies go nowhere).
 */
export function compose(message: Message): Mail {
  const footer = [
    `Questions, ideas, or just want to say hi? Join the JSON Resume Discord: ${DISCORD}`,
    'This email comes from a no-reply address, so replies aren’t read.',
  ];
  const text = [
    ...message.intro,
    `${message.action.label}: ${message.action.url}`,
    ...message.outro,
    '—',
    ...footer,
  ].join('\n\n');
  const p = (s: string) =>
    `<p style="margin:0 0 16px;line-height:1.5">${escape(s)}</p>`;
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f9f9f9;font-family:'Open Sans',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#222">
<div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #ddd;border-radius:8px;padding:32px">
<p style="margin:0 0 24px;font-weight:700;font-size:18px">JSON Resume</p>
${message.intro.map(p).join('\n')}
<p style="margin:24px 0"><a href="${escape(
    message.action.url
  )}" style="display:inline-block;background:#d23a3a;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:4px">${escape(
    message.action.label
  )}</a></p>
${message.outro.map(p).join('\n')}
<hr style="border:0;border-top:1px solid #eee;margin:24px 0">
<p style="margin:0 0 8px;font-size:13px;color:#6b6b6b">Questions, ideas, or just want to say hi? <a href="${DISCORD}" style="color:#a92525">Join the JSON Resume Discord</a>.</p>
<p style="margin:0;font-size:13px;color:#6b6b6b">This email comes from a no-reply address, so replies aren’t read.</p>
</div></body></html>`;
  return { to: message.to, subject: message.subject, text, html };
}

export const verificationEmail = (
  to: string,
  username: string,
  siteUrl: string,
  token: string
) =>
  compose({
    to,
    subject: 'Confirm your email for JSON Resume',
    intro: [
      `Hi @${username},`,
      `Confirm your email to put your resume live at ${siteUrl}/@${username}.`,
    ],
    action: {
      label: 'Confirm your email',
      url: `${siteUrl}/api/auth/verify?token=${token}`,
    },
    outro: [
      'The link works for 24 hours. If you didn’t sign up, ignore this email.',
    ],
  });

export const passwordResetEmail = (
  to: string,
  username: string,
  siteUrl: string,
  token: string
) =>
  compose({
    to,
    subject: 'Reset your JSON Resume password',
    intro: [
      `Hi @${username},`,
      'Someone asked to reset the password for your account. If it was you, choose a new one:',
    ],
    action: {
      label: 'Choose a new password',
      url: `${siteUrl}/reset-password?token=${token}`,
    },
    outro: [
      'The link works for one hour. If you didn’t ask, ignore this email: your password stays as it is.',
    ],
  });
