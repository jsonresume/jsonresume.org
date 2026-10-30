import type { TreeController } from './controller';
import { zoomAbout } from './scene';

interface Point {
  x: number;
  y: number;
}

/**
 * Pointer input: one finger or a mouse pans, two fingers pinch, the wheel
 * zooms about the pointer, a click without movement selects, a double-click
 * opens (when zoomed in to read) or zooms in. Returns the cleanup.
 */
export function attachPointer(box: HTMLElement, t: TreeController) {
  const pointers = new Map<number, Point>();
  let dragged = false;
  let start: Point = { x: 0, y: 0 };
  let pinch = 0;
  const local = (e: MouseEvent): Point => {
    const rect = box.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const setHover = (i: number) => {
    if (i === t.hovered) return;
    t.hovered = i;
    if (i >= 0) box.dataset.pointing = '';
    else delete box.dataset.pointing;
    t.emphasise();
  };
  const down = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    box.setPointerCapture?.(e.pointerId);
    const p = local(e);
    pointers.set(e.pointerId, p);
    if (pointers.size === 1) {
      dragged = false;
      start = p;
    }
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      if (a && b) pinch = Math.hypot(a.x - b.x, a.y - b.y);
      dragged = true;
    }
  };
  const pinchMove = (
    id: number,
    p: Point,
    prev: Point,
    camera: NonNullable<TreeController['camera']>
  ) => {
    const other = [...pointers.entries()].find(([k]) => k !== id)?.[1];
    pointers.set(id, p);
    if (!other) return;
    const distance = Math.hypot(p.x - other.x, p.y - other.y);
    const mid = { x: (p.x + other.x) / 2, y: (p.y + other.y) / 2 };
    const prevMid = { x: (prev.x + other.x) / 2, y: (prev.y + other.y) / 2 };
    const next = zoomAbout(
      camera,
      t.viewport,
      mid.x,
      mid.y,
      pinch ? distance / pinch : 1,
      t.limits
    );
    pinch = distance;
    t.move({
      ...next,
      x: next.x - (mid.x - prevMid.x) / next.k,
      y: next.y - (mid.y - prevMid.y) / next.k,
    });
  };
  const move = (e: PointerEvent) => {
    const p = local(e);
    const prev = pointers.get(e.pointerId);
    if (!prev) {
      if (e.pointerType === 'mouse') setHover(t.hit(p.x, p.y));
      return;
    }
    const camera = t.camera;
    if (!camera) return;
    if (pointers.size === 2) return pinchMove(e.pointerId, p, prev, camera);
    pointers.set(e.pointerId, p);
    if (!dragged && Math.hypot(p.x - start.x, p.y - start.y) > 4) {
      dragged = true;
      setHover(-1);
    }
    if (dragged)
      t.move({
        ...camera,
        x: camera.x - (p.x - prev.x) / camera.k,
        y: camera.y - (p.y - prev.y) / camera.k,
      });
  };
  const up = (e: PointerEvent) => {
    const had = pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = 0;
    if (!had || dragged || pointers.size) return;
    const p = local(e);
    const i = t.hit(p.x, p.y);
    t.choose(i >= 0 ? i : null);
  };
  const cancel = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    pinch = 0;
  };
  const leave = () => setHover(-1);
  const wheel = (e: WheelEvent) => {
    if (!t.camera) return;
    e.preventDefault();
    const unit =
      e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? t.viewport.height : 1;
    const gain = e.ctrlKey ? 0.01 : 0.0022;
    const p = local(e);
    t.move(
      zoomAbout(
        t.camera,
        t.viewport,
        p.x,
        p.y,
        Math.exp(-e.deltaY * unit * gain),
        t.limits
      )
    );
  };
  const dbl = (e: MouseEvent) => {
    if (!t.camera) return;
    const p = local(e);
    const i = t.hit(p.x, p.y);
    if (i >= 0 && t.handlers.onOpen && t.camera.k * t.data.spacing >= 60) {
      t.handlers.onOpen(i);
      return;
    }
    t.fly(zoomAbout(t.camera, t.viewport, p.x, p.y, 2, t.limits));
  };
  box.addEventListener('pointerdown', down);
  box.addEventListener('pointermove', move);
  box.addEventListener('pointerup', up);
  box.addEventListener('pointercancel', cancel);
  box.addEventListener('pointerleave', leave);
  box.addEventListener('wheel', wheel, { passive: false });
  box.addEventListener('dblclick', dbl);
  return () => {
    box.removeEventListener('pointerdown', down);
    box.removeEventListener('pointermove', move);
    box.removeEventListener('pointerup', up);
    box.removeEventListener('pointercancel', cancel);
    box.removeEventListener('pointerleave', leave);
    box.removeEventListener('wheel', wheel);
    box.removeEventListener('dblclick', dbl);
  };
}
