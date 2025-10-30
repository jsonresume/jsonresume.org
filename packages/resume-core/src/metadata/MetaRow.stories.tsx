import type { Meta, StoryObj } from '@storybook/react';
import { MetaRow } from './MetaRow.jsx';

const meta: Meta<typeof MetaRow> = {
  title: 'Metadata/MetaRow',
  component: MetaRow,
  tags: ['autodocs'],
  argTypes: {
    separator: { control: 'text' },
    as: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof MetaRow>;

export const Default: Story = {
  args: {
    items: ['San Francisco, CA', 'Jan 2020 - Present', 'Full-time'],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: ['Remote', 'Contract', '$150k-$200k'],
    separator: ' | ',
  },
};

export const WithChildren: Story = {
  render: () => (
    <MetaRow>
      <span>Boston, MA</span>
      <span>Jun 2018 - Dec 2019</span>
      <span>Part-time</span>
    </MetaRow>
  ),
};
