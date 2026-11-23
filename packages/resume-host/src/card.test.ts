import { describe, expect, it } from 'vitest';
import { resumeCardHtml } from './card';

describe('the resume card', () => {
  const resume = {
    basics: {
      name: 'Ada Lovelace',
      label: 'Analyst <of> engines',
      email: 'ada@example.com',
      phone: '+44 1234',
      image: 'https://example.com/ada.jpg',
      location: { city: 'London', countryCode: 'GB', address: '12 St James' },
    },
    skills: [
      { name: 'Mathematics' },
      { keywords: ['Bernoulli numbers', 'Notes', 'Third'] },
    ],
  };
  const html = resumeCardHtml('ada', resume);

  it('shows the public parts: name, headline, place, photo, skills, link', () => {
    expect(html).toContain('<h1>Ada Lovelace</h1>');
    expect(html).toContain('Analyst &lt;of&gt; engines');
    expect(html).toContain('London, GB');
    expect(html).toContain('src="https://example.com/ada.jpg"');
    expect(html).toContain('<span>Mathematics</span>');
    expect(html).toContain('<span>Bernoulli numbers</span>');
    expect(html).toContain('jsonresume.org/@ada');
  });

  it('never shows contact details', () => {
    expect(html).not.toContain('ada@example.com');
    expect(html).not.toContain('+44');
    expect(html).not.toContain('St James');
  });

  it('draws an initial when there is no photo', () => {
    const bare = resumeCardHtml('grace', { basics: { name: 'Grace' } });
    expect(bare).toContain('class="photo initial">G</div>');
    expect(bare).not.toContain('<img');
  });
});

describe('the card URL', () => {
  it('changes when the card would', async () => {
    const { cardUrl } = await import('./seo');
    const a = cardUrl('ada', { basics: { name: 'Ada' } });
    expect(cardUrl('ada', { basics: { name: 'Ada' } })).toBe(a);
    expect(
      cardUrl('ada', { basics: { name: 'Ada', label: 'Analyst' } })
    ).not.toBe(a);
    // Contact details aren't on the card, so they don't change it.
    expect(
      cardUrl('ada', { basics: { name: 'Ada', email: 'a@example.com' } })
    ).toBe(a);
  });
});
