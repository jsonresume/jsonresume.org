import { globalStyle } from '@vanilla-extract/css';
import { classes as c } from './base.css.js';
import { tokens as t } from './tokens.css.js';

for (const layout of ['right', 'achievement', 'timeline']) {
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.body}`, {
    gridTemplateColumns: 'minmax(0, 1fr) minmax(180px, 0.34fr)',
  });
}
for (const layout of ['left', 'deedy']) {
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.body}`, {
    gridTemplateColumns: 'minmax(180px, 0.33fr) minmax(0, 1fr)',
  });
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.secondary}`, {
    gridColumn: 1,
    gridRow: 1,
  });
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.primary}`, {
    gridColumn: 2,
    gridRow: 1,
  });
}

globalStyle(`.${c.page}[data-layout="left"]`, {
  padding: 0,
  display: 'grid',
  gridTemplateColumns: 'minmax(250px, .42fr) minmax(0, 1fr)',
  gridTemplateRows: 'max-content 1fr',
  columnGap: '34px',
});
globalStyle(`.${c.page}[data-layout="left"] .${c.masthead}`, {
  gridColumn: 1,
  gridRow: 1,
  background: t.color.sidebar,
  color: t.color.sidebarInk,
  margin: 0,
  padding: '38px 26px 24px',
});
globalStyle(`.${c.page}[data-layout="left"] .${c.body}`, {
  display: 'contents',
});
globalStyle(`.${c.page}[data-layout="left"] .${c.primary}`, {
  gridColumn: 2,
  gridRow: '1 / span 2',
  padding: '38px 34px 38px 0',
});
globalStyle(`.${c.page}[data-layout="left"] .${c.secondary}`, {
  gridColumn: 1,
  gridRow: 2,
  background: t.color.sidebar,
  color: t.color.sidebarInk,
  padding: '0 26px 38px',
  alignSelf: 'stretch',
});
globalStyle(`.${c.page}[data-layout="left"] .${c.name}`, {
  fontSize: '33px',
  letterSpacing: '-0.015em',
});
globalStyle(`.${c.page}[data-layout="left"] .${c.contact}`, {
  display: 'grid',
  fontSize: '14px',
});
for (const part of [
  `.${c.label}`,
  `.${c.contact}`,
  `.${c.secondary} .${c.sectionTitle}`,
  `.${c.secondary} .${c.context}`,
  `.${c.secondary} .${c.details}`,
  `.${c.secondary} .${c.date}`,
]) {
  globalStyle(`.${c.page}[data-layout="left"] ${part}`, { color: 'inherit' });
}

globalStyle(`.${c.page}[data-layout="timeline"] .${c.primary} .${c.entry}`, {
  position: 'relative',
  paddingInlineStart: '23px',
  borderInlineStart: `1px solid ${t.color.rule}`,
});
globalStyle(
  `.${c.page}[data-layout="timeline"] .${c.primary} .${c.entry}::before`,
  {
    content: '""',
    position: 'absolute',
    insetInlineStart: '-4px',
    top: '6px',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: t.color.accent,
  }
);
for (const layout of ['academic', 'european']) {
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.entry}`, {
    display: 'grid',
    gridTemplateColumns: '115px minmax(0, 1fr)',
    columnGap: '22px',
  });
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.entryHead}`, {
    display: 'contents',
  });
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.entryTitle}`, {
    gridColumn: 2,
  });
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.date}`, {
    gridColumn: 1,
    gridRow: 1,
  });
  for (const part of [c.context, c.paragraph, c.bullets, c.details]) {
    globalStyle(`.${c.page}[data-layout="${layout}"] .${part}`, {
      gridColumn: 2,
    });
  }
}

globalStyle(`.${c.page}[data-layout="single"] .${c.body}`, {
  display: 'block',
});
globalStyle(`.${c.page}[data-layout="single"] .${c.secondary}`, {
  marginTop: t.space.section,
});
globalStyle(`.${c.page}[data-layout="single"] .${c.secondary}:empty`, {
  display: 'none',
});
globalStyle(`.${c.page}[data-layout="right"] .${c.secondary}:empty`, {
  display: 'none',
});

for (const layout of [
  'right',
  'left',
  'deedy',
  'achievement',
  'timeline',
  'academic',
  'european',
]) {
  globalStyle(`.${c.page}[data-layout="${layout}"]`, {
    '@media': {
      'screen and (max-width: 640px)': {
        display: 'block',
        padding: '28px 22px',
      },
    },
  });
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.body}`, {
    '@media': { 'screen and (max-width: 640px)': { display: 'block' } },
  });
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.secondary}`, {
    '@media': {
      'screen and (max-width: 640px)': {
        marginTop: '30px',
        padding: 0,
        background: 'transparent',
        color: t.color.ink,
      },
    },
  });
  globalStyle(`.${c.page}[data-layout="${layout}"] .${c.entry}`, {
    '@media': { 'screen and (max-width: 640px)': { display: 'block' } },
  });
}
globalStyle(`.${c.page}[data-layout="left"] .${c.masthead}`, {
  '@media': {
    'screen and (max-width: 640px)': {
      margin: '-28px -22px 28px',
      padding: '28px 22px',
    },
  },
});
globalStyle(`.${c.page}[data-layout="left"] .${c.primary}`, {
  '@media': { 'screen and (max-width: 640px)': { padding: 0 } },
});
