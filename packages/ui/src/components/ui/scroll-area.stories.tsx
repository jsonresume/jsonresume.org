import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea, ScrollBar } from './scroll-area';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const VerticalScroll: Story = {
  render: () => (
    <ScrollArea className="h-72 w-80 rounded-md border p-4">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="text-sm">
            Tag {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 rounded-md border p-4"
            style={{ width: '200px' }}
          >
            <div className="font-semibold">Item {i + 1}</div>
            <div className="text-sm text-muted-foreground">
              Horizontal scroll item
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const LongText: Story = {
  render: () => (
    <ScrollArea className="h-96 w-96 rounded-md border p-4">
      <h4 className="mb-4 text-sm font-medium">The Jungle Book</h4>
      <p className="text-sm leading-7">
        It was seven o&apos;clock of a very warm evening in the Seeonee hills
        when Father Wolf woke up from his day&apos;s rest, scratched himself,
        yawned, and spread out his paws one after the other to get rid of the
        sleepy feeling in their tips. Mother Wolf lay with her big gray nose
        dropped across her four tumbling, squealing cubs, and the moon shone
        into the mouth of the cave where they all lived. &quot;Augrh!&quot; said
        Father Wolf. &quot;It is time to hunt again.&quot; He was going to
        spring down hill when a little shadow with a bushy tail crossed the
        threshold and whined: &quot;Good luck go with you, O Chief of the
        Wolves. And good luck and strong white teeth go with noble children that
        they may never forget the hungry in this world.&quot; It was the jackal
        Tabaqui, the Dish licker and the wolves of India despise Tabaqui because
        he runs about making mischief, and telling tales, and eating rags and
        pieces of leather from the village rubbish-heaps.
      </p>
    </ScrollArea>
  ),
};

export const WithCustomHeight: Story = {
  render: () => (
    <ScrollArea className="h-48 w-80 rounded-md border p-4">
      <div className="space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border p-2 text-sm hover:bg-accent"
          >
            List item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
