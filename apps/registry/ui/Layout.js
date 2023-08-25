import { Button } from "ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from "node-html-markdown";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
export default function Layout({ children }) {
  const router = useRouter();
  const parts = router.asPath.split("/");
  const username = parts[1];
  const onShowAbout = () => {};

  return (
    <>
      <Container>
        <Header>
          <HeaderContainer>
            <Logo href="https://jsonresume.org" target="__blank">
              JSON Resume
            </Logo>
            <Links>
              <Link href={`/${username}/jobs`}>Jobs</Link>
              <Link href={`/${username}/interview`}>Interview</Link>
              <Link href={`/${username}/letter`}>Letter</Link>
              <Link href={`/${username}/suggestions`}>Suggestions</Link>
            </Links>
          </HeaderContainer>
        </Header>
        <div>{children}</div>
      </Container>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
        rel="stylesheet"
      />
      <script
        async
        data-id="101412887"
        src="//static.getclicky.com/js"
      ></script>
      <noscript>
        <p>
          <img
            alt="Clicky"
            width="1"
            height="1"
            src="//in.getclicky.com/101412887ns.gif"
          />
        </p>
      </noscript>
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
          background-color: #f5f5f5;
          font-family: "Open Sans", sans-serif;
        }
      `}</style>
    </>
  );
}
