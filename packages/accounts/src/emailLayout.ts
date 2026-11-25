import type { Mail } from './mailer';

/** Where people talk to each other and to us; every email points there. */
export const DISCORD = 'https://discord.gg/GTZtn8pTXC';
const GITHUB = 'https://github.com/jsonresume/jsonresume.org';

export const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        c
      ] ?? c)
  );

/** A line in a list under the button: a next step, or a job. */
export interface EmailItem {
  /** A short tag before the title, such as "Apply". */
  tag?: string;
  title: string;
  text: string;
  url: string;
}

export interface EmailContent {
  to: string;
  subject: string;
  /** The line inboxes show after the subject. */
  preview: string;
  heading: string;
  intro: ReadonlyArray<string>;
  action: { label: string; url: string };
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
  headers?: Record<string, string>;
}

const INK = '#1f1f1f';
const MUTED = '#6b6b6b';
const RED = '#d23a3a';
const LINK = '#a92525';
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

// Clients that read <style> (Apple Mail, iOS, Outlook.com) follow dark mode;
// the rest get the light design from the inline styles.
const STYLE = `<style>
:root{color-scheme:light dark;supported-color-schemes:light dark}
@media (prefers-color-scheme:dark){
.jr-bg{background:#121212!important}
.jr-card{background:#1d1d1d!important;border-color:#333!important}
.jr-ink{color:#ececec!important}
.jr-muted{color:#a8a8a8!important}
.jr-link{color:#ff8a8a!important}
.jr-rule{border-color:#333!important}
.jr-num{background:#3a1d1d!important;color:#ff8a8a!important}
}
@media (max-width:600px){.jr-pad{padding:28px 22px!important}}
</style>`;

const p = (s: string) =>
  `<p class="jr-ink" style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${INK}">${escape(
    s
  )}</p>`;

const button = ({ label, url }: { label: string; url: string }) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 28px"><tr><td style="border-radius:6px;background:${RED}"><a href="${escape(
    url
  )}" style="display:inline-block;padding:13px 24px;font-family:${FONT};font-size:16px;font-weight:600;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:6px">${escape(
    label
  )}</a></td></tr></table>`;

const item = (it: EmailItem, n: number | undefined) => {
  const marker =
    n === undefined
      ? ''
      : `<td valign="top" width="36" style="padding:2px 12px 0 0"><div class="jr-num" style="width:26px;height:26px;border-radius:13px;background:#fbeaea;color:${LINK};font-size:13px;font-weight:700;line-height:26px;text-align:center">${n}</div></td>`;
  const tag = it.tag
    ? `<span style="display:inline-block;margin-right:6px;padding:1px 8px;border-radius:10px;background:#fbeaea;color:${LINK};font-size:12px;font-weight:700">${escape(
        it.tag
      )}</span>`
    : '';
  return `<tr>${marker}<td valign="top" style="padding:0 0 18px">${tag}<a class="jr-link" href="${escape(
    it.url
  )}" style="font-size:16px;font-weight:600;color:${LINK};text-decoration:none">${escape(
    it.title
  )}</a><div class="jr-muted" style="margin-top:3px;font-size:14px;line-height:1.5;color:${MUTED}">${escape(
    it.text
  )}</div></td></tr>`;
};

const footerLink = (label: string, url: string) =>
  `<a class="jr-link" href="${escape(
    url
  )}" style="color:${LINK};text-decoration:none">${label}</a>`;

/** The text version: the same words, links written out. */
const plain = (c: EmailContent) =>
  [
    c.heading,
    ...c.intro,
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
export function compose(c: EmailContent): Mail {
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
