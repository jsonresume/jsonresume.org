import { NavList, NavListGroup, NavListItem } from '@jsonresume/ui';

export default function NavListDocs() {
  return (
    <NavList label="Guide" style={{ width: '15rem' }}>
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
