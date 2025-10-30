import React from 'react';
import { InfoBox } from './InfoBox';

const meta = {
  title: 'Resume Core/Callouts/InfoBox',
  component: InfoBox,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    title: 'Professional Summary',
    children:
      'Experienced software engineer with 8+ years building scalable web applications.',
  },
};

export const Example = {
  args: {
    title: 'Contact Information',
    children: 'Available for full-time positions and consulting opportunities.',
  },
};
