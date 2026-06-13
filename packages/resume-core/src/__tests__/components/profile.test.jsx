import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHtml } from './renderHtml.jsx';
import { Avatar, ProfileCard, SocialLinks } from '../../index.js';

describe('Avatar', () => {
  it('renders an <img> when src is provided', () => {
    const { html } = renderHtml(
      <Avatar src="https://img.example.com/a.png" alt="Jane Doe" />
    );
    expect(html).toContain('<img');
    expect(html).toContain('src="https://img.example.com/a.png"');
    expect(html).toContain('alt="Jane Doe"');
  });

  it('renders a placeholder with the first initial when no src/fallback', () => {
    const { html } = renderHtml(<Avatar alt="Jane" />);
    expect(html).not.toContain('<img');
    expect(html).toContain('J');
  });

  it('renders "?" placeholder when there is no src, fallback, or alt', () => {
    const { html } = renderHtml(<Avatar />);
    expect(html).not.toContain('<img');
    expect(html).toContain('?');
  });

  it('uses the fallback image when src is absent but fallback is set', () => {
    const { html } = renderHtml(
      <Avatar fallback="https://img.example.com/f.png" alt="x" />
    );
    expect(html).toContain('<img');
    expect(html).toContain('https://img.example.com/f.png');
  });

  it('uppercases the placeholder initial', () => {
    const { html } = renderHtml(<Avatar alt="zara" />);
    expect(html).toContain('Z');
  });

  it('passes className through to the rendered element', () => {
    const { html } = renderHtml(<Avatar src="x.png" className="rounded" />);
    expect(html).toContain('rounded');
  });
});

describe('ProfileCard', () => {
  it('renders name, title and summary when provided', () => {
    const { html } = renderHtml(
      <ProfileCard
        name="Jane Doe"
        title="Engineer"
        summary="Builds resilient systems"
      />
    );
    expect(html).toContain('Jane Doe');
    expect(html).toContain('Engineer');
    expect(html).toContain('Builds resilient systems');
  });

  it('renders without any fields (no crash, empty info)', () => {
    const { html } = renderHtml(<ProfileCard />);
    expect(html).toContain('<div');
  });

  it('renders a provided avatar node and children', () => {
    const { html } = renderHtml(
      <ProfileCard name="Jane" avatar={<span className="av">AV</span>}>
        <span className="child">extra</span>
      </ProfileCard>
    );
    expect(html).toContain('AV');
    expect(html).toContain('extra');
  });
});

describe('SocialLinks', () => {
  it('renders an anchor per link with target/rel', () => {
    const { html } = renderHtml(
      <SocialLinks
        links={[
          {
            network: 'GitHub',
            username: 'jane',
            url: 'https://github.com/jane',
          },
          { network: 'X', username: 'jane', url: 'https://x.com/jane' },
        ]}
      />
    );
    const anchors = (html.match(/<a /g) || []).length;
    expect(anchors).toBe(2);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('https://github.com/jane');
  });

  it('renders nothing meaningful for an empty links list', () => {
    const { html } = renderHtml(<SocialLinks links={[]} />);
    expect(html).not.toContain('<a ');
  });

  it('does not crash when links prop is omitted (defaults to [])', () => {
    const { html } = renderHtml(<SocialLinks />);
    expect(html).toContain('<div');
  });

  it('falls back to network when username is missing', () => {
    const { html } = renderHtml(
      <SocialLinks links={[{ network: 'Dribbble', url: 'https://x' }]} />
    );
    expect(html).toContain('Dribbble');
  });
});
