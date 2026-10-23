import {
  assignVars,
  createGlobalTheme,
  createGlobalThemeContract,
  globalStyle,
} from '@vanilla-extract/css';
import { darkColor, media, tokens } from './theme';

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * Typed references to every token. Variable names are stable and public
 * (`vars.color.text.default` is `var(--jr-color-text-default)`), so plain
 * CSS can use the same tokens.
 */
export const vars = createGlobalThemeContract(
  tokens,
  (_value, path) => `jr-${path.map(kebab).join('-')}`
);

createGlobalTheme(':root', vars, tokens);

globalStyle(':root', { colorScheme: 'light' });

// Dark is opt-in: data-theme="dark" forces it, data-theme="system" follows
// the operating system. Without either, pages stay light.
globalStyle('[data-theme="dark"]', {
  colorScheme: 'dark',
  vars: assignVars(vars.color, darkColor),
});

globalStyle('[data-theme="system"]', {
  '@media': {
    [media.dark]: {
      colorScheme: 'dark',
      vars: assignVars(vars.color, darkColor),
    },
  },
});
