import React from 'react';
/**
 * ThemeProvider Stories
 * Demonstrates all available themes for resume components
 */
import { ThemeProvider } from './ThemeProvider';
import { Section } from '../primitives/Section';
import { Heading } from '../typography/Heading';
import { Text } from '../typography/Text';
import { SkillBar } from '../skills/SkillBar';
import { Badge } from '../primitives/Badge';

const meta = {
  title: 'Resume Core/Providers/ThemeProvider',
  component: ThemeProvider,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: [
        'professional',
        'modern',
        'classic',
        'minimal',
        'high-contrast',
      ],
      description: 'Theme variant to apply',
    },
  },
};

export default meta;

const SampleContent = () => (
  <div style={{ padding: '2rem' }}>
    <Section>
      <Heading level={1}>John Doe</Heading>
      <Text>Senior Software Engineer</Text>
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <Badge>React</Badge>
        <Badge>TypeScript</Badge>
        <Badge>Node.js</Badge>
      </div>
    </Section>

    <Section>
      <Heading level={2}>Skills</Heading>
      <SkillBar skill="JavaScript" level={90} showPercentage />
      <SkillBar skill="React" level={85} showPercentage />
      <SkillBar skill="TypeScript" level={80} showPercentage />
      <SkillBar skill="Node.js" level={75} showPercentage />
    </Section>

    <Section>
      <Heading level={2}>About</Heading>
      <Text>
        Passionate software engineer with 8+ years of experience building
        scalable web applications. Specialized in React, TypeScript, and modern
        web technologies. Love mentoring junior developers and contributing to
        open source projects.
      </Text>
    </Section>
  </div>
);

export const Professional = {
  args: {
    theme: 'professional',
    children: <SampleContent />,
  },
};

export const Modern = {
  args: {
    theme: 'modern',
    children: <SampleContent />,
  },
};

export const Classic = {
  args: {
    theme: 'classic',
    children: <SampleContent />,
  },
};

export const Minimal = {
  args: {
    theme: 'minimal',
    children: <SampleContent />,
  },
};

export const HighContrast = {
  args: {
    theme: 'high-contrast',
    children: <SampleContent />,
  },
};

export const ThemeComparison = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      {['professional', 'modern', 'classic', 'minimal', 'high-contrast'].map(
        (theme) => (
          <div
            key={theme}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: '#f5f5f5',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              {theme}
            </div>
            <ThemeProvider theme={theme}>
              <SampleContent />
            </ThemeProvider>
          </div>
        )
      )}
    </div>
  ),
};
