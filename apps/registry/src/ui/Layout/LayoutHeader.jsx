import NavLink from '../NavLink';
import { HeaderContainer, Logo, Links } from './styles';

export function LayoutHeader({ username }) {
  return (
    <HeaderContainer>
      <Logo href="https://jsonresume.org" target="__blank">
        JSON Resume AI
      </Logo>
      <Links>
        <NavLink href={`/${username}/jobs`}>Jobs</NavLink>
        <NavLink href={`/${username}/interview`}>Interview</NavLink>
        <NavLink href={`/${username}/letter`}>Letter</NavLink>
        <NavLink href={`/${username}/suggestions`}>Suggestions</NavLink>
      </Links>
    </HeaderContainer>
  );
}
