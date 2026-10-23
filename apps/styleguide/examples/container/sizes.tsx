import { Container, Stack, Text } from '@jsonresume/ui';
import * as styles from './sizes.css';

export default function ContainerSizes() {
  return (
    <Stack gap={2}>
      <Container size="prose" className={styles.band}>
        <Text>prose: 72ch</Text>
      </Container>
      <Container className={styles.band}>
        <Text>default: 970px, the site column</Text>
      </Container>
      <Container size="wide" className={styles.band}>
        <Text>wide: 1200px</Text>
      </Container>
    </Stack>
  );
}
