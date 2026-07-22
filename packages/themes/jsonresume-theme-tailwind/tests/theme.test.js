import { describe, it, expect } from 'vitest';
import { runThemeRenderQa } from '@jsonresume/theme-kit/qa';
import { completeResume } from '@jsonresume/sample-data';
// Test the built bundle rather than src: twind@0.16's faux-ESM wrapper breaks
// under vitest's node ESM resolution, and CI's check:dist-sync guarantees
// dist stays identical to a fresh build of src.
import { render } from '../dist/index.js';

describe('Tailwind Theme', () => {
  it('passes the shared theme render QA gate', async () => {
    await runThemeRenderQa({ render, name: 'tailwind', expect });
  });

  it('renders expected fields from the standard fixture', () => {
    const html = render(completeResume);

    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('Jane Developer');
    expect(html).toContain('jane.developer@example.com');
  });
});
