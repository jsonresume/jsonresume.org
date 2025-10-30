import React from 'react';
/**
 * GridLayout Stories
 * Responsive grid layout for organizing content
 */
import { GridLayout } from './GridLayout';

const meta = {
  title: 'Resume Core/Layouts/GridLayout',
  component: GridLayout,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'range', min: 1, max: 4, step: 1 },
      description: 'Number of columns',
    },
    gap: {
      control: 'text',
      description: 'Gap between grid items',
    },
    spacing: {
      control: 'text',
      description: 'Bottom spacing',
    },
  },
};

export default meta;

const SampleCard = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '1.5rem',
      background: '#f5f5f5',
      borderRadius: '8px',
      border: '1px solid #ddd',
    }}
  >
    {children}
  </div>
);

export const TwoColumns = {
  args: {
    columns: 2,
    children: (
      <>
        <SampleCard>
          <h3>Column 1</h3>
          <p>Content for first column</p>
        </SampleCard>
        <SampleCard>
          <h3>Column 2</h3>
          <p>Content for second column</p>
        </SampleCard>
      </>
    ),
  },
};

export const ThreeColumns = {
  args: {
    columns: 3,
    children: (
      <>
        <SampleCard>
          <h4>Item 1</h4>
          <p>First item content</p>
        </SampleCard>
        <SampleCard>
          <h4>Item 2</h4>
          <p>Second item content</p>
        </SampleCard>
        <SampleCard>
          <h4>Item 3</h4>
          <p>Third item content</p>
        </SampleCard>
      </>
    ),
  },
};

export const FourColumns = {
  args: {
    columns: 4,
    children: (
      <>
        <SampleCard>Column 1</SampleCard>
        <SampleCard>Column 2</SampleCard>
        <SampleCard>Column 3</SampleCard>
        <SampleCard>Column 4</SampleCard>
      </>
    ),
  },
};

export const SingleColumn = {
  args: {
    columns: 1,
    children: (
      <>
        <SampleCard>
          <h3>Full Width Section</h3>
          <p>This content spans the entire width</p>
        </SampleCard>
        <SampleCard>
          <h3>Another Full Width</h3>
          <p>Another full-width section</p>
        </SampleCard>
      </>
    ),
  },
};

export const CustomGap = {
  args: {
    columns: 2,
    gap: '2rem',
    children: (
      <>
        <SampleCard>Large gap between items</SampleCard>
        <SampleCard>Creates breathing room</SampleCard>
      </>
    ),
  },
};

export const SkillsGrid = {
  render: () => (
    <GridLayout columns={2}>
      <SampleCard>
        <h4>Frontend</h4>
        <p>React, Vue, Angular, TypeScript</p>
      </SampleCard>
      <SampleCard>
        <h4>Backend</h4>
        <p>Node.js, Python, PostgreSQL</p>
      </SampleCard>
      <SampleCard>
        <h4>DevOps</h4>
        <p>Docker, Kubernetes, AWS</p>
      </SampleCard>
      <SampleCard>
        <h4>Tools</h4>
        <p>Git, Jenkins, Terraform</p>
      </SampleCard>
    </GridLayout>
  ),
};

export const ThreeColumnShowcase = {
  render: () => (
    <GridLayout columns={3} gap="1.5rem">
      <SampleCard>
        <h4>Project 1</h4>
        <p>E-commerce platform built with React</p>
      </SampleCard>
      <SampleCard>
        <h4>Project 2</h4>
        <p>Real-time chat application</p>
      </SampleCard>
      <SampleCard>
        <h4>Project 3</h4>
        <p>Analytics dashboard</p>
      </SampleCard>
      <SampleCard>
        <h4>Project 4</h4>
        <p>Mobile app with React Native</p>
      </SampleCard>
      <SampleCard>
        <h4>Project 5</h4>
        <p>API gateway service</p>
      </SampleCard>
      <SampleCard>
        <h4>Project 6</h4>
        <p>ML prediction model</p>
      </SampleCard>
    </GridLayout>
  ),
};
