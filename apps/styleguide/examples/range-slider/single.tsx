'use client';

import { RangeSlider } from '@jsonresume/ui';
import * as styles from './single.css';

export default function RangeSliderSingle() {
  return (
    <div className={styles.root}>
      <RangeSlider
        label="Minimum match"
        defaultValue={[70]}
        formatValue={(v) => `${v}%`}
      />
    </div>
  );
}
