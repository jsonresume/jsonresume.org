import React from 'react';
/**
 * RelativeDate Stories
 */
import { RelativeDate } from './RelativeDate';

const meta = {
  title: 'Resume Core/Dates/RelativeDate',
  component: RelativeDate,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    ago: true,
  },
};

export const Example = {
  args: {
    startDate: '2020-01-01',
    endDate: '2023-06-30',
    ago: false,
  },
};
