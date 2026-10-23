'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Kbd } from '../typography/typography';
import { Dialog, DialogContent, DialogTitle } from '../interactive/interactive';
import * as s from './workspace.css';

const isMac = () =>
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad/.test(navigator.platform);

/** "mod+k" → ["⌘", "K"] on Mac, ["Ctrl", "K"] elsewhere. */
export function formatShortcut(combo: string): string[] {
  return combo.split('+').map((part) => {
    const p = part.trim().toLowerCase();
    if (p === 'mod') return isMac() ? '⌘' : 'Ctrl';
    if (p === 'shift') return isMac() ? '⇧' : 'Shift';
    if (p === 'alt') return isMac() ? '⌥' : 'Alt';
    if (p === 'escape') return 'Esc';
    if (p.startsWith('arrow'))
      return (
        { arrowup: '↑', arrowdown: '↓', arrowleft: '←', arrowright: '→' }[p] ??
        p
      );
    return p.length === 1 ? p.toUpperCase() : p[0]!.toUpperCase() + p.slice(1);
  });
}

function matches(event: KeyboardEvent, combo: string) {
  const parts = combo
    .toLowerCase()
    .split('+')
    .map((p) => p.trim());
  const key = parts[parts.length - 1];
  const mod = parts.includes('mod');
  const wantMeta = mod ? isMac() : parts.includes('meta');
  const wantCtrl = mod ? !isMac() : parts.includes('ctrl');
  return (
    event.key.toLowerCase() === key &&
    event.metaKey === wantMeta &&
    event.ctrlKey === wantCtrl &&
    event.altKey === parts.includes('alt') &&
    (key === '?' || event.shiftKey === parts.includes('shift'))
  );
}

const typing = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    /^(input|textarea|select)$/i.test(target.tagName));

/**
 * Runs `handler` when the shortcut is pressed (e.g. "mod+k", "?", "j").
 * Ignored while typing in a field unless the combo uses mod.
 */
export function useShortcut(
  combo: string,
  handler: (e: KeyboardEvent) => void,
  { enabled = true } = {}
) {
  const saved = useRef(handler);
  saved.current = handler;
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (!matches(e, combo)) return;
      if (typing(e.target) && !combo.includes('mod')) return;
      e.preventDefault();
      saved.current(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [combo, enabled]);
}

export interface ShortcutGroup {
  title: string;
  shortcuts: Array<{ keys: string; description: ReactNode }>;
}

export interface ShortcutHelpProps {
  groups: ShortcutGroup[];
  /** Key that opens the help; "?" by default. */
  trigger?: string;
  title?: string;
}

/** A dialog listing the page's shortcuts, opened with "?". */
export function ShortcutHelp({
  groups,
  trigger = '?',
  title = 'Keyboard shortcuts',
}: ShortcutHelpProps) {
  const [open, setOpen] = useState(false);
  useShortcut(trigger, () => setOpen(true));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <div className={s.shortcutList}>
          {groups.map((g) => (
            <section
              key={g.title}
              className={s.shortcutGroup}
              aria-label={g.title}
            >
              <h3 className={s.shortcutGroupTitle}>{g.title}</h3>
              <dl className={s.shortcutList}>
                {g.shortcuts.map((sc) => (
                  <div key={sc.keys} className={s.shortcutRow}>
                    <dt>{sc.description}</dt>
                    <dd className={s.keys}>
                      {formatShortcut(sc.keys).map((k) => (
                        <Kbd key={k}>{k}</Kbd>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
