import React from 'react';
/**
 * BackgroundPattern Stories
 */
import { BackgroundPattern } from './BackgroundPattern';

const meta = {
  title: 'Resume Core/Visuals/BackgroundPattern',
  component: BackgroundPattern,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    pattern: 'dots',
  },
};

export const Example = {
  args: {
    pattern: 'grid',
    opacity: 0.1,
  },
};
