/**
 * Raw palette. Components never use these directly: they read the semantic
 * tokens in `theme.ts`, which map these values to roles per color scheme.
 * Values are taken from jsonresume.org.
 */
export const palette = {
  white: '#ffffff',
  black: '#000000',
  yellow: {
    50: '#fffdf0',
    100: '#fff9cf',
    200: '#fff18f', // brand
    300: '#ffe95c',
    400: '#f2d935',
    700: '#6b5f0e',
  },
  gray: {
    25: '#fcfcfc',
    50: '#f9f9f9',
    100: '#f2f2f2',
    150: '#eeeeee',
    200: '#dddddd',
    300: '#cccccc',
    400: '#999999',
    500: '#6b6b6b',
    600: '#555555',
    700: '#333333',
    800: '#222222',
    850: '#1c1c1c',
    900: '#1a1a1a',
    950: '#121212',
  },
  red: {
    50: '#fdf3f3',
    100: '#fbe2e2',
    300: '#ff7b7b',
    500: '#d23a3a', // call to action
    600: '#ce2424',
    700: '#a92525', // links
    800: '#8a1d1d',
  },
  green: { 50: '#effaf3', 300: '#6fd39a', 700: '#1f6b3e' },
  amber: { 50: '#fff8eb', 300: '#ffc966', 700: '#8a5200' },
  blue: { 50: '#eff5ff', 300: '#8db6ff', 700: '#1f4f9e' },
} as const;
