'use client';

import { RangeSlider } from '@jsonresume/ui';
import * as styles from './salary.css';

// Counts of job listings per $25k bucket, drawn behind the slider.
const listings = [2, 5, 11, 19, 28, 31, 24, 16, 9, 5, 3, 1];

export default function RangeSliderSalary() {
  return (
    <div className={styles.root}>
      <RangeSlider
        label="Salary"
        min={0}
        max={300}
        step={5}
        defaultValue={[120, 220]}
        formatValue={(v) => `$${v}k`}
        distribution={listings}
      />
    </div>
  );
}
