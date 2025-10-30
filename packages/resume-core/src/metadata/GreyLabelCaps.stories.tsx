import type { Meta, StoryObj } from '@storybook/react';
import { GreyLabelCaps } from './GreyLabelCaps.jsx';

const meta: Meta<typeof GreyLabelCaps> = {
  title: 'Metadata/GreyLabelCaps',
  component: GreyLabelCaps,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm'],
    },
    as: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof GreyLabelCaps>;

export const Small: Story = {
  args: {
    children: 'Education',
    size: 'sm',
  },
};

export const ExtraSmall: Story = {
  args: {
    children: '2018-2022',
    size: 'xs',
  },
};

export const AsDiv: Story = {
  args: {
    children: 'Certification',
    size: 'sm',
    as: 'div',
  },
};
