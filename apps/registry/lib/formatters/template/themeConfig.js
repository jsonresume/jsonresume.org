import * as professional from '@jsonresume/jsonresume-theme-professional';
// import * as tailwind from 'jsonresume-theme-tailwind';
import * as flat from 'jsonresume-theme-flat';
import * as stackoverflow from '@jsonresume/theme-stackoverflow';
import * as reference from 'jsonresume-theme-reference';
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
import * as consultantpolished from '@jsonresume/jsonresume-theme-consultant-polished'; // FIXED
import * as universityfirst from 'jsonresume-theme-university-first'; // TESTING
import * as academiccvlite from 'jsonresume-theme-academic-cv-lite'; // TESTING
import * as saleshunter from 'jsonresume-theme-sales-hunter'; // TESTING
import * as marketingnarrative from 'jsonresume-theme-marketing-narrative'; // FIXED
import * as operationsprecision from 'jsonresume-theme-operations-precision'; // TESTING
import * as writersportfolio from 'jsonresume-theme-writers-portfolio'; // NEW
import * as tokyomodernist from '@jsonresume/jsonresume-theme-tokyo-modernist'; // NEW

// List of available theme names (used by UI components without triggering imports)
export const THEME_NAMES = [
  'academic-cv-lite',
  'consultant-polished',
  'creative-studio',
  'data-driven',
  'developer-mono',
  'elegant',
  'even',
  'executive-slate',
  'flat',
  'government-standard',
  'jacrys',
  'kendall',
  'lucide',
  'macchiato',
  'marketing-narrative',
  'minimalist-grid',
  'minyma',
  'modern-classic',
  'operations-precision',
  'paper-plus-plus',
  'product-manager-canvas',
  'professional',
  'pumpkin',
  'reference',
  'rickosborne',
  'sales-hunter',
  'sidebar',
  'stackoverflow',
  'tan-responsive',
  'tokyo-modernist',
  'university-first',
  'writers-portfolio',
];

export const THEMES = {
  professional,
  // tailwind,
  elegant: require('jsonresume-theme-elegant'),
  flat,
  even: require('jsonresume-theme-even'),
  jacrys: require('jsonresume-theme-jacrys'),
  kendall: require('jsonresume-theme-kendall'),
  lucide: require('jsonresume-theme-lucide'),
  macchiato: require('jsonresume-theme-macchiato'),
  // mantra: require('jsonresume-theme-mantra'), // REMOVED - causes build failure due to ansi-colors dependency
  minyma: require('jsonresume-theme-minyma'),
  'paper-plus-plus': require('jsonresume-theme-paper-plus-plus'),
  pumpkin: require('jsonresume-theme-pumpkin'),
  rickosborne: require('jsonresume-theme-rickosborne'),
  stackoverflow,
  'tan-responsive': require('jsonresume-theme-tan-responsive'),
  reference,
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
  'consultant-polished': consultantpolished, // FIXED
  'university-first': universityfirst, // TESTING
  'academic-cv-lite': academiccvlite, // TESTING
  'sales-hunter': saleshunter, // TESTING
  'marketing-narrative': marketingnarrative, // FIXED
  'operations-precision': operationsprecision, // TESTING
  'writers-portfolio': writersportfolio, // NEW
  'tokyo-modernist': tokyomodernist, // NEW
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
