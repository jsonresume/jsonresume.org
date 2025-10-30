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

/**
 * Theme metadata for all available themes
 * This is the single source of truth for theme information
 */
export const THEME_METADATA = {
  'academic-cv-lite': {
    name: 'Academic CV Lite',
    description:
      'Scholarly, data-rich resume with structured lists and serif typography. Simple text hierarchy with no color.',
    author: 'JSON Resume Team',
    tags: ['academic', 'scholarly', 'cv', 'serif', 'print-first'],
  },
  'consultant-polished': {
    name: 'Consultant Polished',
    description:
      'Elegant, structured resume with transitional serif headers and modern sans body. Optimized for narrative-driven roles.',
    author: 'JSON Resume Team',
    tags: ['consulting', 'elegant', 'professional', 'navy'],
  },
  'creative-studio': {
    name: 'Creative Studio',
    description:
      'Artistic yet professional theme with rounded sans-serif typography and soft color accents. Inspired by Behance portfolios.',
    author: 'JSON Resume Team',
    tags: ['creative', 'artistic', 'design', 'coral'],
  },
  'data-driven': {
    name: 'Data-Driven',
    description:
      'Analytical and factual theme with geometric sans-serif typography. Prioritizes metrics and measurable results.',
    author: 'JSON Resume Team',
    tags: ['analytical', 'metrics', 'data', 'blue'],
  },
  'developer-mono': {
    name: 'Developer Mono',
    description:
      'Technical, efficient theme with monospace headers and sans-serif body. Code-style aesthetics without gimmicks.',
    author: 'JSON Resume Team',
    tags: ['technical', 'developer', 'monospace', 'minimalist', 'blue'],
  },
  elegant: {
    name: 'Elegant',
    description: 'Elegant and refined design with sophisticated typography',
    author: 'JSON Resume',
    tags: ['elegant', 'refined', 'classic'],
  },
  even: {
    name: 'Even',
    description: 'Balanced and clean theme with modern styling',
    author: 'JSON Resume',
    tags: ['modern', 'clean', 'balanced'],
  },
  'executive-slate': {
    name: 'Executive Slate',
    description:
      'Authoritative, polished theme with serif headings and modern sans body. Classic print-like layout with elegant type hierarchy.',
    author: 'JSON Resume Team',
    tags: ['executive', 'professional', 'senior', 'slate', 'premium'],
  },
  flat: {
    name: 'Flat',
    description: 'Flat design with minimalist aesthetic',
    author: 'JSON Resume',
    tags: ['flat', 'minimalist', 'modern'],
  },
  'government-standard': {
    name: 'Government Standard',
    description:
      'Formal, structured resume with serif typography and grayscale design. Perfect for civil service, defense, or government contracts.',
    author: 'JSON Resume Team',
    tags: ['government', 'formal', 'structured', 'grayscale', 'official'],
  },
  jacrys: {
    name: 'Jacrys',
    description: 'Modern professional theme',
    author: 'Community',
    tags: ['modern', 'professional'],
  },
  kendall: {
    name: 'Kendall',
    description: 'Clean and readable resume theme',
    author: 'Community',
    tags: ['clean', 'readable'],
  },
  lucide: {
    name: 'Lucide',
    description: 'Light and elegant design',
    author: 'Community',
    tags: ['light', 'elegant'],
  },
  macchiato: {
    name: 'Macchiato',
    description: 'Warm, coffee-inspired design',
    author: 'Community',
    tags: ['warm', 'coffee', 'cozy'],
  },
  'marketing-narrative': {
    name: 'Marketing Narrative',
    description:
      'Creative, persuasive theme with rounded humanist sans-serif. Flows like an article with narrative emphasis over bullet structure.',
    author: 'JSON Resume Team',
    tags: ['marketing', 'creative', 'storytelling', 'narrative', 'rose'],
  },
  'minimalist-grid': {
    name: 'Minimalist Grid',
    description:
      'Clean, contemporary theme with geometric design aligned to a consistent baseline grid. Light-weight sans-serif with ample letter spacing.',
    author: 'JSON Resume Team',
    tags: ['minimalist', 'grid', 'geometric', 'clean', 'charcoal'],
  },
  minyma: {
    name: 'Minyma',
    description: 'Minimal and compact design',
    author: 'Community',
    tags: ['minimal', 'compact'],
  },
  'modern-classic': {
    name: 'Modern Classic',
    description:
      'Professional, timeless resume with humanist sans-serif typography. Print-optimized with perfect balance between aesthetics and ATS compliance.',
    author: 'JSON Resume Team',
    tags: ['professional', 'timeless', 'modern', 'classic', 'blue'],
  },
  'operations-precision': {
    name: 'Operations Precision',
    description:
      'Efficient, dependable theme with compact sans-serif typography. Highlights toolsets and process improvements.',
    author: 'JSON Resume Team',
    tags: ['operations', 'precision', 'efficient', 'systems', 'teal'],
  },
  'paper-plus-plus': {
    name: 'Paper Plus Plus',
    description: 'Enhanced paper-style design',
    author: 'Community',
    tags: ['paper', 'enhanced', 'print-style'],
  },
  'product-manager-canvas': {
    name: 'Product Manager Canvas',
    description:
      'Analytical yet creative theme with neutral sans-serif typography. Prioritizes brevity and measurable impact.',
    author: 'JSON Resume Team',
    tags: ['product', 'manager', 'analytical', 'metrics', 'indigo'],
  },
  professional: {
    name: 'Professional',
    description: 'Clean professional theme with serif typography',
    author: 'JSON Resume',
    tags: ['professional', 'serif', 'classic'],
  },
  pumpkin: {
    name: 'Pumpkin',
    description: 'Warm and friendly design',
    author: 'Community',
    tags: ['warm', 'friendly', 'orange'],
  },
  reference: {
    name: 'Reference',
    description:
      'Clean and professional reference theme showcasing all JSON Resume features',
    author: 'JSON Resume Team',
    tags: ['professional', 'clean', 'reference', 'complete'],
  },
  rickosborne: {
    name: 'Rickosborne',
    description: 'Custom professional layout',
    author: 'Community',
    tags: ['professional', 'custom'],
  },
  'sales-hunter': {
    name: 'Sales Hunter',
    description:
      'Energetic, confident theme with bold sans-serif typography. Emphasizes quotas, wins, and measurable success.',
    author: 'JSON Resume Team',
    tags: ['sales', 'energetic', 'achievement', 'performance', 'green'],
  },
  sidebar: {
    name: 'Sidebar',
    description:
      'Two-column layout with dark blue sidebar and professional appearance',
    author: 'JSON Resume Team',
    tags: ['professional', 'two-column', 'sidebar', 'modern'],
  },
  stackoverflow: {
    name: 'Stack Overflow',
    description: 'Developer-focused theme inspired by Stack Overflow',
    author: 'JSON Resume',
    tags: ['developer', 'stackoverflow', 'technical'],
  },
  'tan-responsive': {
    name: 'Tan Responsive',
    description: 'Responsive design with warm tones',
    author: 'Community',
    tags: ['responsive', 'warm', 'tan'],
  },
  'tokyo-modernist': {
    name: 'Tokyo Modernist',
    description:
      'Minimal futurism with geometric precision, built on 8pt grid with variable-width typography and deep magenta accents.',
    author: 'JSON Resume Team',
    tags: [
      'modern',
      'futuristic',
      'geometric',
      'minimalist',
      'tokyo',
      'magenta',
    ],
  },
  'university-first': {
    name: 'University First',
    description:
      'Fresh, optimistic theme with education-first layout. Friendly sans-serif with large headings and generous spacing.',
    author: 'JSON Resume Team',
    tags: ['student', 'graduate', 'university', 'education', 'fresh', 'blue'],
  },
  'writers-portfolio': {
    name: "Writer's Portfolio",
    description:
      'Literary, elegant theme with transitional serif typography. Reads like prose with larger body font for readability.',
    author: 'JSON Resume Team',
    tags: ['writer', 'literary', 'elegant', 'minimal', 'serif'],
  },
};

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

// List of available theme names (derived from THEME_METADATA)
export const THEME_NAMES = Object.keys(THEME_METADATA);

/**
 * Get a random theme name from available themes
 * @returns {string} Random theme name
 */
export function getRandomTheme() {
  const randomIndex = Math.floor(Math.random() * THEME_NAMES.length);
  return THEME_NAMES[randomIndex];
}
