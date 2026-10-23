import {
  Container,
  Grid,
  Logo,
  PageHeader,
  Section,
  SiteFooter,
  SiteHeader,
  SiteHeaderLink,
  Text,
} from '@jsonresume/ui';

// Every page: yellow header, gray title band, content in the 970px column,
// quiet footer.
export default function LayoutPageStructure() {
  return (
    <div>
      <SiteHeader brand={<Logo />} navLabel="Example site">
        <SiteHeaderLink href="#layout">Schema</SiteHeaderLink>
        <SiteHeaderLink href="#layout" active>
          Themes
        </SiteHeaderLink>
      </SiteHeader>
      <PageHeader title="Themes" description="Browse the community gallery." />
      <Section>
        <Container>
          <Grid minColumnWidth="12rem" gap={6}>
            <Text>Content sits in the Container.</Text>
            <Text>Grids reflow inside it.</Text>
            <Text>Bands span the full width.</Text>
          </Grid>
        </Container>
      </Section>
      <SiteFooter note="JSON Resume is open source" />
    </div>
  );
}
