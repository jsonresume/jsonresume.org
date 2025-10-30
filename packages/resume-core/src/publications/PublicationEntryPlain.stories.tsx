import type { Meta, StoryObj } from '@storybook/react';
import { PublicationEntryPlain } from './PublicationEntryPlain';

const meta = {
  title: 'Publications/PublicationEntryPlain',
  component: PublicationEntryPlain,
  tags: ['autodocs'],
} satisfies Meta<typeof PublicationEntryPlain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    author: 'Smith, J. & Doe, A.',
    year: 2023,
    title: 'A Novel Approach to Resume Formatting for ATS Systems',
    venue: 'Journal of CV Design, Vol. 12, pp. 45-67',
  },
};

export const WithUrl: Story = {
  args: {
    author: 'Johnson, M.',
    year: 2024,
    title: 'Machine Learning Applications in Resume Parsing',
    venue: 'IEEE Conference on Document Processing',
    url: 'https://example.com/paper',
  },
};

export const MultipleAuthors: Story = {
  args: {
    author: "Zhang, L., Patel, R., O'Connor, S. & Williams, K.",
    year: 2022,
    title: 'Cross-Platform Resume Standards: A Comprehensive Survey',
    venue: 'ACM Computing Surveys, Vol. 55, No. 3',
    url: 'https://doi.org/10.1145/example',
  },
};

export const WithoutVenue: Story = {
  args: {
    author: 'Brown, T.',
    year: 2023,
    title: 'Self-Published Guide to Professional Resume Writing',
  },
};

export const LongTitle: Story = {
  args: {
    author: 'Martinez, A. & Chen, W.',
    year: 2021,
    title:
      'An Extensive Analysis of Applicant Tracking System Requirements and Their Impact on Resume Design Patterns in Modern Hiring Processes',
    venue: 'International Journal of Human Resources Technology',
  },
};
