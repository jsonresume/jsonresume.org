import { Button } from '@jsonresume/ui';

export default function ButtonStates() {
  return (
    <>
      <Button variant="primary" loading>
        Publishing
      </Button>
      <Button disabled>Disabled</Button>
      <Button size="icon" aria-label="Search">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" strokeLinecap="round" />
        </svg>
      </Button>
    </>
  );
}
