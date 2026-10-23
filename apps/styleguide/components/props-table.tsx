import { Badge, Code, Table, Td, Text, Th } from '@jsonresume/ui';
import type { ReactNode } from 'react';
import props from '@/generated/props.json';
import * as styles from './docs.css';

interface PropDoc {
  name: string;
  type: string;
  values: string[] | null;
  required: boolean;
  defaultValue: string | null;
  description: string;
  variant: boolean;
}

/** Renders `backtick` spans from JSDoc descriptions as inline code. */
function withCode(text: string): ReactNode[] {
  return text
    .split(/`([^`]+)`/)
    .map((part, i) => (i % 2 ? <Code key={i}>{part}</Code> : part));
}

const docs = props as Record<
  string,
  { description: string; file: string; props: PropDoc[] }
>;

export function PropsTable({
  component,
  defaults = {},
}: {
  component: string;
  defaults?: Record<string, string>;
}) {
  const doc = docs[component];
  if (!doc) return null;
  return (
    <div>
      <p className={styles.componentLabel}>&lt;{component}&gt;</p>
      {doc.props.length === 0 ? (
        <Text tone="muted">
          No props of its own; accepts the attributes of the element it renders.
        </Text>
      ) : (
        <Table
          caption={`Also accepts the attributes of the element ${component} renders.`}
        >
          <thead>
            <tr>
              <Th>Prop</Th>
              <Th>Type</Th>
              <Th>Default</Th>
              <Th>Description</Th>
            </tr>
          </thead>
          <tbody>
            {doc.props.map((p) => {
              const fallback = p.defaultValue ?? defaults[p.name] ?? null;
              return (
                <tr key={p.name}>
                  <Td>
                    <span className={styles.propName}>{p.name}</span>
                    {p.required ? (
                      <>
                        {' '}
                        <Badge tone="danger">required</Badge>
                      </>
                    ) : null}
                  </Td>
                  <Td>
                    {p.values ? (
                      <span className={styles.values}>
                        {p.values.map((v) => (
                          <Badge key={v} tone="outline">
                            {v}
                          </Badge>
                        ))}
                      </span>
                    ) : (
                      <span className={styles.propType}>{p.type}</span>
                    )}
                  </Td>
                  <Td>
                    <span className={styles.propType}>{fallback ?? '–'}</span>
                  </Td>
                  <Td>
                    {p.description
                      ? withCode(p.description)
                      : p.variant
                      ? 'Style variant.'
                      : ''}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
