import { Badge, Grid, LinkCard } from '@jsonresume/ui';

export default function LinkCardGrid() {
  return (
    <Grid minColumnWidth="14rem" gap={4}>
      <LinkCard
        href="#"
        eyebrow="No install"
        title="Host it from a Gist"
        description="Save resume.json as a GitHub Gist and it is live on the registry."
      />
      <LinkCard
        href="#"
        eyebrow="Terminal"
        title="Use the CLI"
        description="Validate, preview and export to PDF or HTML."
        meta={<Badge>Node 18+</Badge>}
      />
    </Grid>
  );
}
