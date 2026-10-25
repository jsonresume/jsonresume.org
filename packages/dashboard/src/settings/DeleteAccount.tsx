import { useAtomSet } from '@effect/atom-react';
import {
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Stack,
  Text,
} from '@jsonresume/ui';
import { deleteAccountAtom, errorTag } from '@repo/api-client';
import { account as copy } from '@repo/content/pages';
import { useState } from 'react';

/** Delete everything, after typing the username back. */
export function DeleteAccount({ username }: { username: string }) {
  const remove = useAtomSet(deleteAccountAtom, { mode: 'promiseExit' });
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();
  const matches = confirm.trim().toLowerCase() === username;

  const submit = async () => {
    setBusy(true);
    const tag = errorTag(await remove({ payload: { confirm } }));
    if (tag === undefined) return window.location.assign('/');
    setBusy(false);
    setMessage(copy.errors[tag] ?? copy.errors['default']);
  };

  return (
    <Card tone="danger">
      <CardHeader>
        <CardTitle level={2}>{copy.settings.deleteTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4} align="start">
          <Text size="sm">{copy.settings.deleteText}</Text>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="danger">{copy.settings.deleteButton}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>{copy.settings.deleteTitle}</DialogTitle>
              <DialogDescription>{copy.settings.deleteText}</DialogDescription>
              <Stack gap={4}>
                {message ? <Callout tone="danger">{message}</Callout> : null}
                <Field label={copy.settings.deleteConfirm(username)}>
                  <Input
                    autoCapitalize="none"
                    spellCheck={false}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </Field>
              </Stack>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button
                  variant="danger"
                  disabled={!matches || busy}
                  onClick={() => void submit()}
                >
                  {copy.settings.deleteButton}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Stack>
      </CardContent>
    </Card>
  );
}
