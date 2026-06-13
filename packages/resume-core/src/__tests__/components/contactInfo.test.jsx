import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHtml } from './renderHtml.jsx';
import { ContactInfo } from '../../index.js';

describe('ContactInfo', () => {
  it('renders nothing when basics is omitted entirely (default {})', () => {
    // The gotcha: ContactInfo takes a single `basics` prop, not loose fields.
    const { html } = renderHtml(<ContactInfo />);
    expect(html).toBe('');
  });

  it('renders nothing for an empty basics object', () => {
    const { html } = renderHtml(<ContactInfo basics={{}} />);
    expect(html).toBe('');
  });

  it('renders an email as a mailto link', () => {
    const { html } = renderHtml(
      <ContactInfo basics={{ email: 'jane@example.com' }} />
    );
    expect(html).toContain('jane@example.com');
    expect(html).toContain('mailto:jane@example.com');
    expect(html).toContain('aria-label="Email"');
  });

  it('renders a phone as a tel link', () => {
    const { html } = renderHtml(
      <ContactInfo basics={{ phone: '+1 555 0100' }} />
    );
    expect(html).toContain('tel:');
    expect(html).toContain('aria-label="Phone"');
  });

  it('renders a website with protocol stripped from display text', () => {
    const { html } = renderHtml(
      <ContactInfo basics={{ url: 'https://jane.dev/' }} />
    );
    expect(html).toContain('href="https://jane.dev/"');
    expect(html).toContain('>jane.dev<');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('joins location parts and skips falsy fields', () => {
    const { html } = renderHtml(
      <ContactInfo
        basics={{
          location: { city: 'Berlin', region: '', countryCode: 'DE' },
        }}
      />
    );
    expect(html).toContain('Berlin, DE');
  });

  it('does not render a location item when all location fields are empty', () => {
    const { html } = renderHtml(
      <ContactInfo basics={{ location: { city: '', region: '' } }} />
    );
    expect(html).toBe('');
  });

  it('renders social profiles with the network as the label', () => {
    const { html } = renderHtml(
      <ContactInfo
        basics={{
          profiles: [
            { network: 'GitHub', url: 'https://github.com/jane' },
            { network: 'LinkedIn', url: 'https://linkedin.com/in/jane' },
          ],
        }}
      />
    );
    expect(html).toContain('GitHub');
    expect(html).toContain('LinkedIn');
    expect(html).toContain('https://github.com/jane');
  });

  it('skips profiles that have no url', () => {
    const { html } = renderHtml(
      <ContactInfo basics={{ profiles: [{ network: 'Empty' }] }} />
    );
    expect(html).toBe('');
  });

  it('inserts the separator between multiple items', () => {
    const { html } = renderHtml(
      <ContactInfo basics={{ email: 'a@b.com', phone: '123' }} separator="|" />
    );
    expect(html).toContain('|');
  });

  it('does not throw if profiles is missing (defaults to [])', () => {
    const { html } = renderHtml(<ContactInfo basics={{ email: 'a@b.com' }} />);
    expect(html).toContain('a@b.com');
  });
});
