import * as standard from 'jsonresume-theme-standard';
import * as cv from 'jsonresume-theme-cv';
import * as professional from '@jsonresume/jsonresume-theme-professional';
// import * as tailwind from 'jsonresume-theme-tailwind';
import * as full from 'jsonresume-theme-full';
import * as onepage from 'jsonresume-theme-onepage';
import * as onepageplus from 'jsonresume-theme-onepage-plus';
import * as spartacus from 'jsonresume-theme-spartacus';
import * as flat from 'jsonresume-theme-flat';
import * as papirus from '@jsonresume/theme-papirus';
import * as stackoverflow from '@jsonresume/theme-stackoverflow';
import * as reference from 'jsonresume-theme-reference';
import * as modern from 'jsonresume-theme-modern';
import * as sidebar from 'jsonresume-theme-sidebar';
import * as modernclassic from 'jsonresume-theme-modern-classic';
import * as executiveslate from 'jsonresume-theme-executive-slate';
import * as productmanagercanvas from 'jsonresume-theme-product-manager-canvas';
// styled-components moved inline to fix webpack resolution
import * as governmentstandard from 'jsonresume-theme-government-standard'; // FIXED
import * as developermono from 'jsonresume-theme-developer-mono'; // TESTING
import * as minimalistgrid from 'jsonresume-theme-minimalist-grid'; // TESTING
import * as creativestudio from '@jsonresume/jsonresume-theme-creative-studio'; // FIXED
import * as datadriven from 'jsonresume-theme-data-driven'; // TESTING
// import * as consultantpolished from '@jsonresume/jsonresume-theme-consultant-polished'; // FAILS - Date is not a constructor
import * as universityfirst from 'jsonresume-theme-university-first'; // TESTING
import * as academiccvlite from 'jsonresume-theme-academic-cv-lite'; // TESTING
import * as saleshunter from 'jsonresume-theme-sales-hunter'; // TESTING
import * as marketingnarrative from 'jsonresume-theme-marketing-narrative'; // FIXED
import * as operationsprecision from 'jsonresume-theme-operations-precision'; // TESTING

export const THEMES = {
  ace: require('jsonresume-theme-ace'),
  actual: require('jsonresume-theme-actual'),
  autumn: require('jsonresume-theme-autumn'),
  cora: require('jsonresume-theme-cora'),
  cv,
  professional,
  // tailwind,
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
  lucide: require('jsonresume-theme-lucide'),
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
  standard,
  stackoverflow,
  'standard-resume': require('jsonresume-theme-standard-resume'),
  'tan-responsive': require('jsonresume-theme-tan-responsive'),
  techlead: require('jsonresume-theme-techlead'),
  reference,
  modern,
  sidebar,
  'modern-classic': modernclassic,
  'executive-slate': executiveslate,
  'product-manager-canvas': productmanagercanvas,
  // styled-components moved inline to fix webpack resolution
  'government-standard': governmentstandard, // FIXED
  'developer-mono': developermono, // TESTING
  'minimalist-grid': minimalistgrid, // TESTING
  'creative-studio': creativestudio, // FIXED
  'data-driven': datadriven, // TESTING
  // 'consultant-polished': consultantpolished, // FAILS - Date is not a constructor
  'university-first': universityfirst, // TESTING
  'academic-cv-lite': academiccvlite, // TESTING
  'sales-hunter': saleshunter, // TESTING
  'marketing-narrative': marketingnarrative, // FIXED
  'operations-precision': operationsprecision, // TESTING
};

/**
 * Get a random theme name from available themes
 * @returns {string} Random theme name
 */
export function getRandomTheme() {
  const themeNames = Object.keys(THEMES);
  const randomIndex = Math.floor(Math.random() * themeNames.length);
  return themeNames[randomIndex];
}
