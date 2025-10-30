import React from 'react';
/**
 * Badge Stories
 */
import { Badge } from './Badge';

const meta = {
  title: 'Resume Core/Primitives/Badge',
  component: Badge,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'New',
  },
};

export const Example = {
  args: {
    children: 'Featured',
    variant: 'primary',
  },
};
