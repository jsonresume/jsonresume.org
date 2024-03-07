import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const LinkElement = styled.a`
  text-decoration: none;
  color: #000;
  &:active {
    color: #000;
  }
  &:visited {
    color: #000;
  }
  &:hover {
    color: #df4848;
  }
  &[aria-current] {
    font-weight: 700;
  }
`;

const NavLink = ({ href, children }) => {
  const { asPath } = useRouter();
  const path = asPath.split('/')[2];
  const slugPath = href.split('/')[2];
  const ariaCurrent = slugPath === path ? 'page' : undefined;
  console.log({ href, path, ariaCurrent });
  return (
    <Link href={href}>
      <LinkElement aria-current={ariaCurrent}>{children}</LinkElement>
    </Link>
  );
};

export default NavLink;
