const css = `:root {
  --text: #0f172a;
  --muted: #334155;
  --summary-light: #7c8798;
  --heading: #0b1220;
  --header-bg: #0f274d;
  --right-bg: #edf4ff;
  --right-text: #0f274d;
}
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  color: var(--text);
  font-family: Aptos, "Gill Sans MT", "Gill Sans", Calibri, "Trebuchet MS", sans-serif;
  line-height: 1.22;
  font-size: 10pt;
}
.resume {
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.28in 0.32in;
}
.header {
  display: grid;
  grid-template-columns: 1fr 88px;
  gap: 10px;
  align-items: start;
  margin-bottom: 8px;
  background: var(--header-bg);
  border: 1px solid #0b1f3f;
  padding: 10px 10px 8px;
}
.header-main {
  text-align: center;
}
.name {
  margin: 0;
  font-size: 22pt;
  line-height: 1.05;
  color: #f8fbff;
}
.label {
  margin: 3px 0 0;
  font-size: 10.4pt;
  color: #e6f0ff;
  font-style: italic;
}
.layout {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 0.16in;
  align-items: start;
}
.right-panel {
  background: var(--right-bg);
  color: var(--right-text);
  padding: 8px 8px 6px;
  line-height: 1.14;
}
.right-panel .section-title {
  color: var(--right-text);
}
.right-panel .compact-list li,
.right-panel .contact-list li,
.right-panel .skill-group,
.right-panel a {
  color: var(--right-text);
}
.right-panel .compact-list li,
.right-panel .contact-list li,
.right-panel .skill-group,
.right-panel .compact-sub li {
  font-size: 9.15pt;
}
.photo,
.photo-empty {
  width: 100%;
  height: 100%;
}
.photo-wrap {
  width: 68px;
  height: 68px;
  border: 1px solid #93c5fd;
  background: #eff6ff;
}
.photo {
  object-fit: cover;
  display: block;
}
.photo-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 8.4pt;
  color: #1d4ed8;
  padding: 6px;
}
.section {
  margin-top: 7px;
}
.section-title {
  margin: 0 0 4px;
  font-size: 14.2pt;
  font-weight: 700;
  color: var(--heading);
}
.summary {
  margin: 0;
  text-align: left;
  font-size: 10.05pt;
}
.item {
  margin-bottom: 5px;
}
.work-item-keep {
  width: 100%;
  display: block;
  margin-bottom: 5px;
  break-inside: avoid;
  page-break-inside: avoid;
}
.item-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}
.item-role {
  margin: 0;
  font-size: 10.5pt;
  font-weight: 700;
}
.item-org {
  margin: 0.5px 0 0;
  color: var(--muted);
  font-size: 10.5pt;
  font-style: italic;
}
.item-dates {
  white-space: nowrap;
  color: var(--muted);
  font-size: 9.15pt;
}
.item-summary {
  margin: 1px 0 2px;
  color: var(--summary-light);
  font-style: italic;
}
.bullets {
  margin: 2px 0 0;
  padding: 0;
  list-style: none;
}
.bullets li {
  margin: 0 0 1px;
  line-height: 1.12;
  position: relative;
  padding-left: 12px;
}
.bullets li::before {
  content: "•";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--muted);
}
.contact-list,
.compact-list {
  margin: 0;
  padding: 0 0 0 14px;
  list-style: disc;
}
.contact-list {
  padding-left: 0;
  list-style: none;
}
.contact-list li,
.compact-list li {
  margin-bottom: 5px;
  font-size: 9.7pt;
}
.contact-list li {
  margin-bottom: 2px;
  line-height: 1.08;
}
.contact-icon {
  display: inline-flex;
  width: 0.82em;
  height: 0.82em;
  margin-right: 4px;
  vertical-align: -0.08em;
}
.contact-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}
.compact-sub {
  margin: 1px 0 0 14px;
  padding: 0;
}
.compact-sub li {
  font-size: 9.35pt;
  margin-bottom: 0;
}
.compact-list > li {
  margin-bottom: 7px;
}
.cert-list > li {
  margin-bottom: 2px;
  line-height: 1.1;
}
.compact-list li::marker {
  color: var(--muted);
}
.skill-group {
  margin-bottom: 6px;
  font-size: 9.65pt;
}
.skill-name {
  font-weight: 700;
}
.skills-section,
.skills-section .section-title {
  break-inside: avoid;
  page-break-inside: avoid;
}
.skills-section .section-title {
  break-after: avoid;
  page-break-after: avoid;
}
a {
  color: inherit;
  text-decoration: none;
}
.print-footer {
  display: none;
}
@media print {
  @page {
    size: Letter;
    margin: 0.32in 0.32in 0.22in 0.32in;
  }
  html,
  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .resume {
    max-width: none;
    margin: 0;
    padding: 0.03in 0 0.26in;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
  .layout {
    align-items: start;
  }
  .layout > div,
  .right-panel {
    padding-bottom: 0.28in;
  }
  .right-panel {
    background: transparent;
    padding-left: 0;
    padding-right: 0;
  }
  .right-panel .section {
    background: var(--right-bg);
    margin-top: 7px;
    padding: 6px 8px;
  }
  .right-panel .section:first-child {
    margin-top: 0;
  }
  .bullets,
  .compact-list,
  .skills-section {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .section-title {
    break-after: avoid;
    page-break-after: avoid;
  }
  .work-section .work-item-keep,
  .work-section .work-item-keep .item,
  .work-section .work-item-keep .item-head,
  .work-section .work-item-keep .item-summary,
  .work-section .work-item-keep .bullets,
  .work-section .work-item-keep .bullets li {
    break-inside: avoid-page !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    -webkit-column-break-inside: avoid;
    -moz-column-break-inside: avoid;
  }
  .work-section .work-item-keep {
    page-break-before: auto;
    break-before: auto;
  }
  .print-footer {
    display: flex !important;
    position: fixed;
    left: 0.32in;
    right: 0.32in;
    bottom: 0in;
    height: 0.22in;
    padding: 0 0 0.01in;
    font-size: 7.8pt;
    line-height: 1.15;
    color: var(--summary-light);
    font-style: italic;
    background: transparent;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 999;
    pointer-events: none;
  }
}`;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(value) {
  if (!value) return '';
  const normalized = String(value).trim();
  if (!normalized) return '';

  const parsed = new Date(
    /^\d{4}-\d{2}$/.test(normalized) ? `${normalized}-01` : normalized
  );
  if (Number.isNaN(parsed.getTime())) return escapeHtml(value);
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function dateRange(start, end) {
  const startFormatted = formatDate(start);
  const endFormatted = formatDate(end);

  if (startFormatted && endFormatted)
    return `${startFormatted} - ${endFormatted}`;
  if (startFormatted) return `${startFormatted} - Present`;
  if (endFormatted) return endFormatted;
  return '';
}

function section(title, body, className = '') {
  if (!body) return '';
  return `<section class="section ${className}"><h2 class="section-title">${escapeHtml(
    title
  )}</h2>${body}</section>`;
}

function limit(text, maxChars) {
  const normalized = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars - 1).trimEnd()}…`;
}

function profileIcon(profile = {}) {
  const network = String(profile.network || '').toLowerCase();
  const url = String(profile.url || '').toLowerCase();

  if (network.includes('linkedin') || url.includes('linkedin.com')) {
    return `<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><rect x="0" y="0" width="24" height="24" rx="3" fill="#111111"></rect><text x="12" y="17" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#ffffff">in</text></svg></span>`;
  }

  if (network.includes('github') || url.includes('github.com')) {
    return `<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><circle cx="12" cy="12" r="12" fill="#111111"></circle><path d="M12 5.2c-3.85 0-6.97 3.12-6.97 6.97 0 3.08 2 5.7 4.77 6.62.35.06.48-.15.48-.34 0-.17-.01-.73-.01-1.33-1.94.42-2.35-.82-2.35-.82-.32-.8-.78-1.02-.78-1.02-.64-.44.05-.43.05-.43.71.05 1.08.73 1.08.73.63 1.08 1.65.77 2.06.59.06-.46.25-.77.45-.95-1.55-.18-3.18-.78-3.18-3.46 0-.76.27-1.38.72-1.87-.07-.18-.31-.91.07-1.9 0 0 .58-.19 1.92.71a6.7 6.7 0 0 1 3.49 0c1.33-.9 1.92-.71 1.92-.71.38.99.14 1.72.07 1.9.45.49.72 1.11.72 1.87 0 2.68-1.63 3.28-3.19 3.45.26.22.48.65.48 1.3 0 .95-.01 1.71-.01 1.95 0 .19.13.41.49.34A6.98 6.98 0 0 0 18.97 12.17c0-3.85-3.12-6.97-6.97-6.97Z" fill="#ffffff"></path></svg></span>`;
  }

  return `<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><circle cx="12" cy="12" r="10" fill="none" stroke="#0f172a" stroke-width="1.8"></circle><path d="M2 12h20M12 2a14 14 0 0 1 0 20M12 2a14 14 0 0 0 0 20" fill="none" stroke="#0f172a" stroke-width="1.4"></path></svg></span>`;
}

