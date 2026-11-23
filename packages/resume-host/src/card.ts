import { entries, text } from '@repo/resume-formats/read';
import { clip, profileOf } from './profileData';

/** The link-preview card's size: what LinkedIn, Slack and X show large. */
export const CARD_SIZE = { width: 1200, height: 630 } as const;

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Up to six skills: each skill's name, else its first keywords. */
const skillsOf = (resume: unknown) => {
  const skills = entries(entries([resume])[0]?.['skills']);
  const names = skills.flatMap((s) => {
    const name = text(s['name']);
    if (name) return [name];
    return entries([s])
      .flatMap((e) => (Array.isArray(e['keywords']) ? e['keywords'] : []))
      .map(text)
      .filter((k): k is string => Boolean(k))
      .slice(0, 2);
  });
  return [...new Set(names)].slice(0, 6).map((n) => clip(n, 32));
};

const placeOf = (resume: unknown) => {
  const basics = entries([entries([resume])[0]?.['basics']])[0];
  const place = entries([basics?.['location']])[0];
  return [text(place?.['city']), text(place?.['countryCode'])]
    .filter(Boolean)
    .join(', ');
};

/**
 * A resume's link-preview card (1200×630) as HTML, from its public parts
 * only: name, headline, town and country, photo and skills; never contact
 * details. ResumePdf.snapshot turns it into the PNG pages point og:image at.
 */
export function resumeCardHtml(username: string, resume: unknown): string {
  const profile = profileOf(username, resume);
  const place = placeOf(resume);
  const skills = skillsOf(resume);
  const photo = profile.image
    ? `<img class="photo" src="${escape(profile.image)}" alt="">`
    : `<div class="photo initial">${escape(
        (profile.name.replace(/^@/, '')[0] ?? '?').toUpperCase()
      )}</div>`;
  const name = clip(profile.name, 40);
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Ubuntu:wght@700&display=block">
<style>
*{box-sizing:border-box;margin:0}
body{width:${CARD_SIZE.width}px;height:${
    CARD_SIZE.height
  }px;font-family:'Open Sans',sans-serif;color:#1a1a1a;background:#fff;display:flex;flex-direction:column}
.band{background:#fff18f;padding:28px 64px;font:700 30px Ubuntu,sans-serif;display:flex;align-items:center;gap:14px}
.band svg{width:34px;height:34px}
.main{flex:1;display:flex;gap:48px;align-items:center;padding:0 64px}
.photo{width:200px;height:200px;border-radius:50%;object-fit:cover;flex:none;border:6px solid #fff9cf}
.initial{display:flex;align-items:center;justify-content:center;background:#fff18f;font:700 96px Ubuntu,sans-serif}
h1{font:700 ${
    name.length > 24 ? 56 : 68
  }px/1.1 Ubuntu,sans-serif;margin-bottom:12px}
.label{font-size:32px;line-height:1.25;color:#333;margin-bottom:10px}
.place{font-size:24px;color:#555}
.skills{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.skills span{font-size:20px;font-weight:600;padding:6px 16px;border-radius:999px;background:#f2f2f2}
.url{padding:0 64px 36px;font-size:26px;font-weight:600;color:#ce2424}
</style></head><body>
<div class="band"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2.75h8.5L19.25 7.5v13.75H6z" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linejoin="round"/><path d="M14.25 2.75V7.75h5" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linejoin="round"/><path d="M10.25 11c-1 0-1.25.5-1.25 1.25v.6c0 .55-.3.9-.9.9.6 0 .9.35.9.9v.6c0 .75.25 1.25 1.25 1.25M14.75 11c1 0 1.25.5 1.25 1.25v.6c0 .55.3.9.9.9-.6 0-.9.35-.9.9v.6c0 .75-.25 1.25-1.25 1.25" fill="none" stroke="#1a1a1a" stroke-width="1.3" stroke-linecap="round"/></svg>JSON Resume</div>
<div class="main">${photo}<div>
<h1>${escape(name)}</h1>
${
  profile.label
    ? `<div class="label">${escape(clip(profile.label, 70))}</div>`
    : ''
}
${place ? `<div class="place">${escape(place)}</div>` : ''}
${
  skills.length
    ? `<div class="skills">${skills
        .map((s) => `<span>${escape(s)}</span>`)
        .join('')}</div>`
    : ''
}
</div></div>
<div class="url">jsonresume.org/@${escape(username)}</div>
</body></html>`;
}
