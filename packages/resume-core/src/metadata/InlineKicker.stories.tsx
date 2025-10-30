import type { Meta, StoryObj } from '@storybook/react';
import { InlineKicker } from './InlineKicker.jsx';

const meta: Meta<typeof InlineKicker> = {
  title: 'Metadata/InlineKicker',
  component: InlineKicker,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    as: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof InlineKicker>;

export const Default: Story = {
  args: {
    children: 'Featured Project',
  },
};

export const CustomColor: Story = {
  args: {
    children: 'Senior Role',
    color: '#2563eb',
  },
};

export const AsDiv: Story = {
  args: {
    children: 'Leadership Position',
    as: 'div',
  },
};
