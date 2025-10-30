import React from 'react';
import { HeroNameBlock } from './HeroNameBlock';

const meta = {
  title: 'Resume Core/Header/HeroNameBlock',
  component: HeroNameBlock,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    name: 'Alexandra Martinez',
  },
};

export const WithLabel = {
  args: {
    name: 'Alexandra Martinez',
    label: 'Portfolio',
  },
};

export const LongName = {
  args: {
    name: 'Dr. Maximilian Alexander van der Woodsworth III',
    label: 'Curriculum Vitae',
  },
};

export const ShortName = {
  args: {
    name: 'Max Li',
  },
};
