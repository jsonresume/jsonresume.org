import { Button, Hero } from '@jsonresume/ui';

export default function HeroCompact() {
  return (
    <Hero
      size="compact"
      align="start"
      eyebrow="Reference"
      title="The resume schema"
      lede="Every section and field of resume.json, with examples."
      actions={<Button variant="primary">Download schema.json</Button>}
    />
  );
}
