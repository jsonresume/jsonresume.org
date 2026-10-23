import { Button, Link, Stack, Tooltip } from '@jsonresume/ui';
import { Download, ExternalLink, Search } from 'lucide-react';

// Inside buttons, icons size to the label (1em). Icon-only buttons need an
// aria-label; a tooltip shows the same words to sighted users.
export default function IconsInComponents() {
  return (
    <Stack direction="row" gap={4} align="center" wrap>
      <Button variant="primary">
        <Download aria-hidden="true" /> Export PDF
      </Button>
      <Tooltip content="Search themes">
        <Button size="icon" aria-label="Search themes">
          <Search aria-hidden="true" />
        </Button>
      </Tooltip>
      <Link
        href="https://jsonresume.org"
        style={{ display: 'inline-flex', gap: '0.3em', alignItems: 'center' }}
      >
        jsonresume.org <ExternalLink size={14} aria-hidden="true" />
      </Link>
    </Stack>
  );
}
