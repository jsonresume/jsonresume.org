import React from 'react';
/**
 * StatCard Stories
 */
import { StatCard } from './StatCard';

const meta = {
  title: 'Resume Core/Data/StatCard',
  component: StatCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    value: '8+',
    label: 'Years Experience',
  },
};

export const Example = {
  args: {
    value: '15+',
    label: 'Projects Completed',
    icon: '🚀',
  },
};
