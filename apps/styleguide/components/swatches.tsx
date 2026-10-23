import { Badge, Table, Td, Th } from '@jsonresume/ui';
import { darkColor, lightColor, type ColorTokens } from '@jsonresume/ui/tokens';
import { contrast, isHex } from '@/lib/contrast';
import styles from './docs.module.css';

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Flattens a token group into rows: path, css var, light and dark values. */
function rows(group: keyof ColorTokens) {
  const light = lightColor[group] as Record<string, string> | string;
  const dark = darkColor[group] as Record<string, string> | string;
  if (typeof light === 'string') {
    return [
      {
        path: `color.${group}`,
        cssVar: `--jr-color-${kebab(group)}`,
        light,
        dark: dark as string,
      },
    ];
  }
  return Object.entries(light).map(([key, value]) => ({
    path: `color.${group}.${key}`,
    cssVar: `--jr-color-${kebab(group)}-${kebab(key)}`,
    light: value,
    dark: (dark as Record<string, string>)[key] ?? '',
  }));
}

function Chip({ value }: { value: string }) {
  return (
    <span className={styles.chip}>
      <span
        aria-hidden="true"
        className={styles.chipColor}
        style={{ background: value }}
      />
      <span className={styles.mono}>{value}</span>
    </span>
  );
}

/** Semantic color tokens with both themes and, for text, contrast on the page. */
export function ColorTokenTable({
  group,
  against,
}: {
  group: keyof ColorTokens;
  against?: 'page';
}) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Token</Th>
          <Th>Light</Th>
          <Th>Dark</Th>
          {against ? <Th>Contrast on page</Th> : null}
        </tr>
      </thead>
      <tbody>
        {rows(group).map((r) => {
          const ratio =
            against && isHex(r.light)
              ? contrast(r.light, lightColor.surface.page)
              : null;
          return (
            <tr key={r.path}>
              <Td>
                <div className={styles.propName}>{r.path}</div>
                <div className={styles.mono}>{r.cssVar}</div>
              </Td>
              <Td>
                <Chip value={r.light} />
              </Td>
              <Td>
                <Chip value={r.dark} />
              </Td>
              {against ? (
                <Td>
                  {ratio ? (
                    <Badge
                      tone={
                        ratio >= 4.5
                          ? 'success'
                          : ratio >= 3
                          ? 'warning'
                          : 'neutral'
                      }
                    >
                      {ratio.toFixed(2)}:1
                    </Badge>
                  ) : (
                    '–'
                  )}
                </Td>
              ) : null}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
