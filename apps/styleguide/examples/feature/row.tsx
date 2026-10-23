import { Button, Container, Feature, Grid, Section } from '@jsonresume/ui';

export default function FeatureRow() {
  return (
    <Section tone="subtle">
      <Container>
        <Grid minColumnWidth="14rem" gap={8}>
          <Feature title="What is this?" action={<Button>Get started</Button>}>
            JSON Resume is a standard created to empower developers.
          </Feature>
          <Feature title="Themes" action={<Button>View themes</Button>}>
            Browse our gallery of resume themes made by the community.
          </Feature>
          <Feature title="Open Source" action={<Button>View on GitHub</Button>}>
            Every part of JSON Resume is open source on GitHub.
          </Feature>
        </Grid>
      </Container>
    </Section>
  );
}
