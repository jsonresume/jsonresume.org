import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import { Container, Header, Content } from './Layout/styles';
import { LayoutHeader } from './Layout/LayoutHeader';
import { LayoutUserSearch } from './Layout/LayoutUserSearch';
import { LayoutScripts } from './Layout/LayoutScripts';
import { useUsers } from './Layout/useUsers';

export default function Layout({ children }) {
  const router = useRouter();
  const parts = router.asPath.split('/');
  const path = parts[2];
  const [username, setUsername] = useState(parts[1]);
  console.log({ username });
  const users = useUsers();

  const onChangeUsername = (value) => {
    Router.push(
      {
        pathname: `/${value}/${path}`,
      },
      undefined,
      { shallow: true }
    );
    setUsername(value);
  };

  // rmember to cache the users api
  return (
    <>
      <Container>
        <Header>
          <LayoutHeader username={username} />
          <LayoutUserSearch
            username={username}
            users={users}
            onChangeUsername={onChangeUsername}
          />
        </Header>
        <Content>{children}</Content>
      </Container>

      <LayoutScripts />
    </>
  );
}
