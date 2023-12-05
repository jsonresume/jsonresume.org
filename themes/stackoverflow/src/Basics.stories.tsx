import type { Meta, StoryObj } from '@storybook/react';

import { Basics } from './Basics';
import storyResume from './storyResume.json';
const meta: Meta<typeof Basics> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Basics',
  component: Basics,
};

export default meta;
type Story = StoryObj<typeof Basics>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Complete: Story = {
  render: () => <Basics {...storyResume.basics} />,
};
