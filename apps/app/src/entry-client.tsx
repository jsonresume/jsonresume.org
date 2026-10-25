import '@jsonresume/ui/fonts.css';
import '@jsonresume/ui/styles.css';
import { hydrateRouter } from '@repo/ssg/browser';
import { createAppRouter } from './router';

hydrateRouter(createAppRouter());
