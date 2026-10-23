'use client';

import {
  Avatar,
  Badge,
  Button,
  Callout,
  CodeBlock,
  Field,
  Heading,
  Input,
  Link,
  Select,
  Stack,
  Switch,
  Text,
} from '@jsonresume/ui';
import { useState, type ReactNode } from 'react';
import props from '@/generated/props.json';
import * as styles from './docs.css';

type Value = string | boolean;

interface Control {
  name: string;
  kind: 'select' | 'boolean' | 'text';
  options?: string[];
}

interface PlaygroundConfig {
  component: string;
  /** Props that are not shown as controls (e.g. children-like text). */
  initial: Record<string, Value>;
  /** Prop names to expose, in order. Options for unions come from props.json. */
  controls: Array<string | Control>;
  render: (p: Record<string, Value>) => ReactNode;
  /** JSX children for the code sample, from the current props. */
  children?: (p: Record<string, Value>) => string | null;
}

const propDocs = props as Record<
  string,
  { props: Array<{ name: string; values: string[] | null; type: string }> }
>;

function resolveControls(config: PlaygroundConfig): Control[] {
  const docs = propDocs[config.component]?.props ?? [];
  return config.controls.map((c) => {
    if (typeof c !== 'string') return c;
    if (typeof config.initial[c] === 'boolean')
      return { name: c, kind: 'boolean' };
    const doc = docs.find((d) => d.name === c);
    if (doc?.values) return { name: c, kind: 'select', options: doc.values };
    if (doc?.type === 'boolean') return { name: c, kind: 'boolean' };
    return { name: c, kind: 'text' };
  });
}

const as = <T,>(v: Value | undefined) => v as T;

