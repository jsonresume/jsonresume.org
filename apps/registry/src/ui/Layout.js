import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  max-width: 800px;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  height: 100%;
`;

const Header = styled.div`
  background: #fff18f;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 40px;
  font-weight: 500;
`;

const Logo = styled.a`
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
`;

const Links = styled.div`
  width: 300px;
  display: flex;
  justify-content: space-between;
  a {
    text-decoration: none;
    color: #000;
    &:visited {
      color: #000;
    }
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: auto;
  margin-top: 80px;
`;

export default function Layout({ children }) {
  const router = useRouter();
  const parts = router.asPath.split('/');
  const username = parts[1];

  return (
    <>
      <Container>
        <Header>
          <HeaderContainer>
            <Logo href="https://jsonresume.org" target="__blank">
              JSON Resume AI
            </Logo>
            <Links>
              <Link href={`/${username}/jobs`}>Jobs</Link>
              <Link href={`/${username}/interview`}>Interview</Link>
              <Link href={`/${username}/letter`}>Letter</Link>
              <Link href={`/${username}/suggestions`}>Suggestions</Link>
            </Links>
          </HeaderContainer>
        </Header>
        <Content>{children}</Content>
      </Container>

      <script
        async
        data-id="101412887"
        src="https://static.getclicky.com/js"
      ></script>
      <noscript>
        <p>
          <Image
            alt="Clicky"
            width="1"
            height="1"
            src="https://in.getclicky.com/101412887ns.gif"
          />
        </p>
      </noscript>
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
          background-color: #f5f5f5;
          font-family: 'Open Sans', sans-serif;
        }
      `}</style>
    </>
  );
}
