import { Code, Container, Section, Step, Steps } from '@jsonresume/ui';
import { facts } from '@repo/content/facts';
import { SectionIntro } from './SectionIntro';

export function HowItWorks() {
  return (
    <Section spacing="xl" aria-labelledby="how-it-works">
      <Container>
        <SectionIntro
          id="how-it-works"
          overline="How it works"
          title="One file, every format"
        >
          Your resume stops being a document you keep reformatting and becomes
          data you own.
        </SectionIntro>
        <Steps>
          <Step title="Write resume.json">
            Describe your work, education, skills and projects once, in JSON
            that follows the open schema. <Code>resume init</Code> gives you a
            starting file.
          </Step>
          <Step title="Pick a theme">
            Preview the same data in any of {facts.themeCount} community themes,
            from print-ready classics to bold portfolios.
          </Step>
          <Step title="Publish it">
            Save it as a GitHub gist named <Code>resume.json</Code> and it is
            live on the registry, or export HTML and PDF with the CLI.
          </Step>
        </Steps>
      </Container>
    </Section>
  );
}