const playgrounds: Record<string, PlaygroundConfig> = {
  button: {
    component: 'Button',
    initial: {
      variant: 'primary',
      size: 'md',
      label: 'Export PDF',
      loading: false,
      disabled: false,
      fullWidth: false,
    },
    controls: [
      'variant',
      'size',
      { name: 'label', kind: 'text' },
      'loading',
      'disabled',
      'fullWidth',
    ],
    render: (p) => (
      <Button
        variant={as<'primary'>(p.variant)}
        size={as<'md'>(p.size)}
        loading={as<boolean>(p.loading)}
        disabled={as<boolean>(p.disabled)}
        fullWidth={as<boolean>(p.fullWidth)}
      >
        {p.size === 'icon' ? '★' : String(p.label)}
      </Button>
    ),
    children: (p) => (p.size === 'icon' ? '★' : String(p.label)),
  },
  badge: {
    component: 'Badge',
    initial: { tone: 'brand', label: 'Official' },
    controls: ['tone', { name: 'label', kind: 'text' }],
    render: (p) => <Badge tone={as<'brand'>(p.tone)}>{String(p.label)}</Badge>,
    children: (p) => String(p.label),
  },
  callout: {
    component: 'Callout',
    initial: {
      tone: 'warning',
      title: 'Deprecated field',
      label: 'Use summary instead of description.',
    },
    controls: [
      'tone',
      { name: 'title', kind: 'text' },
      { name: 'label', kind: 'text' },
    ],
    render: (p) => (
      <Callout
        tone={as<'warning'>(p.tone)}
        title={String(p.title) || undefined}
      >
        {String(p.label)}
      </Callout>
    ),
    children: (p) => String(p.label),
  },
  heading: {
    component: 'Heading',
    initial: { size: 'title', level: '2', label: 'Getting started' },
    controls: [
      'size',
      {
        name: 'level',
        kind: 'select',
        options: ['1', '2', '3', '4', '5', '6'],
      },
      { name: 'label', kind: 'text' },
    ],
    render: (p) => (
      <Heading size={as<'title'>(p.size)} level={Number(p.level) as 2}>
        {String(p.label)}
      </Heading>
    ),
    children: (p) => String(p.label),
  },
  text: {
    component: 'Text',
    initial: {
      size: 'sm',
      tone: 'default',
      weight: 'regular',
      caps: false,
      measure: false,
      label: 'JSON Resume is an open standard for resumes.',
    },
    controls: [
      'size',
      'tone',
      'weight',
      'caps',
      'measure',
      { name: 'label', kind: 'text' },
    ],
    render: (p) => (
      <Text
        size={as<'sm'>(p.size)}
        tone={as<'default'>(p.tone)}
        weight={as<'regular'>(p.weight)}
        caps={as<boolean>(p.caps)}
        measure={as<boolean>(p.measure)}
      >
        {String(p.label)}
      </Text>
    ),
    children: (p) => String(p.label),
  },
  link: {
    component: 'Link',
    initial: { tone: 'brand', external: false, label: 'Read the schema' },
    controls: ['tone', 'external', { name: 'label', kind: 'text' }],
    render: (p) => (
      <Link
        href="#playground"
        tone={as<'brand'>(p.tone)}
        external={as<boolean>(p.external)}
      >
        {String(p.label)}
      </Link>
    ),
    children: (p) => String(p.label),
  },
  input: {
    component: 'Input',
    initial: { size: 'md', placeholder: 'thomasdavis', disabled: false },
    controls: [
      { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'] },
      { name: 'placeholder', kind: 'text' },
      { name: 'disabled', kind: 'boolean' },
    ],
    render: (p) => (
      <Input
        aria-label="Playground input"
        size={as<'md'>(p.size)}
        placeholder={String(p.placeholder)}
        disabled={as<boolean>(p.disabled)}
      />
    ),
  },
  avatar: {
    component: 'Avatar',
    initial: { name: 'Thomas Davis', size: 'lg', shape: 'square', photo: true },
    controls: [
      { name: 'name', kind: 'text' },
      'size',
      'shape',
      { name: 'photo', kind: 'boolean' },
    ],
    render: (p) => (
      <Avatar
        name={String(p.name)}
        size={as<'lg'>(p.size)}
        shape={as<'square'>(p.shape)}
        src={
          p.photo ? 'https://avatars.githubusercontent.com/u/416209?v=4' : null
        }
      />
    ),
  },
};

const HIDDEN_IN_CODE = new Set(['label', 'photo']);

function toJsx(config: PlaygroundConfig, values: Record<string, Value>) {
  const attrs = Object.entries(values)
    .filter(([k, v]) => !HIDDEN_IN_CODE.has(k) && v !== false && v !== '')
    .map(([k, v]) =>
      v === true ? k : k === 'level' ? `${k}={${v}}` : `${k}="${v}"`
    );
  if (values.photo) attrs.push('src="https://…"');
  const open = `<${config.component}${
    attrs.length ? ` ${attrs.join(' ')}` : ''
  }`;
  const children = config.children?.(values);
  return children ? `${open}>${children}</${config.component}>` : `${open} />`;
}

export function Playground({ slug }: { slug: string }) {
  const config = playgrounds[slug];
  const [values, setValues] = useState<Record<string, Value>>(
    config?.initial ?? {}
  );
  if (!config) return null;
  const controls = resolveControls(config);
  const set = (name: string, value: Value) =>
    setValues((v) => ({ ...v, [name]: value }));

  return (
    <div className={styles.example}>
      <div className={styles.playground}>
        <div className={`${styles.preview} ${styles.playgroundPreview}`}>
          {config.render(values)}
        </div>
        <Stack gap={4} className={styles.playgroundControls}>
          {controls.map((c) =>
            c.kind === 'boolean' ? (
              <Switch
                key={c.name}
                label={c.name}
                checked={Boolean(values[c.name])}
                onCheckedChange={(v) => set(c.name, v)}
              />
            ) : c.kind === 'select' ? (
              <Field key={c.name} label={c.name}>
                <Select
                  value={String(values[c.name])}
                  onChange={(e) => set(c.name, e.target.value)}
                >
                  {c.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : (
              <Field
                key={c.name}
                label={c.name === 'label' ? 'children' : c.name}
              >
                <Input
                  size="sm"
                  value={String(values[c.name] ?? '')}
                  onChange={(e) => set(c.name, e.target.value)}
                />
              </Field>
            )
          )}
        </Stack>
      </div>
      <div className={styles.source}>
        <CodeBlock label="jsx" code={toJsx(config, values)} />
      </div>
    </div>
  );
}
