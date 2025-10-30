import React from 'react';
/**
 * DividerVariants Stories
 */
import { DividerVariants } from './DividerVariants';

const meta = {
  title: 'Resume Core/Visuals/DividerVariants',
  component: DividerVariants,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    variant: 'solid',
  },
};

export const Example = {
  args: {
    variant: 'dotted',
    spacing: 'large',
  },
};
