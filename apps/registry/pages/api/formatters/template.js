export const THEMES = {
  ace: require('jsonresume-theme-ace'),
  actual: require('jsonresume-theme-actual'),
  apage: require('jsonresume-theme-apage'),
  autumn: require('jsonresume-theme-autumn'),
  caffeine: require('jsonresume-theme-caffeine'),
  class: require('jsonresume-theme-class'),
  classy: require('jsonresume-theme-classy'),
  cora: require('jsonresume-theme-cora'),
  compact: require('jsonresume-theme-compact'),
  contempo: require('jsonresume-theme-contempo'),
  dave: require('jsonresume-theme-dave'),
  direct: require('jsonresume-theme-direct'),
  dinesh: require('jsonresume-theme-dinesh'),
  elegant: require('jsonresume-theme-elegant'),
  elite: require('jsonresume-theme-elite'),
  // eloquent: require("jsonresume-theme-eloquent"),
  'el-santo': require('jsonresume-theme-el-santo'),
  even: require('jsonresume-theme-even'),
  flat: require('jsonresume-theme-flat'),
  'flat-fr': require('jsonresume-theme-flat-fr'),
  fresh: require('jsonresume-theme-fresh'),
  full: require('jsonresume-theme-full'),
  joeytall: require('jsonresume-theme-joeytall'),
  github: require('jsonresume-theme-github'),
  github2: require('jsonresume-theme-github2'),
  jacrys: require('jsonresume-theme-jacrys'),
  kards: require('jsonresume-theme-kards'),
  keloran: require('jsonresume-theme-keloran'),
  kendall: require('jsonresume-theme-kendall'),
  macchiato: require('jsonresume-theme-macchiato'),
  mantra: require('jsonresume-theme-mantra'),
  'mocha-responsive': require('jsonresume-theme-mocha-responsive'),
  minyma: require('jsonresume-theme-minyma'),
  modern: require('jsonresume-theme-modern'),
  msresume: require('jsonresume-theme-msresume'),
  one: require('jsonresume-theme-one'),
  onepage: require('jsonresume-theme-onepage'),
  'onepage-plus': require('jsonresume-theme-onepage-plus'),
  'onepage-efficient': require('jsonresume-theme-onepage-efficient'),
  onepageresume: require('jsonresume-theme-onepageresume'),
  orbit: require('jsonresume-theme-orbit'),
  riga: require('jsonresume-theme-riga'),
  paper: require('jsonresume-theme-paper'),
  'paper-plus-plus': require('jsonresume-theme-paper-plus-plus'),
  papirus: require('jsonresume-theme-papirus'),
  pumpkin: require('jsonresume-theme-pumpkin'),
  rocketspacer: require('jsonresume-theme-rocketspacer'),
  short: require('jsonresume-theme-short'),
  'simple-red': require('jsonresume-theme-simple-red'),
  resu: require('jsonresume-theme-resu'),
  rickosborne: require('jsonresume-theme-rickosborne'),
  slick: require('jsonresume-theme-slick'),
  sceptile: require('jsonresume-theme-sceptile'),
  simple: require('jsonresume-theme-simple'),
  spartacus: require('jsonresume-theme-spartacus'),
  'timeline-fixed': require('jsonresume-theme-timeline-fixed'),
  spartan: require('jsonresume-theme-spartan'),
  srt: require('jsonresume-theme-srt'),
  stackoverflowed: require('jsonresume-theme-stackoverflowed'),
  stackoverflow: require('jsonresume-theme-stackoverflow'),
  standard: require('jsonresume-theme-standard'),
  'standard-resume': require('jsonresume-theme-standard-resume'),
  'tachyons-clean': require('jsonresume-theme-tachyons-clean'),
  'tan-responsive': require('jsonresume-theme-tan-responsive'),
  techlead: require('jsonresume-theme-techlead'),
  verbum: require('jsonresume-theme-verbum'),
  wraypro: require('jsonresume-theme-wraypro'),
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

export default { format };
