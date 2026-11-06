import { CanvasRenderer } from './render-canvas';
import { GlRenderer } from './render-gl';
import type { TreeRenderer } from './render-types';

/** WebGL2 if the browser has it, else Canvas 2D; never throws. */
export function createTreeRenderer(canvas: HTMLCanvasElement): TreeRenderer {
  try {
    return new GlRenderer(canvas);
  } catch {
    return new CanvasRenderer(canvas);
  }
}
