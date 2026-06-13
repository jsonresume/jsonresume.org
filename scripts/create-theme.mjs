#!/usr/bin/env node
/**
 * Theme scaffolding generator for jsonresume.org.
 *
 * Spins up a new, correct-by-construction theme package under
 * packages/themes/jsonresume-theme-<slug>/ by mirroring the known-good
 * berlin-grid template. It bakes in the hard-won lessons (SSR-inline
 * styled-components, ContactInfo single-basics prop, no styled-component
 * named Date, Google Fonts via CDN, render ALL JSON Resume sections).
 *
 * It does NOT edit shared files (themeConfig.js, theme-config metadata,
 * registry package.json, changesets) — instead it PRINTS the manual
 * registration checklist so the contributor wires it up deliberately.
 *
 * Usage:
 *   pnpm gen:theme <slug> "Display Name"
 *   node scripts/create-theme.mjs <slug> "Display Name"
 *
 * Example:
 *   pnpm gen:theme harbor-light "Harbor Light"
 */

import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const THEMES_DIR = join(REPO_ROOT, 'packages', 'themes');

function fail(msg) {
  console.error(`\n  ERROR: ${msg}\n`);
  process.exit(1);
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/** kebab-case slug -> "Pascal Case" fallback display name. */
function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

/** kebab-case slug -> lowerCamel identifier usable as a JS import binding. */
function importIdent(slug) {
  return slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function packageJson(slug) {
  return `${JSON.stringify(
    {
      name: `jsonresume-theme-${slug}`,
      version: '0.1.0',
      private: false,
      type: 'module',
      main: './index.jsx',
      peerDependencies: {
        react: '^18.0.0 || ^19.0.0',
        'react-dom': '^18.0.0 || ^19.0.0',
      },
      dependencies: {
        '@jsonresume/core': 'workspace:*',
        'styled-components': '^6.1.19',
      },
      scripts: {
        build: 'vite build',
      },
      publishConfig: {
        access: 'public',
      },
      exports: {
        '.': {
          import: './index.jsx',
          default: './index.jsx',
        },
        './dist': {
          import: './dist/index.js',
          default: './dist/index.js',
        },
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.3.4',
        vite: '^5.4.21',
      },
    },
    null,
    2
  )}\n`;
}

const VITE_CONFIG = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    target: 'node18',
    outDir: './dist',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: './index.jsx',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
      output: {
        exports: 'named',
      },
    },
  },
  ssr: {
    // Force bundle these packages instead of externalizing.
    noExternal: [
      'styled-components',
      '@emotion/is-prop-valid',
      'stylis',
      'shallowequal',
    ],
  },
});
`;

function indexJsx(displayName) {
  return `import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './src/Resume.jsx';

