'use client';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@jsonresume/ui';

export default function DialogConfirm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">Delete resume</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete your resume?</DialogTitle>
        <DialogDescription>
          Your gist stays on GitHub. This only removes the registry copy and its
          cached renders.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
