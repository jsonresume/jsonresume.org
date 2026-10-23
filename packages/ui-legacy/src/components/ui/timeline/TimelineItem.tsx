import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const timelineItemVariants = cva('grid items-center gap-x-2', {
  variants: {
    status: {
      done: 'text-primary',
      default: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    status: 'default',
  },
});

interface TimelineItemProps
  extends React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof timelineItemVariants> {}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, status, ...props }, ref) => (
    <li
      className={cn(timelineItemVariants({ status }), className)}
      ref={ref}
      {...props}
    />
  )
);
TimelineItem.displayName = 'TimelineItem';

export { TimelineItem };
export type { TimelineItemProps };
