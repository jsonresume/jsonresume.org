'use client';
import styled, { ThemeProvider } from 'styled-components';
import theme from './lib/theme';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  padding: 1rem;
  a {
    color: ${({ theme }) => theme.colors.primary.contrastText};
    text-decoration: none;
  }
`;

// @todo - ideally I want to publish this ui package where styled component is not required, but I don't know how to do that yet

const Header = ({ left = null, right = null }) => {
  return (
    <ThemeProvider theme={theme}>
      <HeaderContainer>
        <nav>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div>{left}</div>
            <div>{right}</div>
          </div>
        </nav>
      </HeaderContainer>
    </ThemeProvider>
  );
};

export default Header;
