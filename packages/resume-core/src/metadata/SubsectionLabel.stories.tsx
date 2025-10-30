import type { Meta, StoryObj } from '@storybook/react';
import { SubsectionLabel } from './SubsectionLabel.jsx';

const meta: Meta<typeof SubsectionLabel> = {
  title: 'Metadata/SubsectionLabel',
  component: SubsectionLabel,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['tracked', 'caps'],
    },
    as: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof SubsectionLabel>;

export const Tracked: Story = {
  args: {
    children: 'Key Achievements',
    variant: 'tracked',
  },
};

export const SmallCaps: Story = {
  args: {
    children: 'Technical Skills',
    variant: 'caps',
  },
};

export const AsSpan: Story = {
  args: {
    children: 'Responsibilities',
    variant: 'tracked',
    as: 'span',
  },
};
