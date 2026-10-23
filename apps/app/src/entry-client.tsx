import { base } from '@jsonresume/ui';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { matchRoute } from './routes';

const container = document.getElementById('root');
if (!container) throw new Error('#root is missing from index.html');

document.body.classList.add(base);
const app = (
  <StrictMode>
    <App route={matchRoute(window.location.pathname)} />
  </StrictMode>
);

// Built pages are prerendered (scripts/prerender.ts); `vite dev` serves an
// empty shell, so render from scratch there.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
