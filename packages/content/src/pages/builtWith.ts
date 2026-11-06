/** Apps that sign people in with JSON Resume, and the badge they may show. */

const site = 'https://jsonresume.org';

export const apps: ReadonlyArray<{
  name: string;
  by: string;
  description: string;
  href: string;
  scopes: string;
}> = [
  {
    name: 'JSON Resume Connect',
    by: 'Ismail Kattakath',
    description:
      'A Google Workspace step that turns your resume into a document for Google Docs, with PDF and Word exports. No server: it runs in your own Google account.',
    href: 'https://github.com/ismailkattakath/jsonresume-connect',
    scopes: 'resume:read',
  },
];

export const appsIntro =
  'Independent apps built on Sign in with JSON Resume. Built one? Add it to the [projects directory](/projects) in a pull request and it can be listed here.';

export const badge = {
  intro:
    'Apps that sign people in with JSON Resume may show this badge, linking to jsonresume.org. Use the dark one on dark backgrounds. It says your app works with JSON Resume, not that JSON Resume made or endorses it.',
  light: `${site}/badges/works-with-jsonresume.svg`,
  dark: `${site}/badges/works-with-jsonresume-dark.svg`,
};

export const badgeSnippets = [
  {
    label: 'HTML',
    code: `<a href="${site}">
  <img src="${badge.light}" alt="Works with JSON Resume" width="218" height="36">
</a>`,
  },
  {
    label: 'Markdown',
    code: `[![Works with JSON Resume](${badge.light})](${site})`,
  },
  {
    label: 'Dark backgrounds',
    code: `<a href="${site}">
  <img src="${badge.dark}" alt="Works with JSON Resume" width="218" height="36">
</a>`,
  },
];
