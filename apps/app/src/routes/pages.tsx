import { facts } from '@repo/content/facts';
import {
  organization,
  pageHead,
  paths,
  webSite,
  type PageHeadInput,
} from '@repo/site';
import {
  createRoute,
  type AnyRoute,
  type LazyRoute,
} from '@tanstack/react-router';
import { siteRoute } from './root';

/**
 * A static page: its path and head here (small, in the main bundle), its
 * component in a .lazy.tsx file loaded when the route is visited.
 */
function page<const TPath extends string>(
  path: TPath,
  head: Omit<PageHeadInput, 'path'>,
  load: () => Promise<{ Route: LazyRoute<AnyRoute> }>
) {
  return createRoute({
    getParentRoute: () => siteRoute,
    path,
    head: () => pageHead({ ...head, path }),
  }).lazy(() => load().then((m) => m.Route));
}

export const homeRoute = page(
  paths.home,
  {
    title: 'JSON Resume: the open standard for resumes',
    description: `Write your resume once in JSON and publish it anywhere: ${facts.themeCount} open-source themes, a CLI, and free hosting from a GitHub gist.`,
    jsonLd: [webSite(), organization()],
  },
  () => import('./home.lazy')
);

export const gettingStartedRoute = page(
  paths.gettingStarted,
  {
    title: 'Getting started',
    description:
      'Publish your resume from a GitHub Gist, use the CLI to export PDF and HTML, or import from LinkedIn.',
  },
  () => import('./getting-started.lazy')
);

export const schemaRoute = page(
  paths.schema,
  {
    title: 'The resume schema',
    description: `Every section and field of resume.json, schema version ${facts.schemaVersion}, with examples and ways to validate.`,
  },
  () => import('./schema.lazy')
);

export const jobSchemaRoute = page(
  paths.jobDescriptionSchema,
  {
    title: 'Job description schema',
    description:
      'A standard JSON format for job postings: every field of job.json with an example.',
  },
  () => import('./job-schema.lazy')
);

export const appsRoute = page(
  paths.apps,
  {
    title: 'Apps that work with your resume',
    description:
      'Apps you can connect your JSON Resume to with Sign in with JSON Resume: you choose what each may read or change.',
  },
  () => import('./apps.lazy')
);

export const startRoute = page(
  paths.start,
  {
    title: 'Make your resume',
    description:
      'Upload the resume you have, paste it, or answer a few questions, then see it in a professional theme. Free, and no account until you save.',
  },
  () => import('./start.lazy')
);

export const themesRoute = page(
  paths.themes,
  {
    title: 'Themes',
    description: `Browse ${facts.themeCount} open-source resume themes and preview each with a real resume.`,
  },
  () => import('./themes.lazy')
);

export const projectsRoute = page(
  paths.projects,
  {
    title: 'Projects',
    description:
      'Tools, libraries and services the community has built on JSON Resume.',
  },
  () => import('./projects.lazy')
);

export const teamRoute = page(
  paths.team,
  {
    title: 'Team',
    description:
      'The volunteers who maintain JSON Resume, and the history of the project since 2014.',
  },
  () => import('./team.lazy')
);

export const cliRoute = page(
  paths.cli,
  {
    title: 'CLI reference',
    description:
      'resume-cli: create, validate, preview and export your resume to HTML, PDF, Markdown or text, with every command and option.',
  },
  () => import('./cli.lazy')
);

export const developersRoute = page(
  paths.developers,
  {
    title: 'Sign in with JSON Resume',
    description:
      'OAuth for HR tools, job boards and applicant trackers: people sign in with jsonresume.org and share their resume.json with your app.',
  },
  () => import('./developers.lazy')
);

export const aiRoute = page(
  paths.ai,
  {
    title: 'AI tools',
    description:
      'Open-source registry tools that use your hosted resume: matching jobs, cover letters, resume feedback and interview practice.',
  },
  () => import('./ai.lazy')
);

export const themeDevelopmentRoute = page(
  paths.themeDevelopment,
  {
    title: 'Theme development',
    description:
      'Build a JSON Resume theme: an npm package named jsonresume-theme-{name} that exports a render function returning HTML.',
  },
  () => import('./theme-development.lazy')
);

export const mediaRoute = page(
  paths.media,
  {
    title: 'Media kit',
    description:
      'Facts with sources, ready-to-use descriptions, a fictional example resume and contact details for people writing about JSON Resume.',
  },
  () => import('./media.lazy')
);

export const registryRoute = page(
  paths.registry,
  {
    title: 'The registry is now part of jsonresume.org',
    crumb: 'Registry',
    description:
      'registry.jsonresume.org moved here: your resume is at jsonresume.org/@username, from the same gist. What moved, what is coming, and how to ask for a feature.',
  },
  () => import('./registry.lazy')
);

export const mcpRoute = page(
  paths.mcp,
  {
    title: 'MCP: connect your agent to JSON Resume',
    crumb: 'MCP',
    description:
      'Connect ChatGPT, Claude, Cursor, VS Code, Codex or any MCP client to jsonresume.org: edit your resume, change its theme, see who reads it and find jobs that fit.',
  },
  () => import('./mcp.lazy')
);
