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
import * as nordicminimal from 'jsonresume-theme-nordic-minimal'; // NEW
import * as graphpapergrid from 'jsonresume-theme-graph-paper-grid'; // NEW
import * as monochrome from 'jsonresume-theme-monochrome-noir'; // NEW
import * as twocolumnmodernist from 'jsonresume-theme-two-column-modernist'; // NEW
import * as sidebarphotostrip from 'jsonresume-theme-sidebar-photo-strip'; // NEW
import * as architectsportfolio from 'jsonresume-theme-architects-portfolio'; // NEW
import * as diagonalaccentbar from 'jsonresume-theme-diagonal-accent-bar'; // NEW
import * as asymmetrictimeline from 'jsonresume-theme-asymmetric-timeline'; // NEW
import * as midcenturyresume from 'jsonresume-theme-mid-century-resume'; // NEW
import * as boldheaderstatement from 'jsonresume-theme-bold-header-statement'; // NEW
import * as typewritermodern from 'jsonresume-theme-typewriter-modern'; // NEW
import * as newyorkeditorial from 'jsonresume-theme-new-york-editorial'; // NEW

// Import theme metadata from shared package
export {
  THEME_METADATA,
  THEME_NAMES,
  getRandomTheme,
} from '@repo/theme-config';

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
  'nordic-minimal': nordicminimal, // NEW
  'graph-paper-grid': graphpapergrid, // NEW
  'monochrome-noir': monochrome, // NEW
  'two-column-modernist': twocolumnmodernist, // NEW
  'sidebar-photo-strip': sidebarphotostrip, // NEW
  'architects-portfolio': architectsportfolio, // NEW
  'diagonal-accent-bar': diagonalaccentbar, // NEW
  'asymmetric-timeline': asymmetrictimeline, // NEW
  'mid-century-resume': midcenturyresume, // NEW
  'bold-header-statement': boldheaderstatement, // NEW
  'typewriter-modern': typewritermodern, // NEW
  'new-york-editorial': newyorkeditorial, // NEW
};
