import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const timelineContentVariants = cva(
  'row-start-2 row-end-2 pb-8 text-muted-foreground',
  {
    variants: {
      side: {
        right: 'col-start-3 col-end-4 mr-auto text-left',
        left: 'col-start-1 col-end-2 ml-auto text-right',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

interface TimelineContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineContentVariants> {}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, side, ...props }, ref) => (
    <div
      className={cn(timelineContentVariants({ side }), className)}
      ref={ref}
      {...props}
    />
  )
);
TimelineContent.displayName = 'TimelineContent';

export { TimelineContent };
export type { TimelineContentProps };
