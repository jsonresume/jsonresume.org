import {
  Badge,
  Button,
  Callout,
  Card,
  CardContent,
  CardTitle,
  Grid,
  Link,
  Stack,
  Text,
} from '@jsonresume/ui';
import * as styles from './light-dark.css';

function Sample() {
  return (
    <div className={styles.panel}>
      <Card>
        <CardContent>
          <CardTitle>Pro</CardTitle>
          <Text tone="muted" size="xs">
            by <Link href="#color">JSON Resume Team</Link>
          </Text>
        </CardContent>
      </Card>
      <Stack direction="row" gap={2} wrap>
        <Button variant="primary">Publish</Button>
        <Button>Preview</Button>
        <Badge tone="success">Valid</Badge>
      </Stack>
      <Callout tone="warning">Deprecated field in use.</Callout>
    </div>
  );
}

// data-theme scopes the dark tokens to a subtree: the same components,
// re-themed with no extra code.
export default function ColorLightDark() {
  return (
    <Grid minColumnWidth="16rem" gap={0} stretch>
      <div data-theme="light">
        <Sample />
      </div>
      <div data-theme="dark">
        <Sample />
      </div>
    </Grid>
  );
}
