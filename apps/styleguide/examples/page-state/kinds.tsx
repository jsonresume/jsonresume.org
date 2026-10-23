import { Button, Grid, PageState } from '@jsonresume/ui';

export default function PageStateKinds() {
  return (
    <Grid minColumnWidth="16rem" gap={4}>
      <PageState kind="loading" size="panel" title="Loading jobs" />
      <PageState
        kind="empty"
        size="panel"
        level={2}
        title="No saved jobs"
        description="Jobs you mark as interested appear here."
      />
      <PageState
        kind="not-found"
        size="panel"
        level={2}
        code="404"
        actions={<Button>Go home</Button>}
      />
      <PageState
        kind="error"
        size="panel"
        level={2}
        details="Error: GitHub returned 503 for gist resume.json"
        actions={<Button>Report a problem</Button>}
      />
    </Grid>
  );
}
