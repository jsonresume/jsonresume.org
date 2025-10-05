import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  TimelineHeading,
  TimelineLine,
} from './timeline';

const meta: Meta<typeof Timeline> = {
  title: 'UI/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    positions: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'The position of the timeline items',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {
    positions: 'left',
  },
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem status="done">
        <TimelineHeading>First Event</TimelineHeading>
        <TimelineDot status="done" />
        <TimelineLine done />
        <TimelineContent>
          This is the first event in the timeline
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="done">
        <TimelineHeading>Second Event</TimelineHeading>
        <TimelineDot status="done" />
        <TimelineLine done />
        <TimelineContent>
          This is the second event in the timeline
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineHeading>Current Event</TimelineHeading>
        <TimelineDot status="current" />
        <TimelineLine />
        <TimelineContent>This is the current event in progress</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineHeading>Future Event</TimelineHeading>
        <TimelineDot status="default" />
        <TimelineLine />
        <TimelineContent>This is a future event</TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

export const CenterAligned: Story = {
  args: {
    positions: 'center',
  },
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem status="done">
        <TimelineHeading side="left">Project Started</TimelineHeading>
        <TimelineDot status="done" />
        <TimelineLine done />
        <TimelineContent side="right">
          The project was initiated with a team of 5 developers.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="done">
        <TimelineHeading side="left">Design Phase</TimelineHeading>
        <TimelineDot status="done" />
        <TimelineLine done />
        <TimelineContent side="right">
          Created wireframes and design mockups.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineHeading side="left">Development</TimelineHeading>
        <TimelineDot status="current" />
        <TimelineLine />
        <TimelineContent side="right">
          Currently building the application features.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineHeading side="left">Launch</TimelineHeading>
        <TimelineDot status="default" />
        <TimelineContent side="right">
          Planned launch date is next month.
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

export const RightAligned: Story = {
  args: {
    positions: 'right',
  },
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem status="done">
        <TimelineContent>Order placed successfully</TimelineContent>
        <TimelineDot status="done" />
        <TimelineLine done />
      </TimelineItem>
      <TimelineItem status="done">
        <TimelineContent>Order confirmed by seller</TimelineContent>
        <TimelineDot status="done" />
        <TimelineLine done />
      </TimelineItem>
      <TimelineItem>
        <TimelineContent>Package shipped</TimelineContent>
        <TimelineDot status="current" />
        <TimelineLine />
      </TimelineItem>
      <TimelineItem>
        <TimelineContent>Out for delivery</TimelineContent>
        <TimelineDot status="default" />
        <TimelineLine />
      </TimelineItem>
      <TimelineItem>
        <TimelineContent>Delivered</TimelineContent>
        <TimelineDot status="default" />
      </TimelineItem>
    </Timeline>
  ),
};

export const WithDates: Story = {
  args: {
    positions: 'left',
  },
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem status="done">
        <TimelineHeading className="text-xs">Jan 2024</TimelineHeading>
        <TimelineDot status="done" />
        <TimelineLine done />
        <TimelineContent>
          <div className="space-y-1">
            <h4 className="font-semibold">Product Launch</h4>
            <p className="text-sm text-muted-foreground">
              Successfully launched v1.0 to the public
            </p>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="done">
        <TimelineHeading className="text-xs">Mar 2024</TimelineHeading>
        <TimelineDot status="done" />
        <TimelineLine done />
        <TimelineContent>
          <div className="space-y-1">
            <h4 className="font-semibold">Feature Update</h4>
            <p className="text-sm text-muted-foreground">
              Released new dashboard with analytics
            </p>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineHeading className="text-xs">Oct 2024</TimelineHeading>
        <TimelineDot status="current" />
        <TimelineLine />
        <TimelineContent>
          <div className="space-y-1">
            <h4 className="font-semibold">Mobile App</h4>
            <p className="text-sm text-muted-foreground">
              Currently developing mobile applications
            </p>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineHeading className="text-xs">Q1 2025</TimelineHeading>
        <TimelineDot status="default" />
        <TimelineContent>
          <div className="space-y-1">
            <h4 className="font-semibold">Enterprise Features</h4>
            <p className="text-sm text-muted-foreground">
              Planned enterprise-level features
            </p>
          </div>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};
