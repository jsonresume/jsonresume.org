import React from 'react';
/**
 * BorderAccent Stories
 */
import { BorderAccent } from './BorderAccent';

const meta = {
  title: 'Resume Core/Visuals/BorderAccent',
  component: BorderAccent,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    side: 'left',
  },
};

export const Example = {
  args: {
    side: 'top',
    color: 'accent',
  },
};
