import React from 'react';
import { HighlightCard } from './HighlightCard';

const meta = {
  title: 'Resume Core/Callouts/HighlightCard',
  component: HighlightCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    title: 'Featured Achievement',
    description:
      'Led development of cloud-native architecture serving 1M+ daily users',
  },
};

export const Example = {
  args: {
    title: 'Key Skill',
    description: 'Expert in React, TypeScript, and modern web development',
    icon: '⭐',
  },
};
