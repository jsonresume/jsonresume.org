import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const timelineVariants = cva('grid', {
  variants: {
    positions: {
      left: '[&>li]:grid-cols-[0_min-content_1fr]',
      right: '[&>li]:grid-cols-[1fr_min-content]',
      center: '[&>li]:grid-cols-[1fr_min-content_1fr]',
    },
  },
  defaultVariants: {
    positions: 'left',
  },
});

interface TimelineProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof timelineVariants> {}

const Timeline = React.forwardRef<HTMLUListElement, TimelineProps>(
  ({ children, className, positions, ...props }, ref) => {
    return (
      <ul
        className={cn(timelineVariants({ positions }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </ul>
    );
  }
);
Timeline.displayName = 'Timeline';

export { Timeline };
export type { TimelineProps };
