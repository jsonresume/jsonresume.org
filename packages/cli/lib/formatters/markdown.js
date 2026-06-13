// Pure Markdown formatter for a JSON Resume. No external theme required.
// Renders every JSON Resume schema section that is present, and silently
// skips sections that are missing or empty so partial resumes work too.

const {
  isNonEmptyArray,
  dateRange,
  contactParts,
  section,
} = require('./utils');

const link = (label, url) => (url ? `[${label}](${url})` : label);

const sec = (title, items, renderItem) =>
  section([`## ${title}`], items, renderItem);

const highlights = (items) =>
  isNonEmptyArray(items) ? items.map((h) => `- ${h}`) : [];

const csv = (keywords) =>
  isNonEmptyArray(keywords) ? [keywords.join(', ')] : [];

const italic = (text) => (text ? [`*${text}*`] : []);

const basics = (resume) => {
  const b = resume.basics;
  if (!b) {
    return [];
  }
  const lines = [];
  if (b.name) {
    lines.push(`# ${b.name}`);
  }
  if (b.label) {
    lines.push(`> ${b.label}`);
  }
  const contact = contactParts(b);
  if (contact.length) {
    lines.push(contact.join(' | '));
  }
  if (isNonEmptyArray(b.profiles)) {
    const profiles = b.profiles
      .map((p) => link(p.network || p.username || p.url, p.url))
      .filter(Boolean);
    if (profiles.length) {
      lines.push(profiles.join(' | '));
    }
  }
  if (b.summary) {
    lines.push('', b.summary);
  }
  return lines;
};

const work = (resume) =>
  sec('Work', resume.work, (w) => {
    const heading = [w.position, w.name || w.company]
      .filter(Boolean)
      .join(', ');
    const lines = [`### ${link(heading || 'Role', w.url)}`];
    lines.push(...italic(dateRange(w.startDate, w.endDate)));
    if (w.summary) {
      lines.push('', w.summary);
    }
    return lines.concat(highlights(w.highlights));
  });

const volunteer = (resume) =>
  sec('Volunteer', resume.volunteer, (v) => {
    const heading = [v.position, v.organization].filter(Boolean).join(', ');
    const lines = [`### ${link(heading || 'Volunteer', v.url)}`];
    lines.push(...italic(dateRange(v.startDate, v.endDate)));
    if (v.summary) {
      lines.push('', v.summary);
    }
    return lines.concat(highlights(v.highlights));
  });

const education = (resume) =>
  sec('Education', resume.education, (e) => {
    const study = [e.studyType, e.area].filter(Boolean).join(', ');
    const title = [e.institution, study].filter(Boolean).join(' — ');
    const lines = [`### ${link(title || 'Education', e.url)}`];
    lines.push(...italic(dateRange(e.startDate, e.endDate)));
    if (e.score) {
      lines.push(`Score: ${e.score}`);
    }
    if (isNonEmptyArray(e.courses)) {
      lines.push('', ...e.courses.map((c) => `- ${c}`));
    }
    return lines;
  });

const awards = (resume) =>
  sec('Awards', resume.awards, (a) => {
    const lines = [`### ${a.title || 'Award'}`];
    lines.push(...italic([a.awarder, a.date].filter(Boolean).join(' — ')));
    if (a.summary) {
      lines.push('', a.summary);
    }
    return lines;
  });

const publications = (resume) =>
  sec('Publications', resume.publications, (p) => {
    const lines = [`### ${link(p.name || 'Publication', p.url)}`];
    lines.push(
      ...italic([p.publisher, p.releaseDate].filter(Boolean).join(' — ')),
    );
    if (p.summary) {
      lines.push('', p.summary);
    }
    return lines;
  });

const skills = (resume) =>
  sec('Skills', resume.skills, (s) => {
    const heading = [s.name, s.level].filter(Boolean).join(' — ');
    return [`### ${heading || 'Skill'}`].concat(csv(s.keywords));
  });

const languages = (resume) =>
  sec('Languages', resume.languages, (l) => [
    `- ${[l.language, l.fluency].filter(Boolean).join(' — ')}`,
  ]);

const interests = (resume) =>
  sec('Interests', resume.interests, (i) =>
    [`### ${i.name || 'Interest'}`].concat(csv(i.keywords)),
  );

const references = (resume) =>
  sec('References', resume.references, (r) => {
    const lines = [`### ${r.name || 'Reference'}`];
    if (r.reference) {
      lines.push('', `> ${r.reference}`);
    }
    return lines;
  });

const projects = (resume) =>
  sec('Projects', resume.projects, (p) => {
    const lines = [`### ${link(p.name || 'Project', p.url)}`];
    lines.push(...italic(dateRange(p.startDate, p.endDate)));
    if (p.description) {
      lines.push('', p.description);
    }
    return lines.concat(highlights(p.highlights)).concat(csv(p.keywords));
  });

const toMarkdown = (resume = {}) => {
  const lines = [
    ...basics(resume),
    ...work(resume),
    ...volunteer(resume),
    ...education(resume),
    ...awards(resume),
    ...publications(resume),
    ...skills(resume),
    ...languages(resume),
    ...interests(resume),
    ...references(resume),
    ...projects(resume),
  ];
  return `${lines.join('\n').trim()}\n`;
};

module.exports = toMarkdown;
module.exports.toMarkdown = toMarkdown;
