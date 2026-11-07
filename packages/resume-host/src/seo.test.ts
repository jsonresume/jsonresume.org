import { Profiles, ProfileNotFound, type Username } from '@repo/profiles';
import { ResumePdf } from '@repo/resume-pdf';
import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { resumeOutcome } from './host';
import { profilePage } from './profileData';
import { withProfileHead } from './seo';

const ada = {
  basics: {
    name: 'Ada Lovelace',
    label: 'Analyst </script><script>alert(1)</script>',
    image: 'https://example.com/ada.jpg',
    email: 'ada@example.com',
    phone: '+44 20 7946 0000',
    url: 'https://ada.example.com',
    summary: 'Wrote the first program. '.repeat(20),
    location: {
      address: '12 St James Square',
      postalCode: 'SW1Y 4JH',
      city: 'London',
      countryCode: 'GB',
    },
    profiles: [{ network: 'GitHub', url: 'https://github.com/ada' }],
  },
  work: [
    { name: 'Analytical Engine Co', position: 'Programmer' },
    { name: 'Old Job Ltd', endDate: '1840-01-01' },
  ],
  education: [{ institution: 'Home tutoring' }],
  skills: [{ name: 'Mathematics', keywords: ['Algorithms', 'Notes'] }],
};

/** Every JSON-LD block in a page, parsed. */
const jsonLd = (html: string) =>
  [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    ),
  ].map(([, json]) => JSON.parse(json ?? ''));

describe('withProfileHead', () => {
  const theme =
    '<html><head><title>Ada · CV</title><link rel="canonical" href="https://elsewhere.example/ada">' +
    '<meta name="description" content="The theme’s own"></head><body>Ada</body></html>';
  const html = withProfileHead(theme, 'ada', ada);

  it('names the clean /@username as canonical, replacing the theme’s', () => {
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    expect(html).toContain(
      '<link rel="canonical" href="https://jsonresume.org/@ada">'
    );
    expect(html).not.toContain('elsewhere.example');
  });

  it('keeps the theme’s title and description, and adds what it lacks', () => {
    expect(html).toContain('<title>Ada · CV</title>');
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html.match(/name="description"/g)).toHaveLength(1);
    expect(html).toContain('<meta property="og:type" content="profile">');
    expect(html).toContain(
      '<meta property="og:url" content="https://jsonresume.org/@ada">'
    );
    expect(html).toContain(
      '<meta property="og:image" content="https://example.com/ada.jpg">'
    );
    expect(html).toContain('name="twitter:title"');
    // Everything lands inside <head>.
    expect(html.indexOf('application/ld+json')).toBeLessThan(
      html.indexOf('</head>')
    );
  });

  it('gives a page without a title one, from the resume', () => {
    const bare = withProfileHead('<p>hi</p>', 'plain', {
      basics: { name: 'Plain' },
    });
    expect(bare).toContain('<title>Plain · JSON Resume</title>');
    expect(bare).toContain('content="Plain"');
    expect(bare.endsWith('<p>hi</p>')).toBe(true);
  });

  it('escapes what the resume says, in attributes and in JSON-LD', () => {
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;/script&gt;');
    const [data] = jsonLd(html);
    expect(data.mainEntity.jobTitle).toBe(ada.basics.label);
  });

  it('adds valid ProfilePage data with only public fields', () => {
    const [data] = jsonLd(html);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('ProfilePage');
    expect(data.url).toBe('https://jsonresume.org/@ada');
    const person = data.mainEntity;
    expect(person).toMatchObject({
      '@type': 'Person',
      name: 'Ada Lovelace',
      url: 'https://jsonresume.org/@ada',
      image: 'https://example.com/ada.jpg',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        addressCountry: 'GB',
      },
      sameAs: ['https://ada.example.com', 'https://github.com/ada'],
      worksFor: [{ '@type': 'Organization', name: 'Analytical Engine Co' }],
      alumniOf: [{ '@type': 'EducationalOrganization', name: 'Home tutoring' }],
      knowsAbout: ['Mathematics', 'Algorithms', 'Notes'],
    });
    expect(person.description.length).toBeLessThanOrEqual(500);
    const text = JSON.stringify(data);
    for (const secret of ['ada@example.com', '7946', 'St James', 'SW1Y'])
      expect(text).not.toContain(secret);
  });

  it('builds a Person from a resume with nothing but a username', () => {
    expect(profilePage('ghost', 'not a resume').mainEntity).toEqual({
      '@type': 'Person',
      '@id': 'https://jsonresume.org/@ghost#person',
      name: '@ghost',
      url: 'https://jsonresume.org/@ghost',
      alternateName: '@ghost',
    });
  });
});

describe('resume pages, served', () => {
  const profiles = Layer.succeed(
    Profiles,
    Profiles.of({
      resume: (username: Username) =>
        username === 'ada'
          ? Effect.succeed({
              username,
              resume: ada,
              source: 'ghost',
              stale: false,
              _tag: 'Resume',
            })
          : Effect.fail(
              new ProfileNotFound({
                username,
                reason: 'no-gist',
                file: 'resume.json',
              })
            ),
    })
  );
  const printer = Layer.succeed(
    ResumePdf,
    ResumePdf.of({
      print: (html) => Effect.succeed(new TextEncoder().encode(html)),
    })
  );
  const get = async (path: string) => {
    const outcome = await Effect.runPromise(
      resumeOutcome(new URL(path, 'https://jsonresume.org')).pipe(
        Effect.provide(Layer.merge(profiles, printer))
      )
    );
    if (outcome?._tag !== 'Respond') throw new Error('expected a response');
    return outcome.response;
  };

  it('canonicalises ?theme= and other variants to the clean URL', async () => {
    for (const path of ['/@ada', '/@ada?theme=flat', '/@ada?theme=even&x=1']) {
      const html = await (await get(path)).text();
      expect(html).toContain(
        '<link rel="canonical" href="https://jsonresume.org/@ada">'
      );
      expect(jsonLd(html)[0]['@type']).toBe('ProfilePage');
    }
  });

  it('points files at the page with a canonical Link header', async () => {
    for (const ext of ['json', 'yaml', 'txt', 'docx', 'pdf', 'qr']) {
      const res = await get(`/@ada.${ext}`);
      expect(res.headers.get('link')).toBe(
        '<https://jsonresume.org/@ada>; rel="canonical"'
      );
    }
  });

  it('prints the PDF from the theme’s own page, without the added tags', async () => {
    const pdf = await (await get('/@ada.pdf')).text();
    expect(pdf).not.toContain('application/ld+json');
  });
});
