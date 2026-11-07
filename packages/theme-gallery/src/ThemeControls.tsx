import { Field, Select } from '@jsonresume/ui';
import { THEME_COLORS, THEME_LAYOUTS } from '@jsonresume/theme-metadata';

interface Props {
  layout: string | null;
  color: string | null;
  sort: string | null;
  setLayout: (value: string | null) => void;
  setColor: (value: string | null) => void;
  setSort: (value: string | null) => void;
}

export function ThemeControls({
  layout,
  color,
  sort,
  setLayout,
  setColor,
  setSort,
}: Props) {
  return (
    <>
      <Field label="Layout">
        <Select
          value={layout ?? ''}
          onChange={(event) => setLayout(event.target.value || null)}
        >
          <option value="">All layouts</option>
          {Object.entries(THEME_LAYOUTS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Colour">
        <Select
          value={color ?? ''}
          onChange={(event) => setColor(event.target.value || null)}
        >
          <option value="">All colours</option>
          {Object.entries(THEME_COLORS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Sort by">
        <Select
          value={sort ?? 'usage'}
          onChange={(event) =>
            setSort(event.target.value === 'usage' ? null : event.target.value)
          }
        >
          <option value="usage">Most used</option>
          <option value="chosen">Most explicitly chosen</option>
          <option value="name">Name A–Z</option>
        </Select>
      </Field>
    </>
  );
}
