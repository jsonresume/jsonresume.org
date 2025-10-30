import React from 'react';
/**
 * DateBadge Stories
 */
import { DateBadge } from './DateBadge';

const meta = {
  title: 'Resume Core/Dates/DateBadge',
  component: DateBadge,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    date: '2020 - 2023',
    variant: 'outlined',
  },
};

export const Example = {
  args: {
    date: 'Jan 2022 - Present',
    icon: '📅',
    variant: 'filled',
    dateTime: '2022-01-01',
  },
};
