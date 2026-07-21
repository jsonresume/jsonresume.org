import { describe, it, expect } from 'vitest';
import { runThemeRenderQa } from '@jsonresume/theme-kit/qa';
import { completeResume } from '@jsonresume/sample-data';
import { render } from '../src/index.jsx';

describe('Desert Modern Theme', () => {
  it('passes the shared theme render QA gate', async () => {
    await runThemeRenderQa({ render, name: 'desert-modern', expect });
  });

  it('renders expected fields from the standard fixture', () => {
    const html = render(completeResume);

    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('Jane Developer');
    expect(html).toContain('jane.developer@example.com');
  });
});
