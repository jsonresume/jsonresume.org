import type { TreeController } from './controller';
import { fitCamera, zoomAbout } from './scene';

/**
 * Keyboard input: arrows pan (shift for further), + and - zoom, 0 shows
 * everything, [ and ] step down to a foundation and up to what rests on it,
 * Enter opens, Escape clears the selection. Returns the cleanup.
 */
export function attachKeys(box: HTMLElement, t: TreeController) {
  const key = (e: KeyboardEvent) => {
    const camera = t.camera;
    if (!camera || e.metaKey || e.ctrlKey || e.altKey) return;
    const step = (e.shiftKey ? 320 : 80) / camera.k;
    const { scene, nodes } = t.data;
    const zoom = (factor: number) =>
      t.move(
        zoomAbout(
          camera,
          t.viewport,
          t.viewport.width / 2,
          t.viewport.height / 2,
          factor,
          t.limits
        )
      );
    const go = (i: number | undefined) => {
      if (i === undefined) return;
      t.choose(i);
      const node = nodes[i];
      if (node && t.camera) t.fly({ x: node.x, y: node.y, k: t.camera.k });
    };
    // The step that holds the most up.
    const best = (list: readonly number[]) =>
      [...list].sort(
        (a, b) => (nodes[b]?.support ?? 0) - (nodes[a]?.support ?? 0) || a - b
      )[0];
    const selected = t.selected;
    switch (e.key) {
      case 'ArrowLeft':
        t.move({ ...camera, x: camera.x - step });
        break;
      case 'ArrowRight':
        t.move({ ...camera, x: camera.x + step });
        break;
      case 'ArrowUp':
        t.move({ ...camera, y: camera.y - step });
        break;
      case 'ArrowDown':
        t.move({ ...camera, y: camera.y + step });
        break;
      case '+':
      case '=':
        zoom(1.5);
        break;
      case '-':
      case '_':
        zoom(1 / 1.5);
        break;
      case '0':
        t.fly(fitCamera(scene.bounds, t.viewport));
        break;
      case '[':
        if (selected !== null) go(best(scene.below[selected] ?? []));
        break;
      case ']':
        if (selected !== null) go(best(scene.above[selected] ?? []));
        break;
      case 'Enter':
        if (selected !== null) t.handlers.onOpen?.(selected);
        break;
      case 'Escape':
        t.choose(null);
        break;
      default:
        return;
    }
    e.preventDefault();
  };
  box.addEventListener('keydown', key);
  return () => box.removeEventListener('keydown', key);
}