function contactIcon(type) {
  if (type === 'phone') {
    return `<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M6.6 2.8h3.2c.55 0 1 .45 1 1v2.6c0 .5-.37.92-.86.99l-1.5.2a13.5 13.5 0 0 0 8 8l.2-1.5c.07-.49.49-.86.99-.86h2.6c.55 0 1 .45 1 1v3.2c0 .55-.45 1-1 1A17.8 17.8 0 0 1 5.6 3.8c0-.55.45-1 1-1Z" fill="#0f172a"></path></svg></span>`;
  }
  if (type === 'mail') {
    return `<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="#0f172a" stroke-width="1.8"></rect><path d="M4 7l8 6 8-6" fill="none" stroke="#0f172a" stroke-width="1.8"></path></svg></span>`;
  }
  if (type === 'location') {
    return `<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z" fill="none" stroke="#0f172a" stroke-width="1.8"></path><circle cx="12" cy="10" r="2.4" fill="#0f172a"></circle></svg></span>`;
  }
  return `<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img" focusable="false"><circle cx="12" cy="12" r="10" fill="none" stroke="#0f172a" stroke-width="1.8"></circle><path d="M2 12h20M12 2a14 14 0 0 1 0 20M12 2a14 14 0 0 0 0 20" fill="none" stroke="#0f172a" stroke-width="1.4"></path></svg></span>`;
}

