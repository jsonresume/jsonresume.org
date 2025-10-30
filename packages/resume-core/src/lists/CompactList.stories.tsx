import React from 'react';
/**
 * CompactList Stories
 */
import { CompactList } from './CompactList';

const meta = {
  title: 'Resume Core/Lists/CompactList',
  component: CompactList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: ['JavaScript', 'Python', 'React', 'Node.js', 'Docker'],
    showBullets: true,
    divider: false,
  },
};

export const Example = {
  args: {
    items: [
      'Tech Corp - Senior Engineer',
      'Innovation Labs - Software Engineer',
      'WebDev Agency - Developer',
    ],
    showBullets: false,
    divider: true,
  },
};
