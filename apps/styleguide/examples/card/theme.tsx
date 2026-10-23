import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardMedia,
  CardTitle,
  Link,
  Text,
} from '@jsonresume/ui';
import * as styles from './theme.css';

export default function ThemeCard() {
  return (
    <Card interactive className={styles.root}>
      <CardMedia>
        <img
          src="/examples/theme-pro.png"
          alt="Pro theme preview"
          width={480}
          height={360}
        />
      </CardMedia>
      <CardContent>
        <CardTitle>Pro</CardTitle>
        <Text size="xs" tone="muted">
          by <Link href="https://jsonresume.org">JSON Resume Team</Link>
        </Text>
      </CardContent>
      <CardFooter>
        <Button size="sm" fullWidth>
          Preview theme
        </Button>
      </CardFooter>
    </Card>
  );
}
