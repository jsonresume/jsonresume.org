import React from 'react';
import { cn } from '../../../lib/utils';

interface TimelineLineProps extends React.HTMLAttributes<HTMLHRElement> {
  done?: boolean;
}

const TimelineLine = React.forwardRef<HTMLHRElement, TimelineLineProps>(
  ({ className, done = false, ...props }, ref) => {
    return (
      <hr
        role="separator"
        aria-orientation="vertical"
        className={cn(
          'col-start-2 col-end-3 row-start-2 row-end-2 mx-auto flex h-full min-h-16 w-0.5 justify-center rounded-full',
          done ? 'bg-primary' : 'bg-muted',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
TimelineLine.displayName = 'TimelineLine';

export { TimelineLine };
export type { TimelineLineProps };
