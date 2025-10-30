import type { Meta, StoryObj } from '@storybook/react';
import { MetricBullet, MetricBulletList } from './MetricBullet';

const meta: Meta<typeof MetricBullet> = {
  title: 'Data/MetricBullet',
  component: MetricBullet,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricBullet>;

export const Default: Story = {
  render: () => (
    <MetricBulletList>
      <MetricBullet metric="40%">Revenue increase in Q4 2023</MetricBullet>
      <MetricBullet metric="$2.5M">Annual cost savings achieved</MetricBullet>
      <MetricBullet metric="3x">
        Performance improvement over baseline
      </MetricBullet>
    </MetricBulletList>
  ),
};

export const RightAligned: Story = {
  render: () => (
    <MetricBulletList>
      <MetricBullet metric="40%" align="right">
        Revenue increase in Q4 2023
      </MetricBullet>
      <MetricBullet metric="$2.5M" align="right">
        Annual cost savings achieved
      </MetricBullet>
      <MetricBullet metric="3x" align="right">
        Performance improvement over baseline
      </MetricBullet>
    </MetricBulletList>
  ),
};

export const TightSpacing: Story = {
  render: () => (
    <MetricBulletList>
      <MetricBullet metric="99.9%" spacing="tight">
        System uptime maintained
      </MetricBullet>
      <MetricBullet metric="<100ms" spacing="tight">
        P95 latency achieved
      </MetricBullet>
      <MetricBullet metric="200K" spacing="tight">
        Monthly active users reached
      </MetricBullet>
      <MetricBullet metric="NPS 8.5" spacing="tight">
        Customer satisfaction score
      </MetricBullet>
    </MetricBulletList>
  ),
};

export const CustomBullet: Story = {
  render: () => (
    <MetricBulletList>
      <MetricBullet metric="40%" bullet="✓">
        Revenue increase achieved
      </MetricBullet>
      <MetricBullet metric="$2.5M" bullet="✓">
        Cost savings realized
      </MetricBullet>
      <MetricBullet metric="15" bullet="→">
        Team members led
      </MetricBullet>
    </MetricBulletList>
  ),
};

export const InContext: Story = {
  render: () => (
    <div>
      <h3>Senior Software Engineer - Acme Corp</h3>
      <p>
        Led development of microservices platform serving enterprise clients.
      </p>
      <MetricBulletList>
        <MetricBullet metric="85%">
          Reduced API response time by optimizing database queries
        </MetricBullet>
        <MetricBullet metric="$4.2M">
          Annual infrastructure cost savings through cloud optimization
        </MetricBullet>
        <MetricBullet metric="15">
          Engineers mentored across 3 cross-functional teams
        </MetricBullet>
        <MetricBullet metric="2M+">
          Daily active users supported by platform
        </MetricBullet>
      </MetricBulletList>
    </div>
  ),
};
