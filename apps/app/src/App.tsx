import '@jsonresume/ui/fonts.css';
import '@jsonresume/ui/styles.css';
import { SiteLayout } from './components/SiteLayout';
import type { Route } from './routes';

export function App({ route }: { route: Route }) {
  const { Page } = route;
  return (
    <SiteLayout>
      <Page />
    </SiteLayout>
  );
}
