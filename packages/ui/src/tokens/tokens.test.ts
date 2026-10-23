import { describe, expect, it } from 'vitest';
import { darkColor, lightColor, type ColorTokens } from './theme';

function luminance(hex: string): number {
  const channels = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255
  );
  const [r, g, b] = channels.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number
  ];
  return (hi + 0.05) / (lo + 0.05);
}

// Every text/surface pairing the components use, at WCAG AA for body text.
const pairs = (c: ColorTokens): Array<[string, string, string]> => [
  ['text.default on page', c.text.default, c.surface.page],
  ['text.default on subtle', c.text.default, c.surface.subtle],
  ['text.muted on page', c.text.muted, c.surface.page],
  ['text.muted on subtle', c.text.muted, c.surface.subtle],
  ['text.muted on muted', c.text.muted, c.surface.muted],
  ['text.onBrand on brand', c.text.onBrand, c.surface.brand],
  ['text.link on page', c.text.link, c.surface.page],
  ['text.link on subtle', c.text.link, c.surface.subtle],
  ['primaryText on primary', c.action.primaryText, c.action.primary],
  ['primaryText on primaryHover', c.action.primaryText, c.action.primaryHover],
  ['inkText on ink', c.action.inkText, c.action.ink],
  ['neutralText on neutral', c.action.neutralText, c.action.neutral],
  ['info on infoSurface', c.status.info, c.status.infoSurface],
  ['success on successSurface', c.status.success, c.status.successSurface],
  ['warning on warningSurface', c.status.warning, c.status.warningSurface],
  ['danger on dangerSurface', c.status.danger, c.status.dangerSurface],
  ['danger on page', c.status.danger, c.surface.page],
];

describe.each([
  ['light', lightColor],
  ['dark', darkColor],
])('%s color tokens', (_name, colors) => {
  it.each(pairs(colors))('%s meets 4.5:1', (_label, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('focus ring is visible against the page (3:1)', () => {
    expect(contrast(colors.focus, colors.surface.page)).toBeGreaterThanOrEqual(
      3
    );
  });
});

describe('ink-on-yellow context (onBrandVars)', () => {
  it.each(['#1a1a1a', '#5c5c5c', '#a92525', '#8a1d1d'])(
    '%s on brand yellow meets 4.5:1',
    (fg) => {
      expect(contrast(fg, lightColor.surface.brand)).toBeGreaterThanOrEqual(
        4.5
      );
    }
  );
});
