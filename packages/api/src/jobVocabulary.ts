import { Schema } from 'effect';

/** What a company works on, as its post says (several can apply). */
export const Sector = Schema.Literals([
  'ai_ml',
  'developer_tools',
  'infrastructure',
  'security',
  'data_analytics',
  'enterprise_saas',
  'fintech',
  'crypto_web3',
  'insurance',
  'adtech_marketing',
  'ecommerce_retail',
  'healthcare',
  'biotech',
  'climate_energy',
  'education',
  'government',
  'defense',
  'gambling',
  'gaming',
  'media_entertainment',
  'consumer_social',
  'hr_recruiting',
  'legal',
  'real_estate',
  'logistics_mobility',
  'hardware_robotics',
  'research_science',
  'nonprofit_civic',
  'travel_hospitality',
  'food_agriculture',
]);
export type Sector = typeof Sector.Type;

/** How far along a company is, from its post. */
export const CompanyStage = Schema.Literals([
  'seed',
  'early',
  'growth',
  'public',
  'bootstrapped',
  'nonprofit',
  'government',
  'agency',
  'unspecified',
]);
export type CompanyStage = typeof CompanyStage.Type;

/** Where someone will work. */
export const Workplace = Schema.Literals([
  'remote_global',
  'remote_region',
  'hybrid',
  'onsite',
]);
export type Workplace = typeof Workplace.Type;

/** What matters most to them, most important first. */
export const Priority = Schema.Literals([
  'pay',
  'mission',
  'stack',
  'flexibility',
  'growth',
  'stability',
]);
export type Priority = typeof Priority.Type;

/** Each sector as people say it. */
export const sectorLabels: Record<Sector, string> = {
  ai_ml: 'AI and machine learning',
  developer_tools: 'Developer tools',
  infrastructure: 'Cloud and infrastructure',
  security: 'Security',
  data_analytics: 'Data and analytics',
  enterprise_saas: 'Business software',
  fintech: 'Fintech',
  crypto_web3: 'Crypto and web3',
  insurance: 'Insurance',
  adtech_marketing: 'Adtech and marketing',
  ecommerce_retail: 'E-commerce and retail',
  healthcare: 'Healthcare',
  biotech: 'Biotech',
  climate_energy: 'Climate and energy',
  education: 'Education',
  government: 'Government',
  defense: 'Defense',
  gambling: 'Gambling',
  gaming: 'Games',
  media_entertainment: 'Media and entertainment',
  consumer_social: 'Consumer and social',
  hr_recruiting: 'HR and recruiting',
  legal: 'Legal',
  real_estate: 'Real estate',
  logistics_mobility: 'Logistics and mobility',
  hardware_robotics: 'Hardware and robotics',
  research_science: 'Research and science',
  nonprofit_civic: 'Nonprofit and civic',
  travel_hospitality: 'Travel and hospitality',
  food_agriculture: 'Food and agriculture',
};

export const stageLabels: Record<CompanyStage, string> = {
  seed: 'Seed',
  early: 'Early (Series A–B)',
  growth: 'Growth (Series C+)',
  public: 'Public company',
  bootstrapped: 'Bootstrapped',
  nonprofit: 'Nonprofit',
  government: 'Government',
  agency: 'Agency or consultancy',
  unspecified: '',
};

export const workplaceLabels: Record<Workplace, string> = {
  remote_global: 'Remote, anywhere',
  remote_region: 'Remote in my region',
  hybrid: 'Hybrid',
  onsite: 'In an office',
};

export const priorityLabels: Record<Priority, string> = {
  pay: 'Pay',
  mission: 'What they work on',
  stack: 'The tech',
  flexibility: 'Flexibility',
  growth: 'Room to grow',
  stability: 'Stability',
};
