import type { Mail } from './mailer';
import {
  button,
  DISCORD,
  escape,
  FONT,
  footerLink,
  GITHUB,
  INK,
  item,
  MUTED,
  p,
  RED,
  stats,
  STYLE,
  type EmailItem,
  type EmailStat,
} from './emailParts';

export { DISCORD, escape, type EmailItem, type EmailStat } from './emailParts';

export interface EmailContent {
  to: string;
  subject: string;
  /** The line inboxes show after the subject. */
  preview: string;
  heading: string;
  intro: ReadonlyArray<string>;
  action: { label: string; url: string };
  /** Numbers in a row, under the intro. */
  stats?: ReadonlyArray<EmailStat>;
  items?: ReadonlyArray<EmailItem>;
  /** Number the items, as steps to take in order. */
  numbered?: boolean;
  outro?: ReadonlyArray<string>;
  /** Why this email came, and the links that stop or change it. */
  reason?: {
    text: string;
    links?: ReadonlyArray<{ label: string; url: string }>;
  };
  site: string;
  /** Tags this email's links to our pages (utm_campaign), so clicks count. */
  campaign?: string;
  headers?: Record<string, string>;
}

/** A link to one of our pages, tagged with the email it came from. */
const tagged = (url: string, site: string, campaign: string | undefined) => {
  if (!campaign || !url.startsWith(site) || url.startsWith(`${site}/api/`))
    return url;
  const tags = `utm_source=email&utm_medium=email&utm_campaign=${campaign}`;
  return `${url}${url.includes('?') ? '&' : '?'}${tags}`;
};

/** The content with its links tagged (see tagged). */
const withTags = (c: EmailContent): EmailContent => ({
  ...c,
  action: { ...c.action, url: tagged(c.action.url, c.site, c.campaign) },
  ...(c.items
    ? {
        items: c.items.map((it) => ({
          ...it,
          url: tagged(it.url, c.site, c.campaign),
        })),
      }
    : {}),
});

/** The text version: the same words, links written out. */
const plain = (c: EmailContent) =>
  [
    c.heading,
    ...c.intro,
    ...(c.stats ?? []).map(
      (s) => `${s.value} ${s.label}${s.note ? ` (${s.note})` : ''}`
    ),
    `${c.action.label}: ${c.action.url}`,
    ...(c.items ?? []).map(
      (it, i) =>
        `${c.numbered ? `${i + 1}. ` : '- '}${it.tag ? `${it.tag}: ` : ''}${
          it.title
        }\n   ${it.text}\n   ${it.url}`
    ),
    ...(c.outro ?? []),
    '—',
    ...(c.reason
      ? [
          [
            c.reason.text,
            ...(c.reason.links ?? []).map((l) => `${l.label}: ${l.url}`),
          ].join('\n'),
        ]
      : []),
    `Questions or ideas? Join the JSON Resume Discord: ${DISCORD}`,
    'This email comes from a no-reply address, so replies aren’t read.',
  ].join('\n\n');

/**
 * Every JSON Resume email: a card with a heading, a few paragraphs, one
 * button, an optional list, and the same footer. Tables and inline styles,
 * so it holds together in Gmail and Outlook; dark mode where supported.
 */
export function compose(content: EmailContent): Mail {
  const c = withTags(content);
  const items = c.items?.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 12px">${c.items
        .map((it, i) => item(it, c.numbered ? i + 1 : undefined))
        .join('')}</table>`
    : '';
  const reason = c.reason
    ? `<p class="jr-muted" style="margin:0 0 8px;font-size:13px;line-height:1.5;color:${MUTED}">${escape(
        c.reason.text
      )}${(c.reason.links ?? [])
        .map((l) => ` ${footerLink(escape(l.label), l.url)}.`)
        .join('')}</p>`
    : '';
  const host = c.site.replace(/^https?:\/\//, '');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>${escape(
    c.subject
  )}</title>${STYLE}</head>
<body class="jr-bg" style="margin:0;padding:0;background:#f4f4f2;font-family:${FONT}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escape(
    c.preview
  )}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" class="jr-bg" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 4px 16px;font-family:${FONT}"><a href="${escape(
    c.site
  )}" class="jr-ink" style="font-size:17px;font-weight:800;letter-spacing:-0.2px;color:${INK};text-decoration:none"><span style="color:${RED}">{</span> JSON Resume <span style="color:${RED}">}</span></a></td></tr>
<tr><td class="jr-card jr-pad" style="background:#ffffff;border:1px solid #e4e4e0;border-top:4px solid ${RED};border-radius:10px;padding:36px 40px;font-family:${FONT}">
<h1 class="jr-ink" style="margin:0 0 18px;font-size:24px;line-height:1.3;font-weight:700;color:${INK}">${escape(
    c.heading
  )}</h1>
${c.intro.map(p).join('\n')}
${stats(c.stats ?? [])}
${button(c.action)}
${items}
${(c.outro ?? []).map(p).join('\n')}
</td></tr>
<tr><td style="padding:20px 4px 0;font-family:${FONT}">
${reason}
<p class="jr-muted" style="margin:0 0 8px;font-size:13px;line-height:1.5;color:${MUTED}">${footerLink(
    'Dashboard',
    `${c.site}/dashboard`
  )} &nbsp;·&nbsp; ${footerLink('Discord', DISCORD)} &nbsp;·&nbsp; ${footerLink(
    'GitHub',
    GITHUB
  )}</p>
<p class="jr-muted" style="margin:0;font-size:13px;line-height:1.5;color:${MUTED}">Sent by ${escape(
    host
  )}, the open source resume standard. It comes from a no-reply address, so replies aren’t read: ask on the Discord.</p>
</td></tr></table></td></tr></table></body></html>`;
  return {
    to: c.to,
    subject: c.subject,
    text: plain(c),
    html,
    ...(c.headers ? { headers: c.headers } : {}),
  };
}
