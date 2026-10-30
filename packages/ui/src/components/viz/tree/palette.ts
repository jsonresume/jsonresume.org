import { vars } from '../../../tokens/contract.css';
import type { Rgb, TreePalette } from './render-types';

/** `var(--jr-color-text-default)` to `--jr-color-text-default`. */
const property = (reference: string) =>
  reference.replace(/^var\((--[^,)]+).*$/, '$1');

const TOKENS: Record<keyof TreePalette, string> = {
  bg: property(vars.color.surface.page),
  ink: property(vars.color.text.default),
  muted: property(vars.color.text.muted),
  border: property(vars.color.border.strong),
  success: property(vars.color.status.success),
  danger: property(vars.color.status.danger),
  warning: property(vars.color.status.warning),
};

/**
 * Reads the colour tokens as the element sees them, so the tree follows the
 * theme (light, dark, or the system's) wherever it is placed.
 */
export function readPalette(element: Element): TreePalette {
  const style = getComputedStyle(element);
  const probe = document.createElement('canvas').getContext('2d');
  const parse = (value: string): Rgb => {
    if (!probe) return [0.5, 0.5, 0.5];
    probe.fillStyle = '#000';
    probe.fillStyle = value.trim() || '#000';
    const css = String(probe.fillStyle);
    if (css.startsWith('#')) {
      const channel = (i: number) =>
        Number.parseInt(css.slice(i, i + 2), 16) / 255;
      return [channel(1), channel(3), channel(5)];
    }
    const parts = css.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
    return [
      (parts[0] ?? 0) / 255,
      (parts[1] ?? 0) / 255,
      (parts[2] ?? 0) / 255,
    ];
  };
  const read = (key: keyof TreePalette) =>
    parse(style.getPropertyValue(TOKENS[key]));
  return {
    bg: read('bg'),
    ink: read('ink'),
    muted: read('muted'),
    border: read('border'),
    success: read('success'),
    danger: read('danger'),
    warning: read('warning'),
  };
}
