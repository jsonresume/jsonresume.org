'use client';

import { Combobox, Field } from '@jsonresume/ui';
import * as styles from './countries.css';

const countries = [
  'Australia',
  'Austria',
  'Brazil',
  'Canada',
  'Germany',
  'India',
  'Japan',
  'Netherlands',
  'New Zealand',
  'United Kingdom',
  'United States',
].map((label) => ({ value: label.toLowerCase().replace(/\s/g, '-'), label }));

export default function ComboboxCountries() {
  return (
    <Field
      label="Country"
      hint="Type to filter, then use the arrow keys."
      className={styles.root}
    >
      <Combobox options={countries} placeholder="Choose a country" />
    </Field>
  );
}
