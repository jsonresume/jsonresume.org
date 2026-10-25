import { Button, Container, Section } from '@jsonresume/ui';
import { isSitePath, SiteLink } from '../../SiteLink';
import * as s from './nextSteps.css';

export interface NextStepsProps {
  title: string;
  items: ReadonlyArray<{ label: string; href: string }>;
}

/** The closing band of a page: where to go next, as buttons. */
export function NextSteps({ title, items }: NextStepsProps) {
  return (
    <Section tone="brand" spacing="lg" aria-labelledby="next-steps">
      <Container>
        <div className={s.band}>
          <h2 id="next-steps" className={s.title}>
            {title}
          </h2>
          <div className={s.actions}>
            {items.map((item, index) => (
              <Button
                key={item.href}
                asChild
                variant={index === 0 ? 'primary' : 'secondary'}
              >
                {isSitePath(item.href) ? (
                  <SiteLink href={item.href}>{item.label}</SiteLink>
                ) : (
                  <a href={item.href}>{item.label}</a>
                )}
              </Button>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
