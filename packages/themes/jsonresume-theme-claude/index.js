import markdownIt from 'markdown-it';

const md = markdownIt({ html: false, breaks: true, linkify: false });

function renderMarkdown(text) {
  if (!text) return '';
  return md.render(text);
}

function safeUrl(value = '') {
  try {
    const url = new URL(value);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? value : '#';
  } catch {
    return '#';
  }
}

function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const match = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(dateStr);
  if (match) {
    return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1))
      .toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  }
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? '' :
    d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function dateRange(start, end) {
  if (!start) return '';
  return `${formatDate(start)} — ${formatDate(end)}`;
}

function icon(name) {
  const icons = {
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
  };
  return icons[name] || '';
}

export function render(resume) {
  const { basics = {}, work = [], education = [], skills = [], projects = [], languages = [], references = [] } = resume;
  const { name, label, email, summary, location = {}, website, profiles = [] } = basics;

  const githubProfile = profiles.find(p => p.network?.toLowerCase() === 'github');
  const otherProfiles = profiles.filter(p => p.network?.toLowerCase() !== 'github');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name || 'Resume'}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --color-bg: #fafaf9;
      --color-surface: #ffffff;
      --color-text: #1c1917;
      --color-text-secondary: #57534e;
      --color-text-tertiary: #a8a29e;
      --color-accent: #2563eb;
      --color-accent-subtle: #dbeafe;
      --color-border: #e7e5e4;
      --color-border-strong: #d6d3d1;
      --color-tag-bg: #f5f5f4;
      --color-tag-text: #44403c;
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
      --spacing-xs: 0.25rem;
      --spacing-sm: 0.5rem;
      --spacing-md: 1rem;
      --spacing-lg: 1.5rem;
      --spacing-xl: 2rem;
      --spacing-2xl: 3rem;
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --color-bg: #0c0a09;
        --color-surface: #1c1917;
        --color-text: #fafaf9;
        --color-text-secondary: #a8a29e;
        --color-text-tertiary: #78716c;
        --color-accent: #60a5fa;
        --color-accent-subtle: #1e3a5f;
        --color-border: #292524;
        --color-border-strong: #44403c;
        --color-tag-bg: #292524;
        --color-tag-text: #d6d3d1;
      }
    }

    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: var(--font-sans);
      color: var(--color-text);
      background: var(--color-bg);
      line-height: 1.6;
      padding: var(--spacing-xl) var(--spacing-md);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      overflow: hidden;
    }

    /* Header */
    .header {
      padding: var(--spacing-2xl) var(--spacing-2xl) var(--spacing-xl);
      border-bottom: 1px solid var(--color-border);
      position: relative;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--color-accent) 0%, #7c3aed 50%, #ec4899 100%);
    }

    .header h1 {
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1.1;
      margin-bottom: var(--spacing-xs);
    }

    .header .label {
      font-size: 1.125rem;
      color: var(--color-accent);
      font-weight: 500;
      margin-bottom: var(--spacing-lg);
    }

    .contact-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm) var(--spacing-lg);
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .contact-item svg { flex-shrink: 0; opacity: 0.6; }

    .contact-item a {
      color: var(--color-text-secondary);
      text-decoration: none;
    }
    .contact-item a:hover { color: var(--color-accent); }

    /* Summary */
    .summary {
      padding: var(--spacing-xl) var(--spacing-2xl);
      border-bottom: 1px solid var(--color-border);
      font-size: 0.9375rem;
      color: var(--color-text-secondary);
      line-height: 1.8;
    }

    .summary p { margin-bottom: var(--spacing-sm); }
    .summary p:last-child { margin-bottom: 0; }

    /* Section */
    .section {
      padding: var(--spacing-xl) var(--spacing-2xl);
      border-bottom: 1px solid var(--color-border);
    }

    .section:last-child { border-bottom: none; }

    .section-title {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-tertiary);
      margin-bottom: var(--spacing-lg);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--color-border);
    }

    /* Entry */
    .entry { margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-xl); border-bottom: 1px solid var(--color-border); }
    .entry:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: var(--spacing-xs) var(--spacing-md);
      margin-bottom: var(--spacing-xs);
    }

    .entry-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-text);
    }

    .entry-date {
      font-size: 0.8125rem;
      font-family: var(--font-mono);
      color: var(--color-text-tertiary);
      white-space: nowrap;
    }

    .entry-subtitle {
      font-size: 0.875rem;
      color: var(--color-accent);
      font-weight: 500;
      margin-bottom: var(--spacing-sm);
    }

    .entry-subtitle a {
      color: inherit;
      text-decoration: none;
    }
    .entry-subtitle a:hover { text-decoration: underline; }

    .entry-body {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
    }

    .entry-body p { margin-bottom: var(--spacing-xs); }
    .entry-body p:last-child { margin-bottom: 0; }

    /* Skills */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
    }

    .skill-group h3 {
      font-size: 0.875rem;
      font-weight: 700;
      margin-bottom: var(--spacing-sm);
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
    }

    .skill-tag {
      font-size: 0.75rem;
      font-family: var(--font-mono);
      padding: 0.2em 0.6em;
      background: var(--color-tag-bg);
      color: var(--color-tag-text);
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
    }

    /* Projects */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--spacing-md);
    }

    .project-card {
      padding: var(--spacing-lg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-tag-bg);
    }

    .project-card h3 {
      font-size: 0.9375rem;
      font-weight: 700;
      margin-bottom: var(--spacing-xs);
    }

    .project-card h3 a {
      color: var(--color-text);
      text-decoration: none;
    }
    .project-card h3 a:hover { color: var(--color-accent); }

    .project-card p {
      font-size: 0.8125rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    /* References */
    .reference {
      padding: var(--spacing-lg);
      background: var(--color-tag-bg);
      border-radius: var(--radius-md);
      border-left: 3px solid var(--color-accent);
      margin-bottom: var(--spacing-md);
    }

    .reference:last-child { margin-bottom: 0; }

    .reference blockquote {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
      font-style: italic;
      margin-bottom: var(--spacing-sm);
    }

    .reference cite {
      font-size: 0.8125rem;
      font-weight: 600;
      font-style: normal;
      color: var(--color-text);
    }

    /* Education */
    .courses {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-sm);
    }

    /* Print styles */
    @media print {
      html { font-size: 13px; }
      body { padding: 0; background: white; }
      .container {
        border: none;
        border-radius: 0;
        box-shadow: none;
      }
      .header::before { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .skill-tag, .reference, .project-card {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      .section { break-inside: avoid; }
      .entry { break-inside: avoid; }
    }

    /* Responsive */
    @media (max-width: 640px) {
      .header, .section, .summary { padding-left: var(--spacing-lg); padding-right: var(--spacing-lg); }
      .header h1 { font-size: 1.5rem; }
      .skills-grid { grid-template-columns: 1fr; }
      .projects-grid { grid-template-columns: 1fr; }
      .entry-header { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>${name || ''}</h1>
      ${label ? `<div class="label">${label}</div>` : ''}
      <div class="contact-row">
        ${location.city ? `<span class="contact-item">${icon('location')}${[location.city, location.region, location.countryCode].filter(Boolean).join(', ')}</span>` : ''}
        ${email ? `<span class="contact-item">${icon('email')}<a href="mailto:${email}">${email}</a></span>` : ''}
        ${website ? `<span class="contact-item">${icon('link')}<a href="${safeUrl(website)}">${website.replace(/^https?:\/\//, '')}</a></span>` : ''}
        ${githubProfile ? `<span class="contact-item">${icon('github')}<a href="${safeUrl(githubProfile.url)}">${githubProfile.username}</a></span>` : ''}
        ${otherProfiles.map(p => `<span class="contact-item">${icon('link')}<a href="${safeUrl(p.url)}">${p.network}</a></span>`).join('')}
      </div>
    </header>

    ${summary ? `<div class="summary">${renderMarkdown(summary)}</div>` : ''}

    ${work.length ? `
    <section class="section">
      <div class="section-title">Experience</div>
      ${work.map(job => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${job.position || ''}</span>
          <span class="entry-date">${dateRange(job.startDate, job.endDate)}</span>
        </div>
        <div class="entry-subtitle">${job.website ? `<a href="${safeUrl(job.website)}">${job.company || ''}</a>` : job.company || ''}</div>
        ${job.summary ? `<div class="entry-body">${renderMarkdown(job.summary)}</div>` : ''}
      </div>`).join('')}
    </section>` : ''}

    ${skills.length ? `
    <section class="section">
      <div class="section-title">Skills</div>
      <div class="skills-grid">
        ${skills.map(group => `
        <div class="skill-group">
          <h3>${group.name || ''}</h3>
          <div class="skill-tags">
            ${(group.keywords || []).map(k => `<span class="skill-tag">${k}</span>`).join('')}
          </div>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${projects.length ? `
    <section class="section">
      <div class="section-title">Projects</div>
      <div class="projects-grid">
        ${projects.map(p => `
        <div class="project-card">
          <h3>${p.url ? `<a href="${safeUrl(p.url)}">${p.name || ''}</a>` : p.name || ''}</h3>
          ${p.description ? `<p>${p.description}</p>` : ''}
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${education.length ? `
    <section class="section">
      <div class="section-title">Education</div>
      ${education.map(edu => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${edu.institution || ''}</span>
          <span class="entry-date">${dateRange(edu.startDate, edu.endDate)}</span>
        </div>
        <div class="entry-subtitle">${[edu.studyType, edu.area].filter(Boolean).join(' of ')}</div>
        ${edu.courses?.length ? `
        <div class="courses">
          ${edu.courses.map(c => `<span class="skill-tag">${c}</span>`).join('')}
        </div>` : ''}
      </div>`).join('')}
    </section>` : ''}

    ${references.length ? `
    <section class="section">
      <div class="section-title">References</div>
      ${references.map(ref => `
      <div class="reference">
        <blockquote>${ref.reference || ''}</blockquote>
        <cite>— ${ref.name || ''}</cite>
      </div>`).join('')}
    </section>` : ''}
  </div>
</body>
</html>`;
}
