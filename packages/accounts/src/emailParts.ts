/** Where people talk to each other and to us; every email points there. */
export const DISCORD = 'https://discord.gg/GTZtn8pTXC';
export const GITHUB = 'https://github.com/jsonresume/jsonresume.org';

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

/** A number worth a glance: "23" over "people read it", with a note. */
export interface EmailStat {
  value: string;
  label: string;
  /** A line under it, such as "up from 12". */
  note?: string;
}

export const INK = '#1f1f1f';
export const MUTED = '#6b6b6b';
export const RED = '#d23a3a';
export const LINK = '#a92525';
export const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

// Clients that read <style> (Apple Mail, iOS, Outlook.com) follow dark mode;
// the rest get the light design from the inline styles.
export const STYLE = `<style>
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
@media (max-width:600px){.jr-pad{padding:28px 22px!important}.jr-statv{font-size:20px!important}.jr-stat{padding:12px 4px!important}}
</style>`;

export const p = (s: string) =>
  `<p class="jr-ink" style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${INK}">${escape(
    s
  )}</p>`;

export const button = ({ label, url }: { label: string; url: string }) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 28px"><tr><td style="border-radius:6px;background:${RED}"><a href="${escape(
    url
  )}" style="display:inline-block;padding:13px 24px;font-family:${FONT};font-size:16px;font-weight:600;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:6px">${escape(
    label
  )}</a></td></tr></table>`;

export const item = (it: EmailItem, n: number | undefined) => {
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

export const footerLink = (label: string, url: string) =>
  `<a class="jr-link" href="${escape(
    url
  )}" style="color:${LINK};text-decoration:none">${label}</a>`;

/** A row of numbers, side by side; each cell shares the width. */
export const stats = (list: ReadonlyArray<EmailStat>) =>
  list.length === 0
    ? ''
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;border-collapse:separate;border-spacing:0"><tr>${list
        .map(
          (s) =>
            `<td class="jr-rule jr-stat" valign="top" width="${Math.floor(
              100 / list.length
            )}%" style="padding:14px 10px;border:1px solid #ecece8;border-radius:8px;text-align:center"><div class="jr-ink jr-statv" style="font-size:28px;font-weight:800;line-height:1.1;color:${INK}">${escape(
              s.value
            )}</div><div class="jr-muted" style="margin-top:4px;font-size:13px;line-height:1.4;color:${MUTED}">${escape(
              s.label
            )}</div>${
              s.note
                ? `<div style="margin-top:2px;font-size:12px;font-weight:600;color:${LINK}" class="jr-link">${escape(
                    s.note
                  )}</div>`
                : ''
            }</td>`
        )
        .join('<td width="8"></td>')}</tr></table>`;
