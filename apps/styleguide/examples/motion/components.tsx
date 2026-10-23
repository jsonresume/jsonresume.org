'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Stack,
  Tooltip,
} from '@jsonresume/ui';

// Motion built into components: the dialog overlay fades and the panel
// rises (base, easing.out); tooltips fade (fast); the accordion chevron
// rotates. All of it stops under reduced motion.
export default function MotionInComponents() {
  return (
    <Stack gap={6}>
      <Stack direction="row" gap={3} wrap>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Fade and rise</DialogTitle>
            <DialogDescription>
              The overlay fades in while the panel rises 8px.
            </DialogDescription>
          </DialogContent>
        </Dialog>
        <Tooltip content="Tooltips fade in over 100ms">
          <Button variant="ghost">Hover for a tooltip</Button>
        </Tooltip>
      </Stack>
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>The chevron rotates</AccordionTrigger>
          <AccordionContent>
            Disclosure content appears without sliding, so text never jumps.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
}
