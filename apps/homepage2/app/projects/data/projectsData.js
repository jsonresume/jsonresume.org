import { projects as integrations } from './projects/integrations';
import { projects as development } from './projects/development';
import { projects as tools } from './projects/tools';
import { projects as utilities } from './projects/utilities';

export const PROJECTS = [
  ...integrations,
  ...development,
  ...tools,
  ...utilities,
];

export const CATEGORIES = [
  'integration',
  'framework',
  'validator',
  'hosting',
  'ai',
  'transfer',
  'github',
  'editor',
  'cli',
  'visualization',
  'generator',
  'parser',
  'ats',
];
