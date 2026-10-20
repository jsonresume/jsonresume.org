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
