import * as helpers from './helpers.js';
import Handlebars from 'handlebars/runtime.js';
import './partials.cjs';
import './templates.cjs';
import css from './style.js';

export const render = async (resume) => {
  return Handlebars.templates['resume'](
    {
      css: css,
      resume: resume,
    },
    { helpers }
  );
};
