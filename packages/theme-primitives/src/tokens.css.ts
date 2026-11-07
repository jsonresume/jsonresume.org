import { createTheme, createThemeContract } from '@vanilla-extract/css';

export const tokens = createThemeContract({
  color: {
    ink: null,
    muted: null,
    accent: null,
    rule: null,
    soft: null,
    sidebar: null,
    sidebarInk: null,
  },
  font: { body: null, display: null },
  space: { section: null, entry: null, gutter: null },
  type: { size: null, leading: null, name: null, heading: null },
  width: null,
});

export const defaults = {
  color: {
    ink: '#20242a',
    muted: '#505862',
    accent: '#234f70',
    rule: '#ccd2d8',
    soft: '#f2f5f7',
    sidebar: '#183e4c',
    sidebarInk: '#ffffff',
  },
  font: { body: 'Arial, sans-serif', display: 'Arial, sans-serif' },
  space: { section: '30px', entry: '19px', gutter: '48px' },
  type: { size: '16px', leading: '1.55', name: '42px', heading: '18px' },
  width: '920px',
};

export const defaultDesign = createTheme(tokens, defaults);
