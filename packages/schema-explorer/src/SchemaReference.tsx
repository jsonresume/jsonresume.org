import { Badge, CodeBlock, OnThisPage, Table, Td, Th } from '@jsonresume/ui';
import { exampleFor, type SchemaField, type SchemaSection } from './flatten';
import * as s from './reference.css';

function FieldName({ path }: { path: string }) {
  const dot = path.lastIndexOf('.');
  if (dot < 0) return <code className={s.fieldName}>{path}</code>;
  return (
    <code className={s.fieldName}>
      <span className={s.fieldParent}>{path.slice(0, dot + 1)}</span>
      {path.slice(dot + 1)}
    </code>
  );
}

interface Row {
  path: string;
  type: string;
  description?: string;
  /** Anchor for the row, for top-level fields the page links to. */
  id?: string;
}

function FieldTable({
  caption,
  rows,
}: {
  caption: string;
  rows: ReadonlyArray<Row>;
}) {
  return (
    <Table caption={caption}>
      <thead>
        <tr>
          <Th>Field</Th>
          <Th>Type</Th>
          <Th>Description</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.path} id={row.id}>
            <Td>
              <FieldName path={row.path} />
            </Td>
            <Td className={s.fieldType}>{row.type}</Td>
            <Td className={s.fieldText}>{row.description ?? ''}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function Example({
  code,
  label,
  summary,
  open,
}: {
  code: string;
  label: string;
  summary: string;
  open: boolean;
}) {
  return (
    <details className={s.example} open={open}>
      <summary className={s.exampleSummary}>{summary}</summary>
      <CodeBlock code={code} label={label} />
    </details>
  );
}

export interface SchemaReferenceProps {
  sections: ReadonlyArray<SchemaSection>;
  /** A document that follows the schema, shown section by section. */
  example?: unknown;
  /** File name for the example, e.g. 'resume.json'. */
  exampleName?: string;
  /** Prefix for ids, so two references can share a page. */
  idPrefix?: string;
  /** Show examples expanded. Collapsed by default, so the fields scan. */
  examplesOpen?: boolean;
}

const rowsOf = (fields: ReadonlyArray<SchemaField>): Row[] =>
  fields.map((f) => ({ ...f }));

/**
 * A JSON Schema as a reference. Plain top-level values (text, numbers) share
 * one table; each object or list gets its own anchored section with its
 * fields and the matching part of the example. An index sits alongside on
 * wide screens. Every top-level key has an id, so pages can link to any.
 */
export function SchemaReference({
  sections,
  example,
  exampleName = 'example.json',
  idPrefix = '',
  examplesOpen = false,
}: SchemaReferenceProps) {
  const id = (key: string) => `${idPrefix}${key}`;
  const plain = sections.filter((section) => section.fields.length === 0);
  const structured = sections.filter((section) => section.fields.length > 0);
  const plainExample =
    example !== null && typeof example === 'object' && plain.length
      ? JSON.stringify(
          Object.fromEntries(
            plain.flatMap((section) =>
              section.key in example
                ? [
                    [
                      section.key,
                      (example as Record<string, unknown>)[section.key],
                    ],
                  ]
                : []
            )
          ),
          null,
          2
        )
      : undefined;

  return (
    <div className={s.layout}>
      <div className={s.sections}>
        {plain.length ? (
          <section
            id={id('fields')}
            className={s.section}
            aria-labelledby={id('fields-name')}
          >
            <h2 id={id('fields-name')} className={s.groupName}>
              Top-level fields
            </h2>
            <FieldTable
              caption="Top-level fields"
              rows={plain.map((section) => ({
                path: section.key,
                type: section.type,
                description: section.description,
                id: id(section.key),
              }))}
            />
            {plainExample && plainExample !== '{}' ? (
              <Example
                code={plainExample}
                label={exampleName}
                summary={`Example from ${exampleName}`}
                open={examplesOpen}
              />
            ) : null}
          </section>
        ) : null}
        {structured.map((section) => {
          const sample =
            example === undefined
              ? undefined
              : exampleFor(example, section.key);
          return (
            <section
              key={section.key}
              id={id(section.key)}
              className={s.section}
              aria-labelledby={`${id(section.key)}-name`}
            >
              <div className={s.sectionHead}>
                <h2 id={`${id(section.key)}-name`} className={s.sectionName}>
                  {section.key}
                </h2>
                <Badge>{section.type}</Badge>
              </div>
              {section.description ? (
                <p className={s.sectionText}>{section.description}</p>
              ) : null}
              <FieldTable
                caption={`Fields of ${section.key}`}
                rows={rowsOf(section.fields)}
              />
              {sample ? (
                <Example
                  code={sample}
                  label={`${section.key} in ${exampleName}`}
                  summary={`Example from ${exampleName}`}
                  open={examplesOpen}
                />
              ) : null}
            </section>
          );
        })}
      </div>
      <div className={s.aside}>
        <OnThisPage
          label="Sections"
          items={[
            ...(plain.length
              ? [{ id: id('fields'), label: 'Top-level fields' }]
              : []),
            ...structured.map((section) => ({
              id: id(section.key),
              label: section.key,
            })),
          ]}
        />
      </div>
    </div>
  );
}
