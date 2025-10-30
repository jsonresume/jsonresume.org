import React from 'react';
/**
 * ColorBlock Stories
 */
import { ColorBlock } from './ColorBlock';

const meta = {
  title: 'Resume Core/Visuals/ColorBlock',
  component: ColorBlock,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    color: 'primary',
  },
};

export const Example = {
  args: {
    color: 'accent',
    children: 'Content with colored background',
  },
};
