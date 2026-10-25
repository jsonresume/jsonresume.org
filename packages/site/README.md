# @repo/site

The jsonresume.org site in React, on `@jsonresume/ui`:

- `SiteLayout`: skip link, header navigation, footer.
- `SiteLink`: an `<a>` that navigates in-app for same-site paths (TanStack
  Router) and behaves normally otherwise. Use it for every site link.
- Page templates: `HomePage`, `DocPage`, `BlogIndexPage`, `BlogPostPage`,
  `ProjectsPage`, `TeamPage`, `ThemesPage`, `NotFoundPage`. They take content
  as props (from `@repo/content`) and own no routing.
- `paths`, `external`, `headerNav`, `footerNav`: where things live.

Each page template is its own entry point (`@repo/site/home`, `/doc`,
`/blog`, `/projects`, `/team`, `/themes`) so apps can load it lazily per
route; the root export is the shell every page needs. See `apps/app/src/routes`.
