import { RadarChart } from '@jsonresume/ui';
import * as styles from './radar.css';

export default function ChartsRadar() {
  return (
    <div className={styles.root}>
      <RadarChart
        title="Readiness"
        summary="Strongest in experience and skills; impact needs work."
        data={[
          { label: 'Skills', value: 82 },
          { label: 'Experience', value: 90 },
          { label: 'Impact', value: 45 },
          { label: 'Education', value: 60 },
          { label: 'Keywords', value: 74 },
        ]}
      />
    </div>
  );
}
