import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const timelineHeadingVariants = cva(
  'row-start-1 row-end-1 line-clamp-1 max-w-full truncate',
  {
    variants: {
      side: {
        right: 'col-start-3 col-end-4 mr-auto text-left',
        left: 'col-start-1 col-end-2 ml-auto text-right',
      },
      variant: {
        primary: 'text-base font-medium text-primary',
        secondary: 'text-sm font-light text-muted-foreground',
      },
    },
    defaultVariants: {
      side: 'right',
      variant: 'primary',
    },
  }
);

interface TimelineHeadingProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof timelineHeadingVariants> {}

const TimelineHeading = React.forwardRef<
  HTMLParagraphElement,
  TimelineHeadingProps
>(({ className, side, variant, ...props }, ref) => (
  <p
    role="heading"
    aria-level={variant === 'primary' ? 2 : 3}
    className={cn(timelineHeadingVariants({ side, variant }), className)}
    ref={ref}
    {...props}
  />
));
TimelineHeading.displayName = 'TimelineHeading';

export { TimelineHeading };
export type { TimelineHeadingProps };
