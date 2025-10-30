import type { Meta, StoryObj } from '@storybook/react';
import { PageHeaderLine } from './PageHeaderLine';

const meta = {
  title: 'Print/PageHeaderLine',
  component: PageHeaderLine,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Repeating header line with name on subsequent pages. Uses CSS @page margin boxes to reserve top space for printing. Only visible in print preview.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Full name to display in header',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle (e.g., job title)',
    },
  },
} satisfies Meta<typeof PageHeaderLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'John Doe',
  },
  render: (args) => (
    <div>
      <PageHeaderLine {...args} />
      <div style={{ padding: '2rem' }}>
        <h1>Resume Content</h1>
        <p>
          The header line will appear at the top of each printed page. Use your
          browser's print preview (Cmd/Ctrl + P) to see the effect.
        </p>
        <p>
          This component uses <code>position: running(header)</code> which is
          supported in print mode to create repeating headers.
        </p>
      </div>
    </div>
  ),
};

export const WithSubtitle: Story = {
  args: {
    name: 'Jane Smith',
    subtitle: 'Software Engineer',
  },
  render: (args) => (
    <div>
      <PageHeaderLine {...args} />
      <div style={{ padding: '2rem' }}>
        <h1>Resume Content</h1>
        <p>Header with name and subtitle for additional context.</p>
      </div>
    </div>
  ),
};

export const CustomContent: Story = {
  args: {
    name: 'Alex Johnson',
  },
  render: (args) => (
    <div>
      <PageHeaderLine {...args}>
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          Updated: January 2025
        </span>
      </PageHeaderLine>
      <div style={{ padding: '2rem' }}>
        <h1>Resume Content</h1>
        <p>Header with custom children content on the right side.</p>
      </div>
    </div>
  ),
};

export const MultiPageDemo: Story = {
  args: {
    name: 'Sarah Williams',
    subtitle: 'UX Designer',
  },
  render: (args) => (
    <div>
      <PageHeaderLine {...args} />
      <div style={{ padding: '2rem' }}>
        <h1>Page 1 Content</h1>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
    </div>
  ),
};
