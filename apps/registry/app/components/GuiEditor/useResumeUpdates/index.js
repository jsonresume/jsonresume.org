import { createBasicsUpdaters } from './basicsUpdaters';
import { createWorkUpdaters } from './workUpdaters';
import { createHighlightUpdaters } from './highlightUpdaters';
import { createProfileUpdaters } from './profileUpdaters';
import { createArrayUpdaters } from './arrayUpdaters';

export const useResumeUpdates = (resume, onChange) => {
  const basicsUpdaters = createBasicsUpdaters(resume, onChange);
  const workUpdaters = createWorkUpdaters(resume, onChange);
  const highlightUpdaters = createHighlightUpdaters(resume, onChange);
  const profileUpdaters = createProfileUpdaters(resume, onChange);
  const arrayUpdaters = createArrayUpdaters(resume, onChange);

  return {
    ...basicsUpdaters,
    ...workUpdaters,
    ...highlightUpdaters,
    ...profileUpdaters,
    ...arrayUpdaters,
  };
};
