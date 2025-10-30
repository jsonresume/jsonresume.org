import React from 'react';
/**
 * CheckList Stories
 */
import { CheckList } from './CheckList';

const meta = {
  title: 'Resume Core/Lists/CheckList',
  component: CheckList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      { text: 'JavaScript/TypeScript', checked: true },
      { text: 'React & Redux', checked: true },
      { text: 'Node.js & Express', checked: true },
      { text: 'GraphQL', checked: false },
    ],
    strikethrough: false,
  },
};

export const Example = {
  args: {
    items: [
      { text: 'Complete authentication system', checked: true },
      { text: 'Implement user dashboard', checked: true },
      { text: 'Add analytics tracking', checked: false },
      { text: 'Deploy to production', checked: false },
    ],
    strikethrough: true,
  },
};
