import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convert } from './convert.js';
import { toRenderCVNetwork, toSocialNetworks } from './networks.js';

test('matches network names case-insensitively (#533)', () => {
  assert.equal(toRenderCVNetwork('GitHub'), 'GitHub');
  assert.equal(toRenderCVNetwork('github'), 'GitHub');
  assert.equal(toRenderCVNetwork('Stack Overflow'), 'StackOverflow');
  assert.equal(toRenderCVNetwork('google-scholar'), 'Google Scholar');
  assert.equal(toRenderCVNetwork('Twitter'), 'X');
});

test('drops profiles RenderCV would reject', () => {
  const networks = toSocialNetworks([
    { network: 'Facebook', username: 'jane' },
    { network: 'LinkedIn' },
    { network: 'LinkedIn', username: 'jane-doe' },
  ]);
  assert.deepEqual(networks, [{ network: 'LinkedIn', username: 'jane-doe' }]);
});

test('tolerates missing or null profiles', () => {
  assert.deepEqual(toSocialNetworks(null), []);
  assert.deepEqual(toSocialNetworks(undefined), []);
  assert.deepEqual(toSocialNetworks([null]), []);
});

test('converted YAML keeps the network name', async () => {
  const yaml = await convert({
    basics: {
      profiles: [{ network: 'GitHub', username: 'lajawi', url: '' }],
    },
  });
  assert.match(yaml, /network: "GitHub"/);
  assert.match(yaml, /username: "lajawi"/);
  assert.doesNotMatch(yaml, /null/);
  assert.doesNotMatch(yaml, /undefined/);
});

test('publications get the resume owner as author (#545)', async () => {
  const yaml = await convert({
    basics: { name: 'Jane Doe' },
    publications: [
      {
        name: 'On Resumes',
        publisher: 'Journal of JSON',
        releaseDate: '2020-01-01',
        url: 'https://example.com/paper',
      },
    ],
  });
  assert.match(yaml, /title: "On Resumes"/);
  assert.match(yaml, /authors:\s*\n\s*- "Jane Doe"/);
  assert.match(yaml, /journal: "Journal of JSON"/);
  assert.doesNotMatch(yaml, /null/);
});

test('only international phone numbers are kept', async () => {
  const local = await convert({ basics: { phone: '(912) 555-4321' } });
  const intl = await convert({ basics: { phone: '+1 912 555 4321' } });
  assert.doesNotMatch(local, /phone/);
  assert.match(intl, /phone: "\+1 912 555 4321"/);
});

test('package entry is the converter, not the CLI', async () => {
  const pkg = await import('@jsonresume/jsonresume-to-rendercv');
  assert.equal(typeof pkg.convert, 'function');
});
