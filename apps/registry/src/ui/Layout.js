import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const HeaderContainer = styled.div`
  max-width: 800px;
  width: 100%;
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
  width: 100%;
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
  margin-left: 20px;
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
  padding: 20px;
`;

const UserSearch = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 800px;
  flex-direction: row;
  margin: 20px auto;
  a {
    text-decoration: none;
    color: #000;
    margin-left: 10px;
    :visited {
      color: #000;
    }
  }
`;

const UserInput = styled.input`
  margin-left: 10px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #000;
`;

export default function Layout({ children }) {
  const router = useRouter();
  const parts = router.asPath.split('/');
  const username = parts[1];

  const [users, setUsers] = useState([]);
  // const [user, setUser] = useState('');
  // write a function that fetches user from an api and puts in state
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/resumes');
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  });

  console.log({ users });

  // const onChangeUser = (e) => {
  //   setUser(e.target.value);
  // };

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
          <UserSearch>
            <div>
              Using the resume of
              {username && (
                <UserInput
                  type="text"
                  placeholder="Github username"
                  value={username}
                />
              )}
            </div>
            <div>
              <a href={`https://registry.jsonresume.org/${username}`}>
                View resume
              </a>
              <a href={`https://registry.jsonresume.org/${username}.json`}>
                View raw
              </a>
            </div>
          </UserSearch>
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
