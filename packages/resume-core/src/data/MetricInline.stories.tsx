import type { Meta, StoryObj } from '@storybook/react';
import { MetricInline } from './MetricInline';

const meta: Meta<typeof MetricInline> = {
  title: 'Data/MetricInline',
  component: MetricInline,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricInline>;

export const Default: Story = {
  render: () => (
    <p>
      Increased revenue by <MetricInline>40%</MetricInline> year over year while
      reducing costs by <MetricInline>$2.5M</MetricInline> annually.
    </p>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div>
      <p>
        Small: Led team of <MetricInline size="sm">12</MetricInline> engineers
      </p>
      <p>
        Medium (default): Improved performance by{' '}
        <MetricInline>3x</MetricInline>
      </p>
      <p>
        Large: Achieved <MetricInline size="lg">99.9%</MetricInline> uptime
      </p>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div>
      <h3>Senior Software Engineer</h3>
      <p>
        Led a cross-functional team of <MetricInline>15</MetricInline> engineers
        to deliver a cloud-native platform serving{' '}
        <MetricInline>2M+</MetricInline> daily active users. Improved API
        response time by <MetricInline>85%</MetricInline> and reduced
        infrastructure costs by <MetricInline size="lg">$4.2M</MetricInline>{' '}
        annually.
      </p>
    </div>
  ),
};
