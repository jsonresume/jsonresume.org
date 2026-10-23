import { Button } from '@jsonresume/ui';

// asChild renders the child element (here a link, or a Next.js <Link>)
// with button styles, so navigation stays a real link.
export default function ButtonAsLink() {
  return (
    <Button asChild variant="primary">
      <a href="https://jsonresume.org/getting-started">Getting started</a>
    </Button>
  );
}
