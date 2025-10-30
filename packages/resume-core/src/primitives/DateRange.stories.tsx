import React from 'react';
/**
 * DateRange Stories
 */
import { DateRange } from './DateRange';

const meta = {
  title: 'Resume Core/Primitives/DateRange',
  component: DateRange,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    start: '2020',
    end: 'Present',
  },
};

export const Example = {
  args: {
    start: 'Jan 2022',
    end: 'Dec 2023',
  },
};
