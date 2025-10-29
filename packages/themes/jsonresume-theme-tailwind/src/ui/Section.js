import { cn } from './utils';

export default function Section({ className, ...props }) {
  return (
    <section
      className={cn('flex min-h-0 flex-col gap-y-3', className)}
      {...props}
    />
  );
}
