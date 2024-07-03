'use client';

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from '@jsonresume/ui/Link';
import { ProfileProvider } from './ProfileContext';
import Button from '../../src/ui/Button';

const ProfileContainer = styled.div``;

const Container = styled.div`
  width: 960px;
  margin: auto;
  padding-top: 40px;
  display: flex;
  font-size: 1.3rem;
`;

const Profile = styled.div`
  width: 240px;
  max-width: 240px;
  margin-right: 20px;
`;

const Main = styled.div`
  flex: 1;
`;

const SideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  width: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Name = styled.h2`
  margin: 10px 0 5px 0;
  font-size: 24px;
  color: #333;
`;

const Username = styled.p`
  margin: 5px 0;
  font-size: 18px;
  color: #555;
`;

const Bio = styled.p`
  margin: 10px 0;
  font-size: 16px;
  color: #666;
  text-align: center;
`;

const Location = styled.p`
  margin: 5px 0;
  font-size: 14px;
  color: #777;
`;

const Contact = styled.a`
  margin: 5px 0;
  font-size: 14px;
  color: #0073e6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
const MenuContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Menu = styled.div`
  width: 960px;
  margin: auto;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
`;
const Items = styled.div`
  display: flex;
  gap: 1rem;
  padding-left: 258px;
`;
const ViewMenu = styled.div``;

export default function Layout({ children, resume, username, session }) {
  const router = useRouter();
  const image = resume?.basics?.image
    ? resume?.basics.image
    : '/default-avatar.png';
  return (
    <ProfileContainer>
      <MenuContainer>
        <Menu>
          <Items>
            {username && <Link href={`/${username}/dashboard`}>Dashboard</Link>}
            {username && <Link href={`/${username}/jobs`}>Jobs</Link>}
            {username && (
              <Link href={`/${username}/suggestions`}>Suggestions</Link>
            )}
            {/* {username && <Link href={`/${username}/interview`}>Interview</Link>} */}
            {username && <Link href={`/${username}/letter`}>Letter</Link>}
          </Items>
          <ViewMenu>
            <Link
              href={`/${username}`}
              target="_blank"
              style={{
                marginLeft: 20,
              }}
            >
              View Resume
            </Link>
            <Link
              href={`/${username}/json`}
              style={{
                marginLeft: 20,
              }}
            >
              View JSON
            </Link>
          </ViewMenu>
        </Menu>
      </MenuContainer>
      <Container>
        <Profile>
          <SideContainer>
            <ProfileImage src={image} alt={`${resume.basics.name}`} />
            <Name>{`${resume.basics.name}`}</Name>
            <Username>@{username}</Username>
            <Bio>{resume.basics.label}</Bio>
            <Location>{resume.basics.location.countryCode}</Location>
            <Contact href={`mailto:${resume.basics.email}`}>
              {resume.basics.email}
            </Contact>
            <br />
            {session && (
              <Button
                onClick={() => {
                  router.push('/editor');
                }}
              >
                Edit Resume
              </Button>
            )}
          </SideContainer>
        </Profile>
        <Main>
          <ProfileProvider
            resume={resume}
            username={username}
            session={session}
          >
            {children}
          </ProfileProvider>
        </Main>
      </Container>
    </ProfileContainer>
  );
}
