import * as styles from './docs.css';

/** Do / Don't columns used across foundation and component pages. */
export function Guidelines({
  do: dos,
  dont,
}: {
  do: string[];
  dont: string[];
}) {
  return (
    <div className={styles.guidelines}>
      <div className={`${styles.guide} ${styles.guideDo}`}>
        <h3>Do</h3>
        <ul>
          {dos.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
      <div className={`${styles.guide} ${styles.guideDont}`}>
        <h3>Don’t</h3>
        <ul>
          {dont.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
