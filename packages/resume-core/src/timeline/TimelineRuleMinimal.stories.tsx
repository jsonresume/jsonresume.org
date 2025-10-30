import React from 'react';
import { TimelineRuleMinimal } from './TimelineRuleMinimal';

export default {
  title: 'Timeline/TimelineRuleMinimal',
  component: TimelineRuleMinimal,
  tags: ['autodocs'],
};

const sampleItems = [
  {
    date: 'Jan 2020',
    label: 'Software Engineer',
    meta: 'Tech Corp',
  },
  {
    date: 'Mar 2022',
    label: 'Senior Software Engineer',
    meta: 'Innovation Labs',
  },
  {
    date: 'Jun 2024',
    label: 'Lead Engineer',
    meta: 'Startup Inc',
  },
];

export const Default = {
  args: {
    items: sampleItems,
  },
};

export const CustomTickHeight = {
  args: {
    items: sampleItems,
    tickHeight: '3pt',
  },
};

export const CustomColors = {
  args: {
    items: sampleItems,
    lineColor: '#4a90e2',
    tickHeight: '2.5pt',
  },
};

export const MinimalLabels = {
  args: {
    items: [
      { date: '2020', label: 'Bachelor of Science' },
      { date: '2022', label: 'Master of Science' },
      { date: '2024', label: 'PhD Candidate' },
    ],
  },
};

export const DatesOnly = {
  args: {
    items: [
      { date: 'Q1 2020' },
      { date: 'Q3 2021' },
      { date: 'Q2 2023' },
      { date: 'Present' },
    ],
  },
};
