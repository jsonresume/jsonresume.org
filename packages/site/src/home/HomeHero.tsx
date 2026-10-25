import { Button, CodeBlock, Hero } from '@jsonresume/ui';
import { paths } from '../links';
import { SiteLink } from '../SiteLink';
import * as s from './home.css';

// An excerpt of the sample resume the theme screenshots were rendered from,
// so the JSON and the picture beside it say the same thing.
const sample = `{
  "basics": {
    "name": "Jane Developer",
    "label": "Full Stack Software Engineer",
    "email": "jane.developer@example.com"
  },
  "work": [{
    "name": "TechCorp Inc",
    "position": "Senior Software Engineer",
    "startDate": "2021-03-01"
  }],
  "skills": [{
    "name": "Frontend",
    "keywords": ["React", "TypeScript"]
  }]
}`;

function ResumeDemo() {
  return (
    <div className={s.demo}>
      <CodeBlock className={s.demoCode} code={sample} label="resume.json" />
      <img
        className={s.demoPreview}
        src="/img/themes/bold-header-statement.webp"
        alt="The same resume rendered with the Bold Header Statement theme: a teal header with Jane Developer's name, then her experience at TechCorp Inc."
        width={800}
        height={640}
        fetchPriority="high"
      />
    </div>
  );
}

export function HomeHero() {
  return (
    <Hero
      eyebrow="The open resume standard"
      title="Your resume, as data."
      lede="Write your career once in JSON, then publish it as a website, a PDF or anything else you can build. Open source and free, since 2014."
      actions={
        <>
          <Button asChild variant="primary" size="lg">
            <SiteLink href={paths.gettingStarted}>Get started</SiteLink>
          </Button>
          <Button asChild size="lg">
            <SiteLink href={paths.themes}>Browse themes</SiteLink>
          </Button>
        </>
      }
      media={<ResumeDemo />}
    />
  );
}
