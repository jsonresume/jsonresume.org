import { Button, CodeBlock, Hero } from '@jsonresume/ui';

const sample = `{
  "basics": {
    "name": "Ada Lovelace",
    "label": "Analyst"
  }
}`;

export default function HeroSplit() {
  return (
    <Hero
      eyebrow="Open standard"
      title="Your resume, as data"
      lede="Write it once in JSON. Render it with any theme."
      actions={
        <>
          <Button variant="primary" size="lg">
            Get started
          </Button>
          <Button size="lg">Browse themes</Button>
        </>
      }
      media={<CodeBlock code={sample} label="resume.json" />}
    />
  );
}
