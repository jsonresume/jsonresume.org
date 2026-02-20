const header = function (resume) {
  return [
    resume.basics.name,
    resume.basics.label,
    resume.basics.location?.address,
    resume.basics.location?.city,
    resume.basics.location?.region,
    resume.basics.location?.postalCode,
    resume.basics.location?.countryCode,
    resume.basics.phone,
    resume.basics.email,
  ]
    .filter((e) => e !== undefined)
    .join('\n');
};

const summary = function (resume) {
  if (resume.basics.summary === undefined) return undefined;
  return [
    '',
    'PROFESSIONAL SUMMARY',
    '============================',
    '',
    resume.basics.summary,
    '',
  ].join('\n');
};

const formatSection = (items, title, mergedKeys = []) => {
  if (!items?.length) return undefined;
  const mergedSet = new Set(mergedKeys);
  return [
    '',
    title,
    '============================',
    items.flatMap((item) => {
      const mergedLine = mergedKeys.length
        ? mergedKeys
            .map((k) => item[k])
            .filter((v) => v !== undefined && v !== null && v !== '')
            .join(' - ') || undefined
        : undefined;

      return [
        '',
        mergedLine,
        ...Object.entries(item).flatMap(([key, value]) => {
          if (mergedSet.has(key) || key === 'type') return [];
          if (value === undefined || value === null || value === '') return [];
          if (Array.isArray(value)) {
            return value.map((v) => `+ ${v}`);
          }
          return [String(value)];
        }),
        '',
      ];
    }),
    '',
  ]
    .flat()
    .filter((line) => line !== undefined)
    .join('\n');
};

const works = (resume) =>
  formatSection(resume.work, 'WORK HISTORY', ['startDate', 'endDate']);
const volunteers = (resume) =>
  formatSection(resume.volunteer, 'VOLUNTEER', ['startDate', 'endDate']);
const projects = (resume) =>
  formatSection(resume.projects, 'PROJECTS', ['startDate', 'endDate']);
const education = (resume) =>
  formatSection(resume.education, 'EDUCATION', ['startDate', 'endDate']);
const awards = (resume) =>
  formatSection(resume.awards, 'AWARDS', ['title', 'date']);
const certificates = (resume) =>
  formatSection(resume.certificates, 'CERTIFICATES', ['name', 'date']);
const publications = (resume) =>
  formatSection(resume.publications, 'PUBLICATIONS', ['name', 'date']);
const skills = (resume) => formatSection(resume.skills, 'SKILLS');

const content = function (resume) {
  return [
    header(resume),
    summary(resume),
    works(resume),
    volunteers(resume),
    projects(resume),
    education(resume),
    awards(resume),
    certificates(resume),
    publications(resume),
    skills(resume),
  ]
    .filter((section) => section !== undefined)
    .join('\n');
};

const format = async function (resume) {
  return { content: content(resume), headers: [] };
};

const exports = { format };

export default exports;
