import { Button, Callout, CopyButton, Stack, Text } from '@jsonresume/ui';

/**
 * After the first save that puts the page live: the address, to copy and
 * share, and a way to see it. Where the page is, at the moment it matters.
 */
export function Live({ username }: { username: string }) {
  const url = `${window.location.origin}/@${username}`;
  const shown = url.replace(/^https?:\/\//, '');
  return (
    <Callout tone="success" title="Your resume is live">
      <Stack gap={3}>
        <Text as="span">
          It’s at <a href={`/@${username}`}>{shown}</a>. Put the link in your
          LinkedIn profile, your email signature or your GitHub README; the page
          follows every save.
        </Text>
        <Stack direction="row" wrap gap={2}>
          <CopyButton value={url} label="Copy your link" />
          <Button asChild size="sm" variant="secondary">
            <a href={`/@${username}`}>View your page</a>
          </Button>
        </Stack>
      </Stack>
    </Callout>
  );
}
