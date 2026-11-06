'use client';

import { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { visuallyHidden } from '../../../styles/shared.css';
import { cx } from '../../../utils/cx';
import { TreeController } from './controller';
import { drawFrame } from './frame';
import { treeHandle } from './handle';
import { mountTree } from './mount';
import { buildScene } from './scene-build';
import * as s from './tree-map.css';
import type { TreeMapProps } from './types';

/**
 * A whole graph as one map you can pan and zoom, each node above what it
 * rests on, drawn by its own renderer (WebGL2, or Canvas 2D where that is
 * missing). Zooming in shows more: first the shape and its colours, then the
 * names of what holds most up, then every name, then each node's detail.
 * Lines stay quiet until you point at something; then its connections light.
 *
 * Pointer: drag to pan, wheel or pinch to zoom, click to select, double-click
 * to zoom in (or open, when close enough to read). Keyboard: arrows pan, +
 * and - zoom, 0 shows everything, [ and ] step down and up, Enter opens,
 * Escape clears. The camera lives outside React, so a pan never re-renders.
 */
export function TreeMap({
  nodes,
  edges,
  bands,
  bandLabel,
  initialView,
  selected,
  onSelect,
  onOpen,
  focus,
  lit,
  visible,
  onCameraChange,
  label,
  spacing = 28,
  ref,
  className,
}: TreeMapProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLCanvasElement>(null);
  const monoRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  const scene = useMemo(
    () => buildScene(nodes, edges, bands, spacing),
    [nodes, edges, bands, spacing]
  );
  const data = { scene, nodes, edges, bands, spacing };
  const handlers = { onSelect, onOpen, onCameraChange, bandLabel };
  const controller = useRef<TreeController | null>(null);
  if (!controller.current)
    controller.current = new TreeController(data, handlers);
  const t = controller.current;
  t.handlers = handlers;
  t.emphasis = { focus, lit, visible };

  useImperativeHandle(ref, () => treeHandle(t), [t]);

  // Mount once: everything here outlives a render and reads the controller.
  useEffect(() => {
    const box = boxRef.current;
    const gl = glRef.current;
    const back = backRef.current;
    const text = textRef.current;
    if (!box || !gl || !back || !text) return;
    t.status = statusRef.current;
    t.paint = () => drawFrame(t, { back, text });
    return mountTree({ box, gl, mono: monoRef.current }, t, initialView);
    // The initial view is read once; later changes are not a move.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // New data: new geometry, same camera.
  useEffect(() => {
    if (t.data.scene !== scene)
      t.setData({ scene, nodes, edges, bands, spacing });
  }, [t, scene, nodes, edges, bands, spacing]);

  // Selection and emphasis: drawn without a new layout.
  useEffect(() => {
    t.selected = selected;
    t.emphasise();
  }, [t, selected, focus, lit, visible]);

  return (
    <div
      ref={boxRef}
      role="application"
      aria-roledescription="map"
      aria-label={label}
      tabIndex={0}
      className={cx(s.root, className)}
    >
      <canvas ref={backRef} className={s.layer} />
      <canvas ref={glRef} className={s.layer} />
      <canvas ref={textRef} className={s.layer} />
      <span ref={monoRef} aria-hidden="true" className={s.mono} />
      <p ref={statusRef} aria-live="polite" className={visuallyHidden} />
    </div>
  );
}