// SSR render entry. styled-components MUST be collected via ServerStyleSheet
// so the generated CSS is inlined into <head> — the registry renders themes
// server-side with no client hydration.
export function render(resume) {
  const sheet = new ServerStyleSheet();
  const html = renderToString(sheet.collectStyles(<Resume resume={resume} />));
  const styles = sheet.getStyleTags();
  const title = (resume.basics && resume.basics.name) || 'Resume';

  return \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>\${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  \${styles}
</head>
<body>\${html}</body>
</html>\`;
}
`;
}

function resumeJsx(displayName, slug) {
  return `import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  Badge,
  BadgeList,
  ContactInfo,
  Link,
  safeUrl,
} from '@jsonresume/core';

/*
 * ${displayName} — starter theme scaffolded by scripts/create-theme.mjs.
 *
 * This is a COMPLETE, correct-by-construction starting point: it renders
 * every JSON Resume section and passes the permanent themeRenderQa gate.
 * Redesign the styled-components below into your own distinct layout, but
 * keep these baked-in lessons intact:
 *
 *   1. styled-components are declared INLINE in this single file (no fs reads,
 *      no external CSS) — the SSR pipeline collects them via ServerStyleSheet.
 *   2. <ContactInfo basics={basics} /> takes a SINGLE basics prop. Do NOT
 *      spread individual email/phone/url props — the component destructures
 *      them off basics itself.
 *   3. NEVER name a styled-component "Date" — it shadows the global Date and
 *      crashes SSR. Use DateLabel / MetaDate / Period instead.
 *   4. Load fonts via the Google Fonts CDN in index.jsx (already wired up).
 *   5. Render ALL sections so the theme is complete and passes themeRenderQa.
 */

const Layout = styled.div\`
  max-width: 860px;
  margin: 0 auto;
  padding: 64px 48px;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1a1a1a;
  line-height: 1.6;
  font-size: 14px;

  @media print {
    padding: 32px;
  }
\`;

const Header = styled.header\`
  padding-bottom: 24px;
  border-bottom: 2px solid #1a1a1a;
  margin-bottom: 32px;
\`;

const Name = styled.h1\`
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
\`;

const Tagline = styled.div\`
  font-size: 16px;
  color: #4a4a4a;
  font-weight: 500;
  margin-bottom: 16px;
\`;

const Summary = styled.p\`
  font-size: 15px;
  color: #2a2a2a;
  margin: 16px 0 0 0;
\`;

const StyledContactInfo = styled(ContactInfo)\`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
  font-size: 13px;

  a {
    color: #1a1a1a;
    text-decoration: none;
  }
\`;

const StyledSection = styled(Section)\`
  margin-bottom: 32px;
\`;

const StyledSectionTitle = styled(SectionTitle)\`
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px 0;
  padding-bottom: 6px;
  border-bottom: 2px solid #1a1a1a;
\`;

const Item = styled.div\`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
\`;

const ItemHead = styled.div\`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
\`;

const ItemTitle = styled.h3\`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
\`;

const ItemSubtitle = styled.div\`
  font-size: 14px;
  font-weight: 500;
  color: #4a4a4a;
  margin-top: 2px;
\`;

// NOTE: a styled-component named "Date" would shadow the global Date and
// crash SSR. This one is deliberately named MetaDate.
const MetaDate = styled.div\`
  font-size: 13px;
  font-weight: 600;
  color: #6a6a6a;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
\`;

const ItemDescription = styled.p\`
  font-size: 14px;
  color: #2a2a2a;
  margin: 8px 0 0 0;
\`;

const Highlights = styled.ul\`
  margin: 8px 0 0 0;
  padding-left: 20px;

  li {
    margin-bottom: 4px;
  }
\`;

const SkillsGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
\`;

const SkillCategory = styled.div\`
  h4 {
    font-size: 14px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }
\`;

const StyledBadgeList = styled(BadgeList)\`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
\`;

const StyledBadge = styled(Badge)\`
  font-size: 12px;
  padding: 2px 10px;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
\`;

const SimpleList = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 16px;
\`;

const SimpleItem = styled.div\`
  h4 {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 14px;
    color: #4a4a4a;
    margin: 0;
  }
\`;

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
    volunteer = [],
    awards = [],
    certificates = [],
    publications = [],
    languages = [],
    interests = [],
    references = [],
  } = resume;

  return (
    <Layout>
      <Header>
        {basics.name && <Name>{basics.name}</Name>}
        {basics.label && <Tagline>{basics.label}</Tagline>}
        {basics.summary && <Summary>{basics.summary}</Summary>}
        <StyledContactInfo basics={basics} />
      </Header>

      {work.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <Item key={index}>
              <ItemHead>
                <div>
                  <ItemTitle>{job.position || job.name}</ItemTitle>
                  {job.name && job.position && (
                    <ItemSubtitle>{job.name}</ItemSubtitle>
                  )}
                </div>
                <MetaDate>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </MetaDate>
              </ItemHead>
              {job.summary && <ItemDescription>{job.summary}</ItemDescription>}
              {job.highlights && job.highlights.length > 0 && (
                <Highlights>
                  {job.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </Highlights>
              )}
            </Item>
          ))}
        </StyledSection>
      )}

      {education.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Education</StyledSectionTitle>
          {education.map((edu, index) => (
            <Item key={index}>
              <ItemHead>
                <div>
                  <ItemTitle>{edu.institution}</ItemTitle>
                  {(edu.studyType || edu.area) && (
                    <ItemSubtitle>
                      {[edu.studyType, edu.area].filter(Boolean).join(' in ')}
                    </ItemSubtitle>
                  )}
                </div>
                <MetaDate>
                  <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                </MetaDate>
              </ItemHead>
              {edu.score && <ItemDescription>GPA: {edu.score}</ItemDescription>}
              {edu.courses && edu.courses.length > 0 && (
                <Highlights>
                  {edu.courses.map((course, i) => (
                    <li key={i}>{course}</li>
                  ))}
                </Highlights>
              )}
            </Item>
          ))}
        </StyledSection>
      )}

      {skills.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillCategory key={index}>
                <h4>{skill.name}</h4>
                {skill.keywords && skill.keywords.length > 0 && (
                  <StyledBadgeList>
                    {skill.keywords.map((keyword, i) => (
                      <StyledBadge key={i}>{keyword}</StyledBadge>
                    ))}
                  </StyledBadgeList>
                )}
              </SkillCategory>
            ))}
          </SkillsGrid>
        </StyledSection>
      )}

      {projects.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <Item key={index}>
              <ItemHead>
                <ItemTitle>
                  {project.url ? (
                    <Link href={safeUrl(project.url)}>{project.name}</Link>
                  ) : (
                    project.name
                  )}
                </ItemTitle>
                <MetaDate>
                  <DateRange
                    startDate={project.startDate}
                    endDate={project.endDate}
                  />
                </MetaDate>
              </ItemHead>
              {project.description && (
                <ItemDescription>{project.description}</ItemDescription>
              )}
              {project.highlights && project.highlights.length > 0 && (
                <Highlights>
                  {project.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </Highlights>
              )}
            </Item>
          ))}
        </StyledSection>
      )}

      {volunteer.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          {volunteer.map((vol, index) => (
            <Item key={index}>
              <ItemHead>
                <div>
                  <ItemTitle>{vol.position}</ItemTitle>
                  {vol.organization && (
                    <ItemSubtitle>{vol.organization}</ItemSubtitle>
                  )}
                </div>
                <MetaDate>
                  <DateRange startDate={vol.startDate} endDate={vol.endDate} />
                </MetaDate>
              </ItemHead>
              {vol.summary && <ItemDescription>{vol.summary}</ItemDescription>}
              {vol.highlights && vol.highlights.length > 0 && (
                <Highlights>
                  {vol.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </Highlights>
              )}
            </Item>
          ))}
        </StyledSection>
      )}

      {awards.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Awards</StyledSectionTitle>
          <SimpleList>
            {awards.map((award, index) => (
              <SimpleItem key={index}>
                <h4>{award.title}</h4>
                <p>
                  {award.awarder}
                  {award.date && \` • \${award.date}\`}
                </p>
                {award.summary && <p>{award.summary}</p>}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {certificates.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Certificates</StyledSectionTitle>
          <SimpleList>
            {certificates.map((cert, index) => (
              <SimpleItem key={index}>
                <h4>
                  {cert.url ? (
                    <Link href={safeUrl(cert.url)}>{cert.name}</Link>
                  ) : (
                    cert.name
                  )}
                </h4>
                <p>
                  {cert.issuer}
                  {cert.date && \` • \${cert.date}\`}
                </p>
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {publications.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          <SimpleList>
            {publications.map((pub, index) => (
              <SimpleItem key={index}>
                <h4>
                  {pub.url ? (
                    <Link href={safeUrl(pub.url)}>{pub.name}</Link>
                  ) : (
                    pub.name
                  )}
                </h4>
                <p>
                  {pub.publisher}
                  {pub.releaseDate && \` • \${pub.releaseDate}\`}
                </p>
                {pub.summary && <p>{pub.summary}</p>}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {languages.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <StyledBadgeList>
            {languages.map((lang, index) => (
              <StyledBadge key={index}>
                {lang.language}
                {lang.fluency && \` — \${lang.fluency}\`}
              </StyledBadge>
            ))}
          </StyledBadgeList>
        </StyledSection>
      )}

      {interests.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          <SimpleList>
            {interests.map((interest, index) => (
              <SimpleItem key={index}>
                <h4>{interest.name}</h4>
                {interest.keywords && interest.keywords.length > 0 && (
                  <p>{interest.keywords.join(', ')}</p>
                )}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {references.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>References</StyledSectionTitle>
          <SimpleList>
            {references.map((ref, index) => (
              <SimpleItem key={index}>
                <h4>{ref.name}</h4>
                {ref.reference && <p>{ref.reference}</p>}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}
    </Layout>
  );
}

export default Resume;
`;
}

function readme(displayName, slug) {
  return `# jsonresume-theme-${slug}

> ${displayName} — a theme for [JSON Resume](https://jsonresume.org).

Scaffolded with \`pnpm gen:theme\`. It renders every JSON Resume section and
passes the permanent \`themeRenderQa\` gate out of the box. Make it your own by
editing the styled-components in \`src/Resume.jsx\`.

## Structure

| File              | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| \`index.jsx\`       | SSR render entry — collects styled-components, inlines fonts/CSS |
| \`src/Resume.jsx\`  | The theme: all sections + inline styled-components               |
| \`vite.config.js\`  | SSR library build (\`vite build\` -> \`dist/\`)                      |

## Develop

\`\`\`bash
# From the repo root, with the registry dev server running:
cd apps/registry && pnpm dev
# Preview at:
open http://localhost:3000/thomasdavis?theme=${slug}
\`\`\`

## Build

\`\`\`bash
pnpm --filter jsonresume-theme-${slug} build
\`\`\`

## Rules baked in (keep these)

- styled-components are declared **inline** in \`src/Resume.jsx\` — no \`fs\` reads.
- \`<ContactInfo basics={basics} />\` takes a **single** \`basics\` prop.
- Never name a styled-component \`Date\` (it shadows the global and crashes SSR).
- Fonts load via the **Google Fonts CDN** in \`index.jsx\`.
- Render **all** JSON Resume sections so the theme stays complete.

See \`docs/CREATING_A_THEME.md\` for the full registration checklist.
`;
}

async function main() {
  const [, , rawSlug, rawName] = process.argv;

  if (!rawSlug) {
    fail(
      'Usage: pnpm gen:theme <slug> "Display Name"\n  e.g. pnpm gen:theme harbor-light "Harbor Light"'
    );
  }

  const slug = rawSlug.trim();
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(slug)) {
    fail(
      `Invalid slug "${slug}". Use lowercase kebab-case (letters, digits, hyphens), e.g. "harbor-light".`
    );
  }

  const displayName = (rawName && rawName.trim()) || titleFromSlug(slug);
  const pkgName = `jsonresume-theme-${slug}`;
  const dir = join(THEMES_DIR, pkgName);

  if (await exists(dir)) {
    fail(`Theme directory already exists: packages/themes/${pkgName}`);
  }

  await mkdir(join(dir, 'src'), { recursive: true });

  await Promise.all([
    writeFile(join(dir, 'package.json'), packageJson(slug)),
    writeFile(join(dir, 'vite.config.js'), VITE_CONFIG),
    writeFile(join(dir, 'index.jsx'), indexJsx(displayName)),
    writeFile(join(dir, 'src', 'Resume.jsx'), resumeJsx(displayName, slug)),
    writeFile(join(dir, 'README.md'), readme(displayName, slug)),
  ]);

  const ident = importIdent(slug);

  console.log(`
  Scaffolded jsonresume-theme-${slug}
  -> packages/themes/${pkgName}/
       package.json
       vite.config.js
       index.jsx
       src/Resume.jsx
       README.md

  Next: install workspaces, then build to confirm it renders.

    pnpm install
    pnpm --filter ${pkgName} build

  -----------------------------------------------------------------
  MANUAL REGISTRATION (the generator does NOT touch shared files)
  -----------------------------------------------------------------

  1) apps/registry/lib/formatters/template/themeConfig.js
     - add import (with the other theme imports):

         import * as ${ident} from '${pkgName}';

     - add to the THEMES object:

         '${slug}': ${ident},

  2) packages/theme-config/src/metadata.js
     - add a metadata entry to THEME_METADATA:

         '${slug}': {
           name: '${displayName}',
           description: 'One-line description of the theme vibe.',
           author: 'Your Name',
           tags: ['add', 'a', 'few', 'tags'],
         },

  3) apps/registry/package.json
     - add the workspace dependency (keep alphabetical):

         "${pkgName}": "workspace:*",

     - then re-run: pnpm install

  4) changeset (so the package versions + publishes):

         pnpm changeset
     - select ${pkgName}, choose "minor", describe the theme,
       and end the summary with "Refs #275."

  5) verify the permanent render gate stays green:

         pnpm --filter registry test -- --run themeRenderQa

     This renders EVERY registered theme against the complete fixture and
     asserts no crashes, no raw artifacts ([object Object]/undefined/NaN),
     and that basics/work/education/skills all render.

  Preview while developing (registry dev server must be running):

     open http://localhost:3000/thomasdavis?theme=${slug}
`);
}

main().catch((err) => fail(err.stack || String(err)));