function renderContactSection(basics = {}) {
  const lines = [];

  if (basics.phone)
    lines.push(`<li>${contactIcon('phone')}${escapeHtml(basics.phone)}</li>`);
  if (basics.email)
    lines.push(
      `<li>${contactIcon('mail')}<a href="mailto:${escapeHtml(
        basics.email
      )}">${escapeHtml(basics.email)}</a></li>`
    );

  const location = [
    basics.location?.address,
    basics.location?.city,
    basics.location?.region,
    basics.location?.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  if (location)
    lines.push(`<li>${contactIcon('location')}${escapeHtml(location)}</li>`);

  if (basics.url)
    lines.push(
      `<li>${contactIcon('globe')}<a href="${escapeHtml(
        basics.url
      )}">${escapeHtml(basics.url)}</a></li>`
    );

  (basics.profiles || []).forEach((profile) => {
    if (!profile?.url) return;
    lines.push(
      `<li>${profileIcon(profile)}<a href="${escapeHtml(
        profile.url
      )}">${escapeHtml(profile.url)}</a></li>`
    );
  });

  return section(
    'Contact',
    lines.length ? `<ul class="contact-list">${lines.join('')}</ul>` : ''
  );
}

function renderSummary(basics = {}) {
  if (basics.summary) {
    return section(
      'Summary',
      `<p class="summary">${escapeHtml(limit(basics.summary, 650))}</p>`
    );
  }

  if (basics.label) {
    return section(
      'Summary',
      `<p class="summary">${escapeHtml(limit(basics.label, 650))}</p>`
    );
  }

  return '';
}

function renderProfessionalExperience(work = []) {
  if (!work.length) return '';

  const items = work
    .map((job) => {
      const title = job.position || '';
      const org = job.name
        ? `<p class="item-org">${escapeHtml(job.name)}</p>`
        : '';
      const details = [];

      if (job.summary)
        details.push(`<p class="item-summary">${escapeHtml(job.summary)}</p>`);
      if (Array.isArray(job.highlights) && job.highlights.length) {
        const bullets = job.highlights
          .map(
            (highlight) =>
              `<li>${escapeHtml(String(highlight).replace(/^\*\s*/, ''))}</li>`
          )
          .join('');
        details.push(`<ul class="bullets">${bullets}</ul>`);
      }

      return `
      <div class="work-item-keep">
        <article class="item">
          <div class="item-head">
            <div>
              <h3 class="item-role">${escapeHtml(title)}</h3>
              ${org}
            </div>
            <div class="item-dates">${escapeHtml(
              dateRange(job.startDate, job.endDate)
            )}</div>
          </div>
          ${details.join('')}
        </article>
      </div>
    `;
    })
    .join('');

  return section('Professional Experience', items, 'work-section');
}

function renderEducation(education = []) {
  const items = education
    .map((item) => {
      const title = [item.studyType, item.area].filter(Boolean).join(' in ');
      const institution = item.institution ? `${item.institution}` : '';
      const courses =
        Array.isArray(item.courses) && item.courses.length
          ? `<ul class="compact-sub">${item.courses
              .map((course) => `<li>${escapeHtml(course)}</li>`)
              .join('')}</ul>`
          : '';
      return `<li><strong>${escapeHtml(title)}</strong>${
        institution ? `, <em>${escapeHtml(institution)}</em>` : ''
      }${courses}</li>`;
    })
    .join('');

  return section(
    'Education',
    `<ul class="compact-list edu-list">${items}</ul>`
  );
}

function renderCertificates(certificates = []) {
  if (!certificates.length) return '';
  const items = certificates
    .slice(0, 12)
    .map((cert) => {
      const certName = cert.name
        ? `<strong>${escapeHtml(cert.name)}</strong>`
        : '';
      const issuer = cert.issuer
        ? ` — <em>${escapeHtml(cert.issuer)}</em>`
        : '';
      return `<li>${certName}${issuer}</li>`;
    })
    .join('');
  return section(
    'Certifications',
    `<ul class="compact-list cert-list">${items}</ul>`
  );
}

function renderSkills(skills = []) {
  if (!skills.length) return '';
  const blocks = skills
    .map((skill) => {
      const keywords = Array.isArray(skill.keywords)
        ? skill.keywords.slice(0, 12).join(', ')
        : '';
      return `
      <div class="skill-group">
        <span class="skill-name">${escapeHtml(skill.name)}:</span>
        <span>${escapeHtml(keywords)}</span>
      </div>
    `;
    })
    .join('');

  return section('Skills', `<div>${blocks}</div>`, 'skills-section');
}

export function render(resume = {}) {
  const basics = resume.basics || {};
  const name = basics.name || 'Resume';
  const label = basics.label
    ? `<p class="label">${escapeHtml(basics.label)}</p>`
    : '';
  const footerText = [basics.name, basics.label].filter(Boolean).join(': ');
  const photo = basics.image
    ? `<img class="photo" src="${escapeHtml(basics.image)}" alt="${escapeHtml(
        name
      )} profile photo" />`
    : `<div class="photo-empty">Profile Photo</div>`;

  const leftColumn = [
    renderSummary(basics),
    renderProfessionalExperience(resume.work || []),
  ].join('');

  const rightColumn = [
    renderContactSection(basics),
    renderEducation(resume.education || []),
    renderCertificates(resume.certificates || []),
    renderSkills(resume.skills || []),
  ].join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(name)} - Resume</title>
  <style>${css}</style>
</head>
<body>
  <main class="resume" role="main">
    <header class="header" role="banner">
      <div class="header-main">
        <h1 class="name">${escapeHtml(name)}</h1>
        ${label}
      </div>
      <div class="photo-wrap" aria-label="Profile image">
        ${photo}
      </div>
    </header>
    <div class="layout">
      <div>${leftColumn}</div>
      <aside class="right-panel">${rightColumn}</aside>
    </div>
  </main>
  ${
    footerText
      ? `<footer class="print-footer" role="contentinfo">${escapeHtml(
          footerText
        )}</footer>`
      : ''
  }
</body>
</html>`;
}

export const pdfRenderOptions = {
  mediaType: 'print',
  margin: {
    top: '0.32in',
    right: '0.32in',
    bottom: '0.22in',
    left: '0.32in',
  },
};

export default { render, pdfRenderOptions };
