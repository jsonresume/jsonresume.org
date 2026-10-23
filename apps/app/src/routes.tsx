import type { ComponentType } from 'react';
import { HomePage } from './pages/home/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export interface Route {
  path: string;
  title: string;
  description: string;
  Page: ComponentType;
}

export const routes: Route[] = [
  {
    path: '/',
    title: 'JSON Resume: the open standard for resumes',
    description:
      'Write your resume once in JSON and publish it anywhere: 67 open-source themes, a CLI, and free hosting from a GitHub gist.',
    Page: HomePage,
  },
];

export const notFound: Route = {
  path: '/404',
  title: 'Page not found · JSON Resume',
  description: 'This page does not exist.',
  Page: NotFoundPage,
};

export function matchRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  return routes.find((route) => route.path === path) ?? notFound;
}
