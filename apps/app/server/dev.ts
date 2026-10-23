/** Live pages for `pnpm dev` (see scripts/dev.ts): resumes, with profiles in memory. */
import { ProfileStore } from '@repo/profiles';
import { render } from '../src/entry-server';
import { createResumeHandler, liveProfiles } from './resumes';

const resumes = createResumeHandler(render, liveProfiles(ProfileStore.memory));

export const handle = (request: Request) =>
  /^\/@[^/]+$/.test(new URL(request.url).pathname)
    ? resumes.fetch(request)
    : Promise.resolve(undefined);
