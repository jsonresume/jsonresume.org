import type { Meta, StoryObj } from '@storybook/react';
import { SoftShadowEmulation } from './SoftShadowEmulation';

const meta = {
  title: 'Print/SoftShadowEmulation',
  component: SoftShadowEmulation,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Printed "shadow" effect using second keyline with slight offset. No actual blur - uses subtle tint (≤8%) for print-safe shadow effect that is guaranteed to render on all printers.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    offset: {
      control: 'text',
      description: 'Shadow offset distance',
    },
    shadowColor: {
      control: 'color',
      description: 'Shadow tint color (≤8% opacity)',
    },
    printShadowColor: {
      control: 'color',
      description: 'Solid color for print output',
    },
    padding: {
      control: 'text',
      description: 'Inner padding',
    },
  },
} satisfies Meta<typeof SoftShadowEmulation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    offset: '4px',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    printShadowColor: '#f0f0f0',
  },
  render: (args) => (
    <div style={{ padding: '2rem' }}>
      <SoftShadowEmulation {...args}>
        <h2 style={{ margin: '0 0 1rem 0' }}>Section Title</h2>
        <p style={{ margin: 0 }}>
          This content has a subtle shadow effect that will print reliably on
          all devices. The shadow is created using a second border, not CSS
          box-shadow.
        </p>
      </SoftShadowEmulation>
    </div>
  ),
};

export const ProfileCard: Story = {
  args: {
    offset: '6px',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    printShadowColor: '#f5f5f5',
  },
  render: (args) => (
    <div style={{ padding: '2rem' }}>
      <SoftShadowEmulation {...args}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#e5e7eb',
              margin: '0 auto 1rem',
            }}
          />
          <h2 style={{ margin: '0 0 0.5rem 0' }}>John Doe</h2>
          <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>
            Software Engineer
          </p>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            john.doe@example.com | (555) 123-4567
          </p>
        </div>
      </SoftShadowEmulation>
    </div>
  ),
};

export const SkillsCard: Story = {
  args: {
    offset: '4px',
  },
  render: (args) => (
    <div style={{ padding: '2rem' }}>
      <SoftShadowEmulation {...args}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Technical Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'].map(
            (skill) => (
              <span
                key={skill}
                style={{
                  padding: '0.25rem 0.75rem',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                }}
              >
                {skill}
              </span>
            )
          )}
        </div>
      </SoftShadowEmulation>
    </div>
  ),
};

export const ExperienceBlock: Story = {
  args: {
    offset: '5px',
    shadowColor: 'rgba(0, 0, 0, 0.07)',
  },
  render: (args) => (
    <div style={{ padding: '2rem' }}>
      <SoftShadowEmulation {...args}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <h3 style={{ margin: 0 }}>Senior Developer</h3>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            2020 - Present
          </span>
        </div>
        <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>
          Tech Company Inc.
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Led development of microservices architecture</li>
          <li>Mentored team of 5 junior developers</li>
          <li>Improved application performance by 40%</li>
        </ul>
      </SoftShadowEmulation>
    </div>
  ),
};

export const MultipleCards: Story = {
  args: {
    offset: '4px',
  },
  render: (args) => (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <SoftShadowEmulation {...args}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Education</h3>
        <p style={{ margin: 0 }}>
          <strong>Bachelor of Science in Computer Science</strong>
          <br />
          University Name, 2016
        </p>
      </SoftShadowEmulation>

      <SoftShadowEmulation {...args}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Certifications</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>AWS Certified Solutions Architect</li>
          <li>Google Cloud Professional</li>
        </ul>
      </SoftShadowEmulation>

      <SoftShadowEmulation {...args}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Languages</h3>
        <p style={{ margin: 0 }}>
          English (Native), Spanish (Professional), French (Conversational)
        </p>
      </SoftShadowEmulation>
    </div>
  ),
};

export const CustomShadowColor: Story = {
  args: {
    offset: '6px',
    shadowColor: 'rgba(59, 130, 246, 0.08)',
    printShadowColor: '#dbeafe',
  },
  render: (args) => (
    <div style={{ padding: '2rem' }}>
      <SoftShadowEmulation {...args}>
        <h2 style={{ margin: '0 0 1rem 0', color: '#2563eb' }}>
          Highlighted Section
        </h2>
        <p style={{ margin: 0 }}>
          This shadow uses a blue tint instead of gray for a branded look while
          remaining print-safe.
        </p>
      </SoftShadowEmulation>
    </div>
  ),
};
