/*
 * The camera arithmetic behind TreeMap, kept pure so it can be tested without
 * a screen: where the viewport looks and how far in, zooming about a point,
 * and a fly-to path that zooms out and back in rather than sliding across.
 */

/** The world point at the viewport's centre, and screen pixels per world unit. */
export interface TreeCamera {
  x: number;
  y: number;
  k: number;
}

export interface TreeViewport {
  width: number;
  height: number;
}

export interface TreeBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ZoomLimits {
  min: number;
  max: number;
}

export function toScreen(
  c: TreeCamera,
  v: TreeViewport,
  wx: number,
  wy: number
): [number, number] {
  return [(wx - c.x) * c.k + v.width / 2, (wy - c.y) * c.k + v.height / 2];
}

export function toWorld(
  c: TreeCamera,
  v: TreeViewport,
  sx: number,
  sy: number
): [number, number] {
  return [(sx - v.width / 2) / c.k + c.x, (sy - v.height / 2) / c.k + c.y];
}

/** The camera that shows all of `b`, with `padding` screen pixels around it. */
export function fitCamera(
  b: TreeBounds,
  v: TreeViewport,
  padding = 32,
  max = 4
): TreeCamera {
  const w = Math.max(b.right - b.left, 1);
  const h = Math.max(b.bottom - b.top, 1);
  const k = Math.min(
    (v.width - 2 * padding) / w,
    (v.height - 2 * padding) / h,
    max
  );
  return {
    x: (b.left + b.right) / 2,
    y: (b.top + b.bottom) / 2,
    k: Math.max(k, 1e-3),
  };
}

/** From half the whole picture to close enough that one square fills a thumb. */
export function zoomLimits(
  b: TreeBounds,
  v: TreeViewport,
  closest = 5
): ZoomLimits {
  const fit = fitCamera(b, v, 32, Number.POSITIVE_INFINITY).k;
  return { min: Math.min(fit / 2, closest), max: Math.max(closest, fit) };
}

/** Keeps zoom within limits and at least part of the picture on screen. */
export function clampCamera(
  c: TreeCamera,
  b: TreeBounds,
  v: TreeViewport,
  limits: ZoomLimits
): TreeCamera {
  const k = Math.min(Math.max(c.k, limits.min), limits.max);
  // The centre may wander past the edge by up to half a screen, never further.
  const slackX = v.width / 2 / k;
  const slackY = v.height / 2 / k;
  const x = Math.min(Math.max(c.x, b.left - slackX / 2), b.right + slackX / 2);
  const y = Math.min(Math.max(c.y, b.top - slackY / 2), b.bottom + slackY / 2);
  return { x, y, k };
}

/** Zooms by `factor` keeping the world point under screen point (sx, sy) where it is. */
export function zoomAbout(
  c: TreeCamera,
  v: TreeViewport,
  sx: number,
  sy: number,
  factor: number,
  limits: ZoomLimits
): TreeCamera {
  const k = Math.min(Math.max(c.k * factor, limits.min), limits.max);
  const [wx, wy] = toWorld(c, v, sx, sy);
  return { x: wx - (sx - v.width / 2) / k, y: wy - (sy - v.height / 2) / k, k };
}

const clampDuration = (s: number) => Math.min(900, Math.max(250, s * 220));
const cosh = (x: number) => (Math.exp(x) + Math.exp(-x)) / 2;
const tanh = (x: number) => {
  const e = Math.exp(2 * x);
  return (e - 1) / (e + 1);
};

/**
 * A fly-to path that zooms out as it travels and back in on arrival (van Wijk
 * and Nuij, "Smooth and efficient zooming and panning", 2003), so a long jump
 * keeps the reader oriented. The camera at t in [0, 1], and the path's
 * natural duration in milliseconds.
 */
export function flyPath(
  from: TreeCamera,
  to: TreeCamera,
  v: TreeViewport
): { at: (t: number) => TreeCamera; duration: number } {
  const rho = Math.SQRT2;
  const side = Math.max(v.width, v.height);
  const w0 = side / from.k;
  const w1 = side / to.k;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const d2 = dx * dx + dy * dy;
  const d1 = Math.sqrt(d2);
  if (d1 < 1e-6) {
    const s = Math.log(w1 / w0) / rho;
    return {
      at: (t) => ({
        x: from.x + t * dx,
        y: from.y + t * dy,
        k: from.k * Math.exp(-rho * t * s),
      }),
      duration: clampDuration(Math.abs(s)),
    };
  }
  const b0 = (w1 * w1 - w0 * w0 + rho ** 4 * d2) / (2 * w0 * rho * rho * d1);
  const b1 = (w1 * w1 - w0 * w0 - rho ** 4 * d2) / (2 * w1 * rho * rho * d1);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
  const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const length = (r1 - r0) / rho;
  const coshR0 = cosh(r0);
  return {
    at: (t) => {
      const s = t * length;
      const u =
        (w0 / (rho * rho * d1)) * (coshR0 * tanh(rho * s + r0) - Math.sinh(r0));
      const w = (w0 * coshR0) / cosh(rho * s + r0);
      return { x: from.x + u * dx, y: from.y + u * dy, k: side / w };
    },
    duration: clampDuration(length),
  };
}

/** Starts fast and settles: most of a move happens early, the arrival is gentle. */
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
