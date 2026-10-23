import { NavList, NavListGroup, NavListItem } from '@jsonresume/ui';
import * as styles from './docs.css';

export default function NavListDocs() {
  return (
    <NavList label="Guide" className={styles.root}>
      <NavListGroup label="Start">
        <NavListItem href="#getting-started" active>
          Getting started
        </NavListItem>
        <NavListItem href="#schema">Schema</NavListItem>
      </NavListGroup>
      <NavListGroup label="Guides">
        <NavListItem href="#themes">Themes</NavListItem>
        <NavListItem href="#hosting">Hosting</NavListItem>
      </NavListGroup>
    </NavList>
  );
}
