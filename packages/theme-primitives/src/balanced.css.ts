import { globalStyle } from '@vanilla-extract/css';
import { classes as c } from './base.css.js';

globalStyle(`.${c.page}[data-layout="balanced"] .${c.body}`, {
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, .8fr)',
  '@media': { 'screen and (max-width: 640px)': { display: 'block' } },
});
globalStyle(`.${c.page}[data-layout="balanced"] .${c.secondary}`, {
  '@media': { 'screen and (max-width: 640px)': { marginTop: '30px' } },
});
