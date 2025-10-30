import React from 'react';
import { Callout } from './Callout';

const meta = {
  title: 'Resume Core/Callouts/Callout',
  component: Callout,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    title: 'Important Note',
    children:
      'This is an important callout message for highlighting key information.',
  },
};

export const Example = {
  args: {
    title: 'Success!',
    variant: 'success',
    children: 'Your changes have been saved successfully.',
  },
};
