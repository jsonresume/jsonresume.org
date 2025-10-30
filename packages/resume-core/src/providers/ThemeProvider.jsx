/**
 * ThemeProvider
 * Provides theme context and CSS custom properties to all resume components
 */
import React, { createContext, useContext, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import '../styles/tokens.css';

const ThemeContext = createContext({
  theme: 'professional',
  setTheme: () => {},
});

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--resume-font-sans);
    font-size: var(--resume-size-body);
    line-height: var(--resume-line-height-normal);
    color: var(--resume-color-primary);
    background: var(--resume-color-background);
  }
`;

export function ThemeProvider({ theme = 'professional', children }) {
  const [currentTheme, setCurrentTheme] = React.useState(theme);

  useEffect(() => {
    // Apply theme data attribute to document root
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, setTheme: setCurrentTheme }}
    >
      <GlobalStyles />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
