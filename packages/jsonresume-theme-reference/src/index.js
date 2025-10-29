/**
 * JSON Resume Reference Theme
 * Demonstrates @resume/core best practices
 * Framework-agnostic, ATS-friendly, fully tested
 */

import {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  Badge,
  BadgeList,
} from '@resume/core';

/**
 * Render complete resume from JSON Resume schema
 * @param {Object} resume - JSON Resume object
 * @returns {string} Complete HTML document
 */
export function render(resume) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    volunteer = [],
    awards = [],
    publications = [],
    languages = [],
    interests = [],
    references = [],
    projects = [],
  } = resume;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${basics.name || 'Resume'}</title>
  <link rel="stylesheet" href="https://unpkg.com/@resume/core@0.1.0/src/styles/tokens.css">
  <style>
    body {
      font-family: var(--resume-font-sans);
      font-size: var(--resume-size-body);
      color: var(--resume-color-primary);
      line-height: 1.6;
      max-width: var(--resume-max-width);
      margin: 0 auto;
      padding: 40px 20px;
    }

    .resume-header {
      text-align: center;
      margin-bottom: var(--resume-space-section);
    }

    .resume-name {
      font-size: var(--resume-size-name);
      font-weight: 700;
      margin: 0 0 8px 0;
      color: var(--resume-color-primary);
    }

    .resume-label {
      font-size: var(--resume-size-heading);
      color: var(--resume-color-secondary);
      margin: 0 0 16px 0;
    }

    .resume-contact {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      font-size: var(--resume-size-body);
    }

    .resume-contact a {
      color: var(--resume-color-accent);
      text-decoration: none;
    }

    .resume-summary {
      text-align: center;
      margin: 16px 0;
      color: var(--resume-color-secondary);
    }

    .resume-section {
      margin-bottom: var(--resume-space-section);
    }

    .resume-section-title {
      font-size: var(--resume-size-heading);
      font-weight: 600;
      color: var(--resume-color-primary);
      margin: 0 0 12px 0;
      padding-bottom: 4px;
      border-bottom: 2px solid var(--resume-color-accent);
    }

    .resume-item {
      margin-bottom: 16px;
    }

    .resume-item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }

    .resume-item-title {
      font-weight: 600;
      color: var(--resume-color-primary);
    }

    .resume-item-subtitle {
      color: var(--resume-color-secondary);
      margin-bottom: 4px;
    }

    .resume-item-meta {
      display: flex;
      gap: 12px;
      font-size: 10px;
      color: var(--resume-color-tertiary);
      margin-bottom: 8px;
    }

    .resume-description {
      margin: 8px 0;
    }

    .resume-highlights {
      margin: 8px 0;
      padding-left: 20px;
    }

    .resume-highlights li {
      margin: 4px 0;
    }

    .resume-badge-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .resume-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: var(--resume-radius-sm);
      font-size: 10px;
      font-weight: 500;
    }

    .resume-badge-default {
      background: var(--resume-color-muted);
      color: var(--resume-color-primary);
    }

    .resume-badge-accent {
      background: var(--resume-color-accent-light);
      color: var(--resume-color-accent);
    }
  </style>
</head>
<body>
  ${renderHero(basics)}
  ${work.length > 0 ? renderWork(work) : ''}
  ${education.length > 0 ? renderEducation(education) : ''}
  ${skills.length > 0 ? renderSkills(skills) : ''}
  ${projects.length > 0 ? renderProjects(projects) : ''}
  ${volunteer.length > 0 ? renderVolunteer(volunteer) : ''}
  ${awards.length > 0 ? renderAwards(awards) : ''}
  ${publications.length > 0 ? renderPublications(publications) : ''}
  ${languages.length > 0 ? renderLanguages(languages) : ''}
  ${interests.length > 0 ? renderInterests(interests) : ''}
  ${references.length > 0 ? renderReferences(references) : ''}
</body>
</html>`;
}

/**
 * Render hero section with name, label, contact info
 */
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
    url ? `<a href="${url}">${url}</a>` : '',
    location
      ? `<span>${[location.city, location.region, location.countryCode]
          .filter(Boolean)
          .join(', ')}</span>`
      : '',
    ...profiles.map((p) => `<a href="${p.url}">${p.network}</a>`),
  ].filter(Boolean);

  return `<header class="resume-header">
  <h1 class="resume-name">${name || ''}</h1>
  ${label ? `<p class="resume-label">${label}</p>` : ''}
  ${
    contactItems.length > 0
      ? `<div class="resume-contact">${contactItems.join(' • ')}</div>`
      : ''
  }
  ${summary ? `<p class="resume-summary">${summary}</p>` : ''}
