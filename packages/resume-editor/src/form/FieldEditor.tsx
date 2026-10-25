import {
  Checkbox,
  Field,
  Grid,
  Input,
  Repeater,
  Stack,
  TagInput,
  Text,
  Textarea,
} from '@jsonresume/ui';
import { Predicate } from 'effect';
import type { ReactNode } from 'react';
import { itemTitle, type FieldSpec } from '../model';
import type { Json, Path } from '../values';
import { pathKey, useForm } from './context';

const text = (v: Json) =>
  Predicate.isString(v) || Predicate.isNumber(v) ? String(v) : '';
const strings = (v: Json): string[] =>
  Array.isArray(v) ? v.filter(Predicate.isString) : [];
const objects = (v: Json): Json[] => (Array.isArray(v) ? v : []);
const SHORT = new Set(['text', 'date', 'url', 'email', 'boolean']);

interface Props {
  spec: FieldSpec;
  value: Json;
  path: Path;
}

/** Short fields side by side, then the long ones full width. */
export function Fields({
  specs,
  value,
  path,
}: {
  specs: ReadonlyArray<FieldSpec>;
  value: Json;
  path: Path;
}) {
  const at = (spec: FieldSpec) =>
    Predicate.isObject(value) ? value[spec.key] : undefined;
  const short = specs.filter((s) => SHORT.has(s.kind));
  const long = specs.filter((s) => !SHORT.has(s.kind));
  return (
    <Stack gap={5}>
      {short.length > 0 ? (
        <Grid gap={4} minColumnWidth="13rem">
          {short.map((s) => (
            <FieldEditor
              key={s.key}
              spec={s}
              value={at(s)}
              path={[...path, s.key]}
            />
          ))}
        </Grid>
      ) : null}
      {long.map((s) => (
        <FieldEditor
          key={s.key}
          spec={s}
          value={at(s)}
          path={[...path, s.key]}
        />
      ))}
    </Stack>
  );
}

/** One field of the resume, edited the way its type suggests. */
export function FieldEditor({ spec, value, path }: Props) {
  const { set, issues } = useForm();
  const error = issues.get(pathKey(path));
  const field = (control: ReactNode, hint?: string) => (
    <Field
      label={spec.label}
      hint={hint ?? spec.description}
      {...(error ? { error } : {})}
    >
      {control}
    </Field>
  );
  const put = (next: Json) => set(path, next);

  switch (spec.kind) {
    case 'text':
    case 'url':
    case 'email':
      return field(
        <Input
          type={spec.kind === 'text' ? 'text' : spec.kind}
          value={text(value)}
          onChange={(e) => put(e.target.value)}
        />
      );
    case 'date':
      return field(
        <Input
          value={text(value)}
          placeholder="2024-06"
          inputMode="numeric"
          onChange={(e) => put(e.target.value)}
        />,
        'Year, year-month or full date: 2024, 2024-06 or 2024-06-30.'
      );
    case 'longText':
      return field(
        <Textarea
          rows={4}
          value={text(value)}
          onChange={(e) => put(e.target.value)}
        />
      );
    case 'boolean':
      return (
        <Checkbox
          label={spec.label}
          checked={value === true}
          onCheckedChange={(c) => put(c === true ? true : undefined)}
        />
      );
    case 'tags':
      return field(
        <TagInput
          value={strings(value)}
          onValueChange={put}
          placeholder="Type and press Enter"
        />
      );
    case 'lines':
      return field(
        <Textarea
          rows={4}
          value={strings(value).join('\n')}
          onChange={(e) => put(e.target.value.split('\n'))}
          onBlur={(e) =>
            put(e.target.value.split('\n').filter((l) => l.trim() !== ''))
          }
        />,
        'One per line.'
      );
    case 'location':
      return Predicate.isString(value) ? (
        field(
          <Input value={value} onChange={(e) => put(e.target.value)} />,
          'Free text, e.g. Oslo, Norway.'
        )
      ) : (
        <Group spec={spec} value={value} path={path} />
      );
    case 'group':
      return <Group spec={spec} value={value} path={path} />;
    case 'list':
      return <List spec={spec} value={value} path={path} />;
  }
}

function Group({ spec, value, path }: Props) {
  return (
    <Stack gap={3}>
      <Text as="span" size="sm" weight="semibold" tone="strong">
        {spec.label}
      </Text>
      <Fields specs={spec.fields ?? []} value={value} path={path} />
    </Stack>
  );
}

/** A list of entries (jobs, schools, profiles): add, remove, reorder. */
export function List({
  spec,
  value,
  path,
  headingLevel = 4,
}: Props & { headingLevel?: 2 | 3 | 4 | 5 }) {
  const { set } = useForm();
  return (
    <Repeater
      items={objects(value)}
      onChange={(items) => set(path, items)}
      create={() => ({})}
      itemLabel={itemTitle}
      noun={spec.label.toLowerCase().replace(/s$/, '')}
      addLabel={`Add ${spec.label.toLowerCase().replace(/s$/, '')}`}
      headingLevel={headingLevel}
      renderItem={(item, _update, index) => (
        <Fields
          specs={spec.fields ?? []}
          value={item}
          path={[...path, index]}
        />
      )}
    />
  );
}
