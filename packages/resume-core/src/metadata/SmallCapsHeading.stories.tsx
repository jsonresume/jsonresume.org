import type { Meta, StoryObj } from '@storybook/react';
import { SmallCapsHeading } from './SmallCapsHeading.jsx';

const meta: Meta<typeof SmallCapsHeading> = {
  title: 'Metadata/SmallCapsHeading',
  component: SmallCapsHeading,
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'number',
      min: 1,
      max: 6,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SmallCapsHeading>;

export const Medium: Story = {
  args: {
    children: 'Professional Experience',
    level: 2,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    children: 'Education',
    level: 3,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Technical Skills',
    level: 2,
    size: 'lg',
  },
};

export const Level3: Story = {
  args: {
    children: 'Certifications',
    level: 3,
    size: 'md',
  },
};
