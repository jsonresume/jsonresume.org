// Pure plain-text formatter for a JSON Resume. No external theme required.
// Renders every JSON Resume schema section that is present, and silently
// skips sections that are missing or empty so partial resumes work too.

const {
  isNonEmptyArray,
  dateRange,
  contactParts,
  section,
} = require('./utils');

const heading = (text) => [text.toUpperCase(), '='.repeat(text.length)];

const sec = (title, items, renderItem) =>
  section(heading(title), items, renderItem);

const bullets = (items) =>
  isNonEmptyArray(items) ? items.map((i) => `  * ${i}`) : [];

const csv = (keywords) =>
  isNonEmptyArray(keywords) ? [`  ${keywords.join(', ')}`] : [];

const basics = (resume) => {
  const b = resume.basics;
  if (!b) {
    return [];
  }
  const lines = [];
  if (b.name) {
    lines.push(b.name);
  }
  if (b.label) {
    lines.push(b.label);
  }
  const contact = contactParts(b);
  if (contact.length) {
    lines.push(contact.join(' | '));
  }
  if (isNonEmptyArray(b.profiles)) {
    b.profiles.forEach((p) => {
      const label = [p.network, p.username].filter(Boolean).join(' ');
      const parts = [label, p.url].filter(Boolean);
      if (parts.length) {
        lines.push(parts.join(': '));
      }
    });
  }
  if (b.summary) {
    lines.push('', b.summary);
  }
  return lines;
};

const work = (resume) =>
  sec('Work', resume.work, (w) => {
    const title = [w.position, w.name || w.company].filter(Boolean).join(' @ ');
    const lines = [title || 'Role'];
    const range = dateRange(w.startDate, w.endDate);
    if (range) {
      lines.push(range);
    }
    if (w.url) {
      lines.push(w.url);
    }
    if (w.summary) {
      lines.push(w.summary);
    }
    return lines.concat(bullets(w.highlights));
  });

const volunteer = (resume) =>
  sec('Volunteer', resume.volunteer, (v) => {
    const title = [v.position, v.organization].filter(Boolean).join(' @ ');
    const lines = [title || 'Volunteer'];
    const range = dateRange(v.startDate, v.endDate);
    if (range) {
      lines.push(range);
    }
    if (v.summary) {
      lines.push(v.summary);
    }
    return lines.concat(bullets(v.highlights));
  });

const education = (resume) =>
  sec('Education', resume.education, (e) => {
    const study = [e.studyType, e.area].filter(Boolean).join(', ');
    const title = [e.institution, study].filter(Boolean).join(' - ');
    const lines = [title || 'Education'];
    const range = dateRange(e.startDate, e.endDate);
    if (range) {
      lines.push(range);
    }
    if (e.score) {
      lines.push(`Score: ${e.score}`);
    }
    return lines.concat(bullets(e.courses));
  });

const awards = (resume) =>
  sec('Awards', resume.awards, (a) => {
    const lines = [a.title || 'Award'];
    const meta = [a.awarder, a.date].filter(Boolean).join(' - ');
    if (meta) {
      lines.push(meta);
    }
    if (a.summary) {
      lines.push(a.summary);
    }
    return lines;
  });

const publications = (resume) =>
  sec('Publications', resume.publications, (p) => {
    const lines = [p.name || 'Publication'];
    const meta = [p.publisher, p.releaseDate].filter(Boolean).join(' - ');
    if (meta) {
      lines.push(meta);
    }
    if (p.url) {
      lines.push(p.url);
    }
    if (p.summary) {
      lines.push(p.summary);
    }
    return lines;
  });

const skills = (resume) =>
  sec('Skills', resume.skills, (s) => {
    const title = [s.name, s.level].filter(Boolean).join(' - ');
    return [title || 'Skill'].concat(csv(s.keywords));
  });

const languages = (resume) =>
  sec('Languages', resume.languages, (l) => [
    `  * ${[l.language, l.fluency].filter(Boolean).join(' - ')}`,
  ]);

const interests = (resume) =>
  sec('Interests', resume.interests, (i) =>
    [i.name || 'Interest'].concat(csv(i.keywords)),
  );

const references = (resume) =>
  sec('References', resume.references, (r) => {
    const lines = [r.name || 'Reference'];
    if (r.reference) {
      lines.push(r.reference);
    }
    return lines;
  });

const projects = (resume) =>
  sec('Projects', resume.projects, (p) => {
    const lines = [p.name || 'Project'];
    const range = dateRange(p.startDate, p.endDate);
    if (range) {
      lines.push(range);
    }
    if (p.url) {
      lines.push(p.url);
    }
    if (p.description) {
      lines.push(p.description);
    }
    return lines.concat(bullets(p.highlights)).concat(csv(p.keywords));
  });

const toText = (resume = {}) => {
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

module.exports = toText;
module.exports.toText = toText;
