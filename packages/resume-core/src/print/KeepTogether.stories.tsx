import React from 'react';
/**
 * KeepTogether Stories
 */
import { KeepTogether } from './KeepTogether';

const meta = {
  title: 'Resume Core/Print/KeepTogether',
  component: KeepTogether,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'Content that should stay together when printing',
  },
};

export const Example = {
  args: {
    children: 'Experience section - do not break across pages',
  },
};
