import React from 'react';
/**
 * BlockQuote Stories
 */
import { BlockQuote } from './BlockQuote';

const meta = {
  title: 'Resume Core/Quotes/BlockQuote',
  component: BlockQuote,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: () => (
    <BlockQuote cite="Sarah Johnson, Senior Manager">
      Sarah is an exceptional engineer who consistently delivers high-quality
      work. Her technical expertise and leadership skills have been instrumental
      in our team's success.
    </BlockQuote>
  ),
};

export const Example = {
  render: () => (
    <BlockQuote cite="Michael Chen, CTO at Tech Corp" highlight={true}>
      One of the most talented developers I've worked with. Sarah's ability to
      solve complex problems and mentor junior team members is outstanding.
    </BlockQuote>
  ),
};
