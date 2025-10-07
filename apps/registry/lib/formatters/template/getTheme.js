import { THEMES } from './themeConfig';

export const getTheme = (theme) => {
  try {
    return THEMES[theme];
  } catch (e) {
    return {
      e: e.toString(),
      error: 'Theme is not supported.',
    };
  }
};
