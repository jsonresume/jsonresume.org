import resume from '@jsonresume/sample-data/complete-resume.json';
import { Button, EmptyState, Stack, Text } from '@jsonresume/ui';

/** No resume yet: start blank, or from a complete example to edit. */
export function Start({ onStart }: { onStart: (resume: unknown) => void }) {
  return (
    <EmptyState
      title="Start your resume"
      action={
        <Stack direction="row" wrap gap={3} justify="center">
          <Button
            variant="primary"
            onClick={() => onStart({ basics: { name: '' } })}
          >
            Start blank
          </Button>
          <Button variant="secondary" onClick={() => onStart(resume)}>
            Start from an example
          </Button>
        </Stack>
      }
    >
      Every section is optional. The example fills each one in, so you can see
      what goes where and replace it.
    </EmptyState>
  );
}

/** Bring back a draft kept in this browser, or let it go. */
Start.Restore = function Restore({
  at,
  onRestore,
  onDiscard,
}: {
  at: number;
  onRestore: () => void;
  onDiscard: () => void;
}) {
  return (
    <Stack direction="row" wrap align="center" gap={3}>
      <Text as="span" size="sm">
        From {new Date(at).toLocaleString()}, in this browser.
      </Text>
      <Button size="sm" variant="secondary" onClick={onRestore}>
        Restore them
      </Button>
      <Button size="sm" variant="ghost" onClick={onDiscard}>
        Discard
      </Button>
    </Stack>
  );
};
