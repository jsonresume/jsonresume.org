import type { Meta, StoryObj } from '@storybook/react';
import { BadgeRowOutline } from './BadgeRowOutline';

const meta = {
  title: 'Badges/BadgeRowOutline',
  component: BadgeRowOutline,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BadgeRowOutline>;

export default meta;
type Story = StoryObj<typeof meta>;

const softSkills = [
  'Leadership',
  'Communication',
  'Problem Solving',
  'Teamwork',
];

const hardSkills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'PostgreSQL',
  'Docker',
];

const categories = ['Frontend', 'Backend', 'DevOps', 'Design'];

const certifications = ['AWS Certified', 'Scrum Master', 'PMP', 'Security+'];

export const Default: Story = {
  args: {
    items: softSkills,
  },
};

export const SmallSize: Story = {
  args: {
    items: hardSkills,
    size: 'small',
  },
};

export const LargeSize: Story = {
  args: {
    items: softSkills,
    size: 'large',
  },
};

export const NotRounded: Story = {
  args: {
    items: categories,
    rounded: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Square corners instead of fully rounded',
      },
    },
  },
};

export const ThickStroke: Story = {
  args: {
    items: softSkills,
    strokeWidth: '1pt',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Thicker border for more emphasis (1pt instead of default 0.5pt)',
      },
    },
  },
};

export const ThinStroke: Story = {
  args: {
    items: hardSkills,
    strokeWidth: '0.5pt',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimum recommended stroke width (0.5pt) to avoid scalloping',
      },
    },
  },
};

export const ManyBadges: Story = {
  args: {
    items: [
      'JavaScript',
      'TypeScript',
      'React',
      'Vue',
      'Angular',
      'Node.js',
      'Express',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'Docker',
      'Kubernetes',
      'AWS',
      'Azure',
      'Git',
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates wrapping behavior with many badges',
      },
    },
  },
};

export const Certifications: Story = {
  args: {
    items: certifications,
    size: 'medium',
    strokeWidth: '0.75pt',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example usage for displaying certifications',
      },
    },
  },
};

export const EmptyBadges: Story = {
  args: {
    items: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Component returns null when no items are provided',
      },
    },
  },
};

export const SingleBadge: Story = {
  args: {
    items: ['Full Stack Developer'],
  },
};
