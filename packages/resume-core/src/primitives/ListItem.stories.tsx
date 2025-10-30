import React from 'react';
/**
 * ListItem Stories
 */
import { ListItem } from './ListItem';

const meta = {
  title: 'Resume Core/Primitives/ListItem',
  component: ListItem,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'First list item',
  },
};

export const Example = {
  args: {
    children: 'List item with icon',
    icon: '✓',
  },
};
