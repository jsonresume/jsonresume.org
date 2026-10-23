import { Badge, Table, Td, Th } from '@jsonresume/ui';
import { darkColor, lightColor, type ColorTokens } from '@jsonresume/ui/tokens';
import { contrast } from '@/lib/contrast';
import * as styles from './docs.css';

const texts = ['default', 'strong', 'muted', 'link'] as const;
const surfaces = ['page', 'subtle', 'muted', 'raised'] as const;

function Rating({ ratio }: { ratio: number }) {
  const tone =
    ratio >= 7
      ? 'success'
      : ratio >= 4.5
      ? 'success'
      : ratio >= 3
      ? 'warning'
      : 'danger';
  const label =
    ratio >= 7
      ? 'AAA'
      : ratio >= 4.5
      ? 'AA'
      : ratio >= 3
      ? 'large only'
      : 'fail';
  return (
    <Badge tone={tone}>
      {ratio.toFixed(1)} {label}
    </Badge>
  );
}

/** Contrast of every text token on every neutral surface, computed from the tokens. */
export function ContrastMatrix({ theme }: { theme: 'light' | 'dark' }) {
  const c: ColorTokens = theme === 'light' ? lightColor : darkColor;
  return (
    <Table
      caption={`${
        theme === 'light' ? 'Light' : 'Dark'
      } theme. AA needs 4.5:1 for body text.`}
    >
      <thead>
        <tr>
          <Th>Text \ Surface</Th>
          {surfaces.map((s) => (
            <Th key={s}>{s}</Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {texts.map((t) => (
          <tr key={t}>
            <Td>
              <span className={styles.propName}>text.{t}</span>
            </Td>
            {surfaces.map((s) => (
              <Td key={s}>
                <Rating ratio={contrast(c.text[t], c.surface[s])} />
              </Td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
