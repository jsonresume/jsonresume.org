'use client';

import {
  Button,
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@jsonresume/ui';

export default function SheetSides() {
  return (
    <>
      {(['left', 'right', 'bottom'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button>{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>From the {side}</SheetTitle>
            </SheetHeader>
            <SheetBody>
              Use right for details, left for navigation, bottom for actions on
              small screens.
            </SheetBody>
          </SheetContent>
        </Sheet>
      ))}
    </>
  );
}
