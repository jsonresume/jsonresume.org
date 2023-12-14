import * as standard from 'jsonresume-theme-standard';
import * as full from 'jsonresume-theme-full';
import * as onepage from 'jsonresume-theme-onepage';
import * as onepageplus from 'jsonresume-theme-onepage-plus';
import * as spartacus from 'jsonresume-theme-spartacus';
import * as flat from 'jsonresume-theme-flat';
import * as papirus from '@jsonresume/theme-papirus';
import * as stackoverflow from '@jsonresume/theme-stackoverflow';

export const THEMES = {
  ace: require('jsonresume-theme-ace'),
  actual: require('jsonresume-theme-actual'),
  autumn: require('jsonresume-theme-autumn'),
  cora: require('jsonresume-theme-cora'),
  elegant: require('jsonresume-theme-elegant'),
  full,
  flat,
  'el-santo': require('jsonresume-theme-el-santo'),
  even: require('jsonresume-theme-even'),
  github: require('jsonresume-theme-github'),
  github2: require('jsonresume-theme-github2'),
  jacrys: require('jsonresume-theme-jacrys'),
  kards: require('jsonresume-theme-kards'),
  kendall: require('jsonresume-theme-kendall'),
  macchiato: require('jsonresume-theme-macchiato'),
  mantra: require('jsonresume-theme-mantra'),
  'mocha-responsive': require('jsonresume-theme-mocha-responsive'),
  minyma: require('jsonresume-theme-minyma'),
  msresume: require('jsonresume-theme-msresume'),
  one: require('jsonresume-theme-one'),
  onepage,
  'onepage-plus': onepageplus,
  onepageresume: require('jsonresume-theme-onepageresume'),
  orbit: require('jsonresume-theme-orbit'),
  paper: require('jsonresume-theme-paper'),
  papirus,
  'paper-plus-plus': require('jsonresume-theme-paper-plus-plus'),
  pumpkin: require('jsonresume-theme-pumpkin'),
  relaxed: require('jsonresume-theme-relaxed'),
  rocketspacer: require('jsonresume-theme-rocketspacer'),
  'simple-red': require('jsonresume-theme-simple-red'),
  rickosborne: require('jsonresume-theme-rickosborne'),
  spartan: require('jsonresume-theme-spartan'),
  spartacus,
  stackoverflowed: require('jsonresume-theme-stackoverflowed'),
  standard,
  stackoverflow,
  'standard-resume': require('jsonresume-theme-standard-resume'),
  'tan-responsive': require('jsonresume-theme-tan-responsive'),
  techlead: require('jsonresume-theme-techlead'),
};

const getTheme = (theme) => {
  try {
    return THEMES[theme];
  } catch (e) {
    return {
      e: e.toString(),
      error: 'Theme is not supported.',
    };
  }
};

const format = async function (resume, options) {
  const theme = options.theme ?? 'elegant';
  const themeRenderer = getTheme(theme);

  if (!themeRenderer) {
    throw new Error('theme-missing');
  }

  const resumeHTML = themeRenderer.render(resume);

  return {
    content: resumeHTML,
    headers: [
      {
        key: 'Cache-control',
        value: 'public, max-age=90',
      },
      {
        key: 'Content-Type',
        value: 'text/html',
      },
    ],
  };
};

const exports = { format };

export default exports;
