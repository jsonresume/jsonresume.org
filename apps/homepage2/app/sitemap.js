const BASE = 'https://jsonresume.org';

const ROUTES = [
  '/',
  '/getting-started/',
  '/schema/',
  '/themes/',
  '/cli/',
  '/projects/',
  '/team/',
  '/ai/',
  '/media/',
  '/theme-development/',
  '/job-description-schema/',
  '/docs',
];

export default function sitemap() {
  return ROUTES.map((route) => ({ url: `${BASE}${route}` }));
}
