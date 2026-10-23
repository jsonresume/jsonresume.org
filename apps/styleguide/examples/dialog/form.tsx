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
  Field,
  Input,
} from '@jsonresume/ui';

export default function DialogForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Connect GitHub</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Connect your GitHub account</DialogTitle>
        <DialogDescription>
          We read a public gist named resume.json. We never write to your
          account.
        </DialogDescription>
        <Field label="GitHub username" hint="Case doesn't matter.">
          <Input autoComplete="username" placeholder="thomasdavis" />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="primary">Connect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
