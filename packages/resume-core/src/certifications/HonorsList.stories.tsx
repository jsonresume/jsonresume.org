import React from 'react';
/**
 * HonorsList Stories
 */
import { HonorsList } from './HonorsList';

const meta = {
  title: 'Resume Core/Certifications/HonorsList',
  component: HonorsList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      { title: "Dean's List", year: '2015-2019' },
      { title: 'Summa Cum Laude', year: '2019' },
    ],
  },
};

export const Example = {
  args: {
    items: [
      {
        title: 'Employee of the Year',
        organization: 'Tech Corp',
        year: '2022',
      },
      { title: 'Innovation Award', organization: 'Startup XYZ', year: '2021' },
    ],
  },
};
