import React from 'react';
/**
 * Grid Stories
 */
import { Grid } from './Grid';

const meta = {
  title: 'Resume Core/Utils/Grid',
  component: Grid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'Grid container content',
  },
};

export const Example = {
  args: {
    columns: 3,
    gap: 'large',
    children: 'Three column grid',
  },
};
