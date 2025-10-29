/**
 * JSON Resume Modern Theme
 * Clean, minimal design with purple accent and subtle shadows
 * Built with @resume/core primitives
 */

import {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  BadgeList,
} from '@resume/core';

export function render(resume) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
  } = resume;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${basics.name || 'Resume'}</title>
  <style>
    /* Design Tokens from @resume/core (inlined) */
    :root {
      --resume-font-sans: "Helvetica Neue", Helvetica, Arial, sans-serif;
      --resume-size-name: 36px;
      --resume-size-heading: 16px;
      --resume-size-body: 11px;
      --resume-size-small: 10px;
      --resume-color-primary: #1a1a1a;
      --resume-color-secondary: #4a4a4a;
      --resume-color-accent: #2563eb;
      --resume-space-section: 24px;
      --resume-space-item: 16px;
      --resume-max-width: 660px;
    }
  </style>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #1f2937;
      background: #f9fafb;
      padding: 40px 20px;
    }

    .resume-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
      padding: 48px;
    }

    /* Modern purple theme */
    :root {
      --resume-color-primary: #1f2937;
      --resume-color-secondary: #6b7280;
      --resume-color-accent: #8b5cf6;
      --resume-color-accent-light: #ede9fe;
    }

    /* Hero section */
    .resume-header {
      text-align: center;
      padding-bottom: 32px;
      border-bottom: 2px solid #f3f4f6;
      margin-bottom: 40px;
    }

    .resume-name {
      font-size: 42px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }

    .resume-label {
      font-size: 18px;
      color: var(--resume-color-accent);
      font-weight: 500;
      margin-bottom: 16px;
    }

    .resume-contact {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      font-size: 13px;
      color: var(--resume-color-secondary);
    }

    .resume-contact a {
      color: var(--resume-color-accent);
      text-decoration: none;
      transition: color 0.2s;
    }

    .resume-contact a:hover {
      color: #7c3aed;
    }

    .resume-summary {
      margin-top: 20px;
      font-size: 15px;
      line-height: 1.7;
      color: var(--resume-color-secondary);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Sections */
    .resume-section {
      margin-bottom: 36px;
    }

    .resume-section-title {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--resume-color-accent);
      display: inline-block;
    }

    /* List items */
    .resume-item {
      margin-bottom: 24px;
      padding-left: 20px;
      border-left: 3px solid #f3f4f6;
      transition: border-color 0.2s;
    }

    .resume-item:hover {
      border-left-color: var(--resume-color-accent-light);
    }

    .resume-item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
    }

    .resume-item-title {
      font-size: 17px;
      font-weight: 600;
      color: #111827;
    }

    .resume-item-subtitle {
      font-size: 15px;
      color: var(--resume-color-secondary);
      margin-bottom: 4px;
    }

    .resume-item-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: var(--resume-color-secondary);
      margin-bottom: 12px;
    }

    .resume-date,
    .resume-location {
      display: flex;
      align-items: center;
    }

    .resume-description {
      margin-bottom: 12px;
      color: #374151;
      line-height: 1.6;
    }

    .resume-highlights {
      list-style: none;
      margin-top: 8px;
    }

    .resume-highlights li {
      position: relative;
      padding-left: 20px;
      margin-bottom: 6px;
      color: #4b5563;
    }

    .resume-highlights li::before {
      content: "→";
      position: absolute;
      left: 0;
      color: var(--resume-color-accent);
      font-weight: 600;
    }

    /* Badges */
    .resume-badge-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .resume-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      background: var(--resume-color-accent-light);
      color: var(--resume-color-accent);
      transition: all 0.2s;
    }

    .resume-badge:hover {
      background: var(--resume-color-accent);
      color: white;
      transform: translateY(-1px);
    }

    .resume-skill-group {
      margin-bottom: 16px;
    }

    .resume-skill-group strong {
      display: block;
      margin-bottom: 8px;
      color: #111827;
      font-size: 14px;
    }

    /* Print styles */
    @media print {
      body {
        background: white;
        padding: 0;
      }

      .resume-container {
        box-shadow: none;
        border-radius: 0;
        padding: 20px;
      }

      .resume-item:hover {
        border-left-color: #f3f4f6;
      }

      .resume-badge:hover {
        background: var(--resume-color-accent-light);
        color: var(--resume-color-accent);
        transform: none;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    ${renderHero(basics)}
    ${work.length > 0 ? renderWork(work) : ''}
    ${education.length > 0 ? renderEducation(education) : ''}
    ${skills.length > 0 ? renderSkills(skills) : ''}
    ${projects.length > 0 ? renderProjects(projects) : ''}
  </div>
</body>
</html>`;
}

function renderHero(basics) {
  const {
    name,
    label,
    email,
    phone,
    url,
    summary,
    location,
    profiles = [],
  } = basics;

  const contactItems = [
    email ? `<a href="mailto:${email}">${email}</a>` : '',
    phone ? `<span>${phone}</span>` : '',
    url
      ? `<a href="${url}" target="_blank">${url.replace(
          /^https?:\/\//,
          ''
        )}</a>`
      : '',
    location
      ? `<span>${[location.city, location.region]
          .filter(Boolean)
          .join(', ')}</span>`
      : '',
    ...profiles.map(
      (p) => `<a href="${p.url}" target="_blank">${p.network}</a>`
    ),
  ].filter(Boolean);

  return `<header class="resume-header">
  <h1 class="resume-name">${name || ''}</h1>
  ${label ? `<div class="resume-label">${label}</div>` : ''}
  ${
    contactItems.length > 0
      ? `<div class="resume-contact">${contactItems.join(' • ')}</div>`
      : ''
  }
  ${summary ? `<p class="resume-summary">${summary}</p>` : ''}
</header>`;
}

function renderWork(work) {
  const items = work
    .map((job) => {
      const {
        name,
        position,
        startDate,
        endDate,
        location,
        summary,
        highlights = [],
      } = job;

      return ListItem({
        title: position || '',
        subtitle: name || '',
        dateRange: startDate ? DateRange({ startDate, endDate }) : '',
        location: location || '',
        description: summary || '',
        highlights,
      });
    })
    .join('\n');

  return Section({
    id: 'work',
    content: `${SectionTitle({ title: 'Experience' })}\n${items}`,
  });
}

function renderEducation(education) {
  const items = education
    .map((edu) => {
      const { institution, area, studyType, startDate, endDate, score } = edu;

      const title = [studyType, area].filter(Boolean).join(' in ');
      const highlights = score ? [`GPA: ${score}`] : [];

      return ListItem({
        title: title || institution,
        subtitle: title ? institution : '',
        dateRange: startDate ? DateRange({ startDate, endDate }) : '',
        highlights: highlights.length > 0 ? highlights : undefined,
      });
    })
    .join('\n');

  return Section({
    id: 'education',
    content: `${SectionTitle({ title: 'Education' })}\n${items}`,
  });
}

function renderSkills(skills) {
  const skillGroups = skills
    .map((skillGroup) => {
      const { name, keywords = [] } = skillGroup;
      return `<div class="resume-skill-group">
  ${name ? `<strong>${name}</strong>` : ''}
  ${BadgeList({ items: keywords, variant: 'accent' })}
</div>`;
    })
    .join('\n');

  return Section({
    id: 'skills',
    content: `${SectionTitle({ title: 'Skills' })}\n${skillGroups}`,
  });
}

function renderProjects(projects) {
  const items = projects
    .map((project) => {
      const {
        name,
        description,
        highlights = [],
        keywords = [],
        startDate,
        endDate,
        url,
      } = project;

      const desc = [
        description || '',
        url ? `<a href="${url}" target="_blank">${url}</a>` : '',
        keywords.length > 0
          ? BadgeList({ items: keywords, variant: 'accent' })
          : '',
      ]
        .filter(Boolean)
        .join('<br>');

      return ListItem({
        title: name || '',
        dateRange: startDate ? DateRange({ startDate, endDate }) : '',
        description: desc,
        highlights: highlights.length > 0 ? highlights : undefined,
      });
    })
    .join('\n');

  return Section({
    id: 'projects',
    content: `${SectionTitle({ title: 'Projects' })}\n${items}`,
  });
}

export default { render };
