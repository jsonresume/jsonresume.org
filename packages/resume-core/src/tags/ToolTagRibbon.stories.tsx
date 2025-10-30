import type { Meta, StoryObj } from '@storybook/react';
import { ToolTagRibbon } from './ToolTagRibbon';

const meta = {
  title: 'Tags/ToolTagRibbon',
  component: ToolTagRibbon,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToolTagRibbon>;

export default meta;
type Story = StoryObj<typeof meta>;

const frontendStack = [
  'React',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'styled-components',
];

const backendStack = [
  'Node.js',
  'Express',
  'PostgreSQL',
  'Redis',
  'MongoDB',
  'GraphQL',
];

const fullStack = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'PostgreSQL',
  'Docker',
  'AWS',
  'Git',
  'REST APIs',
  'GraphQL',
  'Redis',
  'MongoDB',
  'Kubernetes',
  'CI/CD',
];

export const Default: Story = {
  args: {
    tags: frontendStack,
  },
};

export const WithDotSeparator: Story = {
  args: {
    tags: frontendStack,
    separator: '•',
  },
};

export const WithSlashSeparator: Story = {
  args: {
    tags: backendStack,
    separator: '/',
  },
};

export const NoSeparator: Story = {
  args: {
    tags: frontendStack,
    separator: '',
  },
};

export const SmallSize: Story = {
  args: {
    tags: frontendStack,
    size: 'small',
  },
};

export const LargeSize: Story = {
  args: {
    tags: frontendStack,
    size: 'large',
  },
};

export const ManyTags: Story = {
  args: {
    tags: fullStack,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates wrapping behavior with many tags',
      },
    },
  },
};

export const SingleTag: Story = {
  args: {
    tags: ['React'],
  },
};

export const EmptyTags: Story = {
  args: {
    tags: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Component returns null when no tags are provided',
      },
    },
  },
};