</header>`;
}

/**
 * Render work experience section
 */
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
    content: `${SectionTitle({ title: 'Work Experience' })}\n${items}`,
  });
}

/**
 * Render education section
 */
function renderEducation(education) {
  const items = education
    .map((edu) => {
      const {
        institution,
        area,
        studyType,
        startDate,
        endDate,
        score,
        courses = [],
      } = edu;

      const title = [studyType, area].filter(Boolean).join(' in ');
      const highlights = [score ? `GPA: ${score}` : '', ...courses].filter(
        Boolean
      );

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

/**
 * Render skills section with badge lists
 */
function renderSkills(skills) {
  const skillGroups = skills
    .map((skillGroup) => {
      const { name, keywords = [] } = skillGroup;
      return `<div class="resume-skill-group">
  ${name ? `<strong>${name}:</strong> ` : ''}
  ${BadgeList({ items: keywords, variant: 'default' })}
</div>`;
    })
    .join('\n');

  return Section({
    id: 'skills',
    content: `${SectionTitle({ title: 'Skills' })}\n${skillGroups}`,
  });
}

/**
 * Render projects section
 */
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
        url ? `<a href="${url}">${url}</a>` : '',
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

/**
 * Render volunteer experience
 */
function renderVolunteer(volunteer) {
  const items = volunteer
    .map((vol) => {
      const {
        organization,
        position,
        startDate,
        endDate,
        summary,
        highlights = [],
      } = vol;

      return ListItem({
        title: position || '',
        subtitle: organization || '',
        dateRange: startDate ? DateRange({ startDate, endDate }) : '',
        description: summary || '',
        highlights,
      });
    })
    .join('\n');

  return Section({
    id: 'volunteer',
    content: `${SectionTitle({ title: 'Volunteer Experience' })}\n${items}`,
  });
}

/**
 * Render awards section
 */
function renderAwards(awards) {
  const items = awards
    .map((award) => {
      const { title, date, awarder, summary } = award;

      return ListItem({
        title: title || '',
        subtitle: awarder || '',
        dateRange: date || '',
        description: summary || '',
      });
    })
    .join('\n');

  return Section({
    id: 'awards',
    content: `${SectionTitle({ title: 'Awards & Honors' })}\n${items}`,
  });
}

/**
 * Render publications section
 */
function renderPublications(publications) {
  const items = publications
    .map((pub) => {
      const { name, publisher, releaseDate, url, summary } = pub;

      const desc = [summary || '', url ? `<a href="${url}">${url}</a>` : '']
        .filter(Boolean)
        .join('<br>');

      return ListItem({
        title: name || '',
        subtitle: publisher || '',
        dateRange: releaseDate || '',
        description: desc,
      });
    })
    .join('\n');

  return Section({
    id: 'publications',
    content: `${SectionTitle({ title: 'Publications' })}\n${items}`,
  });
}

/**
 * Render languages section
 */
function renderLanguages(languages) {
  const items = languages
    .map((lang) => {
      const { language, fluency } = lang;
      return `<div>${language}${fluency ? ` (${fluency})` : ''}</div>`;
    })
    .join('\n');

  return Section({
    id: 'languages',
    content: `${SectionTitle({ title: 'Languages' })}\n${items}`,
  });
}

/**
 * Render interests section
 */
function renderInterests(interests) {
  const keywords = interests.flatMap((i) => i.keywords || []);

  return Section({
    id: 'interests',
    content: `${SectionTitle({ title: 'Interests' })}\n${BadgeList({
      items: keywords,
      variant: 'default',
    })}`,
  });
}

/**
 * Render references section
 */
function renderReferences(references) {
  const items = references
    .map((ref) => {
      const { name, reference } = ref;
      return ListItem({
        title: name || '',
        description: reference || '',
      });
    })
    .join('\n');

  return Section({
    id: 'references',
    content: `${SectionTitle({ title: 'References' })}\n${items}`,
  });
}

export default { render };
