import css from '!!raw-loader!./style.css';
import tpl from './resume.hbs';

export const render = (resume) =>
  tpl({
    css: css,
    resume: resume,
  });
