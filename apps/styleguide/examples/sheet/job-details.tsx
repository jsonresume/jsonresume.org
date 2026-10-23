'use client';

import {
  Button,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Text,
} from '@jsonresume/ui';

export default function SheetJobDetails() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>View job</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Senior Engineer</SheetTitle>
          <SheetDescription>Stripe · Remote · $180k–$220k</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Text>
            Build the payments platform used by millions of businesses.
            You&apos;ll own services end to end and work closely with product
            and design.
          </Text>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Close</Button>
          </SheetClose>
          <Button variant="primary">Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
