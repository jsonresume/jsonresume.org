import { Field, Select } from '@jsonresume/ui';
import { THEME_COLORS, THEME_LAYOUTS } from '@jsonresume/theme-metadata';
import { facetCounts, themes } from './catalog';
import * as s from './gallery.css';

const layouts = facetCounts(themes, 'layout');
const colors = facetCounts(themes, 'color');

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
      <Field label="Layout" className={s.facet}>
        <Select
          value={layout ?? ''}
          onChange={(event) => setLayout(event.target.value || null)}
        >
          <option value="">All layouts</option>
          {layouts.map(({ value }) => (
            <option key={value} value={value}>
              {THEME_LAYOUTS[value]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Colour" className={s.facet}>
        <Select
          value={color ?? ''}
          onChange={(event) => setColor(event.target.value || null)}
        >
          <option value="">All colours</option>
          {colors.map(({ value }) => (
            <option key={value} value={value}>
              {THEME_COLORS[value]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Sort by" className={s.sortFacet}>
        <Select
          value={sort ?? 'recommended'}
          onChange={(event) =>
            setSort(
              event.target.value === 'recommended' ? null : event.target.value
            )
          }
        >
          <option value="recommended">Recommended first</option>
          <option value="usage">Most used</option>
          <option value="chosen">Most explicitly chosen</option>
          <option value="name">Name A–Z</option>
        </Select>
      </Field>
    </>
  );
}
