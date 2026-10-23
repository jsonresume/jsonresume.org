'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { useSyncExternalStore, type ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { Button } from '../button/button';
import * as s from './overlay.css';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: 'neutral' | 'success' | 'danger' | 'info';
  /** One optional action, e.g. Undo. altText describes it for screen readers. */
  action?: { label: string; altText: string; onClick: () => void };
  /** Milliseconds before it closes; defaults to 5000. */
  duration?: number;
}

interface ToastRecord extends ToastOptions {
  id: number;
  open: boolean;
}

let toasts: ToastRecord[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Shows a toast from anywhere, e.g. `toast({ title: 'Saved', tone: 'success' })`. Returns its id. */
export function toast(options: ToastOptions): number {
  const id = nextId++;
  toasts = [...toasts, { ...options, id, open: true }];
  emit();
  return id;
}

/** Closes a toast early. */
export function dismissToast(id: number) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, open: false } : t));
  emit();
}

function remove(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export interface ToasterProps {
  /** Accessible name of the notifications region. */
  label?: string;
  closeLabel?: string;
}

/**
 * Renders toasts. Mount once near the root of the app, then call toast().
 * Toasts are announced politely, pause on hover and focus, and can be
 * swiped away.
 */
export function Toaster({
  label = 'Notifications',
  closeLabel = 'Dismiss',
}: ToasterProps) {
  const items = useSyncExternalStore(
    subscribe,
    () => toasts,
    () => toasts
  );
  return (
    <ToastPrimitive.Provider swipeDirection="right" label={label}>
      {items.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          open={t.open}
          duration={t.duration ?? 5000}
          type={t.tone === 'danger' ? 'foreground' : 'background'}
          className={s.toast({ tone: t.tone })}
          onOpenChange={(open) => {
            if (!open) {
              dismissToast(t.id);
              setTimeout(() => remove(t.id), 200);
            }
          }}
        >
          <ToastPrimitive.Title className={s.toastTitle}>
            {t.title}
          </ToastPrimitive.Title>
          {t.description ? (
            <ToastPrimitive.Description className={s.toastDescription}>
              {t.description}
            </ToastPrimitive.Description>
          ) : null}
          {t.action ? (
            <ToastPrimitive.Action
              asChild
              altText={t.action.altText}
              className={s.toastAction}
            >
              <Button size="sm" onClick={t.action.onClick}>
                {t.action.label}
              </Button>
            </ToastPrimitive.Action>
          ) : null}
          <ToastPrimitive.Close className={s.toastClose}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="m4 4 8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <span className={visuallyHidden}>{closeLabel}</span>
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className={s.toastViewport} />
    </ToastPrimitive.Provider>
  );
}
