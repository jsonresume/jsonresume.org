import type { Meta, StoryObj } from '@storybook/react';
import { KPIChipLine, KPIChip } from './KPIChipLine';

const meta: Meta<typeof KPIChipLine> = {
  title: 'Data/KPIChipLine',
  component: KPIChipLine,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KPIChipLine>;

export const Default: Story = {
  args: {
    kpis: ['95% Uptime', 'NPS 8.5', '200K MAU', '<100ms P95'],
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <strong>Extra Small:</strong>
        <KPIChipLine kpis={['95% Uptime', 'NPS 8.5', '200K MAU']} size="xs" />
      </div>
      <div>
        <strong>Small (default):</strong>
        <KPIChipLine kpis={['95% Uptime', 'NPS 8.5', '200K MAU']} size="sm" />
      </div>
      <div>
        <strong>Medium:</strong>
        <KPIChipLine kpis={['95% Uptime', 'NPS 8.5', '200K MAU']} size="md" />
      </div>
    </div>
  ),
};

export const WithDividers: Story = {
  args: {
    kpis: ['95% Uptime', 'NPS 8.5', '200K MAU', '<100ms P95'],
    showDividers: true,
  },
};

export const CustomDivider: Story = {
  args: {
    kpis: ['95% Uptime', 'NPS 8.5', '200K MAU', '<100ms P95'],
    showDividers: true,
    divider: '•',
  },
};

export const ManualComposition: Story = {
  render: () => (
    <KPIChipLine>
      <KPIChip>99.9% Uptime</KPIChip>
      <KPIChip>NPS 9.2</KPIChip>
      <KPIChip>500K MAU</KPIChip>
      <KPIChip>&lt;50ms P95</KPIChip>
      <KPIChip>SOC 2 Compliant</KPIChip>
    </KPIChipLine>
  ),
};

export const InContext: Story = {
  render: () => (
    <div>
      <h3>Platform Engineer - Cloud Infrastructure</h3>
      <p>
        Managed critical production infrastructure supporting millions of users.
      </p>
      <KPIChipLine
        kpis={['99.9% Uptime', '<100ms P95', '200K MAU', '$2.5M Saved']}
        margin="12px 0"
      />
      <p>
        Led migration to Kubernetes, implementing automated scaling, monitoring,
        and disaster recovery processes across 3 regions.
      </p>
    </div>
  ),
};

export const TightLayout: Story = {
  args: {
    kpis: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'AWS',
      'Docker',
      'K8s',
    ],
    size: 'xs',
    gap: '4px',
    margin: '4px 0',
  },
};
