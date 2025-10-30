import React from 'react';
/**
 * PullQuote Stories
 */
import { PullQuote } from './PullQuote';

const meta = {
  title: 'Resume Core/Quotes/PullQuote',
  component: PullQuote,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    quote:
      "Sarah's technical leadership and innovative approach to problem-solving have transformed our engineering culture.",
    author: 'Michael Chen',
    context: 'CTO at Tech Corp',
  },
};

export const Example = {
  args: {
    quote:
      'An exceptional engineer who combines deep technical expertise with outstanding communication skills. A true asset to any team.',
    author: 'Jennifer Martinez',
    context: 'VP of Engineering, Innovation Labs',
  },
};
