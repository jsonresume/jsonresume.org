import React from 'react';
/**
 * MetricBar Stories
 */
import { MetricBar } from './MetricBar';

const meta = {
  title: 'Resume Core/Data/MetricBar',
  component: MetricBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    label: 'JavaScript',
    value: 90,
    max: 100,
  },
};

export const Example = {
  args: {
    label: 'React',
    value: 95,
    max: 100,
    color: 'blue',
  },
};
