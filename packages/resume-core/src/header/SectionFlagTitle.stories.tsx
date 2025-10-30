import React from 'react';
import { SectionFlagTitle } from './SectionFlagTitle';

const meta = {
  title: 'Resume Core/Header/SectionFlagTitle',
  component: SectionFlagTitle,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'Work Experience',
  },
};

export const Skills = {
  args: {
    children: 'Technical Skills',
    level: 2,
  },
};

export const CustomColor = {
  args: {
    children: 'Featured Projects',
    flagColor: '#8b5cf6',
  },
};

export const WideFlag = {
  args: {
    children: 'Education',
    flagWidth: '6px',
  },
};

export const BlueAccent = {
  args: {
    children: 'Certifications',
    flagColor: '#2563eb',
    flagWidth: '5px',
  },
};

export const Level3 = {
  args: {
    children: 'Languages',
    level: 3,
  },
};
