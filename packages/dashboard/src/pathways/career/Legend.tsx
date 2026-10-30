import * as s from './career.css';

/** The map's key: what each kind of square means. */
export function Legend() {
  return (
    <ul className={s.legend} aria-label="Key">
      <li>
        <span className={`${s.swatch} ${s.have}`} aria-hidden="true" /> Yours:
        skills, strengths
      </li>
      <li>
        <span className={`${s.swatch} ${s.gap}`} aria-hidden="true" /> Asked
        for, not shown yet
      </li>
      <li>
        <span className={`${s.swatch} ${s.mine}`} aria-hidden="true" /> Your
        experience; one step away
      </li>
      <li>
        <span className={`${s.swatch} ${s.open}`} aria-hidden="true" /> Roles,
        jobs and destinations
      </li>
    </ul>
  );
}
