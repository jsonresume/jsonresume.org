import type { Meta, StoryObj } from '@storybook/react';
import { PageFooterLine } from './PageFooterLine';

const meta = {
  title: 'Print/PageFooterLine',
  component: PageFooterLine,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Small footer with page number and date. Displays "Page X of N" format with automatic page numbering. Only visible in print preview.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showDate: {
      control: 'boolean',
      description: 'Show current date in footer',
    },
    dateFormat: {
      control: 'text',
      description: 'Custom date string (defaults to locale date)',
    },
  },
} satisfies Meta<typeof PageFooterLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showDate: true,
  },
  render: (args) => (
    <div>
      <div style={{ padding: '2rem', minHeight: '400px' }}>
        <h1>Resume Content</h1>
        <p>
          The footer will appear at the bottom of each printed page with page
          numbers. Use your browser's print preview (Cmd/Ctrl + P) to see the
          effect.
        </p>
      </div>
      <PageFooterLine {...args} />
    </div>
  ),
};

export const WithoutDate: Story = {
  args: {
    showDate: false,
  },
  render: (args) => (
    <div>
      <div style={{ padding: '2rem', minHeight: '400px' }}>
        <h1>Resume Content</h1>
        <p>Footer with page numbers only, no date.</p>
      </div>
      <PageFooterLine {...args} />
    </div>
  ),
};

export const CustomDateFormat: Story = {
  args: {
    showDate: true,
    dateFormat: 'January 2025',
  },
  render: (args) => (
    <div>
      <div style={{ padding: '2rem', minHeight: '400px' }}>
        <h1>Resume Content</h1>
        <p>Footer with custom date format.</p>
      </div>
      <PageFooterLine {...args} />
    </div>
  ),
};

export const WithCustomContent: Story = {
  args: {
    showDate: true,
  },
  render: (args) => (
    <div>
      <div style={{ padding: '2rem', minHeight: '400px' }}>
        <h1>Resume Content</h1>
        <p>Footer with additional custom content.</p>
      </div>
      <PageFooterLine {...args}>
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          Confidential
        </span>
      </PageFooterLine>
    </div>
  ),
};

export const MultiPageDemo: Story = {
  args: {
    showDate: true,
    dateFormat: 'October 2025',
  },
  render: (args) => (
    <div>
      <div style={{ padding: '2rem' }}>
        <h1>Multi-Page Resume</h1>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
        ))}
      </div>
      <PageFooterLine {...args} />
    </div>
  ),
};
