import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { Check, Circle, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

const timelineDotVariants = cva(
  'col-start-2 col-end-3 row-start-1 row-end-1 flex size-4 items-center justify-center rounded-full border border-current',
  {
    variants: {
      status: {
        default: '[&>*]:hidden',
        current:
          '[&>*:not(.lucide-circle)]:hidden [&>.lucide-circle]:fill-current [&>.lucide-circle]:text-current',
        done: 'bg-primary [&>*:not(.lucide-check)]:hidden [&>.lucide-check]:text-background',
        error:
          'border-destructive bg-destructive [&>*:not(.lucide-x)]:hidden [&>.lucide-x]:text-background',
        custom: '[&>*:not(:nth-child(4))]:hidden [&>*:nth-child(4)]:block',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  }
);

interface TimelineDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineDotVariants> {
  customIcon?: React.ReactNode;
}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, status, customIcon, ...props }, ref) => (
    <div
      role="status"
      className={cn('timeline-dot', timelineDotVariants({ status }), className)}
      ref={ref}
      {...props}
    >
      <Circle className="size-2.5" />
      <Check className="size-3" />
      <X className="size-3" />
      {customIcon}
    </div>
  )
);
TimelineDot.displayName = 'TimelineDot';

export { TimelineDot };
export type { TimelineDotProps };
