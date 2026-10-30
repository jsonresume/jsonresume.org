import type { TreeController } from './controller';
import { fitCamera, zoomAbout } from './scene';
import type { TreeMapHandle } from './types';

/** What a TreeMap's ref can do: fly to a node or a set of them, fit, zoom. */
export function treeHandle(t: TreeController): TreeMapHandle {
  return {
    flyTo(index) {
      const node = t.data.nodes[index];
      if (!node || !t.camera) return;
      const reading = Math.min(t.limits.max, 110 / t.data.spacing);
      t.fly({ x: node.x, y: node.y, k: Math.max(t.camera.k, reading) });
    },
    fit() {
      t.fly(fitCamera(t.data.scene.bounds, t.viewport));
    },
    zoomBy(factor) {
      if (!t.camera) return;
      const { width, height } = t.viewport;
      t.move(
        zoomAbout(t.camera, t.viewport, width / 2, height / 2, factor, t.limits)
      );
    },
    fitTo(indices) {
      let left = Number.POSITIVE_INFINITY;
      let right = Number.NEGATIVE_INFINITY;
      let top = Number.POSITIVE_INFINITY;
      let bottom = Number.NEGATIVE_INFINITY;
      for (const i of indices) {
        const node = t.data.nodes[i];
        if (!node) continue;
        left = Math.min(left, node.x);
        right = Math.max(right, node.x);
        top = Math.min(top, node.y);
        bottom = Math.max(bottom, node.y);
      }
      if (!Number.isFinite(left) || !t.viewport.width) return;
      // Room for the names under the squares, and never closer than reading distance.
      const pad = t.data.spacing * 2;
      t.fly(
        fitCamera(
          {
            left: left - pad,
            right: right + pad,
            top: top - pad,
            bottom: bottom + pad * 1.5,
          },
          t.viewport,
          32,
          Math.min(t.limits.max, 130 / t.data.spacing)
        )
      );
    },
    camera: () => t.camera,
  };
}
