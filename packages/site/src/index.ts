// The site shell, needed on every page. Page templates are separate entry
// points (@repo/site/home, /doc, /blog, /projects, /team, /themes) so each
// route's code loads only on that route.
export { formatDate } from './format';
export { pageHead, type PageHeadInput } from './head';
export {
  external,
  footerNav,
  headerNav,
  paths,
  siteUrl,
  themeImageUrl,
  resumeUrl,
  themePreviewUrl,
  type NavItem,
} from './links';
export { NotFoundPage } from './pages/NotFoundPage';
export { authHintScript } from './HeaderAuth';
export { SiteLayout } from './SiteLayout';
export { isSitePath, SiteLink } from './SiteLink';
