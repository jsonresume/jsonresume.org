import { Button, Container, Section } from '@jsonresume/ui';
import { links } from '../../site';
import * as s from './home.css';

export function OpenSourceBand() {
  return (
    <Section tone="brand" spacing="xl" aria-labelledby="open-source">
      <Container size="prose">
        <div className={s.band}>
          <p className={s.overline}>Open source</p>
          <h2 id="open-source" className={s.title}>
            Built in the open, by the people who use it
          </h2>
          <p className={s.lede}>
            The schema, the CLI, every theme and this site are MIT licensed and
            maintained by volunteers on GitHub. Fix a typo, add a theme or
            propose a schema change.
          </p>
          <div className={s.actions}>
            <Button asChild variant="primary" size="lg">
              <a href={links.github}>View on GitHub</a>
            </Button>
            <Button asChild size="lg">
              <a href={links.contributing}>How to contribute</a>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
