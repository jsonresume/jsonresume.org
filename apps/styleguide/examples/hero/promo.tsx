import { Button, Hero } from '@jsonresume/ui';

export default function HeroPromo() {
  return (
    <Hero
      title="JSON Resume"
      lede="The open-source initiative to create a JSON-based standard for resumes. For developers, by developers."
      actions={
        <Button variant="primary" size="lg">
          Read more
        </Button>
      }
    />
  );
}
