import React from 'react';
import { NameStackElegant } from './NameStackElegant';

const meta = {
  title: 'Resume Core/Header/NameStackElegant',
  component: NameStackElegant,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    name: 'Alexandra Chen',
    role: 'Senior Product Designer',
  },
};

export const WithTagline = {
  args: {
    name: 'Alexandra Chen',
    role: 'Senior Product Designer',
    tagline: 'Creating intuitive digital experiences that delight users',
  },
};

export const LeftAlign = {
  args: {
    name: 'Marcus Thompson',
    role: 'Full Stack Developer',
    tagline: 'Building scalable web applications',
    align: 'left',
  },
};

export const RightAlign = {
  args: {
    name: 'Sarah Williams',
    role: 'Data Scientist',
    tagline: 'Transforming data into actionable insights',
    align: 'right',
  },
};

export const LongTagline = {
  args: {
    name: 'Dr. James Rodriguez',
    role: 'Research Scientist & AI Engineer',
    tagline:
      'Pioneering advances in machine learning and artificial intelligence with a focus on ethical AI development and real-world applications',
  },
};

export const Minimal = {
  args: {
    name: 'Jordan Lee',
    role: 'UX Designer',
  },
};
