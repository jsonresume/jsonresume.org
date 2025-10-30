import React from 'react';
/**
 * SocialLinks Stories
 */
import { SocialLinks } from './SocialLinks';

const meta = {
  title: 'Resume Core/Profile/SocialLinks',
  component: SocialLinks,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    links: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/sarahjohnson' },
      { platform: 'GitHub', url: 'https://github.com/sarahjohnson' },
      { platform: 'Twitter', url: 'https://twitter.com/sarahjohnson' },
    ],
  },
};

export const Example = {
  args: {
    links: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/michaelchen' },
      { platform: 'Portfolio', url: 'https://michaelchen.com' },
    ],
  },
};
